"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

type ActiveSection = "home" | "profile" | "collaborations" | "messages" | "settings";

export default function InfluencerDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [userName, setUserName] = useState<string>("Creator");
  const [isDemo, setIsDemo] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");
  const [userEmail, setUserEmail] = useState<string>("");
  const [applied, setApplied] = useState<number[]>([]);

  useEffect(() => {
    console.log("Dashboard mount - loading profile and auth...");
    
    // Check if in demo mode
    const demoMode = sessionStorage.getItem("demo_mode");
    if (demoMode) {
      setIsDemo(true);
      // Get email from sessionStorage for demo mode
      const email = sessionStorage.getItem("influencer_email");
      if (email) {
        setUserEmail(email);
        console.log("Demo mode - email from sessionStorage:", email);
      }
    } else {
      // Try to get authenticated user from Supabase
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user }, error }) => {
        if (error) {
          console.error("Error getting user from Supabase:", error);
          setUserEmail("Not authenticated");
          return;
        }
        if (user?.email) {
          setUserEmail(user.email);
          console.log("✓ Got user email from Supabase:", user.email);
        } else {
          console.log("No user email found");
          setUserEmail("Not available");
        }
      }).catch((err) => {
        console.error("Error getting user from Supabase:", err);
        setUserEmail("Not available");
      });
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

  // Tasks data
  const AVAILABLE_TASKS = [
    {
      id: 1,
      brand: "Priya Fashion",
      campaignName: "Summer Collection Launch",
      type: "Instagram Reel",
      budget: "₹50,000",
      deadline: "5 days",
      followers: "100K+",
      engagement: "4%+",
      description: "Showcase our new summer collection with a creative reel. Focus on styling and trends.",
      status: "open",
    },
    {
      id: 2,
      brand: "NutriWell Foods",
      campaignName: "Healthy Lifestyle Campaign",
      type: "YouTube Video",
      budget: "₹75,000",
      deadline: "7 days",
      followers: "200K+",
      engagement: "5%+",
      description: "Create an authentic video showcasing how NutriWell fits into your daily routine.",
      status: "open",
    },
    {
      id: 3,
      brand: "TechGadget Pro",
      campaignName: "Product Review Series",
      type: "Instagram Reels + Stories",
      budget: "₹60,000",
      deadline: "3 days",
      followers: "50K+",
      engagement: "3%+",
      description: "Honest review of our latest gadget in your signature style. Full creative freedom.",
      status: "open",
    },
    {
      id: 4,
      brand: "Urban Cafe",
      campaignName: "Cafe Experience Challenge",
      type: "TikTok Video",
      budget: "₹40,000",
      deadline: "10 days",
      followers: "75K+",
      engagement: "6%+",
      description: "Create a fun, engaging video featuring our cafe vibe. Perfect for food creators!",
      status: "open",
    },
  ];

  const handleApply = (taskId: number) => {
    if (!applied.includes(taskId)) {
      setApplied([...applied, taskId]);
      setTimeout(() => {
        alert("Application sent! The brand will review and get back to you soon.");
      }, 300);
    }
  };

  const MENU_ITEMS: { id: ActiveSection; icon: string; label: string }[] = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "profile", icon: "📋", label: "Your Profile" },
    { id: "collaborations", icon: "✅", label: "Active Collaborations" },
    { id: "messages", icon: "💬", label: "Messages" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px", color: "#1a1a1a" }}>
              🎯 Available Opportunities
            </h2>

            {/* Task Flow - Per Row Breakdown */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{
                background: "white",
                border: "1px solid #e0dcff",
                borderRadius: "12px",
                overflow: "hidden",
              }}>
                {/* Header Row */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr 1fr",
                  gap: "24px",
                  padding: "16px 24px",
                  background: "#f0f9ff",
                  borderBottom: "2px solid #bfdbfe",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  fontSize: "13px",
                }}>
                  <div>🎯 NICHE</div>
                  <div>📱 FORMAT</div>
                  <div>💰 BUDGET</div>
                </div>

                {/* Task Rows */}
                {[
                  { niche: "Fashion", format: "Instagram Reel", budget: "₹50,000" },
                  { niche: "Food & Lifestyle", format: "YouTube Video", budget: "₹75,000" },
                  { niche: "Tech & Gadgets", format: "Instagram Reels + Stories", budget: "₹60,000" },
                  { niche: "Cafe & Food", format: "TikTok Video", budget: "₹40,000" },
                ].map((task, index) => (
                  <div
                    key={index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1.5fr 1fr",
                      gap: "24px",
                      padding: "16px 24px",
                      borderBottom: index < 3 ? "1px solid #f0f9ff" : "none",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f5f3ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    <div>
                      <span style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        background: "#e0dcff",
                        color: "#6366f1",
                        borderRadius: "16px",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}>
                        {task.niche}
                      </span>
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: "500", color: "#1a1a1a" }}>
                      {task.format}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#6366f1" }}>
                      {task.budget}
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "12px", color: "#999", marginTop: "12px", marginLeft: "0" }}>
                📊 Showing 4 active task flows • More opportunities added daily
              </p>
            </div>

            {/* How It Works */}
            <div style={{ marginTop: "32px", paddingTop: "32px", borderTop: "2px solid #e0dcff" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a1a", marginBottom: "20px" }}>
                How It Works
              </h3>
              <div style={{
                background: "#f0f9ff",
                border: "2px solid #bfdbfe",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
              }}>
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 12px 0" }}>
                  🎯 Snatch Opportunity
                </p>
                <p style={{ fontSize: "14px", color: "#666", margin: "0", lineHeight: "1.8" }}>
                  You will get tasks assigned by the Admins of NagarInfluence. 
                  <br />
                  <br />
                  Complete your profile to start receiving opportunities that match your niche and audience size. Our team carefully selects and assigns tasks that align with your expertise.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div style={{ marginTop: "32px", padding: "24px", background: "#e0dcff", borderRadius: "12px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "#1a1a1a", margin: "0 0 16px 0", fontWeight: "600" }}>
                ✨ Complete your profile to unlock opportunities
              </p>
              <button
                onClick={() => setActiveSection("profile")}
                style={{
                  padding: "12px 24px",
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
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
                Go to Profile →
              </button>
            </div>
          </div>
        );

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
                    {userEmail || (isDemo ? "Enter email on login page" : "Loading...")}
                  </p>
                  <p style={{ fontSize: "12px", color: "#666", margin: "8px 0 0 0" }}>
                    🔒 Google Login{isDemo ? " (Demo Mode)" : ""}
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
