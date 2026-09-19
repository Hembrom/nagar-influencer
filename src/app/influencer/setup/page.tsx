"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

const SOCIAL_PLATFORMS = [
  { name: "Instagram", icon: "📷", key: "instagram" },
  { name: "YouTube", icon: "▶️", key: "youtube" },
  { name: "TikTok", icon: "♪", key: "tiktok" },
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
  const [collaborationInterests, setCollaborationInterests] = useState("");
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
        setCollaborationInterests(profile.collaborationInterests?.join?.(", ") || "");
        setPortfolioLinks(profile.portfolioLinks || ["", "", "", "", ""]);
        console.log("Profile loaded from localStorage:", profile);
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

  const updateSocialLink = (platform: string, value: string) => {
    setSocialLinks({ ...socialLinks, [platform]: value });
  };

  const handlePortfolioLinkChange = (index: number, value: string) => {
    const next = [...portfolioLinks];
    next[index] = value;
    setPortfolioLinks(next);
  };

  const handleSaveProfile = () => {
    if (!displayName.trim() || !bio.trim() || selectedCategories.size === 0) {
      alert("Please fill in all required fields on this page");
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
      collaborationInterests: collaborationInterests.split(",").map(c => c.trim()).filter(c => c),
      portfolioLinks: portfolioLinks.filter(link => link.trim()),
      createdAt: new Date().toISOString(),
    };

    try {
      const demoMode = sessionStorage.getItem("demo_mode");
      if (demoMode) {
        localStorage.setItem("influencer_profile", JSON.stringify(profile));
        console.log("Profile saved to localStorage:", profile);
      }
    } catch (e) {
      console.error("Error saving profile:", e);
      alert("Error saving profile. Please try again.");
      return;
    }

    router.push("/influencer/dashboard");
  };

  return (
    <div style={{ background: "#f5f3ff", minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <button
              onClick={() => router.back()}
              style={{
                background: "none",
                border: "none",
                fontSize: "14px",
                fontWeight: "600",
                color: "#6366f1",
                cursor: "pointer",
                marginBottom: "16px",
              }}
            >
              ← Back
            </button>
            <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0", color: "#1a1a1a" }}>
              Tell Us About Yourself
            </h1>
            <p style={{ fontSize: "14px", color: "#666", margin: "8px 0 0 0" }}>
              This information helps brands understand you better.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "14px", color: "#666", margin: "0 0 8px 0" }}>Step 2 of 2</p>
            <button
              onClick={() => router.push("/influencer/dashboard")}
              style={{
                background: "none",
                border: "none",
                fontSize: "14px",
                fontWeight: "600",
                color: "#6366f1",
                cursor: "pointer",
              }}
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}>
          {/* LEFT COLUMN */}
          <div style={{ maxWidth: "500px" }}>
            {/* Profile Photo */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "#1a1a1a" }}>
                Profile Photo
              </label>
              <div style={{ position: "relative", display: "inline-block", width: "150px" }}>
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background: "#e9e5ff",
                    border: "3px solid #6366f1",
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
                    <span style={{ fontSize: "48px" }}>📷</span>
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
                <button
                  onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    fileInput?.click();
                  }}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "#6366f1",
                    color: "white",
                    border: "3px solid white",
                    fontSize: "20px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  📷
                </button>
              </div>
              <button
                onClick={() => setProfilePhoto(null)}
                style={{
                  marginTop: "12px",
                  fontSize: "14px",
                  color: "#6366f1",
                  fontWeight: "600",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Change Photo
              </button>
              <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>JPG, PNG up to 5MB</p>
            </div>

            {/* Display Name */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#1a1a1a" }}>
                Display Name <span style={{ color: "#ff6b6b" }}>*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Creator"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #e9e5ff",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: "white",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Bio */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#1a1a1a" }}>
                Bio / About Me <span style={{ color: "#ff6b6b" }}>*</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 300))}
                placeholder="Tell us what you create, your niche, and what makes you unique..."
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "12px 14px",
                  border: "1px solid #e9e5ff",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: "white",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
              <p style={{ fontSize: "12px", color: "#999", marginTop: "6px", textAlign: "right" }}>
                {bio.length}/300
              </p>
            </div>

            {/* Location */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#1a1a1a" }}>
                Location <span style={{ color: "#ff6b6b" }}>*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #e9e5ff",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: "white",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                <option value="">Select city</option>
                <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Pune">Pune</option>
              </select>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* Content Categories */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#1a1a1a" }}>
                Content Categories <span style={{ color: "#ff6b6b" }}>*</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {CONTENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    style={{
                      padding: "10px 12px",
                      border: selectedCategories.has(cat) ? "2px solid #6366f1" : "1px solid #e9e5ff",
                      borderRadius: "8px",
                      background: selectedCategories.has(cat) ? "#e9e5ff" : "white",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: selectedCategories.has(cat) ? "#6366f1" : "#666",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    {selectedCategories.has(cat) ? "✓" : "○"} {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#1a1a1a" }}>
                Social Media Links
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {SOCIAL_PLATFORMS.map((platform) => (
                  <div key={platform.key} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ fontSize: "20px", width: "24px", textAlign: "center" }}>{platform.icon}</span>
                    <input
                      type="text"
                      value={socialLinks[platform.key as keyof typeof socialLinks]}
                      onChange={(e) => updateSocialLink(platform.key, e.target.value)}
                      placeholder={`@${platform.key}handle`}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        border: "1px solid #e9e5ff",
                        borderRadius: "8px",
                        fontSize: "13px",
                        background: "white",
                      }}
                    />
                    <button
                      onClick={() => updateSocialLink(platform.key, "")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#999",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience Size */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#1a1a1a" }}>
                Audience Size (Total Followers) <span style={{ color: "#ff6b6b" }}>*</span>
              </label>
              <select
                value={audienceSize}
                onChange={(e) => setAudienceSize(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #e9e5ff",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                <option value="">Select range</option>
                <option value="1K - 10K">1K - 10K</option>
                <option value="10K - 50K">10K - 50K</option>
                <option value="50K - 100K">50K - 100K</option>
                <option value="100K - 500K">100K - 500K</option>
                <option value="500K - 1M">500K - 1M</option>
                <option value="1M+">1M+</option>
              </select>
            </div>

            {/* Collaboration Interests */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#1a1a1a" }}>
                What kind of collaborations are you interested in? <span style={{ color: "#ff6b6b" }}>*</span>
              </label>
              <textarea
                value={collaborationInterests}
                onChange={(e) => setCollaborationInterests(e.target.value.slice(0, 300))}
                placeholder="Brand partnerships, product reviews, event invites, travel collaborations and long-term campaigns."
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "12px 14px",
                  border: "1px solid #e9e5ff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  background: "white",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
              <p style={{ fontSize: "12px", color: "#999", marginTop: "6px", textAlign: "right" }}>
                {collaborationInterests.length}/300
              </p>
            </div>

            {/* Portfolio */}
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#1a1a1a" }}>
                Portfolio / Sample Work
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                {portfolioLinks.map((link, i) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: "1",
                      borderRadius: "8px",
                      border: "2px dashed #e9e5ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: link ? "transparent" : "#f9f7ff",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {link ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={link}
                        alt={`Portfolio ${i + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "24px" }}>+</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            handlePortfolioLinkChange(i, event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
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
                ))}
              </div>
              <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
                Add images or links to showcase your best work (up to 5)
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: "48px", display: "flex", justifyContent: "center" }}>
          <button
            onClick={handleSaveProfile}
            style={{
              padding: "14px 48px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            Save & Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
