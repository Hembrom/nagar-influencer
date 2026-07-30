"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import { FormatIcon } from "@/components/FormatIcons";
import { CAMPAIGN_FORMATS } from "@/lib/formats";

export default function NewCampaignPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(CAMPAIGN_FORMATS[0].id);
  const format = CAMPAIGN_FORMATS.find((f) => f.id === selected)!;

  return (
    <PageFrame
      title="New campaign"
      subtitle="Select the format that fits your product best"
      footer={
        <div className="flex justify-end">
          <div className="w-full max-w-xs">
            <PrimaryButton
              onClick={() =>
                router.push(
                  `/dashboard/campaigns/new/samples?format=${selected}`,
                )
              }
            >
              Continue
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="mb-4 text-xs font-bold tracking-[0.08em] text-muted-light">
            CAMPAIGN FORMAT
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CAMPAIGN_FORMATS.map((item) => {
              const isActive = item.id === selected;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.id)}
                  className={`relative rounded-2xl border-2 bg-card p-5 text-left transition ${
                    isActive
                      ? "border-orange shadow-[0_8px_24px_rgba(255,107,43,0.15)]"
                      : "border-border hover:border-orange/40"
                  }`}
                >
                  {isActive ? (
                    <span className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-orange" />
                  ) : null}
                  <FormatIcon icon={item.icon} active={isActive} />
                  <p className="mt-4 text-base font-bold text-navy">
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-muted">
                    {item.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-purple/20 bg-purple-soft p-5">
          <p className="text-xs font-bold tracking-wide text-purple uppercase">
            Insight
          </p>
          {format.recommendation ? (
            <p className="mt-3 text-sm leading-relaxed text-purple">
              <span className="font-bold">Recommended:</span>{" "}
              {format.recommendation}
            </p>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-purple">
              {format.description}
            </p>
          )}
          <div className="mt-5 border-t border-purple/15 pt-4">
            <p className="text-xs font-bold text-purple/70">Selected</p>
            <p className="mt-1 text-sm font-bold text-purple-deep">
              {format.title}
            </p>
          </div>
        </aside>
      </div>
    </PageFrame>
  );
}
