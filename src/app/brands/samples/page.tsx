"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
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
    <MobileShell
      footer={
        <PrimaryButton
          onClick={() =>
            router.push(`/brands/confirm?format=${formatId}`)
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="9" fill="white" fillOpacity="0.25" />
            <path d="M10 8.5v7l6-3.5-6-3.5z" fill="white" />
          </svg>
          Select This Format
        </PrimaryButton>
      }
    >
      <PageHeader
        title={`Sample ${format.title}s`}
        subtitle="Watch samples to understand the format & quality of influencer campaigns."
        backHref="/brands"
      />

      <div className="flex flex-col gap-4 pb-2">
        {samples.map((video, i) => {
          const isActive = video.id === active;
          return (
            <button
              key={video.id}
              type="button"
              onClick={() => setActive(video.id)}
              className={`animate-fade-up overflow-hidden rounded-2xl bg-card text-left shadow-[0_2px_14px_rgba(26,26,46,0.07)] transition ring-2 ${
                isActive ? "ring-orange" : "ring-transparent"
              }`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div
                className={`relative aspect-video bg-gradient-to-br ${video.gradient}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange text-white shadow-lg">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 7.5v9l8-4.5-8-4.5z" />
                      </svg>
                    </span>
                  </span>
                </div>
                <span className="absolute bottom-3 left-3 rounded-md bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                  {video.imageHint}
                </span>
              </div>
              <div className="px-4 py-3.5">
                <p className="text-[15px] font-bold text-navy">{video.title}</p>
                <p className="mt-1 text-[13px] text-muted">
                  {video.views}{" "}
                  <span className="text-muted-light">•</span>{" "}
                  <span className="font-medium text-orange">{video.duration}</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </MobileShell>
  );
}

export default function SamplesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-muted">
          Loading samples…
        </div>
      }
    >
      <SamplesContent />
    </Suspense>
  );
}
