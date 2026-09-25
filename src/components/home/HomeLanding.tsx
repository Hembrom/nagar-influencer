"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

const BUSINESS_HREF = "/login?next=/dashboard/campaigns/new";
const CREATOR_HREF = "/influencers";

type ModalType =
  | { kind: "info"; audience: "business" | "creator" }
  | { kind: "how" }
  | { kind: "categories" }
  | { kind: "resources" }
  | { kind: "login" }
  | { kind: "early" };

const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const STEPS: { title: string; desc: string; icon: ReactNode }[] = [
  {
    title: "Discover",
    desc: "Find relevant creators or businesses in your city.",
    icon: (
      <svg {...iconProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    title: "Connect",
    desc: "View profiles, check fit and reach out.",
    icon: (
      <svg {...iconProps}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
    ),
  },
  {
    title: "Collaborate",
    desc: "Plan campaigns, set goals and go live.",
    icon: (
      <svg {...iconProps}>
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
        <path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8" />
      </svg>
    ),
  },
  {
    title: "Manage",
    desc: "Communicate, track progress and handle deliverables.",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18M8 15l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Measure",
    desc: "See what worked and create bigger opportunities.",
    icon: (
      <svg {...iconProps}>
        <path d="M3 3v18h18" />
        <path d="m7 15 4-4 3 3 5-6" />
      </svg>
    ),
  },
];

const CATEGORIES: { name: string; icon: ReactNode }[] = [
  {
    name: "Food & Beverages",
    icon: (
      <svg {...iconProps}>
        <path d="M3 2v7c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2V2M6 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    ),
  },
  {
    name: "Fashion & Beauty",
    icon: (
      <svg {...iconProps}>
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z" />
      </svg>
    ),
  },
  {
    name: "Education & Coaching",
    icon: (
      <svg {...iconProps}>
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    name: "Healthcare & Wellness",
    icon: (
      <svg {...iconProps}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3.2 12h4.3l1.5-3 2 6 1.5-3h8.3" />
      </svg>
    ),
  },
  {
    name: "Home & Real Estate",
    icon: (
      <svg {...iconProps}>
        <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    name: "Automotive",
    icon: (
      <svg {...iconProps}>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2.7-3.6A2 2 0 0 0 13.7 6H7.3a2 2 0 0 0-1.6.9L3 10.5 2.6 11A2 2 0 0 0 2 12.4V16c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
        <path d="M9 17h6" />
      </svg>
    ),
  },
  {
    name: "Travel & Tourism",
    icon: (
      <svg {...iconProps}>
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z" />
      </svg>
    ),
  },
  {
    name: "And More…",
    icon: (
      <svg {...iconProps}>
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />
      </svg>
    ),
  },
];

const AUDIENCES = {
  business: {
    label: "For business owners",
    kicker:
      "You know your city. But reaching the right customers is getting harder.",
    points: [
      "Don't know which local creators to trust",
      "Difficult to find creators who actually match your business",
      "Negotiating and coordinating campaigns takes time",
      "Most influencer platforms feel designed for bigger brands",
    ],
    note: "Grow My Influence brings discovery, collaboration and campaign management into one place.",
    cta: "I'm a Business Owner",
    href: BUSINESS_HREF,
  },
  creator: {
    label: "For creators",
    kicker: "Your audience is local. Your opportunities should be too.",
    points: [
      "Find businesses looking for creators like you",
      "Discover relevant collaboration opportunities",
      "Build a professional creator profile",
      "Turn local influence into meaningful income",
    ],
    note: "Get noticed. Build relationships. Do what you love — right in your city.",
    cta: "I'm a Creator",
    href: CREATOR_HREF,
  },
} as const;

const SPOTLIGHT_POINTS = [
  { title: "Local focus", body: "Right in your city" },
  { title: "Real connections", body: "People you can trust" },
  { title: "Meaningful growth", body: "For businesses and creators" },
];

const RESOURCES = [
  {
    title: "Creator guidelines",
    body: "How to build a profile that local businesses want to work with.",
  },
  {
    title: "Campaign playbook",
    body: "Plan a local promotion from brief to go-live in a week.",
  },
  {
    title: "Pricing & payouts",
    body: "How bookings, tokens and creator payouts work.",
  },
  {
    title: "FAQ",
    body: "Answers to the questions we hear most from businesses and creators.",
  },
];

const FOOTER_COLUMNS = [
  {
    title: "For Businesses",
    links: [
      { label: "Find creators", href: BUSINESS_HREF },
      { label: "Start a campaign", href: BUSINESS_HREF },
      { label: "How it works", href: "#how" },
    ],
  },
  {
    title: "For Creators",
    links: [
      { label: "Join as creator", href: CREATOR_HREF },
      { label: "Creator hub", href: "/influencer-home" },
      { label: "Build your profile", href: "/influencer/setup" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Categories", href: "#categories" },
      { label: "FAQ", href: "/" },
      { label: "Contact us", href: "mailto:hello@nagarinfluence.com" },
    ],
  },
];

const primaryBtn =
  "inline-flex items-center justify-center rounded-xl bg-purple-deep px-6 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(79,44,207,0.28)] transition hover:bg-purple-deep/90";
const outlineBtn =
  "inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold text-navy transition hover:border-purple/40 hover:text-purple";

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-4 w-4 shrink-0 ${className}`}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple text-xs font-extrabold text-white">
        GMI
      </div>
      <span className="text-base font-bold tracking-tight text-navy">
        Grow My Influence
      </span>
    </Link>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-scale-in max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-xl font-extrabold text-navy">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-muted transition hover:bg-background hover:text-navy"
          >
            <svg className="h-5 w-5" {...iconProps}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EarlyAccessForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-green-soft p-5 text-center">
        <p className="font-bold text-navy">You&apos;re on the list!</p>
        <p className="mt-1 text-sm text-muted">
          We&apos;ll reach out as soon as Grow My Influence opens in your city.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-navy outline-none transition focus:border-purple focus:bg-card";

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-sm text-muted">
        Be the first to connect with businesses and creators in your city.
      </p>
      <input required name="name" placeholder="Full name" className={field} />
      <input
        required
        type="email"
        name="email"
        placeholder="Email address"
        className={field}
      />
      <select required name="role" defaultValue="" className={field}>
        <option value="" disabled>
          I am a…
        </option>
        <option value="business">Business owner</option>
        <option value="creator">Creator</option>
      </select>
      <input required name="city" placeholder="Your city" className={field} />
      <button type="submit" className={`${primaryBtn} w-full`}>
        Get early access
      </button>
    </form>
  );
}

function ModalContent({
  modal,
  onClose,
  setModal,
}: {
  modal: ModalType;
  onClose: () => void;
  setModal: (m: ModalType) => void;
}) {
  switch (modal.kind) {
    case "info": {
      const a = AUDIENCES[modal.audience];
      return (
        <Modal title={a.label} onClose={onClose}>
          <p className="font-semibold text-navy">{a.kicker}</p>
          <ul className="mt-4 space-y-2.5">
            {a.points.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm text-muted">
                <CheckIcon className="mt-0.5 text-purple" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-purple-soft p-4 text-sm font-medium text-purple-deep">
            {a.note}
          </p>
          <Link href={a.href} className={`${primaryBtn} mt-5 w-full`}>
            {a.cta}
          </Link>
        </Modal>
      );
    }
    case "how":
      return (
        <Modal title="How it works" onClose={onClose}>
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="flex gap-3 rounded-xl border border-border p-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-soft text-xs font-bold text-purple">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-bold text-navy">{s.title}</p>
                  <p className="text-sm text-muted">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Modal>
      );
    case "categories":
      return (
        <Modal title="All categories" onClose={onClose}>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-semibold text-navy"
              >
                <span className="text-purple">{c.icon}</span>
                {c.name}
              </div>
            ))}
          </div>
        </Modal>
      );
    case "resources":
      return (
        <Modal title="Resources" onClose={onClose}>
          <div className="space-y-3">
            {RESOURCES.map((r) => (
              <div
                key={r.title}
                className="rounded-xl border border-border p-4"
              >
                <p className="text-sm font-bold text-navy">{r.title}</p>
                <p className="mt-1 text-sm text-muted">{r.body}</p>
              </div>
            ))}
          </div>
        </Modal>
      );
    case "login":
      return (
        <Modal title="Log in" onClose={onClose}>
          <p className="text-sm text-muted">
            Choose how you use Grow My Influence.
          </p>
          <div className="mt-4 grid gap-3">
            <Link href="/login" className={primaryBtn}>
              Log in as a Business
            </Link>
            <Link href="/influencer/login" className={outlineBtn}>
              Log in as a Creator
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            New here?{" "}
            <button
              onClick={() => setModal({ kind: "early" })}
              className="font-semibold text-purple hover:underline"
            >
              Get started
            </button>
          </p>
        </Modal>
      );
    case "early":
      return (
        <Modal title="Get early access" onClose={onClose}>
          <EarlyAccessForm />
        </Modal>
      );
  }
}

export function HomeLanding() {
  const [modal, setModal] = useState<ModalType | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const closeModal = useCallback(() => setModal(null), []);
  const open = (m: ModalType) => {
    setMenuOpen(false);
    setModal(m);
  };

  const navItems: { label: string; action: () => void }[] = [
    {
      label: "For Businesses",
      action: () => open({ kind: "info", audience: "business" }),
    },
    {
      label: "For Creators",
      action: () => open({ kind: "info", audience: "creator" }),
    },
    {
      label: "How It Works",
      action: () => {
        setMenuOpen(false);
        document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    { label: "Resources", action: () => open({ kind: "resources" }) },
  ];

  const step = STEPS[activeStep];

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((n) => (
              <button
                key={n.label}
                onClick={n.action}
                className="text-sm font-medium text-muted transition hover:text-navy"
              >
                {n.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy lg:hidden"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
            <button
              onClick={() => open({ kind: "login" })}
              className="hidden rounded-xl border border-border px-4 py-2 text-sm font-bold text-navy transition hover:border-purple/40 hover:text-purple sm:inline-flex"
            >
              Login
            </button>
            <button
              onClick={() => open({ kind: "early" })}
              className="hidden rounded-xl bg-purple-deep px-4 py-2 text-sm font-bold text-white transition hover:bg-purple-deep/90 sm:inline-flex"
            >
              Get Started
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="animate-fade-up border-t border-border bg-card px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((n) => (
                <button
                  key={n.label}
                  onClick={n.action}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-navy hover:bg-background"
                >
                  {n.label}
                </button>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 sm:hidden">
                <button
                  onClick={() => open({ kind: "login" })}
                  className={outlineBtn}
                >
                  Login
                </button>
                <button
                  onClick={() => open({ kind: "early" })}
                  className={primaryBtn}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-card">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-soft blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-orange-soft blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-28 pt-16 lg:grid-cols-2 lg:pt-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              Growing, right in your city
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-6xl">
              Your city has stories{" "}
              <span className="text-purple">worth sharing.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Grow My Influence connects local businesses with trusted creators
              to build authentic promotions, bring in more customers, and grow
              stronger communities — right where you live.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={BUSINESS_HREF} className={primaryBtn}>
                I&apos;m a Business Owner
              </Link>
              <Link href={CREATOR_HREF} className={outlineBtn}>
                I&apos;m a Creator
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm font-medium text-muted">
              <span className="flex items-center gap-2">
                <CheckIcon className="text-green" /> Safe &amp; verified
                profiles
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon className="text-green" /> Built for local reach
              </span>
            </div>
          </div>

          <div
            className="animate-fade-up relative mx-auto w-full max-w-md"
            style={{ animationDelay: "120ms" }}
          >
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_20px_50px_rgba(26,26,46,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple text-sm font-bold text-white">
                  MR
                </div>
                <div>
                  <p className="font-bold text-navy">Meera R.</p>
                  <p className="text-xs text-muted">
                    Fashion &amp; Beauty · Tier 2 city
                  </p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
                {[
                  { v: "12.4K", l: "reach" },
                  { v: "4.9", l: "rating" },
                  { v: "18", l: "collabs" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-lg font-extrabold text-navy">{s.v}</p>
                    <p className="text-xs text-muted">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 -mt-4 ml-10 rounded-2xl border border-border bg-card p-5 shadow-[0_20px_50px_rgba(26,26,46,0.1)] sm:ml-16">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange text-sm font-bold text-white">
                  SG
                </div>
                <div className="flex-1">
                  <p className="font-bold text-navy">
                    Sundar&apos;s General Store
                  </p>
                  <p className="text-xs text-muted">Local Shop</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-soft px-2.5 py-1 text-xs font-semibold text-green">
                  <CheckIcon className="h-3 w-3" /> Verified
                </span>
              </div>
            </div>

            <div className="animate-pulse-soft absolute -bottom-10 left-0 z-20 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white shadow-lg">
              <span className="h-2 w-2 rounded-full bg-green" />
              New collaboration matched
            </div>
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 block h-12 w-full text-background"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0 40c240 40 480 40 720 20S1200 0 1440 30v50H0Z"
          />
        </svg>
      </section>

      {/* Goals */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Different goals. A common growth story.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Whether you run a business or create content, Grow My Influence
            helps you unlock real opportunities in your city.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {(["business", "creator"] as const).map((key) => {
            const a = AUDIENCES[key];
            const accent = key === "business" ? "text-purple" : "text-orange";
            const accentBg =
              key === "business" ? "bg-purple-soft" : "bg-orange-soft";
            return (
              <div
                key={key}
                className="flex flex-col rounded-2xl border border-border bg-card p-7"
              >
                <span
                  className={`self-start rounded-full ${accentBg} px-3 py-1 text-xs font-semibold uppercase tracking-wider ${accent}`}
                >
                  {a.label}
                </span>
                <p className="mt-4 text-lg font-bold leading-snug text-navy">
                  {a.kicker}
                </p>
                <ul className="mt-5 space-y-3">
                  {a.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-muted">
                      <CheckIcon className={`mt-0.5 ${accent}`} />
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-border pt-5 text-sm font-medium text-navy">
                  {a.note}
                </p>
                <Link
                  href={a.href}
                  className={`${key === "business" ? primaryBtn : outlineBtn} mt-6 self-start`}
                >
                  {a.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 bg-card py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              One platform. From discovery to results.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              A simple process to find the right people, run effective campaigns
              and grow — all in one place.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {STEPS.map((s, i) => {
              const active = i === activeStep;
              return (
                <div key={s.title} className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setActiveStep(i)}
                    aria-pressed={active}
                    className={`flex w-24 flex-col items-center gap-2 rounded-2xl border p-3 transition sm:w-28 ${
                      active
                        ? "border-purple bg-purple-soft text-purple"
                        : "border-border bg-card text-muted hover:border-purple/40 hover:text-navy"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        active ? "bg-purple text-white" : "bg-background"
                      }`}
                    >
                      {s.icon}
                    </span>
                    <span className="text-xs font-bold sm:text-sm">
                      {s.title}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <svg
                      className="hidden h-5 w-5 text-muted-light sm:block"
                      {...iconProps}
                      aria-hidden
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          <div
            key={activeStep}
            className="animate-fade-up mx-auto mt-8 flex max-w-xl items-center gap-5 rounded-2xl border border-border bg-background p-6"
          >
            <span className="text-4xl font-extrabold text-purple/30">
              {String(activeStep + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-lg font-bold text-navy">{step.title}</p>
              <p className="mt-1 text-sm text-muted">{step.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Explore opportunities in your city
          </h2>
          <button
            onClick={() => open({ kind: "categories" })}
            className="text-sm font-bold text-purple hover:underline"
          >
            View all categories →
          </button>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => open({ kind: "categories" })}
              className="group flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-purple/40 hover:shadow-[0_12px_30px_rgba(79,44,207,0.08)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-soft text-purple transition group-hover:bg-purple group-hover:text-white">
                {c.icon}
              </span>
              <span className="text-sm font-bold text-navy">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Creator spotlight */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-purple-soft px-6 py-14 text-center sm:px-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Built for the creators who bring local stories to life.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
            From neighbourhood food spots to the boutique down the street,
            creators are how cities discover what&apos;s worth loving. Grow My
            Influence helps you turn that influence into real partnerships.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {SPOTLIGHT_POINTS.map((p) => (
              <div key={p.title} className="rounded-2xl bg-card p-5">
                <p className="font-bold text-purple">{p.title}</p>
                <p className="mt-1 text-sm text-muted">{p.body}</p>
              </div>
            ))}
          </div>
          <Link href={CREATOR_HREF} className={`${primaryBtn} mt-10`}>
            I&apos;m a Creator
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted">
              Connecting local businesses and creators, one city at a time.
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold text-navy">
                {col.title}
              </h3>
              <ul className="space-y-2 text-sm text-muted">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition hover:text-navy">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-navy">Follow Us</h3>
            <div className="flex gap-2">
              {[
                {
                  label: "Instagram",
                  path: (
                    <>
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </>
                  ),
                },
                {
                  label: "YouTube",
                  path: (
                    <>
                      <rect x="2" y="5" width="20" height="14" rx="4" />
                      <path d="m10 9 5 3-5 3Z" />
                    </>
                  ),
                },
                {
                  label: "LinkedIn",
                  path: (
                    <>
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
                    </>
                  ),
                },
                {
                  label: "X",
                  path: <path d="M4 4l16 16M20 4 4 20" />,
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition hover:border-purple/40 hover:text-purple"
                >
                  <svg className="h-4 w-4" {...iconProps}>
                    {s.path}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-6 text-sm text-muted">
          <p>© 2026 Grow My Influence. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/" className="hover:text-navy">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-navy">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>

      {modal && (
        <ModalContent modal={modal} onClose={closeModal} setModal={setModal} />
      )}
    </div>
  );
}
