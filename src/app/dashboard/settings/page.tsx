"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import {
  loadProfile,
  saveProfile,
  upsertProfileFromAuth,
  type LocalProfile,
} from "@/lib/profile";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      let u: User | null = null;
      if (getSupabaseEnv()) {
        try {
          const supabase = createClient();
          const { data } = await supabase.auth.getUser();
          u = data.user;
          if (u) await upsertProfileFromAuth(u);
        } catch {
          u = null;
        }
      }
      setUser(u);
      setProfile(await loadProfile(u));
    }
    void init();
  }, []);

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const userId = user?.id ?? profile.id ?? "demo-user";
      const next = await saveProfile(userId, profile);
      setProfile(next);
      setSaved(true);
    } catch {
      setError("Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageFrame
      title="Settings"
      subtitle="Your contact details — Google fills name & email; add mobile and LinkedIn here"
    >
      <form onSubmit={onSave} className="mx-auto grid max-w-3xl gap-6">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold tracking-wide text-muted-light uppercase">
              Contact profile
            </h2>
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              value={profile?.full_name ?? ""}
              onChange={(v) =>
                setProfile((p) => (p ? { ...p, full_name: v } : p))
              }
              hint="From Google login — editable"
            />
            <Field
              label="Email"
              value={profile?.email ?? ""}
              onChange={(v) =>
                setProfile((p) => (p ? { ...p, email: v } : p))
              }
              hint="From Google login"
              readOnly={Boolean(user?.email)}
            />
            <Field
              label="Mobile"
              value={profile?.mobile ?? ""}
              onChange={(v) =>
                setProfile((p) => (p ? { ...p, mobile: v } : p))
              }
              placeholder="+91 98765 43210"
              hint="Not provided by Google — add manually"
            />
            <Field
              label="LinkedIn"
              value={profile?.linkedin_url ?? ""}
              onChange={(v) =>
                setProfile((p) => (p ? { ...p, linkedin_url: v } : p))
              }
              placeholder="https://linkedin.com/in/you"
              hint="Not provided by Google — add manually"
            />
            <Field
              label="Company name"
              value={profile?.company_name ?? ""}
              onChange={(v) =>
                setProfile((p) => (p ? { ...p, company_name: v } : p))
              }
              placeholder="Acme Tech"
            />
            <Field
              label="Website"
              value={profile?.website ?? ""}
              onChange={(v) =>
                setProfile((p) => (p ? { ...p, website: v } : p))
              }
              placeholder="https://acme.example"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving || !profile}
              className="rounded-xl bg-purple-deep px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            {saved ? (
              <span className="text-sm font-semibold text-green">Saved</span>
            ) : null}
            {error ? (
              <span className="text-sm text-red-600">{error}</span>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-purple/20 bg-purple-soft p-5 text-sm leading-relaxed text-purple">
          <p className="font-bold">What Google login gives us</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Name</li>
            <li>Email</li>
            <li>Profile photo</li>
          </ul>
          <p className="mt-3 font-bold">What you need to fill</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Mobile number</li>
            <li>LinkedIn URL</li>
            <li>Company / website</li>
          </ul>
        </section>
      </form>
    </PageFrame>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-navy">{label}</span>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-purple read-only:opacity-70"
      />
      {hint ? (
        <span className="mt-1 block text-[11px] text-muted-light">{hint}</span>
      ) : null}
    </label>
  );
}
