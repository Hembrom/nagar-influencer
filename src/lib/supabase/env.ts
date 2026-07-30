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
