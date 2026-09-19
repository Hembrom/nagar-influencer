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
          email: "creator@example.com",
          role: "influencer",
        }));
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
          email: "creator@example.com",
          role: "influencer",
        }));
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

  const handleDemoMode = () => {
    sessionStorage.setItem("demo_mode", "true");
    sessionStorage.setItem("influencer_demo_user", JSON.stringify({
      email: "demo@creator.com",
      role: "influencer",
    }));
    router.push("/influencer/setup");
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

          {error && (
            <div style={{
              background: "#FFE5D9",
              border: "1px solid #FFD9C8",
              color: "#E24B4A",
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
              background: "#FFF5F0",
              border: "1px solid #FFD9C8",
              color: "#FF6B35",
              padding: "12px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "20px",
            }}>
              Working in demo mode. Your progress will be saved locally.
            </div>
          )}

          {/* GOOGLE SIGN IN */}
          <button
            onClick={handleGoogleSignIn}
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
              marginBottom: "20px",
            }}
          >
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* DIVIDER */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0", opacity: "0.5" }}>
            <div style={{ flex: 1, height: "1px", background: "#d0d0cc" }} />
            <span style={{ fontSize: "13px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#d0d0cc" }} />
          </div>

          {/* DEMO WORKSPACE */}
          <button
            onClick={handleDemoMode}
            style={{
              width: "100%",
              padding: "12px 24px",
              background: "transparent",
              color: "#FF6B35",
              border: "1px solid #FF6B35",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FFF5F0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Open Demo Workspace
          </button>

          {/* TERMS */}
          <p style={{ fontSize: "12px", color: "#7a7a77", textAlign: "center", marginTop: "20px" }}>
            By continuing you agree to NagarInfluence terms.
          </p>
        </div>
      </div>
    </div>
  );
}
