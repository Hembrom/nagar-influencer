"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  saveBrief,
  type CampaignBrief,
  type CampaignGoal,
  type ProductType,
} from "@/lib/recommend";

const GOALS: { id: CampaignGoal; label: string; hint: string }[] = [
  { id: "awareness", label: "Awareness", hint: "Get discovered by new audiences" },
  { id: "trust", label: "Build trust", hint: "Proof, reviews, credibility" },
  { id: "conversions", label: "Conversions", hint: "Demos, signups, sales" },
  { id: "launch", label: "Product launch", hint: "Release-week momentum" },
];

const PRODUCTS: { id: ProductType; label: string }[] = [
  { id: "saas", label: "SaaS / B2B software" },
  { id: "app", label: "Mobile app" },
  { id: "hardware", label: "Hardware / gadget" },
  { id: "d2c", label: "D2C / consumer brand" },
  { id: "other", label: "Other" },
];

export default function NewCampaignBriefPage() {
  const router = useRouter();
  const [form, setForm] = useState<CampaignBrief>({
    brandName: "",
    productName: "",
    productType: "saas",
    goal: "conversions",
    audience: "",
    story: "",
    want: "",
    timeline: "2weeks",
  });

  const canContinue =
    form.brandName.trim().length > 1 &&
    form.productName.trim().length > 1 &&
    form.story.trim().length > 20 &&
    form.want.trim().length > 10;

  function submit() {
    if (!canContinue) return;
    saveBrief(form);
    router.push("/dashboard/campaigns/new/match");
  }

  return (
    <PageFrame
      title="New campaign"
      subtitle="Tell us your story — we’ll recommend the best format for your goals"
      footer={
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted">
            Step 1 of 2 · Brief → system match
          </p>
          <div className="w-full max-w-xs">
            <PrimaryButton onClick={submit} disabled={!canContinue}>
              Get my recommendation
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-bold tracking-wide text-muted-light uppercase">
              Brand basics
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Brand / company"
                value={form.brandName}
                onChange={(v) => setForm({ ...form, brandName: v })}
                placeholder="Acme Tech"
              />
              <Field
                label="Product name"
                value={form.productName}
                onChange={(v) => setForm({ ...form, productName: v })}
                placeholder="Acme Analytics"
              />
            </div>

            <p className="mt-5 mb-2 text-sm font-semibold text-navy">
              Product type
            </p>
            <div className="flex flex-wrap gap-2">
              {PRODUCTS.map((p) => (
                <Chip
                  key={p.id}
                  active={form.productType === p.id}
                  onClick={() => setForm({ ...form, productType: p.id })}
                >
                  {p.label}
                </Chip>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-bold tracking-wide text-muted-light uppercase">
              What do you want?
            </h2>
            <p className="mt-4 mb-2 text-sm font-semibold text-navy">
              Primary goal
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setForm({ ...form, goal: g.id })}
                  className={`rounded-2xl border-2 p-4 text-left transition ${
                    form.goal === g.id
                      ? "border-orange bg-orange-soft/40"
                      : "border-border hover:border-orange/40"
                  }`}
                >
                  <p className="text-sm font-bold text-navy">{g.label}</p>
                  <p className="mt-1 text-xs text-muted">{g.hint}</p>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Field
                label="Who is this for?"
                value={form.audience}
                onChange={(v) => setForm({ ...form, audience: v })}
                placeholder="e.g. Indian SMB founders, SaaS marketers…"
              />
            </div>

            <label className="mt-4 block text-sm">
              <span className="mb-1.5 block font-semibold text-navy">
                Your story
              </span>
              <textarea
                rows={4}
                value={form.story}
                onChange={(e) => setForm({ ...form, story: e.target.value })}
                placeholder="What are you building? What’s the problem you solve? Why now?"
                className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-purple"
              />
              <span className="mt-1 block text-xs text-muted-light">
                Min. ~20 characters — the more context, the better the match.
              </span>
            </label>

            <label className="mt-4 block text-sm">
              <span className="mb-1.5 block font-semibold text-navy">
                What should this campaign achieve?
              </span>
              <textarea
                rows={3}
                value={form.want}
                onChange={(e) => setForm({ ...form, want: e.target.value })}
                placeholder="e.g. Drive demo signups, explain our dashboard, launch to tech YouTubers…"
                className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-purple"
              />
            </label>

            <p className="mt-5 mb-2 text-sm font-semibold text-navy">Timeline</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "asap" as const, label: "ASAP" },
                  { id: "2weeks" as const, label: "Within 2 weeks" },
                  { id: "flexible" as const, label: "Flexible" },
                ] as const
              ).map((t) => (
                <Chip
                  key={t.id}
                  active={form.timeline === t.id}
                  onClick={() => setForm({ ...form, timeline: t.id })}
                >
                  {t.label}
                </Chip>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-purple/20 bg-purple-soft p-5">
          <p className="text-xs font-bold tracking-wide text-purple uppercase">
            How matching works
          </p>
          <ol className="mt-3 space-y-3 text-sm leading-relaxed text-purple">
            <li>
              <span className="font-bold">1.</span> You share story & goals — no
              format picking yet.
            </li>
            <li>
              <span className="font-bold">2.</span> We score formats against your
              product type and outcome.
            </li>
            <li>
              <span className="font-bold">3.</span> You get one best pick + why,
              then reserve with ₹500.
            </li>
          </ol>
        </aside>
      </div>
    </PageFrame>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-navy">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-purple"
      />
    </label>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
        active
          ? "bg-orange text-white"
          : "bg-background text-muted hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}
