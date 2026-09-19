"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface InfluencerProfile {
  displayName: string;
  bio: string;
  profilePhoto?: string;
  categories: string[];
  socialLinks: { instagram: string; youtube: string; tiktok: string };
  audienceSize: string;
  collaborationInterests: string[];
  portfolioLinks: string[];
  createdAt: string;
}

export default function InfluencerDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [userName, setUserName] = useState<string>("Creator");
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Check if in demo mode
    const demoMode = sessionStorage.getItem("demo_mode");
    if (demoMode) {
      setIsDemo(true);
    }

    // Load profile from localStorage
    const savedProfile = localStorage.getItem("influencer_profile");
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile) as InfluencerProfile;
        setProfile(profileData);
        setUserName(profileData.displayName || "Creator");
      } catch (e) {
        console.error("Error loading profile:", e);
      }
    } else {
      // First time - show setup prompt
      const demoUser = sessionStorage.getItem("influencer_demo_user");
      if (demoUser) {
        try {
          const user = JSON.parse(demoUser);
          setUserName(user.email?.split("@")[0] || "Creator");
        } catch (e) {
          console.error("Error parsing user:", e);
        }
      }
    }
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem("demo_mode");
    sessionStorage.removeItem("influencer_demo_user");
    localStorage.removeItem("influencer_profile");
    router.push("/influencer/login");
  };

  return (
    <div style={{ background: "#f9f9f7", minHeight: "100vh", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0", color: "#1a1a18" }}>
                Welcome, {userName}! 👋
              </h1>
              {isDemo && (
                <p style={{ fontSize: "12px", color: "#FF6B35", fontWeight: "600", margin: "6px 0 0 0" }}>
                  Demo Mode
                </p>
              )}
            </div>
            <button
              onClick={handleSignOut}
              style={{
                padding: "10px 16px",
                border: "1px solid #d0d0cc",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1a1a18",
                background: "white",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
          <p style={{ fontSize: "14px", color: "#7a7a77", margin: "0" }}>
            {profile 
              ? "Complete your profile and start getting brand collaboration offers."
              : "Let's set up your profile to start getting brand collaboration offers."}
          </p>
        </div>

        {/* PROFILE SETUP PROMPT */}
        {!profile && (
          <div style={{
            background: "#FFF5F0",
            border: "1px solid #FFD9C8",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: "600", color: "#FF6B35", margin: "0 0 4px 0" }}>
                Complete your profile to attract brands! ✨
              </p>
              <p style={{ fontSize: "13px", color: "#7a7a77", margin: "0" }}>
                Add your bio, categories, and portfolio links to get started.
              </p>
            </div>
            <button
              onClick={() => {
                // Force reload to ensure data is loaded
                router.push("/influencer/setup");
                // Also check localStorage immediately
                const saved = localStorage.getItem("influencer_profile");
                console.log("Profile in localStorage:", saved);
              }}
              style={{
                padding: "10px 16px",
                background: "#FF6B35",
                color: "white",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                cursor: "pointer",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              Complete Profile →
            </button>
          </div>
        )}

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
