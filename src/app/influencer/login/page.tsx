"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { isSupabaseAuthReachable } from "@/lib/supabase/health";

export default function InfluencerLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  const [demoEmail, setDemoEmail] = useState("");
  const env = getSupabaseEnv();
  const supabaseUrl = env?.url;

  // Check if Supabase is configured on component mount
  useEffect(() => {
    if (!supabaseUrl) {
      setConfigured(false);
      return;
    }
    let cancelled = false;
    isSupabaseAuthReachable(supabaseUrl).then((ok) => {
      if (cancelled) return;
      setConfigured(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [supabaseUrl]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!configured || !env) {
        // Demo mode - redirect to setup
        sessionStorage.setItem("demo_mode", "true");
        sessionStorage.setItem("influencer_demo_user", JSON.stringify({
          email: demoEmail || "creator@example.com",
          role: "influencer",
        }));
        // Save email for display in dashboard
        if (demoEmail) {
          sessionStorage.setItem("influencer_email", demoEmail);
        }
        router.push("/influencer/setup");
        return;
      }

      // Production: Use Supabase OAuth
      const reachable = await isSupabaseAuthReachable(env.url);
      if (!reachable) {
        setConfigured(false);
        // Fall back to demo mode
        sessionStorage.setItem("demo_mode", "true");
        sessionStorage.setItem("influencer_demo_user", JSON.stringify({
          email: demoEmail || "creator@example.com",
          role: "influencer",
        }));
        if (demoEmail) {
          sessionStorage.setItem("influencer_email", demoEmail);
        }
        router.push("/influencer/setup");
        return;
      }

      const supabase = createClient();
      const origin = window.location.origin;
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/influencer/setup")}`,
        },
      });

      if (authError) throw authError;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#f5f3ff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", maxWidth: "1000px", width: "100%" }}>
        {/* LEFT - BRANDING */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "700", margin: "0 0 16px 0", color: "#1a1a1a" }}>
            Your Story<br />
            Creates<br />
            <span style={{ color: "#6366f1" }}>Opportunities</span>
          </h1>
          <p style={{ fontSize: "16px", margin: "0 0 32px 0", color: "#666", lineHeight: "1.6" }}>
            Tell brands who you are, what you love and what you create. Connect with exciting partnership opportunities.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
              <span style={{ fontSize: "24px" }}>👤</span>
              <div>
                <p style={{ fontWeight: "600", margin: "0 0 4px 0", color: "#1a1a1a" }}>Showcase Your Identity</p>
                <p style={{ fontSize: "14px", margin: "0", color: "#666" }}>Let brands get to know you</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
              <span style={{ fontSize: "24px" }}>🎯</span>
              <div>
                <p style={{ fontWeight: "600", margin: "0 0 4px 0", color: "#1a1a1a" }}>Highlight Your Niche</p>
                <p style={{ fontSize: "14px", margin: "0", color: "#666" }}>Tell us what you create</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>⭐</span>
              <div>
                <p style={{ fontWeight: "600", margin: "0 0 4px 0", color: "#1a1a1a" }}>Share Your Best Work</p>
                <p style={{ fontSize: "14px", margin: "0", color: "#666" }}>Add your portfolio to attract collaborations</p>
              </div>
            </div>
          </div>

          <p style={{ fontSize: "13px", marginTop: "40px", color: "#999", fontStyle: "italic" }}>
            Creators Make It Happen
          </p>
        </div>

        {/* RIGHT - LOGIN FORM */}
        <div style={{ 
          background: "white", 
          borderRadius: "12px", 
          padding: "48px", 
          border: "1px solid #e0dcff",
          boxShadow: "0 4px 16px rgba(99, 102, 241, 0.08)"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px", color: "#1a1a1a" }}>
            Creator Login
          </h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "32px", margin: "0 0 32px 0" }}>
            Sign in to access your influencer workspace
          </p>

          {error && (
            <div style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              padding: "12px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "20px",
            }}>
              {error}
            </div>
          )}

          {!configured && (
            <div style={{
              background: "#f0f9ff",
              border: "1px solid #bfdbfe",
              borderRadius: "8px",
              padding: "12px 14px",
              fontSize: "13px",
              marginBottom: "20px",
            }}>
              <input
                type="email"
                placeholder="Enter your email (e.g., dailygoals@gmail.com)"
                value={demoEmail}
                onChange={(e) => setDemoEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #bfdbfe",
                  borderRadius: "6px",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          {/* GOOGLE SIGN IN */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: "#6366f1",
              color: "white",
              border: "1px solid #6366f1",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4f46e5";
              e.currentTarget.style.borderColor = "#4f46e5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#6366f1";
              e.currentTarget.style.borderColor = "#6366f1";
            }}
          >
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* TERMS */}
          <p style={{ fontSize: "12px", color: "#999", textAlign: "center", marginTop: "24px" }}>
            By continuing you agree to NagarInfluence terms.
          </p>
        </div>
      </div>
    </div>
  );
}
