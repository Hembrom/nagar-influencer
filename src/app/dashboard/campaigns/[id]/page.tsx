"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import { BOOKING } from "@/lib/formats";

type StepState = "done" | "active" | "pending";

const STEPS: { title: string; subtitle: string; state: StepState }[] = [
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

function TrackerContent() {
  const params = useParams();
  const id = String(params.id || BOOKING.orderId);

  return (
    <PageFrame
      title="Campaign tracker"
      subtitle="Live tracking of your slot reservation & callback"
      footer={
        <div className="flex justify-end">
          <div className="w-full max-w-xs">
            <PrimaryButton variant="purple" href="/dashboard/messages">
              Need help? Message us
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="mx-auto grid max-w-3xl gap-5">
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5">
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-muted-light">
              ACTIVE CAMPAIGN
            </p>
            <p className="mt-1 text-lg font-bold text-navy">
              {BOOKING.packageName}
            </p>
          </div>
          <span className="rounded-full bg-orange-soft px-3 py-1 text-xs font-bold text-orange">
            ID: {id}
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="mb-6 text-xs font-bold tracking-[0.08em] text-muted-light">
            LIVE PROGRESS
          </p>
          <ol>
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
                <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                  {!isLast ? (
                    <span
                      className={`absolute top-8 left-[13px] h-[calc(100%-1.5rem)] w-0.5 ${lineColor}`}
                    />
                  ) : null}
                  {step.state === "done" ? (
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
                  ) : step.state === "active" ? (
                    <span className="animate-pulse-soft flex h-7 w-7 items-center justify-center rounded-full bg-orange">
                      <span className="h-2 w-2 rounded-full bg-white" />
                    </span>
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5e7eb]">
                      <span className="h-2 w-2 rounded-full bg-[#9ca3af]" />
                    </span>
                  )}
                  <div>
                    <p className={`text-base font-bold ${titleColor}`}>
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">{step.subtitle}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </PageFrame>
  );
}

export default function CampaignTrackerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted">Loading…</div>}>
      <TrackerContent />
    </Suspense>
  );
}
