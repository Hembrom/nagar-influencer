"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface InfluencerProfile {
  displayName: string;
  bio: string;
  location?: string;
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
        // First time - try to get email from sessionStorage
        const email = sessionStorage.getItem("influencer_email");
        if (email) {
          setUserName(email.split("@")[0] || "Creator");
        } else {
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
              <div>
                {/* TOP ROW - PHOTO & BASIC INFO */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  {/* LEFT - PHOTO & NAME */}
                  <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                    {profile.profilePhoto && (
                      <div style={{ marginBottom: "16px" }}>
                        <img
                          src={profile.profilePhoto}
                          alt="Profile"
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "3px solid #6366f1",
                            margin: "0 auto",
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: "600", color: "#666", margin: "0 0 4px 0" }}>
                        Display Name
                      </p>
                      <p style={{ fontSize: "18px", color: "#1a1a1a", fontWeight: "700", margin: "0" }}>
                        {profile.displayName}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT - BIO */}
                  <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px" }}>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#666", margin: "0 0 8px 0" }}>
                      Bio
                    </p>
                    <p style={{ fontSize: "14px", color: "#1a1a1a", margin: "0", lineHeight: "1.6" }}>
                      {profile.bio}
                    </p>
                  </div>
                </div>

                {/* SECOND ROW - CATEGORIES & AUDIENCE */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  {/* LEFT - CATEGORIES */}
                  <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px" }}>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#666", margin: "0 0 12px 0" }}>
                      Content Categories
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {profile.categories.map((cat) => (
                        <span
                          key={cat}
                          style={{
                            background: "#e0dcff",
                            color: "#6366f1",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT - AUDIENCE SIZE */}
                  <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px" }}>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#666", margin: "0 0 8px 0" }}>
                      Audience Size
                    </p>
                    <p style={{ fontSize: "18px", color: "#6366f1", fontWeight: "700", margin: "0" }}>
                      {profile.audienceSize}
                    </p>
                  </div>
                </div>

                {/* THIRD ROW - LOCATION & SOCIAL */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  {/* LEFT - LOCATION */}
                  <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px" }}>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#666", margin: "0 0 8px 0" }}>
                      Location
                    </p>
                    <p style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500", margin: "0" }}>
                      {profile.location || "Not specified"}
                    </p>
                  </div>

                  {/* RIGHT - SOCIAL LINKS */}
                  <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px" }}>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#666", margin: "0 0 12px 0" }}>
                      Social Media
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {profile.socialLinks.instagram ? (
                        <a
                          href={profile.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "6px 12px",
                            background: "#e0dcff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#6366f1",
                            textDecoration: "none",
                            cursor: "pointer",
                          }}
                        >
                          📷 Instagram
                        </a>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#999" }}>—</span>
                      )}
                      {profile.socialLinks.youtube ? (
                        <a
                          href={profile.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "6px 12px",
                            background: "#e0dcff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#6366f1",
                            textDecoration: "none",
                            cursor: "pointer",
                          }}
                        >
                          ▶️ YouTube
                        </a>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#999" }}>—</span>
                      )}
                      {profile.socialLinks.tiktok ? (
                        <a
                          href={profile.socialLinks.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "6px 12px",
                            background: "#e0dcff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#6366f1",
                            textDecoration: "none",
                            cursor: "pointer",
                          }}
                        >
                          ♪ TikTok
                        </a>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#999" }}>—</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* EDIT BUTTON */}
                <button
                  onClick={() => router.push("/influencer/setup")}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
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

            {/* ACCOUNT SECTION */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "#1a1a1a" }}>
                Account
              </h3>
              <div style={{ 
                background: "#f0f9ff", 
                border: "1px solid #bfdbfe", 
                borderRadius: "8px", 
                padding: "16px",
              }}>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "#666", margin: "0 0 4px 0" }}>
                    Google Account Email
                  </p>
                  <p style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500", margin: "0", paddingBottom: "8px", borderBottom: "1px solid #bfdbfe" }}>
                    {sessionStorage.getItem("influencer_email") || profile?.displayName ? `${profile?.displayName?.toLowerCase()}@creator.local` : "creator@example.com"}
                  </p>
                  <p style={{ fontSize: "12px", color: "#666", margin: "8px 0 0 0" }}>
                    🔒 Google Login (Read-only)
                  </p>
                </div>
              </div>
            </div>

            {/* PRIVACY SECTION */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "#1a1a1a" }}>
                Privacy & Visibility
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ 
                  background: "#f0f9ff", 
                  border: "1px solid #bfdbfe", 
                  borderRadius: "8px", 
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 4px 0" }}>
                      Profile Visibility
                    </p>
                    <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>
                      Make your profile visible to brands
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                </div>

                <div style={{ 
                  background: "#f0f9ff", 
                  border: "1px solid #bfdbfe", 
                  borderRadius: "8px", 
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 4px 0" }}>
                      Show Portfolio
                    </p>
                    <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>
                      Display your work samples to potential partners
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>

            {/* NOTIFICATIONS SECTION */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "#1a1a1a" }}>
                Notifications
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ 
                  background: "#f0f9ff", 
                  border: "1px solid #bfdbfe", 
                  borderRadius: "8px", 
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 4px 0" }}>
                      Brand Messages
                    </p>
                    <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>
                      Get notified when brands reach out
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                </div>

                <div style={{ 
                  background: "#f0f9ff", 
                  border: "1px solid #bfdbfe", 
                  borderRadius: "8px", 
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 4px 0" }}>
                      Collaboration Offers
                    </p>
                    <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>
                      Alerts for new opportunities matching your niche
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>

            {/* MORE OPTIONS */}
            <div style={{ borderTop: "1px solid #e0dcff", paddingTop: "24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "#1a1a1a" }}>
                More Options
              </h3>
              <button
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#fef2f2",
                  color: "#991b1b",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  border: "1px solid #fee2e2",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fee2e2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fef2f2";
                }}
              >
                Delete Account
              </button>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", height: "fit-content" }}>
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

            {/* DIVIDER */}
            <div style={{ height: "1px", background: "#e0dcff", margin: "12px 0" }} />

            {/* SIGN OUT BUTTON */}
            <button
              onClick={handleSignOut}
              style={{
                padding: "12px 16px",
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fee2e2",
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
                e.currentTarget.style.background = "#fee2e2";
                e.currentTarget.style.borderColor = "#fecaca";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fef2f2";
                e.currentTarget.style.borderColor = "#fee2e2";
              }}
            >
              <span style={{ fontSize: "18px" }}>🚪</span>
              <span>Sign Out</span>
            </button>
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
