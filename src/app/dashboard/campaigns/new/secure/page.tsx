"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import { BOOKING } from "@/lib/formats";

function SecureContent() {
  const router = useRouter();
  const params = useSearchParams();
  const formatId = params.get("format") ?? "youtube-video";
  const [method, setMethod] = useState<"upi" | "card">("upi");
  const [paying, setPaying] = useState(false);

  const handlePay = () => {
    setPaying(true);
    window.setTimeout(() => {
      router.push(
        `/dashboard/campaigns/new/confirmed?format=${formatId}`,
      );
    }, 700);
  };

  return (
    <PageFrame
      title="Secure your campaign"
      subtitle="Reserve with a fully refundable token booking amount"
      footer={
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() =>
              router.push(`/dashboard/campaigns/new/confirm?format=${formatId}`)
            }
            className="text-sm font-semibold text-muted hover:text-navy"
          >
            ← Back
          </button>
          <div className="w-full max-w-sm">
            <PrimaryButton onClick={handlePay} disabled={paying}>
              {paying ? "Processing…" : `Pay ₹${BOOKING.tokenAmount} secured`}
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="rounded-2xl border border-purple/25 bg-purple-soft p-5">
            <p className="text-base font-bold text-purple">
              Pay only ₹{BOOKING.tokenAmount} to reserve
            </p>
            <p className="mt-2 text-sm leading-relaxed text-purple/80">
              The booking fee prevents slots from selling out and is adjusted in
              your final campaign invoice.
            </p>
          </div>

          <ul className="space-y-4 rounded-2xl border border-border bg-card p-5">
            {[
              {
                title: "Reserves your slot immediately",
                body: "Influencer hold is guaranteed for the next 48 hours.",
              },
              {
                title: "Representative callback in 2 hours",
                body: "Our strategist will call to lock final specifications.",
              },
              {
                title: "100% refundable token guarantee",
                body: "Full refund if you decide not to proceed.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-3">
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
                <div>
                  <p className="text-sm font-bold text-navy">{item.title}</p>
                  <p className="text-sm text-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-3 text-xs font-bold tracking-[0.08em] text-muted-light">
            PREFERRED PAYMENT METHOD
          </p>
          <div className="space-y-2.5">
            {(
              [
                {
                  id: "upi" as const,
                  label: "UPI (GPay, PhonePe, Paytm)",
                },
                {
                  id: "card" as const,
                  label: "Credit / Debit Card",
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMethod(opt.id)}
                className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left transition ${
                  method === opt.id ? "border-orange" : "border-border"
                }`}
              >
                <span className="text-sm font-semibold text-navy">
                  {opt.label}
                </span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    method === opt.id
                      ? "border-orange bg-orange"
                      : "border-border"
                  }`}
                >
                  {method === opt.id ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  ) : null}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted-light">
            Secured by Razorpay · 256-bit PCI-DSS encryption
          </p>
        </div>
      </div>
    </PageFrame>
  );
}

export default function SecurePage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted">Loading…</div>}>
      <SecureContent />
    </Suspense>
  );
}
