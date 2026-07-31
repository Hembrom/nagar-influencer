"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import { FormatIcon } from "@/components/FormatIcons";
import {
  loadChatBrief,
  recommendFromSelection,
  type ChatBrief,
  type MatchResult,
} from "@/lib/recommend";

export default function MatchPage() {
  const router = useRouter();
  const [brief, setBrief] = useState<ChatBrief | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    const b = loadChatBrief();
    if (!b?.selectedReelId) {
      router.replace(
        b?.story ? "/dashboard/campaigns/new/reels" : "/dashboard/campaigns/new",
      );
      return;
    }
    const result = recommendFromSelection(b);
    setBrief(b);
    setMatch(result);
    setPicked(result.primary.id);
  }, [router]);

  if (!brief || !match || !picked) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-muted">
        Building your best match…
      </div>
    );
  }

  const selected =
    match.primary.id === picked
      ? match.primary
      : match.alternatives.find((a) => a.id === picked) ?? match.primary;

  return (
    <PageFrame
      title="Best match for you"
      subtitle={`Based on ${brief.productHint}${
        match.reel ? ` · liked ${match.reel.influencerName}` : ""
      }`}
      footer={
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/campaigns/new/reels")}
            className="text-sm font-semibold text-muted hover:text-navy"
          >
            ← Change reel
          </button>
          <div className="w-full max-w-xs">
            <PrimaryButton
              onClick={() =>
                router.push(
                  `/dashboard/campaigns/new/confirm?format=${picked}`,
                )
              }
            >
              Continue with {selected.title}
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setPicked(match.primary.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setPicked(match.primary.id);
            }}
            className={`cursor-pointer rounded-2xl border-2 bg-card p-6 transition ${
              picked === match.primary.id
                ? "border-orange shadow-[0_8px_24px_rgba(255,107,43,0.12)]"
                : "border-border"
            }`}
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-purple px-3 py-1 text-[11px] font-bold tracking-wide text-white">
                SYSTEM PICK
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${
                  match.confidence === "high"
                    ? "bg-green-soft text-green"
                    : "bg-orange-soft text-orange"
                }`}
              >
                {match.confidence === "high" ? "High fit" : "Good fit"}
              </span>
            </div>
            <div className="flex gap-4">
              <FormatIcon icon={match.primary.icon} active />
              <div>
                <h2 className="text-xl font-bold text-navy">
                  {match.primary.title}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {match.primary.subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-navy/80">
                  {match.primary.description}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.08em] text-muted-light">
              OTHER STRONG OPTIONS
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {match.alternatives.map((alt) => (
                <button
                  key={alt.id}
                  type="button"
                  onClick={() => setPicked(alt.id)}
                  className={`rounded-2xl border-2 bg-card p-4 text-left transition ${
                    picked === alt.id
                      ? "border-orange"
                      : "border-border hover:border-orange/40"
                  }`}
                >
                  <FormatIcon icon={alt.icon} active={picked === alt.id} />
                  <p className="mt-3 text-sm font-bold text-navy">{alt.title}</p>
                  <p className="mt-1 text-xs text-muted">{alt.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-purple/20 bg-purple-soft p-5">
            <p className="text-xs font-bold tracking-wide text-purple uppercase">
              Why we picked this
            </p>
            <ul className="mt-3 space-y-2.5">
              {match.reasons.map((r) => (
                <li
                  key={r}
                  className="flex gap-2 text-sm leading-relaxed text-purple"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {match.reel ? (
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-bold tracking-[0.08em] text-muted-light">
                REEL YOU LIKED
              </p>
              <p className="mt-2 text-sm font-bold text-navy">
                {match.reel.title}
              </p>
              <p className="mt-1 text-sm text-muted">
                {match.reel.influencerName} · {match.reel.influencerHandle}
              </p>
              <p className="mt-2 text-xs text-muted">{match.reel.vibe}</p>
            </div>
          ) : null}
        </aside>
      </div>
    </PageFrame>
  );
}
