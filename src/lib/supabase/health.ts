export async function isSupabaseAuthReachable(url: string) {
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/auth/v1/health`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000), // Increased from 3s to 10s
    });
    return res.ok;
  } catch {
    return false;
  }
}
