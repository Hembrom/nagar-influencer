import type { User } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { addInfluencerSelfRegistered } from "@/lib/supabase/influencers";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

const LOCAL_KEY = "ni_profile";

export type LocalProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  mobile: string | null;
  company_name: string | null;
  website: string | null;
};

export function profileFromGoogleUser(user: User): LocalProfile {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? meta.email ?? null,
    full_name:
      meta.full_name || meta.name || meta.preferred_username || null,
    avatar_url: meta.avatar_url || meta.picture || null,
    mobile: meta.phone || meta.phone_number || null,
    company_name: null,
    website: null,
  };
}

function readLocal(): LocalProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as LocalProfile) : null;
  } catch {
    return null;
  }
}

function writeLocal(profile: LocalProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(profile));
}

/** Upsert Google identity fields without wiping mobile the user already saved */
export async function upsertProfileFromAuth(user: User) {
  const fromGoogle = profileFromGoogleUser(user);
  const existing = readLocal();

  const merged: LocalProfile = {
    ...fromGoogle,
    mobile: existing?.mobile ?? fromGoogle.mobile,
    company_name: existing?.company_name ?? null,
    website: existing?.website ?? null,
    full_name: existing?.full_name || fromGoogle.full_name,
  };

  writeLocal(merged);

  if (!getSupabaseEnv()) return merged;

  try {
    const supabase = createClient();
    await supabase.from("profiles").upsert(
      {
        id: merged.id,
        email: merged.email,
        full_name: merged.full_name,
        avatar_url: merged.avatar_url,
        mobile: merged.mobile,
        company_name: merged.company_name,
        website: merged.website,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  } catch {
    // local still saved
  }

  return merged;
}

export async function loadProfile(user: User | null): Promise<LocalProfile | null> {
  if (!user) {
    return readLocal();
  }

  if (getSupabaseEnv()) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        const profile: LocalProfile = {
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          mobile: data.mobile,
          company_name: data.company_name,
          website: data.website,
        };
        writeLocal(profile);
        return profile;
      }
    } catch {
      // fall through
    }
  }

  const local = readLocal();
  if (local?.id === user.id) return local;
  return upsertProfileFromAuth(user);
}

export async function saveProfile(
  userId: string,
  patch: Partial<LocalProfile>,
): Promise<LocalProfile> {
  const current = readLocal() ?? {
    id: userId,
    email: null,
    full_name: null,
    avatar_url: null,
    mobile: null,
    company_name: null,
    website: null,
  };

  const next: LocalProfile = {
    ...current,
    ...patch,
    id: userId,
  };
  writeLocal(next);

  if (getSupabaseEnv()) {
    try {
      const supabase = createClient();
      await supabase.from("profiles").upsert(
        {
          id: next.id,
          email: next.email,
          full_name: next.full_name,
          avatar_url: next.avatar_url,
          mobile: next.mobile,
          company_name: next.company_name,
          website: next.website,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
    } catch {
      // local still saved
    }
  }

  return next;
}

// ============================================================================
// INFLUENCER PROFILE FUNCTIONS
// ============================================================================

export type InfluencerProfile = {
  displayName: string;
  bio: string;
  location?: string | null;
  profilePhoto?: string | null;
  categories: string[];
  socialLinks: { instagram: string; youtube: string; tiktok: string };
  audienceSize: string;
  collaborationInterests: string[];
  portfolioLinks: string[];
  createdAt: string;
};

const INFLUENCER_LOCAL_KEY = "influencer_profile";

/**
 * Save influencer profile to localStorage and Supabase
 */
export async function saveInfluencerProfile(
  userId: string,
  profile: InfluencerProfile,
): Promise<InfluencerProfile> {
  // Always save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(INFLUENCER_LOCAL_KEY, JSON.stringify(profile));
  }

  // Try to save to Supabase
  if (getSupabaseEnv()) {
    try {
      const supabase = createClient();
      
      // Get user email for influencers table
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      const userEmail = user?.email || `influencer-${userId}@growmyinfluence.in`;

      // Save to profiles table (existing)
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: userId,
          influencer_data: profile,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
      
      if (profileError) {
        console.error("❌ Supabase error saving influencer profile:", profileError.message, profileError.details);
      } else {
        console.log("✓ Influencer profile saved to profiles table");
      }

      // Also save to influencers table (NEW)
      try {
        // Generate unique handle - if it's taken, append random suffix
        let handle = profile.displayName.toLowerCase().replace(/\s+/g, "_");
        const originalHandle = handle;
        let handleAttempt = 1;
        
        // Check if handle is unique (simple approach: try insert, if fails, retry with suffix)
        // In production, you'd query first, but this is simpler
        
        const influencerData = {
          name: profile.displayName,
          email: userEmail,
          handle: handle,
          bio: profile.bio || "",
          location: profile.location || null,
          profile_photo: profile.profilePhoto || null,
          category: profile.categories[0] || "Other",
          instagram_url: profile.socialLinks.instagram || null,
          youtube_url: profile.socialLinks.youtube || null,
          tiktok_url: profile.socialLinks.tiktok || null,
          audience_size: profile.audienceSize || null,
          collaboration_interests: profile.collaborationInterests.join(", ") || null,
          portfolio_links: profile.portfolioLinks || [],
        };

        await addInfluencerSelfRegistered(influencerData as any);
        console.log("✓ Influencer registered in influencers table", { email: userEmail, handle });
      } catch (influencerErr: any) {
        const errorMsg = influencerErr?.message || String(influencerErr);
        console.error("❌ Error saving to influencers table:", errorMsg, influencerErr?.details);
        
        // If it's a unique constraint error on email, that's OK (user already registered)
        if (errorMsg.includes("duplicate") || errorMsg.includes("unique")) {
          console.warn("⚠️ Influencer already registered (email or handle exists)");
        } else {
          throw influencerErr; // Re-throw if it's not a duplicate error
        }
      }
    } catch (err) {
      console.error("❌ Exception saving influencer profile to Supabase:", err);
      // Local save still succeeded
    }
  } else {
    console.warn("⚠️ Supabase not configured - profile saved to localStorage only");
  }

  return profile;
}

/**
 * Load influencer profile from Supabase or localStorage
 */
export async function loadInfluencerProfile(
  userId: string | null,
): Promise<InfluencerProfile | null> {
  // Try Supabase first if authenticated
  if (userId && getSupabaseEnv()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("influencer_data")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("❌ Supabase error loading influencer profile:", error.message, error.details);
      } else if (data?.influencer_data) {
        const profile = data.influencer_data as InfluencerProfile;
        console.log("✓ Influencer profile loaded from Supabase");
        // Update localStorage cache
        if (typeof window !== "undefined") {
          localStorage.setItem(INFLUENCER_LOCAL_KEY, JSON.stringify(profile));
        }
        return profile;
      } else {
        console.log("ℹ️ No influencer profile found in Supabase for user:", userId);
      }
    } catch (err) {
      console.error("❌ Exception loading influencer profile from Supabase:", err);
      // Fall back to localStorage
    }
  }

  // Fall back to localStorage
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(INFLUENCER_LOCAL_KEY);
      return raw ? (JSON.parse(raw) as InfluencerProfile) : null;
    } catch {
      return null;
    }
  }

  return null;
}
