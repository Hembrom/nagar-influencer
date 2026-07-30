import Link from "next/link";
import { MobileShell } from "@/components/MobileShell";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function InfluencersPage() {
  return (
    <MobileShell
      footer={
        <div className="flex flex-col gap-2.5">
          <PrimaryButton variant="purple" href="mailto:creators@nagarinfluence.com">
            Apply as Creator
          </PrimaryButton>
          <Link
            href="/"
            className="py-2 text-center text-[13px] font-semibold text-muted"
          >
            Back to home
          </Link>
        </div>
      }
    >
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple text-xs font-extrabold text-white">
          NI
        </div>
        <span className="text-base font-bold text-navy">NagarInfluence</span>
        <VerifiedBadge />
      </div>

      <div className="animate-fade-up">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-purple">
          Creator desk
        </p>
        <h1 className="mt-2 text-[28px] font-extrabold leading-tight text-navy">
          Grow with verified brand campaigns
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Join NagarInfluence as a creator. Get matched with tech & SaaS brands,
          clear briefs, and on-time payouts.
        </p>
      </div>

      <div
        className="animate-fade-up mt-8 flex flex-col gap-3"
        style={{ animationDelay: "100ms" }}
      >
        {[
          {
            title: "Verified brand briefs only",
            body: "No spam collabs — every campaign is pre-screened.",
          },
          {
            title: "Transparent payouts",
            body: "Token-backed bookings with milestone releases.",
          },
          {
            title: "Dedicated creator success",
            body: "A strategist helps lock angles, dates, and delivery.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-card p-4 shadow-[0_2px_12px_rgba(26,26,46,0.06)]"
          >
            <p className="text-[14px] font-bold text-navy">{item.title}</p>
            <p className="mt-1 text-[13px] text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}
