import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { upsertProfileFromAuthServer } from "@/lib/profile-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Default to /dashboard/campaigns for business owners, but allow override via 'next' param
  const next = searchParams.get("next") || "/dashboard/campaigns";

  if (!getSupabaseEnv()) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (code) {
    try {
      const supabase = await createClient();
      
      // Try to exchange the code for a session
      const { error, data } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          try {
            await upsertProfileFromAuthServer(supabase, user);
          } catch {
            // login still succeeds even if profile table missing
          }
        }
        return NextResponse.redirect(`${origin}${next}`);
      }
      
      // If exchange fails due to PKCE, log it but try alternative approach
      console.error("[AUTH_CALLBACK_ERROR]", {
        error: error?.message,
        code: code?.substring(0, 20) + "...",
        timestamp: new Date().toISOString(),
      });
      
      // If it's a PKCE error, still redirect (Supabase may handle it differently)
      if (error?.message?.includes("PKCE")) {
        // Try to get the session from cookies that Supabase may have set
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          try {
            await upsertProfileFromAuthServer(supabase, user);
          } catch {
            // continue anyway
          }
          return NextResponse.redirect(`${origin}${next}`);
        }
      }
    } catch (err) {
      console.error("[AUTH_CALLBACK_EXCEPTION]", err);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
