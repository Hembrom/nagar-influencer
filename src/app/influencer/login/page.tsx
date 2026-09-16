"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InfluencerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Integrate with Supabase auth
    setTimeout(() => {
      console.log("Login attempt:", { email, password });
      router.push("/influencer/setup");
      setLoading(false);
    }, 1000);
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", maxWidth: "1000px", width: "100%" }}>
        {/* LEFT - BRANDING */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", color: "white" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "700", margin: "0 0 16px 0" }}>
            Your Story<br />
            Creates<br />
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Opportunities</span>
          </h1>
          <p style={{ fontSize: "16px", margin: "0 0 32px 0", opacity: "0.9", lineHeight: "1.6" }}>
            Tell brands who you are, what you love and what you create. Connect with exciting partnership opportunities.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
              <span style={{ fontSize: "24px" }}>👤</span>
              <div>
                <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>Showcase Your Identity</p>
                <p style={{ fontSize: "14px", margin: "0", opacity: "0.9" }}>Let brands get to know you</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
              <span style={{ fontSize: "24px" }}>🎯</span>
              <div>
                <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>Highlight Your Niche</p>
                <p style={{ fontSize: "14px", margin: "0", opacity: "0.9" }}>Tell us what you create</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>⭐</span>
              <div>
                <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>Share Your Best Work</p>
                <p style={{ fontSize: "14px", margin: "0", opacity: "0.9" }}>Add your portfolio to attract collaborations</p>
              </div>
            </div>
          </div>

          <p style={{ fontSize: "13px", marginTop: "40px", opacity: "0.8", fontStyle: "italic" }}>
            Creators Make It Happen
          </p>
        </div>

        {/* RIGHT - LOGIN FORM */}
        <div style={{ background: "white", borderRadius: "12px", padding: "48px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px", color: "#1a1a18" }}>
            Creator Login
          </h2>
          <p style={{ fontSize: "14px", color: "#7a7a77", marginBottom: "32px", margin: "0 0 32px 0" }}>
            Sign in to access your influencer workspace
          </p>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#1a1a18" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #d0d0cc",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#1a1a18" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #d0d0cc",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Remember Me */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
              <input type="checkbox" id="remember" style={{ cursor: "pointer" }} />
              <label htmlFor="remember" style={{ fontSize: "13px", color: "#7a7a77", cursor: "pointer", margin: "0" }}>
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 24px",
                background: "#FF6B35",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0", opacity: "0.5" }}>
            <div style={{ flex: 1, height: "1px", background: "#d0d0cc" }} />
            <span style={{ fontSize: "13px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#d0d0cc" }} />
          </div>

          {/* Sign Up Link */}
          <p style={{ textAlign: "center", fontSize: "14px", color: "#7a7a77", margin: "24px 0 0 0" }}>
            Don't have an account?{" "}
            <a href="/influencer/signup" style={{ color: "#FF6B35", fontWeight: "600", textDecoration: "none", cursor: "pointer" }}>
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
