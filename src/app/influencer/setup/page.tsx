"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CONTENT_CATEGORIES = [
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Fitness",
  "Travel",
  "Entertainment",
  "Technology",
  "Food",
  "Other",
];

const COLLABORATION_TYPES = [
  "Brand partnerships",
  "Product reviews",
  "Event invites",
  "Travel collaborations",
  "Long-term campaigns",
  "Sponsored content",
];

export default function InfluencerSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [socialLinks, setSocialLinks] = useState({ instagram: "", youtube: "", tiktok: "" });
  const [audienceSize, setAudienceSize] = useState("");
  const [collaborationInterests, setCollaborationInterests] = useState<Set<string>>(new Set());
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>(["", "", "", "", ""]);

  // Load existing profile on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("influencer_profile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setProfilePhoto(profile.profilePhoto || null);
        setDisplayName(profile.displayName || "");
        setBio(profile.bio || "");
        setLocation(profile.location || "");
        setSelectedCategories(new Set(profile.categories || []));
        setSocialLinks(profile.socialLinks || { instagram: "", youtube: "", tiktok: "" });
        setAudienceSize(profile.audienceSize || "");
        setCollaborationInterests(new Set(profile.collaborationInterests || []));
        setPortfolioLinks(profile.portfolioLinks || ["", "", "", "", ""]);
      } catch (e) {
        console.error("Error loading profile:", e);
      }
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (category: string) => {
    const next = new Set(selectedCategories);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    setSelectedCategories(next);
  };

  const toggleCollaboration = (type: string) => {
    const next = new Set(collaborationInterests);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    setCollaborationInterests(next);
  };

  const handlePortfolioLinkChange = (index: number, value: string) => {
    const next = [...portfolioLinks];
    next[index] = value;
    setPortfolioLinks(next);
  };

  const handleSkip = () => {
    router.push("/influencer/dashboard");
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!displayName.trim() || !bio.trim() || selectedCategories.size === 0) {
        alert("Please fill in all required fields");
        return;
      }
      setStep(2);
    }
  };

  const handleSaveProfile = () => {
    if (!socialLinks.instagram && !socialLinks.youtube && !socialLinks.tiktok) {
      alert("Please add at least one social media link");
      return;
    }
    
    const profile = {
      displayName,
      bio,
      location,
      profilePhoto,
      categories: Array.from(selectedCategories),
      socialLinks,
      audienceSize,
      collaborationInterests: Array.from(collaborationInterests),
      portfolioLinks: portfolioLinks.filter(link => link.trim()),
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage (demo mode) or Supabase (production)
    try {
      const demoMode = sessionStorage.getItem("demo_mode");
      if (demoMode) {
        localStorage.setItem("influencer_profile", JSON.stringify(profile));
      }
      // TODO: Save to Supabase in production
      console.log("Influencer profile saved:", profile);
    } catch (e) {
      console.error("Error saving profile:", e);
    }
    
    router.push("/influencer/dashboard");
  };

  return (
    <div style={{ background: "#f9f9f7", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0", color: "#1a1a18" }}>
              {step === 1 ? "Tell Us About Yourself" : "Showcase Your Work"}
            </h1>
            <p style={{ fontSize: "14px", color: "#7a7a77", margin: "0" }}>
              {step === 1
                ? "This information helps brands understand you better."
                : "Add your best work to attract brand partnerships."}
            </p>
          </div>
          <button
            onClick={handleSkip}
            style={{
              background: "none",
              border: "none",
              color: "#FF6B35",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Skip for now
          </button>
        </div>

        {/* PROGRESS */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: step >= 1 ? "#FF6B35" : "#e0e0e0",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <p style={{ fontSize: "12px", color: step >= 1 ? "#FF6B35" : "#7a7a77", fontWeight: "500", margin: "0" }}>
                About You
              </p>
            </div>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: step >= 2 ? "#FF6B35" : "#e0e0e0",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                2
              </div>
              <p style={{ fontSize: "12px", color: step >= 2 ? "#FF6B35" : "#7a7a77", fontWeight: "500", margin: "0" }}>
                Your Work
              </p>
            </div>
          </div>
          <div style={{ height: "4px", background: "#e0e0e0", borderRadius: "2px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                background: "#FF6B35",
                width: step === 1 ? "50%" : "100%",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "32px" }}>
          {step === 1 ? (
            /* STEP 1 - ABOUT YOU */
            <div style={{ maxWidth: "600px" }}>
              {/* Profile Photo */}
              <div style={{ marginBottom: "28px" }}>
                <label style={{ display: "block", fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#1a1a18" }}>
                  Profile Photo
                </label>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "12px",
                      background: "#f0f0f0",
                      border: "2px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                  >
                    {profilePhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "32px", marginBottom: "4px" }}>📷</div>
                        <div style={{ fontSize: "12px", color: "#7a7a77" }}>Add Photo</div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", color: "#7a7a77", margin: "0 0 8px 0" }}>JPG, PNG up to 5MB</p>
                    {profilePhoto && (
                      <button
                        onClick={() => setProfilePhoto(null)}
                        style={{
                          background: "#FFF5F0",
                          border: "none",
                          color: "#FF6B35",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Change Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "15px", fontWeight: "600", marginBottom: "8px", color: "#1a1a18" }}>
                  Display Name *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name or creator handle"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1px solid #d0d0cc",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Bio */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "15px", fontWeight: "600", marginBottom: "8px", color: "#1a1a18" }}>
                  Bio / About Me *
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us what you create, your niche, and what makes you unique..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1px solid #d0d0cc",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontFamily: "inherit",
                    minHeight: "100px",
                    resize: "vertical",
                  }}
                />
                <p style={{ fontSize: "13px", color: "#7a7a77", margin: "6px 0 0 0" }}>
                  {bio.length}/300
                </p>
              </div>

              {/* Location */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "15px", fontWeight: "600", marginBottom: "8px", color: "#1a1a18" }}>
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1px solid #d0d0cc",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Content Categories */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#1a1a18" }}>
                  Content Categories *
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {CONTENT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: selectedCategories.has(cat) ? "none" : "1px solid #d0d0cc",
                        background: selectedCategories.has(cat) ? "#FF6B35" : "white",
                        color: selectedCategories.has(cat) ? "white" : "#1a1a18",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
                <button
                  onClick={() => router.back()}
                  style={{
                    flex: 1,
                    padding: "14px 24px",
                    border: "1px solid #d0d0cc",
                    borderRadius: "8px",
                    background: "white",
                    color: "#1a1a18",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  style={{
                    flex: 1,
                    padding: "14px 24px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#FF6B35",
                    color: "white",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Continue →
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2 - YOUR WORK */
            <div style={{ maxWidth: "600px" }}>
              {/* Social Media Links */}
              <div style={{ marginBottom: "28px" }}>
                <label style={{ display: "block", fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#1a1a18" }}>
                  Social Media Links
                </label>
                <div>
                  {[
                    { id: "instagram", label: "Instagram", icon: "📷", placeholder: "@yourusername" },
                    { id: "youtube", label: "YouTube", icon: "▶️", placeholder: "@yourchannel" },
                    { id: "tiktok", label: "TikTok", icon: "🎵", placeholder: "@yourusername" },
                  ].map((platform) => (
                    <div key={platform.id} style={{ marginBottom: "12px" }}>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#7a7a77", marginBottom: "6px", display: "block" }}>
                        {platform.label}
                      </label>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "18px" }}>{platform.icon}</span>
                        <input
                          type="text"
                          value={socialLinks[platform.id as keyof typeof socialLinks]}
                          onChange={(e) =>
                            setSocialLinks({
                              ...socialLinks,
                              [platform.id]: e.target.value,
                            })
                          }
                          placeholder={platform.placeholder}
                          style={{
                            flex: 1,
                            padding: "10px 12px",
                            border: "1px solid #d0d0cc",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audience Size */}
              <div style={{ marginBottom: "28px" }}>
                <label style={{ display: "block", fontSize: "15px", fontWeight: "600", marginBottom: "8px", color: "#1a1a18" }}>
                  Audience Size (Total Followers)
                </label>
                <select
                  value={audienceSize}
                  onChange={(e) => setAudienceSize(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1px solid #d0d0cc",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select audience size...</option>
                  <option value="1k-10k">1K - 10K</option>
                  <option value="10k-50k">10K - 50K</option>
                  <option value="50k-100k">50K - 100K</option>
                  <option value="100k-500k">100K - 500K</option>
                  <option value="500k-1m">500K - 1M</option>
                  <option value="1m+">1M+</option>
                </select>
              </div>

              {/* Collaboration Interests */}
              <div style={{ marginBottom: "28px" }}>
                <label style={{ display: "block", fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#1a1a18" }}>
                  What kind of collaborations are you interested in?
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {COLLABORATION_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleCollaboration(type)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "20px",
                        border: collaborationInterests.has(type) ? "none" : "1px solid #d0d0cc",
                        background: collaborationInterests.has(type) ? "#FF6B35" : "white",
                        color: collaborationInterests.has(type) ? "white" : "#1a1a18",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Portfolio Links */}
              <div style={{ marginBottom: "28px" }}>
                <label style={{ display: "block", fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#1a1a18" }}>
                  Portfolio / Sample Work
                </label>
                <p style={{ fontSize: "13px", color: "#7a7a77", marginBottom: "12px", margin: "0 0 12px 0" }}>
                  Add up to 5 YouTube or Instagram links to showcase your best work
                </p>
                <div>
                  {portfolioLinks.map((link, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={link}
                      onChange={(e) => handlePortfolioLinkChange(idx, e.target.value)}
                      placeholder={`Link ${idx + 1} (YouTube or Instagram)`}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d0d0cc",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        marginBottom: "8px",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: "14px 24px",
                    border: "1px solid #d0d0cc",
                    borderRadius: "8px",
                    background: "white",
                    color: "#1a1a18",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleSaveProfile}
                  style={{
                    flex: 1,
                    padding: "14px 24px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#FF6B35",
                    color: "white",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Complete Profile →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
