import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/** Server-side upsert after Google OAuth callback */
export async function upsertProfileFromAuthServer(
  supabase: SupabaseClient<Database>,
  user: User,
) {
  const meta = user.user_metadata ?? {};
  const email = user.email ?? meta.email ?? null;
  const full_name =
    meta.full_name || meta.name || meta.preferred_username || null;
  const avatar_url = meta.avatar_url || meta.picture || null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("mobile, linkedin_url, company_name, website, full_name")
    .eq("id", user.id)
    .maybeSingle();

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email,
      full_name: existing?.full_name || full_name,
      avatar_url,
      mobile: existing?.mobile ?? null,
      linkedin_url: existing?.linkedin_url ?? null,
      company_name: existing?.company_name ?? null,
      website: existing?.website ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
}
