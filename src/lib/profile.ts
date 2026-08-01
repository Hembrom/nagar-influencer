import type { User } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";

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
