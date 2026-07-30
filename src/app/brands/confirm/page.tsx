"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { FormatIcon } from "@/components/FormatIcons";
import { getFormat } from "@/lib/formats";

function ConfirmContent() {
  const router = useRouter();
  const params = useSearchParams();
  const formatId = params.get("format") ?? "youtube-video";
  const format = getFormat(formatId);

  return (
    <MobileShell
      footer={
        <PrimaryButton
          onClick={() => router.push(`/brands/secure?format=${formatId}`)}
        >
          Continue to Package
        </PrimaryButton>
      }
    >
      <PageHeader
        title="Confirm Your Selection"
        subtitle="Review your chosen format and deliverables before choosing packages."
        backHref={`/brands/samples?format=${formatId}`}
      />

      <div className="animate-fade-up relative rounded-2xl border-2 border-orange bg-card p-4 shadow-[0_4px_16px_rgba(255,107,43,0.12)]">
        <span className="absolute top-3 right-3 rounded-full bg-orange-soft px-2.5 py-1 text-[10px] font-bold tracking-wide text-orange">
          SELECTED
        </span>
        <div className="flex gap-3 pr-16">
          <FormatIcon icon={format.icon} active />
          <div>
            <p className="text-[16px] font-bold text-navy">{format.title}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              {format.description}
            </p>
          </div>
        </div>
      </div>

      <div
        className="animate-fade-up mt-4 rounded-2xl bg-card p-5 shadow-[0_2px_14px_rgba(26,26,46,0.06)]"
        style={{ animationDelay: "80ms" }}
      >
        <p className="mb-4 text-[11px] font-bold tracking-[0.08em] text-muted-light">
          WHAT YOU&apos;LL GET
        </p>
        <ul className="flex flex-col gap-3.5">
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
              <span className="text-[13px] leading-snug text-navy/85">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="animate-fade-up mt-4 flex gap-3 rounded-2xl bg-purple-soft p-4"
        style={{ animationDelay: "140ms" }}
      >
        <span className="mt-0.5 text-purple">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l7 3v6c0 5-3.5 9.4-7 11-3.5-1.6-7-6-7-11V5l7-3z" />
          </svg>
        </span>
        <p className="text-[13px] leading-relaxed text-purple">
          <span className="font-bold">Refund Guarantee:</span> If the content
          creator fails to deliver within the timeline, booking deposit is
          refunded instantly.
        </p>
      </div>
    </MobileShell>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-muted">
          Loading…
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
