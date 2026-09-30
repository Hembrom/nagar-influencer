export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !anonKey ||
    url.includes("YOUR_PROJECT_REF") ||
    anonKey.includes("your_anon_key")
  ) {
    return null;
  }

  return { url, anonKey };
}

export function getAppUrl() {
  // Use the explicit env var if set, otherwise fall back to window.location.origin
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    return appUrl;
  }
  
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for server-side rendering
  return 'https://www.growmyinfluence.in';
}
