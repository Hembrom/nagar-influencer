"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  getCampaign,
  STATUS_LABEL,
  type Campaign,
  type CampaignStatus,
} from "@/lib/campaigns";

type StepState = "done" | "active" | "pending";

const FLOW: {
  status: CampaignStatus;
  title: string;
  subtitle: string;
}[] = [
  {
    status: "order_placed",
    title: "Order Placed",
    subtitle: "Token of ₹500 received",
  },
  {
    status: "representative_assigned",
    title: "Representative Assigned",
    subtitle: "Strategist joining your dashboard soon",
  },
  {
    status: "campaign_finalized",
    title: "Campaign Finalized",
    subtitle: "Video guidelines and delivery dates locked",
  },
  {
    status: "campaign_live",
    title: "Campaign Live",
    subtitle: "Creator uploads dedicated video content",
  },
];

function stepStates(status: CampaignStatus): StepState[] {
  const idx = FLOW.findIndex((s) => s.status === status);
  const active = idx < 0 ? 0 : idx;
  return FLOW.map((_, i) => {
    if (i < active) return "done";
    if (i === active) return i === 0 ? "done" : "active";
    return "pending";
  }).map((state, i) => {
    // Fresh orders: step 1 done, step 2 active (awaiting rep)
    if (status === "order_placed") {
      if (i === 0) return "done";
      if (i === 1) return "active";
      return "pending";
    }
    return state;
  });
}

function TrackerContent() {
  const params = useParams();
  const id = String(params.id || "");
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(
    undefined,
  );

  useEffect(() => {
    setCampaign(getCampaign(id));
  }, [id]);

  const states = useMemo(
    () => (campaign ? stepStates(campaign.status) : []),
    [campaign],
  );

  if (campaign === undefined) {
    return <div className="p-8 text-muted">Loading tracker…</div>;
  }

  if (!campaign) {
    return (
      <PageFrame title="Campaign tracker" subtitle="Order not found">
        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center">
          <p className="font-bold text-navy">No campaign with ID {id}</p>
          <p className="mt-2 text-sm text-muted">
            Complete payment on a new campaign to create a trackable order.
          </p>
          <Link
            href="/dashboard/campaigns"
            className="mt-5 inline-flex text-sm font-semibold text-purple hover:underline"
          >
            ← All campaigns
          </Link>
        </div>
      </PageFrame>
    );
  }

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
              {campaign.packageName}
            </p>
            <p className="mt-1 text-xs text-muted">
              {STATUS_LABEL[campaign.status]}
            </p>
          </div>
          <span className="rounded-full bg-orange-soft px-3 py-1 text-xs font-bold text-orange">
            ID: {campaign.orderId}
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="mb-6 text-xs font-bold tracking-[0.08em] text-muted-light">
            LIVE PROGRESS
          </p>
          <ol>
            {FLOW.map((step, i) => {
              const state = states[i];
              const isLast = i === FLOW.length - 1;
              const lineColor =
                state === "done" ? "bg-green" : "bg-[#e5e7eb]";
              const titleColor =
                state === "active"
                  ? "text-orange"
                  : state === "done"
                    ? "text-navy"
                    : "text-muted";

              return (
                <li
                  key={step.title}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  {!isLast ? (
                    <span
                      className={`absolute top-8 left-[13px] h-[calc(100%-1.5rem)] w-0.5 ${lineColor}`}
                    />
                  ) : null}
                  {state === "done" ? (
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
                  ) : state === "active" ? (
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
