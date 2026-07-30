"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import { matchReelsFromStory, type MatchedReel } from "@/lib/influencers";
import {
  loadChatBrief,
  updateSelectedReel,
  type ChatBrief,
} from "@/lib/recommend";

export default function ReelsPickPage() {
  const router = useRouter();
  const [brief, setBrief] = useState<ChatBrief | null>(null);
  const [reels, setReels] = useState<MatchedReel[]>([]);
  const [liked, setLiked] = useState<string | null>(null);

  useEffect(() => {
    const b = loadChatBrief();
    if (!b?.story || !b?.want) {
      router.replace("/dashboard/campaigns/new");
      return;
    }
    setBrief(b);
    setReels(matchReelsFromStory(b.story, b.want));
  }, [router]);

  if (!brief) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-muted">
        Loading creator matches…
      </div>
    );
  }

  return (
    <PageFrame
      title="Creators we matched for you"
      subtitle="Up to 5 existing reels from verified influencers — like the one that feels right"
      footer={
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/campaigns/new")}
            className="text-sm font-semibold text-muted hover:text-navy"
          >
            ← Retell your story
          </button>
          <div className="w-full max-w-xs">
            <PrimaryButton
              disabled={!liked}
              onClick={() => {
                if (!liked) return;
                updateSelectedReel(liked);
                router.push("/dashboard/campaigns/new/match");
              }}
            >
              Continue with this reel
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="mb-5 rounded-2xl border border-purple/20 bg-purple-soft px-5 py-4 text-sm text-purple">
        Matched from your story. Pick the style you want influencers to recreate
        for <span className="font-bold">{brief.productHint}</span>.
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {reels.map((reel) => {
          const active = liked === reel.id;
          return (
            <button
              key={reel.id}
              type="button"
              onClick={() => setLiked(reel.id)}
              className={`overflow-hidden rounded-2xl border-2 bg-card text-left transition ${
                active
                  ? "border-orange shadow-[0_8px_24px_rgba(255,107,43,0.14)]"
                  : "border-border hover:border-orange/40"
              }`}
            >
              <div
                className={`relative aspect-[9/14] max-h-[280px] bg-gradient-to-br ${reel.gradient}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange text-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 7.5v9l8-4.5-8-4.5z" />
                      </svg>
                    </span>
                  </span>
                </div>
                <span className="absolute top-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm">
                  {reel.formatLabel}
                </span>
                {active ? (
                  <span className="absolute top-3 right-3 rounded-full bg-orange px-2.5 py-1 text-[10px] font-bold text-white">
                    LIKED
                  </span>
                ) : null}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple text-[11px] font-bold text-white">
                    {reel.influencerName.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-navy">
                      {reel.influencerName}
                    </p>
                    <p className="truncate text-[11px] text-muted">
                      {reel.influencerHandle} · {reel.followers}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold text-navy">
                  {reel.title}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {reel.style} · {reel.views} views · {reel.duration}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </PageFrame>
  );
}
