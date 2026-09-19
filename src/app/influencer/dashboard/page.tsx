"use client";

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

type ActiveSection = "profile" | "collaborations" | "messages" | "settings";

export default function InfluencerDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [userName, setUserName] = useState<string>("Creator");
  const [isDemo, setIsDemo] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>("profile");

  useEffect(() => {
    console.log("Dashboard mount - loading profile...");
    
    // Check if in demo mode
    const demoMode = sessionStorage.getItem("demo_mode");
    if (demoMode) {
      setIsDemo(true);
    }

    // Load profile from localStorage - ALWAYS check fresh
    try {
      const savedProfile = localStorage.getItem("influencer_profile");
      console.log("Raw localStorage data:", savedProfile);
      
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile) as InfluencerProfile;
        console.log("Parsed profile data:", profileData);
        setProfile(profileData);
        setUserName(profileData.displayName || "Creator");
      } else {
        console.log("No profile found in localStorage");
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
    } catch (e) {
      console.error("Error loading profile:", e);
    }
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem("demo_mode");
    sessionStorage.removeItem("influencer_demo_user");
    localStorage.removeItem("influencer_profile");
    router.push("/influencer/login");
  };

  const MENU_ITEMS: { id: ActiveSection; icon: string; label: string }[] = [
    { id: "profile", icon: "📋", label: "Your Profile" },
    { id: "collaborations", icon: "✅", label: "Active Collaborations" },
    { id: "messages", icon: "💬", label: "Messages" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px", color: "#1a1a1a" }}>
              📋 Your Profile
            </h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
              View and update your influencer profile information.
            </p>
            {profile ? (
              <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px" }}>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#666", margin: "0 0 4px 0" }}>
                      Display Name
                    </p>
                    <p style={{ fontSize: "15px", color: "#1a1a1a", fontWeight: "500", margin: "0" }}>
                      {profile.displayName}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#666", margin: "0 0 4px 0" }}>
                      Bio
                    </p>
                    <p style={{ fontSize: "14px", color: "#1a1a1a", margin: "0" }}>
                      {profile.bio}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#666", margin: "0 0 4px 0" }}>
                      Categories
                    </p>
                    <p style={{ fontSize: "14px", color: "#1a1a1a", margin: "0" }}>
                      {profile.categories.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#666", margin: "0 0 4px 0" }}>
                      Audience Size
                    </p>
                    <p style={{ fontSize: "14px", color: "#1a1a1a", margin: "0" }}>
                      {profile.audienceSize}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/influencer/setup")}
                  style={{
                    marginTop: "20px",
                    padding: "10px 16px",
                    background: "#6366f1",
                    color: "white",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4f46e5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#6366f1";
                  }}
                >
                  Edit Profile →
                </button>
              </div>
            ) : (
              <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px" }}>
                <p style={{ fontSize: "14px", color: "#1e40af", margin: "0 0 16px 0" }}>
                  Your profile is not set up yet.
                </p>
                <button
                  onClick={() => router.push("/influencer/setup")}
                  style={{
                    padding: "10px 16px",
                    background: "#6366f1",
                    color: "white",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4f46e5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#6366f1";
                  }}
                >
                  Create Profile →
                </button>
              </div>
            )}
          </div>
        );

      case "collaborations":
        return (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px", color: "#1a1a1a" }}>
              ✅ Active Collaborations
            </h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
              Manage your ongoing brand partnerships and deliverables.
            </p>
            <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "#1e40af", margin: "0" }}>
                No active collaborations yet. Complete your profile to get started! 🚀
              </p>
            </div>
          </div>
        );

      case "messages":
        return (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px", color: "#1a1a1a" }}>
              💬 Messages
            </h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
              Chat with brands about partnership details.
            </p>
            <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "#1e40af", margin: "0" }}>
                No messages yet. Brands will reach out once you complete your profile! 💌
              </p>
            </div>
          </div>
        );

      case "settings":
        return (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px", color: "#1a1a1a" }}>
              ⚙️ Settings
            </h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
              Update your account settings and preferences.
            </p>
            <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button
                  onClick={handleSignOut}
                  style={{
                    padding: "12px 16px",
                    background: "#fee2e2",
                    color: "#991b1b",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1px solid #fecaca",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fecaca";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fee2e2";
                  }}
                >
                  Sign Out
                </button>
                {isDemo && (
                  <p style={{ fontSize: "12px", color: "#6366f1", fontWeight: "600", margin: "0", textAlign: "center" }}>
                    Demo Mode Active
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ background: "#f5f3ff", minHeight: "100vh", padding: "24px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0", color: "#1a1a1a" }}>
                Welcome, {userName}! 👋
              </h1>
              {isDemo && (
                <p style={{ fontSize: "12px", color: "#6366f1", fontWeight: "600", margin: "6px 0 0 0" }}>
                  Demo Mode
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT - SIDEBAR + CONTENT */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "32px" }}>
          {/* LEFT SIDEBAR - MENU */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  padding: "12px 16px",
                  background: activeSection === item.id ? "#6366f1" : "white",
                  color: activeSection === item.id ? "white" : "#1a1a1a",
                  border: activeSection === item.id ? "1px solid #6366f1" : "1px solid #e0dcff",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.background = "#f0f9ff";
                    e.currentTarget.style.borderColor = "#bfdbfe";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.borderColor = "#e0dcff";
                  }
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* RIGHT CONTENT AREA */}
          <div style={{ 
            background: "white", 
            borderRadius: "12px", 
            padding: "32px",
            border: "1px solid #e0dcff",
            boxShadow: "0 4px 16px rgba(99, 102, 241, 0.08)"
          }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
