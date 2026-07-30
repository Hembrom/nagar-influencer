import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type { Database };
export { createBrowserClient, createServerClient };

/** Typed browser client — use in Client Components */
export function supabaseBrowser() {
  return createBrowserClient();
}

/** Typed server client — use in Server Components / Route Handlers */
export async function supabaseServer() {
  return createServerClient();
}
