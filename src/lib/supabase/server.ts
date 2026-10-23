import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseServiceRoleKey &&
    !supabaseUrl.includes("your_") &&
    !supabaseServiceRoleKey.includes("your_")
);

/**
 * Server-side client with service role for admin operations. It bypasses
 * row-level security, so it is only ever imported from server code
 * (server actions, admin pages) that has already verified the session.
 */
export const supabaseAdmin: SupabaseClient | null = supabaseConfigured
  ? createClient(supabaseUrl as string, supabaseServiceRoleKey as string, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
