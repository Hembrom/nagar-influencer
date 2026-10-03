import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/** Server-side upsert after Google OAuth callback */
export async function upsertProfileFromAuthServer(
  supabase: SupabaseClient<Database>,
  user: User,
) {
  const meta = user.user_metadata ?? {};
  
  // Extract email - try multiple sources
  const email = user.email || meta.email || null;
  
  console.log("📧 [PROFILE_SERVER] Gmail OAuth User Data:", {
    user_id: user.id,
    user_email: user.email,
    meta_email: meta.email,
    final_email: email,
    meta_full_name: meta.full_name,
    meta_name: meta.name,
    meta_picture: meta.picture,
  });
  
  const full_name =
    meta.full_name || meta.name || meta.preferred_username || null;
  const avatar_url = meta.avatar_url || meta.picture || null;

  // Get existing profile to preserve manual fields
  const { data: existing } = await supabase
    .from("profiles")
    .select("mobile, company_name, website, full_name")
    .eq("id", user.id)
    .maybeSingle();

  // Prepare profile data
  const profileData = {
    id: user.id,
    email: email || `user-${user.id}@nagar-influencer.local`, // Fallback email if Gmail doesn't provide one
    full_name: existing?.full_name || full_name,
    avatar_url,
    mobile: existing?.mobile ?? null,
    company_name: existing?.company_name ?? null,
    website: existing?.website ?? null,
    updated_at: new Date().toISOString(),
  };

  console.log("💾 [PROFILE_SERVER] Upserting profile:", profileData);

  const { error } = await supabase.from("profiles").upsert(
    profileData,
    { onConflict: "id" },
  );

  if (error) {
    console.error("❌ [PROFILE_SERVER] Error upserting profile:", error);
    throw error;
  }

  console.log("✅ [PROFILE_SERVER] Profile upserted successfully");

  // AUTO-CREATE INFLUENCER ENTRY (if not already exists)
  try {
    const emailToUse = profileData.email;
    const handle = (full_name || "influencer")
      .toLowerCase()
      .replace(/\s+/g, "_")
      .substring(0, 50);

    console.log("👤 [PROFILE_SERVER] Creating/updating auto influencer entry:", {
      name: full_name || "New Influencer",
      email: emailToUse,
      handle,
      profile_photo: avatar_url,
    });

    // Use UPSERT on email to avoid unique constraint issues
    // Now includes all available fields from the updated types
    const { error: influencerError } = await supabase.from("influencers").upsert(
      {
        email: emailToUse,
        name: full_name || "New Influencer",
        handle: handle,
        profile_photo: avatar_url || null,
        followers: null,
        category: "Other",
        bio: null,
        location: null,
        instagram_url: null,
        youtube_url: null,
        tiktok_url: null,
        audience_size: null,
        collaboration_interests: null,
        portfolio_links: null,
        source: "self-registered",
        status: "verified",
      },
      { onConflict: "email" },
    );

    if (influencerError) {
      console.warn("⚠️ [PROFILE_SERVER] Warning updating influencer:", influencerError.message);
      // Don't throw - let profile still be created even if influencer update fails
    } else {
      console.log("✅ [PROFILE_SERVER] Influencer entry created/updated successfully");
    }
  } catch (err) {
    console.warn("⚠️ [PROFILE_SERVER] Exception creating influencer:", err);
    // Don't throw - not critical
  }
}
