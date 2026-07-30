"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { VerifiedBadge } from "@/components/VerifiedBadge";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard/campaigns";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configured = Boolean(getSupabaseEnv());

  async function signInWithGoogle() {
    setError(null);
    setLoading(true);
    try {
      if (!configured) {
        window.location.href = next;
        return;
      }
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (authError) throw authError;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start Google login");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-[0_20px_60px_rgba(15,10,31,0.08)]">
      <h1 className="text-2xl font-extrabold tracking-tight text-navy">
        Sign in to your workspace
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Continue with Google to create campaigns, track bookings, and message
        your strategist.
      </p>

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-white px-5 py-3.5 text-sm font-bold text-navy transition hover:bg-background disabled:opacity-60"
      >
        <GoogleMark />
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>

      {!configured ? (
        <p className="mt-4 rounded-xl bg-orange-soft px-3 py-2 text-xs leading-relaxed text-orange">
          Supabase env not set yet — this will open the dashboard in demo mode.
          Add Google provider in Supabase Auth for real login.
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : null}

      <p className="mt-6 text-center text-xs text-muted-light">
        By continuing you agree to NagarInfluence terms.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0f0a1f]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 20%, rgba(79,44,207,0.45), transparent 55%), radial-gradient(ellipse 50% 40% at 85% 70%, rgba(255,107,43,0.25), transparent 50%)",
        }}
      />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-8 py-10 lg:flex-row lg:items-center lg:gap-16">
        <div className="mb-10 max-w-lg lg:mb-0">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange text-sm font-extrabold text-white">
              NI
            </div>
            <span className="text-lg font-bold text-white">NagarInfluence</span>
            <VerifiedBadge />
          </Link>
          <h2 className="mt-10 text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl">
            Your brand campaign desk
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/65">
            Book verified creator campaigns, reserve slots with a refundable
            token, and track everything in one workspace.
          </p>
        </div>

        <Suspense fallback={<div className="h-72 w-full max-w-md animate-pulse rounded-3xl bg-white/10" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.5l.1.1 6.3 5.3C39.2 36.3 44 31 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}
