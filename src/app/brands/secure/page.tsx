"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
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
      router.push(`/brands/confirmed?format=${formatId}`);
    }, 700);
  };

  return (
    <MobileShell
      footer={
        <div>
          <PrimaryButton onClick={handlePay} disabled={paying}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l7 3v6c0 5-3.5 9.4-7 11-3.5-1.6-7-6-7-11V5l7-3zm0 4v10.5c2.2-1.2 4.5-4.2 4.5-7.5V7.2L12 5.4 7.5 7.2V9c0 3.3 2.3 6.3 4.5 7.5V6z" />
            </svg>
            {paying ? "Processing…" : `Pay ₹${BOOKING.tokenAmount} Secured`}
          </PrimaryButton>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-light">
            By clicking pay you agree to NagarInfluence&apos;s Refundable Token
            Agreement terms.
          </p>
        </div>
      }
    >
      <PageHeader
        title="Secure Your Campaign"
        subtitle="Reserve with a fully refundable token booking amount"
        backHref={`/brands/confirm?format=${formatId}`}
      />

      <div className="animate-fade-up rounded-2xl border border-purple/25 bg-purple-soft p-4">
        <p className="flex items-center gap-2 text-[15px] font-bold text-purple">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l7 3v6c0 5-3.5 9.4-7 11-3.5-1.6-7-6-7-11V5l7-3z" />
          </svg>
          Pay only ₹{BOOKING.tokenAmount} to reserve
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-purple/80">
          The ₹{BOOKING.tokenAmount} booking fee prevents slots from selling out.
          This amount is directly adjusted in your final campaign invoice.
        </p>
      </div>

      <ul className="mt-5 flex flex-col gap-4">
        {[
          {
            title: "Reserves your slot immediately",
            body: "Influencer hold is guaranteed for the next 48 hours.",
          },
          {
            title: "Representative callback in 2 hours",
            body: "Our direct strategist will call to lock final specifications.",
          },
          {
            title: "100% refundable token guarantee",
            body: "No questions asked full refund if you decide not to proceed.",
          },
        ].map((item, i) => (
          <li
            key={item.title}
            className="animate-fade-up flex gap-3"
            style={{ animationDelay: `${80 + i * 50}ms` }}
          >
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
              <p className="text-[14px] font-bold text-navy">{item.title}</p>
              <p className="mt-0.5 text-[13px] text-muted">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <p
        className="animate-fade-up mt-7 mb-3 text-[11px] font-bold tracking-[0.08em] text-muted-light"
        style={{ animationDelay: "220ms" }}
      >
        PREFERRED PAYMENT METHOD
      </p>

      <div
        className="animate-fade-up flex flex-col gap-2.5"
        style={{ animationDelay: "260ms" }}
      >
        <button
          type="button"
          onClick={() => setMethod("upi")}
          className={`flex items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3.5 text-left transition ${
            method === "upi" ? "border-orange" : "border-border"
          }`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-soft text-orange">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect
                x="6"
                y="2"
                width="12"
                height="20"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <circle cx="12" cy="18" r="1" fill="currentColor" />
            </svg>
          </span>
          <span className="flex-1 text-[14px] font-semibold text-navy">
            UPI (GPay, PhonePe, Paytm)
          </span>
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
              method === "upi" ? "border-orange bg-orange" : "border-border"
            }`}
          >
            {method === "upi" ? (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            ) : null}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMethod("card")}
          className={`flex items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3.5 text-left transition ${
            method === "card" ? "border-orange" : "border-border"
          }`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-soft text-purple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect
                x="2"
                y="5"
                width="20"
                height="14"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
          <span className="flex-1 text-[14px] font-semibold text-navy">
            Credit / Debit Card
          </span>
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
              method === "card" ? "border-orange bg-orange" : "border-border"
            }`}
          >
            {method === "card" ? (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            ) : null}
          </span>
        </button>
      </div>

      <p
        className="animate-fade-up mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-light"
        style={{ animationDelay: "300ms" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l7 3v6c0 5-3.5 9.4-7 11-3.5-1.6-7-6-7-11V5l7-3z" />
        </svg>
        Secured by Razorpay. 256-bit PCI-DSS Encryption.
      </p>
    </MobileShell>
  );
}

export default function SecurePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-muted">
          Loading…
        </div>
      }
    >
      <SecureContent />
    </Suspense>
  );
}
