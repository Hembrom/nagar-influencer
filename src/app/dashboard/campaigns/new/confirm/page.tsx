"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import { FormatIcon } from "@/components/FormatIcons";
import { getFormat } from "@/lib/formats";

function ConfirmContent() {
  const router = useRouter();
  const params = useSearchParams();
  const formatId = params.get("format") ?? "youtube-video";
  const format = getFormat(formatId);

  return (
    <PageFrame
      title="Confirm your selection"
      subtitle="Review format and deliverables before securing your slot"
      footer={
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() =>
              router.push(`/dashboard/campaigns/new/match`)
            }
            className="text-sm font-semibold text-muted hover:text-navy"
          >
            ← Back to match
          </button>
          <div className="w-full max-w-xs">
            <PrimaryButton
              onClick={() =>
                router.push(`/dashboard/campaigns/new/secure?format=${formatId}`)
              }
            >
              Continue to payment
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-orange bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <FormatIcon icon={format.icon} active />
            <span className="rounded-full bg-orange-soft px-3 py-1 text-[11px] font-bold tracking-wide text-orange">
              SELECTED
            </span>
          </div>
          <h2 className="text-xl font-bold text-navy">{format.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {format.description}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="mb-4 text-xs font-bold tracking-[0.08em] text-muted-light">
            WHAT YOU&apos;LL GET
          </p>
          <ul className="space-y-3">
            {format.deliverables.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green text-white">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm leading-snug text-navy/85">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-3 rounded-xl bg-purple-soft p-4">
            <span className="text-purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l7 3v6c0 5-3.5 9.4-7 11-3.5-1.6-7-6-7-11V5l7-3z" />
              </svg>
            </span>
            <p className="text-sm leading-relaxed text-purple">
              <span className="font-bold">Refund Guarantee:</span> If the creator
              fails to deliver on timeline, your booking deposit is refunded
              instantly.
            </p>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted">Loading…</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
