import { getSupabaseEnv } from "./env";

export async function isSupabaseAuthReachable(url: string) {
  try {
    const env = getSupabaseEnv();
    const anonKey = env?.anonKey;
    
    const res = await fetch(`${url.replace(/\/$/, "")}/auth/v1/health`, {
      method: "GET",
      cache: "no-store",
      headers: anonKey ? { apikey: anonKey } : {},
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
