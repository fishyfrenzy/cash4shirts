import { createClient } from "@supabase/supabase-js";

// Service-role Supabase client. Bypasses Row Level Security, so it MUST only be
// used in server-side code (server actions / route handlers) that has already
// verified the caller is an authenticated admin. The service key never ships to
// the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
