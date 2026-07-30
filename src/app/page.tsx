import Link from "next/link";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export default function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0f0a1f]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 15% 0%, rgba(79,44,207,0.5), transparent 55%), radial-gradient(ellipse 60% 45% at 90% 80%, rgba(255,107,43,0.28), transparent 50%), radial-gradient(ellipse 40% 35% at 50% 100%, rgba(35,193,141,0.12), transparent 45%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-8 py-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple text-sm font-extrabold text-white shadow-lg shadow-purple/40">
              NI
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              NagarInfluence
            </span>
            <VerifiedBadge />
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white/75 transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/login?next=/dashboard/campaigns/new"
              className="rounded-xl bg-orange px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(255,107,43,0.35)] transition hover:bg-[#f05f20]"
            >
              Open workspace
            </Link>
          </div>
        </header>

        <main className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <p className="mb-4 text-sm font-semibold tracking-wide text-orange">
              India&apos;s verified campaign desk
            </p>
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white lg:text-6xl">
              Run influencer campaigns
              <span className="text-orange"> like a product team</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
              Reserve creator slots with a refundable token, get a strategist
              assigned in hours, and track every campaign from one desktop
              workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login?next=/dashboard/campaigns/new"
                className="rounded-2xl bg-orange px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_rgba(255,107,43,0.4)] transition hover:bg-[#f05f20]"
              >
                I&apos;m a Brand
              </Link>
              <Link
                href="/influencers"
                className="rounded-2xl border border-white/15 bg-white/8 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/12"
              >
                I&apos;m an Influencer
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/40">
              Secure bookings · Verified creators · Refundable token
            </p>
          </div>

          <div
            className="animate-fade-up grid gap-4 sm:grid-cols-2"
            style={{ animationDelay: "120ms" }}
          >
            {[
              {
                title: "New campaign",
                body: "Pick a format, review samples, reserve with ₹500.",
              },
              {
                title: "All campaigns",
                body: "Track live progress from order placed to go-live.",
              },
              {
                title: "Messages",
                body: "Talk to your assigned strategist in one thread.",
              },
              {
                title: "Settings",
                body: "Manage brand profile, billing contacts, and prefs.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-white/6 p-5 backdrop-blur-md"
              >
                <p className="text-sm font-bold text-white">{card.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
