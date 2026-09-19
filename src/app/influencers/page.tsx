"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { isSupabaseAuthReachable } from "@/lib/supabase/health";

export default function InfluencersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const env = getSupabaseEnv();
  const supabaseUrl = env?.url;

  async function applyAsCreator() {
    setLoading(true);
    try {
      if (!supabaseUrl) {
        // Demo mode
        sessionStorage.setItem("demo_mode", "true");
        sessionStorage.setItem("influencer_demo_user", JSON.stringify({
          email: "creator@example.com",
          role: "influencer",
        }));
        router.push("/influencer-home");
        return;
      }

      const reachable = await isSupabaseAuthReachable(supabaseUrl);
      if (!reachable) {
        // Fallback to demo
        sessionStorage.setItem("demo_mode", "true");
        sessionStorage.setItem("influencer_demo_user", JSON.stringify({
          email: "creator@example.com",
          role: "influencer",
        }));
        router.push("/influencer-home");
        return;
      }

      // Production: Use Supabase OAuth
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/influencer-home")}`,
        },
      });
      if (authError) throw authError;
    } catch (e) {
      console.error("Error:", e);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-5xl px-8 py-10">
        <header className="mb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple text-xs font-extrabold text-white">
              NI
            </div>
            <span className="text-base font-bold text-navy">NagarInfluence</span>
            <VerifiedBadge />
          </Link>
        </header>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-purple">
              Creator desk
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-navy lg:text-5xl">
              Grow with verified brand campaigns
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Join NagarInfluence as a creator. Get matched with tech & SaaS
              brands, clear briefs, and on-time payouts.
            </p>
            <button
              onClick={applyAsCreator}
              disabled={loading}
              className="mt-6 rounded-xl bg-purple-deep px-6 py-3 text-base font-bold text-white hover:bg-purple-deep/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Apply as creator"}
            </button>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: "Verified brand briefs only",
                body: "No spam collabs — every campaign is pre-screened.",
              },
              {
                title: "Transparent payouts",
                body: "Token-backed bookings with milestone releases.",
              },
              {
                title: "Dedicated creator success",
                body: "A strategist helps lock angles, dates, and delivery.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <p className="font-bold text-navy">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
