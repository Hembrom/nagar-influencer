"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { saveChatBrief } from "@/lib/recommend";

type CampaignBrief = {
  whatYouPromote: string;
  category: string;
  goal: string;
  location: string;
  audience: string;
  language: string;
  contentFormat: string;
  numCreators: string;
  budget: string;
  timeline: string;
};

const CATEGORIES = ["Shop / Store", "Product", "Restaurant / Cafe", "Service", "Event", "Other"];
const GOALS = [
  "Get more customers",
  "Increase awareness",
  "Promote a product",
  "Promote an event",
  "Generate leads/sales",
  "Create social content",
];
const FORMATS = ["Instagram Reel", "YouTube Short", "Instagram Story", "YouTube Video", "Not sure — Recommend for me"];
const CREATOR_COUNTS = ["1", "2", "3", "5+"];
const BUDGETS = ["₹5K–₹10K", "₹10K–₹25K", "₹25K–₹50K", "₹50K+"];
const TIMELINES = ["ASAP", "Within 1 week", "Within 2 weeks", "Flexible"];

export default function NewCampaignPage() {
  const router = useRouter();
  const [brief, setBrief] = useState<CampaignBrief>({
    whatYouPromote: "",
    category: "",
    goal: "",
    location: "Kolkata",
    audience: "18–35",
    language: "Bengali + English",
    contentFormat: "",
    numCreators: "",
    budget: "",
    timeline: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!brief.whatYouPromote.trim()) {
      newErrors.whatYouPromote = "Tell us what you're promoting";
    }
    if (!brief.goal) {
      newErrors.goal = "Select a goal";
    }
    if (!brief.contentFormat) {
      newErrors.contentFormat = "Pick a content style";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleProceed() {
    if (!validate()) return;

    // Save brief and navigate to Step 2
    saveChatBrief({
      text: brief.whatYouPromote,
      category: brief.category,
      goal: brief.goal,
      location: brief.location,
      audience: brief.audience,
      language: brief.language,
      format: brief.contentFormat,
      numCreators: brief.numCreators || "3",
      budget: brief.budget || "₹10K–₹25K",
      timeline: brief.timeline || "ASAP",
    });
    router.push("/dashboard/campaigns/new/match");
  }

  const Chip = ({
    selected,
    onClick,
    children,
  }: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        selected
          ? "bg-orange text-white"
          : "border border-border bg-background text-navy hover:border-orange"
      }`}
    >
      {children}
    </button>
  );

  const Select = ({
    value,
    onChange,
    options,
  }: {
    value: string;
    onChange: (val: string) => void;
    options: string[];
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-navy outline-none focus:border-orange"
    >
      <option value="">Select…</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );

  return (
    <PageFrame
      title="Tell us what you need"
      subtitle="Share a few details and we'll find the right creators and content style for you."
    >
      <div className="mx-auto max-w-2xl space-y-8 py-6">
        {/* Progress Indicator */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
              ●
            </div>
            <span className="text-sm font-semibold text-navy">Tell us what you need</span>
          </div>
          <div className="h-0.5 flex-1 bg-border" />
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-border text-xs font-bold text-muted">
              ○
            </div>
            <span className="text-sm text-muted">Pick your match & reserve</span>
          </div>
        </div>

        {/* SECTION 1: What are you promoting? */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-navy">What are you promoting?</h2>
          <textarea
            value={brief.whatYouPromote}
            onChange={(e) => setBrief({ ...brief, whatYouPromote: e.target.value })}
            placeholder="Tell us about your shop, product, service, event or offer…"
            className={`min-h-24 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-orange ${
              errors.whatYouPromote ? "border-red-500 focus:border-red-500" : "border-border bg-background"
            }`}
          />
          {errors.whatYouPromote && (
            <p className="text-xs text-red-600">{errors.whatYouPromote}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                selected={brief.category === cat}
                onClick={() => setBrief({ ...brief, category: cat })}
              >
                {cat}
              </Chip>
            ))}
          </div>
        </div>

        {/* SECTION 2: What's your goal? */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-navy">What's your goal?</h2>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <Chip
                key={g}
                selected={brief.goal === g}
                onClick={() => setBrief({ ...brief, goal: g })}
              >
                {g}
              </Chip>
            ))}
          </div>
          {errors.goal && <p className="text-xs text-red-600">{errors.goal}</p>}
        </div>

        {/* SECTION 3: Who should we reach? */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-navy">Who should we reach?</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted">Location</label>
              <Select
                value={brief.location}
                onChange={(val) => setBrief({ ...brief, location: val })}
                options={["Kolkata", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pan-India"]}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted">Audience age</label>
              <Select
                value={brief.audience}
                onChange={(val) => setBrief({ ...brief, audience: val })}
                options={["18–25", "18–35", "25–45", "35–55", "18+", "All ages"]}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted">Language</label>
              <Select
                value={brief.language}
                onChange={(val) => setBrief({ ...brief, language: val })}
                options={["English only", "Bengali + English", "Hindi + English", "Multiple languages"]}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Content format */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-navy">What kind of content do you want?</h2>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((fmt) => (
              <Chip
                key={fmt}
                selected={brief.contentFormat === fmt}
                onClick={() => setBrief({ ...brief, contentFormat: fmt })}
              >
                {fmt}
              </Chip>
            ))}
          </div>
          {errors.contentFormat && (
            <p className="text-xs text-red-600">{errors.contentFormat}</p>
          )}
        </div>

        {/* SECTION 5: Campaign preferences */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-navy">Campaign preferences</h2>
          <p className="text-xs text-muted">(Optional — we'll recommend defaults)</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted">Creators</label>
              <Select
                value={brief.numCreators}
                onChange={(val) => setBrief({ ...brief, numCreators: val })}
                options={CREATOR_COUNTS}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted">Budget</label>
              <Select
                value={brief.budget}
                onChange={(val) => setBrief({ ...brief, budget: val })}
                options={BUDGETS}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted">Timeline</label>
              <Select
                value={brief.timeline}
                onChange={(val) => setBrief({ ...brief, timeline: val })}
                options={TIMELINES}
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex items-center justify-between border-t border-border pt-6">
          <div className="text-xs text-muted">
            Need help? Our campaign matcher can recommend everything for you.
          </div>
          <button
            onClick={handleProceed}
            className="flex items-center gap-2 rounded-xl bg-orange px-6 py-3 text-sm font-bold text-white transition hover:bg-[#f05f20]"
          >
            Find my matches →
          </button>
        </div>
      </div>
    </PageFrame>
  );
}
