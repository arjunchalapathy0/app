import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// SERVER ONLY. Uses the service role key, which bypasses RLS.
// Only import this from route handlers, never from a client component.

/** Returns a Supabase admin client, or null when env vars aren't configured yet. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
