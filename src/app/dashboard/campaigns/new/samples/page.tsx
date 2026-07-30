"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import { getFormat, getSamples } from "@/lib/formats";

function SamplesContent() {
  const router = useRouter();
  const params = useSearchParams();
  const formatId = params.get("format") ?? "youtube-video";
  const format = getFormat(formatId);
  const samples = useMemo(() => getSamples(formatId), [formatId]);
  const [active, setActive] = useState(samples[0]?.id);

  return (
    <PageFrame
      title={`Sample ${format.title}s`}
      subtitle="Watch samples to understand format quality for influencer campaigns"
      footer={
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/campaigns/new/match")}
            className="text-sm font-semibold text-muted hover:text-navy"
          >
            ← Back to match
          </button>
          <div className="w-full max-w-xs">
            <PrimaryButton
              onClick={() =>
                router.push(`/dashboard/campaigns/new/confirm?format=${formatId}`)
              }
            >
              Select this format
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {samples.map((video) => {
          const isActive = video.id === active;
          return (
            <button
              key={video.id}
              type="button"
              onClick={() => setActive(video.id)}
              className={`overflow-hidden rounded-2xl border-2 bg-card text-left transition ${
                isActive
                  ? "border-orange shadow-[0_8px_24px_rgba(255,107,43,0.12)]"
                  : "border-border hover:border-orange/40"
              }`}
            >
              <div
                className={`relative aspect-video bg-gradient-to-br ${video.gradient}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange text-white">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 7.5v9l8-4.5-8-4.5z" />
                      </svg>
                    </span>
                  </span>
                </div>
              </div>
              <div className="px-4 py-3.5">
                <p className="font-bold text-navy">{video.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {video.views} ·{" "}
                  <span className="font-medium text-orange">{video.duration}</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </PageFrame>
  );
}

export default function SamplesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted">Loading samples…</div>}>
      <SamplesContent />
    </Suspense>
  );
}
