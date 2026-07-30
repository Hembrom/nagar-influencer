import Link from "next/link";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export default function InfluencersPage() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-5xl px-8 py-10">
        <header className="mb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple text-xs font-extrabold text-white">
              NI
            </div>
            <span className="text-base font-bold text-navy">NagarInfluence</span>
            <VerifiedBadge />
          </Link>
          <Link
            href="mailto:creators@nagarinfluence.com"
            className="rounded-xl bg-purple-deep px-4 py-2.5 text-sm font-bold text-white"
          >
            Apply as creator
          </Link>
        </header>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-purple">
              Creator desk
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-navy lg:text-5xl">
              Grow with verified brand campaigns
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Join NagarInfluence as a creator. Get matched with tech & SaaS
              brands, clear briefs, and on-time payouts.
            </p>
          </div>

          <div className="grid gap-4">
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
                className="rounded-2xl border border-border bg-card p-5"
              >
                <p className="font-bold text-navy">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
