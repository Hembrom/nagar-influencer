"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import { getCampaign, type Campaign } from "@/lib/campaigns";

function ConfirmedContent() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    if (!orderId) return;
    setCampaign(getCampaign(orderId));
  }, [orderId]);

  if (!orderId || !campaign) {
    return (
      <PageFrame title="Booking secured" subtitle="Looking up your order…">
        <div className="py-16 text-center text-muted">
          {orderId ? (
            <>
              Order not found.{" "}
              <Link href="/dashboard/campaigns" className="text-purple underline">
                View all campaigns
              </Link>
            </>
          ) : (
            <>
              No order id.{" "}
              <Link href="/dashboard/campaigns/new" className="text-purple underline">
                Start a new campaign
              </Link>
            </>
          )}
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame
      title="Booking secured"
      subtitle="Your token reservation is confirmed"
      footer={
        <div className="flex justify-end">
          <div className="w-full max-w-xs">
            <PrimaryButton
              variant="purple"
              href={`/dashboard/campaigns/${campaign.orderId}`}
            >
              Track order status
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-soft text-green">
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
          <h2 className="mt-4 text-3xl font-extrabold text-navy">
            Booking Secured!
          </h2>
          <span className="mt-3 rounded-full bg-green px-3 py-1 text-[11px] font-bold tracking-wide text-white">
            ORDER PLACED
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-xs font-bold tracking-[0.08em] text-muted-light">
              BOOKING RECEIPT
            </p>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Selected Package</dt>
                <dd className="max-w-[60%] text-right font-bold text-navy">
                  {campaign.packageName}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Token Paid</dt>
                <dd className="font-bold text-green">
                  ₹{campaign.tokenAmount}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Order ID</dt>
                <dd className="font-bold text-purple-deep">{campaign.id}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-xs font-bold tracking-[0.08em] text-muted-light">
              WHAT HAPPENS NEXT?
            </p>
            <ol className="space-y-4">
              {[
                {
                  title: "Strategist assigns within 2 hours",
                  body: "An expert will contact your registered phone.",
                },
                {
                  title: "Details finalization",
                  body: "Lock angles, brief, and release date.",
                },
                {
                  title: "Campaign goes live",
                  body: "Creator uploads content. Full payment post-release.",
                },
              ].map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-soft text-xs font-bold text-purple-deep">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy">{step.title}</p>
                    <p className="text-sm text-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Or go to{" "}
          <Link
            href="/dashboard/campaigns"
            className="font-semibold text-purple hover:underline"
          >
            all campaigns
          </Link>
        </p>
      </div>
    </PageFrame>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted">Loading…</div>}>
      <ConfirmedContent />
    </Suspense>
  );
}
