"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import { loadChatBrief, type ChatBrief } from "@/lib/recommend";
import { INFLUENCERS } from "@/lib/influencers";
import { CAMPAIGN_FORMATS } from "@/lib/formats";

export default function MatchPage() {
  const router = useRouter();
  const [brief, setBrief] = useState<ChatBrief | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const b = loadChatBrief();
    if (!b) {
      router.replace("/dashboard/campaigns/new");
      return;
    }
    setBrief(b);
    // Default to first matching format or Instagram Reel
    const defaultFormat = b.format || "instagram-reel";
    setSelectedFormat(defaultFormat);
    // Select first 3 creators by default
    setSelectedCreators(new Set(INFLUENCERS.slice(0, 3).map((inf) => inf.id)));
    setLoading(false);
  }, [router]);

  if (loading || !brief) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-muted">
        Loading your matches…
      </div>
    );
  }

  const format = CAMPAIGN_FORMATS.find((f) => f.id === selectedFormat);
  const creators = INFLUENCERS.filter((inf) => selectedCreators.has(inf.id));

  function toggleCreator(id: string) {
    const next = new Set(selectedCreators);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedCreators(next);
  }

  async function handleReserve() {
    // Simple demo: just navigate to dashboard
    // In production: charge ₹500 and create booking
    router.push(`/dashboard/campaigns/${Math.random().toString(36).slice(2, 9)}`);
  }

  return (
    <PageFrame
      title="Here's what we'd recommend"
      subtitle="Based on your campaign brief, we've found content styles and creators that fit."
    >
      <div className="mx-auto max-w-4xl space-y-8 py-6">
        {/* Progress Indicator */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 opacity-60">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
              ✓
            </div>
            <span className="text-sm font-semibold text-navy">Tell us what you need</span>
          </div>
          <div className="h-0.5 flex-1 bg-border" />
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
              ●
            </div>
            <span className="text-sm font-semibold text-navy">Pick your match & reserve</span>
          </div>
        </div>

        {/* Campaign Summary */}
        <div className="rounded-xl border border-border bg-background p-4">
          <h3 className="mb-3 text-sm font-semibold text-navy">Your campaign</h3>
          <div className="grid gap-3 text-sm">
            <p className="text-navy">
              <span className="font-semibold">{brief.category || "Your product"}:</span>{" "}
              {brief.goal}
            </p>
            <div className="flex items-center gap-2 text-muted">
              <span>{brief.numCreators} creators</span>
              <span>•</span>
              <span>{brief.budget}</span>
              <span>•</span>
              <span>{brief.location}</span>
            </div>
            <button
              onClick={() => router.back()}
              className="w-fit text-xs font-semibold text-orange hover:underline"
            >
              ← Edit brief
            </button>
          </div>
        </div>

        {/* SECTION A: Content Style */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-navy">Pick the style you like</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {CAMPAIGN_FORMATS.map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt.id)}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  selectedFormat === fmt.id
                    ? "border-orange bg-orange/5"
                    : "border-border bg-background hover:border-orange/50"
                }`}
              >
                <p className="text-xs font-semibold text-muted">{fmt.icon}</p>
                <h3 className="font-bold text-navy">{fmt.title}</h3>
                <p className="text-xs text-muted">{fmt.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION B: Recommended Creators */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-navy">Creators we'd recommend</h2>
          <p className="text-sm text-muted">
            Final availability is confirmed by our strategist. Select your preferred creators.
          </p>
          <div className="space-y-3">
            {INFLUENCERS.slice(0, 4).map((inf) => {
              const isSelected = selectedCreators.has(inf.id);
              return (
                <button
                  key={inf.id}
                  onClick={() => toggleCreator(inf.id)}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    isSelected
                      ? "border-orange bg-orange/5"
                      : "border-border bg-background hover:border-orange/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-navy">{inf.name}</h3>
                      <p className="text-xs text-muted">{inf.handle}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-purple/10 px-2 py-1 text-xs text-purple">
                          {inf.followers} followers
                        </span>
                        <span className="rounded-full bg-orange/10 px-2 py-1 text-xs text-orange">
                          {inf.niche[0]}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted">{inf.vibe}</p>
                    </div>
                    <div
                      className={`mt-1 h-5 w-5 rounded border-2 transition ${
                        isSelected
                          ? "border-orange bg-orange"
                          : "border-border"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION C: Final Reservation */}
        <div className="space-y-4 border-t border-border pt-6">
          <div className="rounded-xl border border-orange/30 bg-orange/5 p-4">
            <h3 className="text-sm font-semibold text-navy">Your selection</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p>
                <span className="text-muted">Content:</span>{" "}
                <span className="font-semibold text-navy">{format?.title}</span>
              </p>
              <p>
                <span className="text-muted">Creators:</span>{" "}
                <span className="font-semibold text-navy">{selectedCreators.size}</span>
              </p>
              <p>
                <span className="text-muted">Budget:</span>{" "}
                <span className="font-semibold text-navy">{brief.budget}</span>
              </p>
            </div>
            <div className="mt-4 rounded-lg bg-background p-3">
              <p className="text-xs text-muted">Booking token</p>
              <p className="mt-1 text-xl font-bold text-navy">₹500</p>
              <p className="mt-2 text-xs text-muted">
                ₹500 is adjusted against your final campaign invoice.
              </p>
            </div>
            <p className="mt-3 text-xs text-muted">
              Our strategist will contact you to finalize the brief, creator availability and
              pricing.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <PrimaryButton onClick={handleReserve} className="flex-1">
              Reserve campaign for ₹500 →
            </PrimaryButton>
            <button
              onClick={() => router.back()}
              className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-navy transition hover:bg-white"
            >
              ← Edit campaign
            </button>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
