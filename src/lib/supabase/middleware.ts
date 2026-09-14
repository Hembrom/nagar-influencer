import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { getSupabaseEnv } from "./env";

const AUTH_FETCH_TIMEOUT_MS = 4_000;

function hasSupabaseSessionCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.includes("-auth-token") &&
        !cookie.name.includes("code-verifier"),
    );
}

export async function updateSession(request: NextRequest) {
  const env = getSupabaseEnv();
  const { pathname } = request.nextUrl;
  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login" || pathname.startsWith("/login/");

  if (!env) {
    return NextResponse.next({ request });
  }

  const hasSessionCookie = hasSupabaseSessionCookie(request);

  if (isDashboard && !hasSessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!hasSessionCookie) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(env.url, env.anonKey, {
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          signal: AbortSignal.timeout(AUTH_FETCH_TIMEOUT_MS),
        }),
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value),
        );
      },
    },
  });

  let isAuthenticated: boolean | null = null;
  try {
    const { data, error } = await supabase.auth.getClaims();
    if (!error) {
      isAuthenticated = Boolean(data?.claims);
    }
  } catch {
    return supabaseResponse;
  }

  if (isAuthenticated === null) {
    return supabaseResponse;
  }

  if (isDashboard && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isLogin && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/campaigns";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
