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

  const Chip = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      style={{
        padding: "12px 16px",
        border: selected ? "none" : "1px solid #d0d0cc",
        borderRadius: "8px",
        background: selected ? "#FF6B35" : "white",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        color: selected ? "white" : "#1a1a18",
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </button>
  );

  const Select = ({ value, onChange, options }: { value: string; onChange: (val: string) => void; options: string[] }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "12px 14px",
        border: "1px solid #d0d0cc",
        borderRadius: "8px",
        fontSize: "15px",
        fontFamily: "inherit",
        background: "white",
        color: "#1a1a18",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23FF6B35' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: "36px",
      }}
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
    <div style={{ background: "#f9f9f7", minHeight: "100vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px", maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
      <div style={{ background: "white", borderRadius: "12px", padding: "32px" }}>
        {/* STEP INDICATOR - 2 STEPS */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "48px", gap: "8px" }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#FF6B35",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 8px",
                fontWeight: "700",
                fontSize: "16px",
                color: "white",
                boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)",
              }}
            >
              ●
            </div>
            <div style={{ fontSize: "12px", color: "#FF6B35", fontWeight: "600" }}>Tell us what you need</div>
          </div>
          <div style={{ textAlign: "center", flex: 1, opacity: 0.5 }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 8px",
                fontWeight: "700",
                fontSize: "16px",
                color: "#7a7a77",
              }}
            >
              ○
            </div>
            <div style={{ fontSize: "12px", color: "#7a7a77", fontWeight: "500" }}>Pick your match & reserve</div>
          </div>
        </div>

        {/* HEADER */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#FF6B35", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
            Step 1 of 2
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0", color: "#1a1a18" }}>What are you promoting?</h1>
          <p style={{ fontSize: "14px", color: "#7a7a77", margin: "0" }}>Share a few details and we'll find the right creators and content style for you.</p>
        </div>

        {/* UNIFORM CARD GRID - 2x2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* CARD 1 - What are you promoting */}
          <div style={{ background: "#f9f9f7", borderRadius: "12px", padding: "20px", border: "1px solid #e0e0e0" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "12px", color: "#1a1a18", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              What are you promoting? *
            </label>
            <textarea
              value={brief.whatYouPromote}
              onChange={(e) => setBrief({ ...brief, whatYouPromote: e.target.value })}
              placeholder="Tell us about your shop, product, service, event or offer…"
              style={{
                width: "100%",
                minHeight: "120px",
                padding: "12px 14px",
                border: errors.whatYouPromote ? "1px solid #E24B4A" : "1px solid #d0d0cc",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "inherit",
                background: "white",
                color: "#1a1a18",
                resize: "vertical",
                lineHeight: "1.5",
                outline: "none",
              }}
            />
            {errors.whatYouPromote && <p style={{ fontSize: "12px", color: "#E24B4A", marginTop: "8px" }}>{errors.whatYouPromote}</p>}
          </div>

          {/* CARD 2 - Category */}
          <div style={{ background: "#f9f9f7", borderRadius: "12px", padding: "20px", border: "1px solid #e0e0e0" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "12px", color: "#1a1a18", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Which category best fits?
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {CATEGORIES.map((cat) => (
                <Chip key={cat} selected={brief.category === cat} onClick={() => setBrief({ ...brief, category: cat })}>
                  {cat}
                </Chip>
              ))}
            </div>
          </div>

          {/* CARD 3 - Goal */}
          <div style={{ background: "#f9f9f7", borderRadius: "12px", padding: "20px", border: "1px solid #e0e0e0" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "12px", color: "#1a1a18", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              What's your goal? *
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setBrief({ ...brief, goal: g })}
                  style={{
                    padding: "10px 12px",
                    border: brief.goal === g ? "2px solid #FF6B35" : "1px solid #d0d0cc",
                    borderRadius: "8px",
                    background: brief.goal === g ? "#FFF5F0" : "white",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#1a1a18",
                    transition: "all 0.2s ease",
                    textAlign: "left",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.goal && <p style={{ fontSize: "12px", color: "#E24B4A", marginTop: "8px" }}>{errors.goal}</p>}
          </div>

          {/* CARD 4 - Content Format */}
          <div style={{ background: "#f9f9f7", borderRadius: "12px", padding: "20px", border: "1px solid #e0e0e0" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "12px", color: "#1a1a18", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              What kind of content do you want? *
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {FORMATS.map((fmt) => (
                <Chip key={fmt} selected={brief.contentFormat === fmt} onClick={() => setBrief({ ...brief, contentFormat: fmt })}>
                  {fmt}
                </Chip>
              ))}
            </div>
            {errors.contentFormat && <p style={{ fontSize: "12px", color: "#E24B4A", marginTop: "8px" }}>{errors.contentFormat}</p>}
          </div>
        </div>

        {/* PREFERENCES - FULL WIDTH CARD */}
        <div style={{ background: "#f9f9f7", borderRadius: "12px", padding: "20px", border: "1px solid #e0e0e0", marginBottom: "32px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "14px", color: "#1a1a18", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Campaign preferences (optional)
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#7a7a77", marginBottom: "6px" }}>Location</div>
              <Select
                value={brief.location}
                onChange={(val) => setBrief({ ...brief, location: val })}
                options={["Kolkata", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pan-India"]}
              />
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#7a7a77", marginBottom: "6px" }}>Age group</div>
              <Select
                value={brief.audience}
                onChange={(val) => setBrief({ ...brief, audience: val })}
                options={["18–25", "18–35", "25–45", "35–55", "18+", "All ages"]}
              />
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#7a7a77", marginBottom: "6px" }}>Language</div>
              <Select
                value={brief.language}
                onChange={(val) => setBrief({ ...brief, language: val })}
                options={["English only", "Bengali + English", "Hindi + English", "Multiple languages"]}
              />
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#7a7a77", marginBottom: "6px" }}>Budget</div>
              <Select
                value={brief.budget}
                onChange={(val) => setBrief({ ...brief, budget: val })}
                options={BUDGETS}
              />
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#7a7a77", marginBottom: "6px" }}>Timeline</div>
              <Select
                value={brief.timeline}
                onChange={(val) => setBrief({ ...brief, timeline: val })}
                options={TIMELINES}
              />
            </div>
          </div>
        </div>

        {/* CTA SECTION */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "13px", color: "#7a7a77" }}>Need help? Our campaign matcher can recommend everything for you.</div>
          <button
            onClick={handleProceed}
            style={{
              background: "#FF6B35",
              color: "white",
              border: "none",
              padding: "14px 24px",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#E55A2B";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 107, 53, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FF6B35";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(255, 107, 53, 0.2)";
            }}
          >
            Find my matches →
          </button>
        </div>

        <div style={{ fontSize: "13px", color: "#7a7a77", textAlign: "center", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #e0e0e0" }}>
          We only use your info to reach you. No spam, ever.
        </div>
      </div>

      {/* SIDEBAR */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* TIP CARD 1 */}
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e0e0e0" }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a18", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>💡</span> Pro Tip
          </div>
          <p style={{ fontSize: "13px", color: "#7a7a77", margin: "0", lineHeight: "1.6" }}>
            The more details you share, the better creators we'll match with your campaign.
          </p>
        </div>

        {/* TIP CARD 2 */}
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e0e0e0" }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a18", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>⚡</span> Quick Start
          </div>
          <ul style={{ fontSize: "13px", color: "#7a7a77", margin: "0", paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>Tell us what you're promoting</li>
            <li>Pick your campaign goal</li>
            <li>Select content format</li>
            <li>Get matched creators</li>
          </ul>
        </div>

        {/* TIP CARD 3 */}
        <div style={{ background: "#FFF5F0", borderRadius: "12px", padding: "20px", border: "1px solid #FFD9C8" }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#FF6B35", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>✨</span> What Happens Next
          </div>
          <p style={{ fontSize: "13px", color: "#7a7a77", margin: "0", lineHeight: "1.6" }}>
            After you complete your brief, you'll see recommended creators matched to your goals. Reserve with a ₹500 token and we'll handle the rest!
          </p>
        </div>

        {/* STATS CARD */}
        <div style={{ background: "#f9f9f7", borderRadius: "12px", padding: "16px", border: "1px solid #e0e0e0" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#7a7a77", textTransform: "uppercase", margin: "0 0 12px 0", letterSpacing: "0.5px" }}>
            Avg Campaign Stats
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "18px", fontWeight: "700", color: "#FF6B35", margin: "0" }}>3-5</p>
              <p style={{ fontSize: "11px", color: "#7a7a77", margin: "4px 0 0 0" }}>Creators per brief</p>
            </div>
            <div>
              <p style={{ fontSize: "18px", fontWeight: "700", color: "#1D9E75", margin: "0" }}>48hrs</p>
              <p style={{ fontSize: "11px", color: "#7a7a77", margin: "4px 0 0 0" }}>Avg match time</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
