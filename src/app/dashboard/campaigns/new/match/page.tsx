"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadChatBrief, type ChatBrief } from "@/lib/recommend";
import { INFLUENCERS } from "@/lib/influencers";
import { CAMPAIGN_FORMATS } from "@/lib/formats";

const CREATOR_COST_PER_PERSON = 18000;

export default function MatchPage() {
  const router = useRouter();
  const [brief, setBrief] = useState<ChatBrief | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const b = loadChatBrief();
    if (!b) {
      router.replace("/dashboard/campaigns/new");
      return;
    }
    setBrief(b);
    const defaultFormat = b.format || "instagram-reel";
    setSelectedFormat(defaultFormat);
    setLoading(false);
  }, [router]);

  if (loading || !brief) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <p className="text-sm text-gray-600">Building your best match…</p>
        </div>
      </div>
    );
  }

  function toggleCreator(id: string) {
    const next = new Set(selectedCreators);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedCreators(next);
  }

  const totalCreatorCost = selectedCreators.size * CREATOR_COST_PER_PERSON;
  const platformFee = 500;
  const totalCost = platformFee + totalCreatorCost;

  async function handleReserve() {
    if (selectedCreators.size === 0) {
      alert("Please select at least one creator");
      return;
    }
    // TODO: Implement payment and booking
    router.push(`/dashboard/campaigns/${Math.random().toString(36).slice(2, 9)}`);
  }

  return (
    <div style={{ background: "#f9f9f7", minHeight: "100vh" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px", background: "white" }}>
        
        {/* STEP INDICATOR - 2 STEPS */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "48px", gap: "8px" }}>
          <div style={{ textAlign: "center", flex: 1, opacity: 0.6 }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#23C55E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 8px",
                fontWeight: "700",
                fontSize: "16px",
                color: "white",
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: "12px", color: "#7a7a77", fontWeight: "500" }}>
              Tell us what you need
            </div>
          </div>
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
            <div style={{ fontSize: "12px", color: "#FF6B35", fontWeight: "600" }}>
              Pick your match & reserve
            </div>
          </div>
        </div>

        {/* HEADER */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#FF6B35", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
            Step 2 of 2
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "#1a1a18" }}>
            Here's what we recommend
          </h1>
          <p style={{ fontSize: "14px", color: "#7a7a77", marginBottom: "16px" }}>
            Based on your campaign, we've found the best content styles and creators.
          </p>
          <div style={{ height: "4px", background: "#e0e0e0", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#FF6B35", width: "100%" }} />
          </div>
        </div>

        {/* CAMPAIGN SUMMARY */}
        <div
          style={{
            background: "#FFF5F0",
            border: "1px solid #FFD9C8",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "24px",
            borderLeft: "4px solid #FF6B35",
          }}
        >
          <div style={{ fontSize: "14px", marginBottom: "12px" }}>
            <span style={{ color: "#7a7a77", fontWeight: "500" }}>Your campaign:</span>{" "}
            <span style={{ fontWeight: "700", color: "#1a1a18" }}>
              {brief.category || "Your product"} · {brief.goal}
            </span>
          </div>
          <div style={{ fontSize: "13px", color: "#7a7a77", lineHeight: "1.5" }}>
            {brief.numCreators} creators • {brief.budget} • {brief.location}
          </div>
          <button
            onClick={() => router.back()}
            style={{
              marginTop: "12px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#FF6B35",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ← Edit brief
          </button>
        </div>

        {/* CONTENT STYLE SECTION */}
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#1a1a18" }}>
            Pick the style you like
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "16px" }}>
            {CAMPAIGN_FORMATS.map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt.id)}
                style={{
                  padding: "12px 14px",
                  border: selectedFormat === fmt.id ? "2px solid #FF6B35" : "1px solid #d0d0cc",
                  borderRadius: "8px",
                  background: selectedFormat === fmt.id ? "#FFF5F0" : "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#1a1a18",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "4px" }}>{fmt.title}</div>
                <div style={{ fontSize: "12px", color: "#7a7a77" }}>{fmt.subtitle}</div>
              </button>
            ))}
          </div>
        </div>

        {/* CREATORS SECTION */}
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#1a1a18" }}>
            Recommended creators (select 2–3)
          </label>
          <div style={{ background: "#EFF8F5", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px", borderLeft: "4px solid #1D9E75" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#1D9E75", marginBottom: "4px" }}>
              ✓ Perfect match found!
            </div>
            <div style={{ fontSize: "13px", color: "#7a7a77" }}>
              Our team will fine-tune everything with you.
            </div>
          </div>

          {INFLUENCERS.slice(0, 4).map((inf) => {
            const isSelected = selectedCreators.has(inf.id);
            return (
              <button
                key={inf.id}
                onClick={() => toggleCreator(inf.id)}
                style={{
                  width: "100%",
                  border: isSelected ? "2px solid #FF6B35" : "1px solid #d0d0cc",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "12px",
                  cursor: "pointer",
                  background: isSelected ? "#FFF5F0" : "white",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "700", fontSize: "16px", color: "#1a1a18", marginBottom: "4px" }}>
                      {inf.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "#7a7a77" }}>{inf.handle}</div>
                  </div>
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      border: isSelected ? "none" : "2px solid #d0d0cc",
                      background: isSelected ? "#FF6B35" : "white",
                      borderRadius: "4px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {isSelected && "✓"}
                  </div>
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      background: "#EFF8F5",
                      color: "#1D9E75",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      marginRight: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    {inf.followers} followers
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      background: "#FFF5F0",
                      color: "#FF6B35",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      marginRight: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    {inf.niche[0]}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#7a7a77", lineHeight: "1.5" }}>
                  {inf.vibe}
                </div>
              </button>
            );
          })}
        </div>

        {/* PRICING SUMMARY */}
        <div
          style={{
            background: "#FFF5F0",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "24px",
            border: "1px solid #FFD9C8",
            borderLeft: "4px solid #FF6B35",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#1a1a18" }}>
            Your investment
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", fontSize: "14px" }}>
            <span style={{ color: "#7a7a77", fontWeight: "500" }}>Platform coordination fee</span>
            <span style={{ fontWeight: "700", color: "#1a1a18" }}>₹{platformFee.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", fontSize: "14px" }}>
            <span style={{ color: "#7a7a77", fontWeight: "500" }}>Creator fees (~₹{CREATOR_COST_PER_PERSON.toLocaleString("en-IN")} each)</span>
            <span style={{ fontWeight: "700", color: "#1a1a18" }}>₹{totalCreatorCost.toLocaleString("en-IN")}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #FFD9C8",
              paddingTop: "14px",
              marginTop: "10px",
              fontWeight: "700",
              fontSize: "18px",
              color: "#FF6B35",
            }}
          >
            <span>Total investment</span>
            <span>₹{totalCost.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ fontSize: "12px", color: "#7a7a77", marginTop: "12px", lineHeight: "1.5" }}>
            Our strategist will contact you to finalize details and creator availability.
          </div>
        </div>

        {/* TRUST SECTION */}
        <div
          style={{
            background: "#EFF8F5",
            padding: "14px 16px",
            borderRadius: "8px",
            marginBottom: "28px",
            borderLeft: "4px solid #1D9E75",
          }}
        >
          {[
            "All creators verified for authentic followers",
            "Our team handles all negotiations & contracts",
            "Campaign starts within 5–7 days of booking",
            "Detailed performance report included",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", fontSize: "13px", color: "#1D9E75", marginBottom: i < 3 ? "8px" : "0", alignItems: "flex-start" }}>
              <span style={{ fontWeight: "700", flexShrink: 0 }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={handleReserve}
            style={{
              background: "#FF6B35",
              color: "white",
              border: "none",
              padding: "14px 24px",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              width: "100%",
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
            Reserve campaign for ₹500 →
          </button>
          <button
            onClick={() => router.back()}
            style={{
              background: "white",
              color: "#1a1a18",
              border: "1px solid #d0d0cc",
              padding: "14px 24px",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FF6B35";
              e.currentTarget.style.background = "#FFF5F0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#d0d0cc";
              e.currentTarget.style.background = "white";
            }}
          >
            ← Change my selections
          </button>
        </div>

        {/* FOOTER */}
        <div style={{ fontSize: "13px", color: "#7a7a77", textAlign: "center", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #e0e0e0" }}>
          By clicking "Reserve campaign", you agree to our terms. You'll receive an invoice and our team will contact you within 2 hours.
        </div>
      </div>
    </div>
  );
}
