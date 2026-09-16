"use client";

import Link from "next/link";

export default function InfluencerDashboardPage() {
  return (
    <div style={{ background: "#f9f9f7", minHeight: "100vh", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0", color: "#1a1a18" }}>
              Influencer Dashboard
            </h1>
            <Link
              href="/logout"
              style={{
                padding: "10px 16px",
                border: "1px solid #d0d0cc",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1a1a18",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Sign Out
            </Link>
          </div>
          <p style={{ fontSize: "14px", color: "#7a7a77", margin: "0" }}>
            Welcome! Complete your profile and start getting brand collaboration offers.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Profile Card */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid #e0e0e0",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#1a1a18" }}>
              📋 Your Profile
            </h2>
            <p style={{ fontSize: "14px", color: "#7a7a77", marginBottom: "16px", margin: "0 0 16px 0" }}>
              View and update your influencer profile information.
            </p>
            <Link
              href="/influencer/profile"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                background: "#FF6B35",
                color: "white",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              View Profile →
            </Link>
          </div>

          {/* Opportunities Card */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid #e0e0e0",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#1a1a18" }}>
              🎯 Brand Opportunities
            </h2>
            <p style={{ fontSize: "14px", color: "#7a7a77", marginBottom: "16px", margin: "0 0 16px 0" }}>
              Browse and apply for brand collaboration opportunities.
            </p>
            <button
              style={{
                display: "inline-block",
                padding: "10px 16px",
                background: "#FF6B35",
                color: "white",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
              }}
            >
              Browse Opportunities →
            </button>
          </div>

          {/* Messages Card */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid #e0e0e0",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#1a1a18" }}>
              💬 Messages
            </h2>
            <p style={{ fontSize: "14px", color: "#7a7a77", marginBottom: "16px", margin: "0 0 16px 0" }}>
              Chat with brands about partnership details.
            </p>
            <button
              style={{
                display: "inline-block",
                padding: "10px 16px",
                background: "#FF6B35",
                color: "white",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
              }}
            >
              Check Messages →
            </button>
          </div>

          {/* Analytics Card */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid #e0e0e0",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#1a1a18" }}>
              📊 Analytics
            </h2>
            <p style={{ fontSize: "14px", color: "#7a7a77", marginBottom: "16px", margin: "0 0 16px 0" }}>
              Track your profile views and collaboration performance.
            </p>
            <button
              style={{
                display: "inline-block",
                padding: "10px 16px",
                background: "#FF6B35",
                color: "white",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
              }}
            >
              View Analytics →
            </button>
          </div>

          {/* My Collaborations Card */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid #e0e0e0",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#1a1a18" }}>
              ✅ Active Collaborations
            </h2>
            <p style={{ fontSize: "14px", color: "#7a7a77", marginBottom: "16px", margin: "0 0 16px 0" }}>
              Manage your ongoing brand partnerships and deliverables.
            </p>
            <button
              style={{
                display: "inline-block",
                padding: "10px 16px",
                background: "#FF6B35",
                color: "white",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
              }}
            >
              View Collaborations →
            </button>
          </div>

          {/* Settings Card */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid #e0e0e0",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#1a1a18" }}>
              ⚙️ Settings
            </h2>
            <p style={{ fontSize: "14px", color: "#7a7a77", marginBottom: "16px", margin: "0 0 16px 0" }}>
              Update your account settings and preferences.
            </p>
            <button
              style={{
                display: "inline-block",
                padding: "10px 16px",
                background: "#FF6B35",
                color: "white",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
              }}
            >
              Go to Settings →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
