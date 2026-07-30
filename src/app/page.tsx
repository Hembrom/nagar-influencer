import Link from "next/link";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export default function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0f0a1f]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,44,207,0.55), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, rgba(255,107,43,0.28), transparent 50%), radial-gradient(ellipse 50% 40% at 10% 70%, rgba(35,193,141,0.18), transparent 45%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-10">
        <div className="animate-fade-up flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple text-sm font-extrabold text-white shadow-lg shadow-purple/40">
            NI
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            NagarInfluence
          </span>
          <VerifiedBadge />
        </div>

        <div className="mt-12 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <p className="mb-3 text-sm font-medium tracking-wide text-white/55">
            India&apos;s verified campaign desk
          </p>
          <h1 className="text-[40px] font-extrabold leading-[1.05] tracking-tight text-white">
            Nagar
            <span className="text-orange">Influence</span>
          </h1>
          <p className="mt-4 max-w-[20rem] text-[15px] leading-relaxed text-white/70">
            Book creator campaigns with a refundable token — or join as a
            verified influencer.
          </p>
        </div>

        <div
          className="animate-fade-up mt-10 mb-4 flex flex-col gap-3"
          style={{ animationDelay: "160ms" }}
        >
          <Link
            href="/brands"
            className="group flex items-center justify-between rounded-2xl bg-orange px-5 py-5 text-left shadow-[0_12px_32px_rgba(255,107,43,0.4)] transition hover:bg-[#f05f20] active:scale-[0.98]"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/75">
                For marketers
              </p>
              <p className="text-lg font-extrabold text-white">I&apos;m a Brand</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition group-hover:translate-x-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>

          <Link
            href="/influencers"
            className="group flex items-center justify-between rounded-2xl border border-white/15 bg-white/8 px-5 py-5 text-left backdrop-blur-md transition hover:bg-white/12 active:scale-[0.98]"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/55">
                For creators
              </p>
              <p className="text-lg font-extrabold text-white">
                I&apos;m an Influencer
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition group-hover:translate-x-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>

        <p
          className="animate-fade-up text-center text-[12px] text-white/40"
          style={{ animationDelay: "240ms" }}
        >
          Secure bookings · Verified creators · Refundable token
        </p>
      </main>
    </div>
  );
}
