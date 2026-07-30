"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { BOOKING } from "@/lib/formats";

type StepState = "done" | "active" | "pending";

const STEPS: {
  title: string;
  subtitle: string;
  state: StepState;
}[] = [
  {
    title: "Order Placed",
    subtitle: `Token of ₹${BOOKING.tokenAmount} received`,
    state: "done",
  },
  {
    title: "Representative Assigned",
    subtitle: "Rahul Sharma joining your dashboard soon",
    state: "active",
  },
  {
    title: "Campaign Finalized",
    subtitle: "Video guidelines and delivery dates locked",
    state: "pending",
  },
  {
    title: "Campaign Live",
    subtitle: "Creator uploads dedicated video content",
    state: "pending",
  },
];

function StepIcon({ state }: { state: StepState }) {
  if (state === "done") {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="animate-pulse-soft flex h-7 w-7 items-center justify-center rounded-full bg-orange">
        <span className="h-2 w-2 rounded-full bg-white" />
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5e7eb]">
      <span className="h-2 w-2 rounded-full bg-[#9ca3af]" />
    </span>
  );
}

function TrackerContent() {
  const params = useSearchParams();
  const formatId = params.get("format") ?? "youtube-video";

  return (
    <MobileShell
      footer={
        <PrimaryButton variant="purple" href="mailto:support@nagarinfluence.com">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6a3 3 0 013-3h2l1 3-2 1a10 10 0 005 5l1-2 3 1v2a3 3 0 01-3 3A12 12 0 014 6z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M15 3h5v5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M14 10l6-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Need Help? Contact Us
        </PrimaryButton>
      }
    >
      <PageHeader
        title="Campaign Tracker"
        subtitle="Live tracking of your slot reservation & callback"
        backHref={`/brands/confirmed?format=${formatId}`}
      />

      <div className="animate-fade-up rounded-2xl bg-card p-4 shadow-[0_2px_14px_rgba(26,26,46,0.06)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.08em] text-muted-light">
              ACTIVE CAMPAIGN
            </p>
            <p className="mt-1 text-[16px] font-bold text-navy">
              {BOOKING.packageName}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-orange-soft px-2.5 py-1 text-[11px] font-bold text-orange">
            ID: {BOOKING.orderId}
          </span>
        </div>
      </div>

      <div
        className="animate-fade-up mt-4 rounded-2xl bg-card p-5 shadow-[0_2px_14px_rgba(26,26,46,0.06)]"
        style={{ animationDelay: "80ms" }}
      >
        <p className="mb-5 text-[11px] font-bold tracking-[0.08em] text-muted-light">
          LIVE PROGRESS
        </p>
        <ol className="relative">
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1;
            const lineColor =
              step.state === "done" ? "bg-green" : "bg-[#e5e7eb]";
            const titleColor =
              step.state === "active"
                ? "text-orange"
                : step.state === "done"
                  ? "text-navy"
                  : "text-muted";

            return (
              <li key={step.title} className="relative flex gap-3.5 pb-7 last:pb-0">
                {!isLast ? (
                  <span
                    className={`absolute top-7 left-[13px] h-[calc(100%-1.25rem)] w-0.5 ${lineColor}`}
                  />
                ) : null}
                <StepIcon state={step.state} />
                <div className="pt-0.5">
                  <p className={`text-[15px] font-bold ${titleColor}`}>
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[13px] text-muted">{step.subtitle}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </MobileShell>
  );
}

export default function TrackerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-muted">
          Loading…
        </div>
      }
    >
      <TrackerContent />
    </Suspense>
  );
}
