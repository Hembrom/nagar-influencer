"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { BOOKING } from "@/lib/formats";

function ConfirmedContent() {
  const params = useSearchParams();
  const formatId = params.get("format") ?? "youtube-video";

  return (
    <MobileShell
      footer={
        <PrimaryButton
          variant="purple"
          href={`/brands/tracker?format=${formatId}`}
        >
          Track Order Status
        </PrimaryButton>
      }
    >
      <div className="flex flex-col items-center pt-8 text-center">
        <div className="animate-scale-in flex h-16 w-16 items-center justify-center rounded-full bg-green-soft text-green">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l5 5L20 7"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1
          className="animate-fade-up mt-5 text-[28px] font-extrabold text-navy"
          style={{ animationDelay: "80ms" }}
        >
          Booking Secured!
        </h1>
        <span
          className="animate-fade-up mt-3 rounded-full bg-green px-3 py-1 text-[11px] font-bold tracking-wide text-white"
          style={{ animationDelay: "120ms" }}
        >
          ORDER PLACED
        </span>
      </div>

      <div
        className="animate-fade-up mt-8 rounded-2xl bg-card p-5 shadow-[0_2px_14px_rgba(26,26,46,0.06)]"
        style={{ animationDelay: "160ms" }}
      >
        <p className="mb-4 text-[11px] font-bold tracking-[0.08em] text-muted-light">
          BOOKING RECEIPT
        </p>
        <dl className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[13px] text-muted">Selected Package</dt>
            <dd className="text-right text-[14px] font-bold text-navy">
              {BOOKING.packageName}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[13px] text-muted">Token Paid</dt>
            <dd className="text-[14px] font-bold text-green">
              ₹{BOOKING.tokenAmount}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[13px] text-muted">Order ID</dt>
            <dd className="text-[14px] font-bold text-purple-deep">
              {BOOKING.orderIdFull}
            </dd>
          </div>
        </dl>
      </div>

      <div
        className="animate-fade-up mt-4 rounded-2xl bg-card p-5 shadow-[0_2px_14px_rgba(26,26,46,0.06)]"
        style={{ animationDelay: "220ms" }}
      >
        <p className="mb-4 text-[11px] font-bold tracking-[0.08em] text-muted-light">
          WHAT HAPPENS NEXT?
        </p>
        <ol className="flex flex-col gap-4">
          {[
            {
              title: "Strategist assigns within 2 hours",
              body: "A seasoned expert will contact your registered phone number.",
            },
            {
              title: "Details finalization",
              body: "Lock down content angles, brief elements, and target release date.",
            },
            {
              title: "Campaign goes live",
              body: "The creator uploads the final content. Full payment post-release.",
            },
          ].map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-soft text-[13px] font-bold text-purple-deep">
                {i + 1}
              </span>
              <div>
                <p className="text-[14px] font-bold text-navy">{step.title}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-muted">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </MobileShell>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-muted">
          Loading…
        </div>
      }
    >
      <ConfirmedContent />
    </Suspense>
  );
}
