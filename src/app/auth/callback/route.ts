import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { upsertProfileFromAuthServer } from "@/lib/profile-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Default to /dashboard/campaigns for business owners, but allow override via 'next' param
  const next = searchParams.get("next") || "/dashboard/campaigns";

  const env = getSupabaseEnv();
  if (!env) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          try {
            await upsertProfileFromAuthServer(supabase, user);
          } catch {
            // login still succeeds even if profile table missing
          }
        }
        return NextResponse.redirect(`${origin}${next}`);
      }

      console.error("[AUTH_EXCHANGE_FAILED]", {
        error: error?.message,
        code: code?.substring(0, 20),
      });

      // PKCE error is expected for cross-domain auth - try direct token exchange
      if (error?.message?.includes("PKCE")) {
        console.log("[AUTH_ATTEMPTING_DIRECT_EXCHANGE] for code:", code?.substring(0, 20));
        
        // Try direct REST API token exchange
        try {
          const tokenRes = await fetch(
            `${env.url}/auth/v1/token?grant_type=authorization_code&code=${encodeURIComponent(code || "")}`,
            { method: "POST", cache: 'no-store' }
          );
          
          if (tokenRes.ok) {
            console.log("[AUTH_DIRECT_EXCHANGE_SUCCESS]");
            // Tokens were set via Set-Cookie header, try getting user again
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              try {
                await upsertProfileFromAuthServer(supabase, user);
              } catch (err) {
                console.error("[PROFILE_UPDATE_FAILED]", err);
              }
              return NextResponse.redirect(`${origin}${next}`);
            }
          } else {
            const err = await tokenRes.json();
            console.error("[DIRECT_EXCHANGE_FAILED]", err);
          }
        } catch (err) {
          console.error("[DIRECT_EXCHANGE_ERROR]", err);
        }
      }
    } catch (err) {
      console.error("[AUTH_EXCEPTION]", err);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
