"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { FormatIcon } from "@/components/FormatIcons";
import { CAMPAIGN_FORMATS } from "@/lib/formats";

export default function BrandsFormatPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(CAMPAIGN_FORMATS[0].id);
  const format = CAMPAIGN_FORMATS.find((f) => f.id === selected)!;

  return (
    <MobileShell
      footer={
        <PrimaryButton
          onClick={() => router.push(`/brands/samples?format=${selected}`)}
        >
          Continue
        </PrimaryButton>
      }
    >
      <div className="mb-6 animate-fade-up flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple text-xs font-extrabold text-white">
          NI
        </div>
        <span className="text-base font-bold text-navy">NagarInfluence</span>
        <VerifiedBadge />
      </div>

      <p className="animate-fade-up mb-1 text-[14px] text-muted">
        Select the format that fits your product best
      </p>
      <h2
        className="animate-fade-up mb-5 text-[13px] font-bold tracking-[0.08em] text-navy"
        style={{ animationDelay: "40ms" }}
      >
        CAMPAIGN FORMAT
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {CAMPAIGN_FORMATS.map((item, i) => {
          const isActive = item.id === selected;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id)}
              className={`animate-fade-up relative rounded-2xl border-2 bg-card p-3.5 text-left transition ${
                isActive
                  ? "border-orange shadow-[0_4px_16px_rgba(255,107,43,0.18)]"
                  : "border-transparent shadow-[0_2px_12px_rgba(26,26,46,0.06)]"
              }`}
              style={{ animationDelay: `${60 + i * 40}ms` }}
            >
              {isActive ? (
                <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-orange" />
              ) : null}
              <FormatIcon icon={item.icon} active={isActive} />
              <p className="mt-3 text-[13px] font-bold leading-snug text-navy">
                {item.title}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted">
                {item.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {format.recommendation ? (
        <div
          className="animate-fade-up mt-5 flex gap-3 rounded-2xl bg-purple-soft p-4"
          style={{ animationDelay: "320ms" }}
        >
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple/15 text-purple">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 21h6v-1.5H9V21zm3-19C8.7 2 6 4.7 6 8c0 2.4 1.4 4.4 3.4 5.3V16h5.2v-2.7C16.6 12.4 18 10.4 18 8c0-3.3-2.7-6-6-6z" />
            </svg>
          </span>
          <p className="text-[13px] leading-relaxed text-purple">
            <span className="font-bold">Recommended:</span>{" "}
            {format.recommendation}
          </p>
        </div>
      ) : null}
    </MobileShell>
  );
}
