import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True only when the credentials look like a real project. The bundled
 * `.env.local.example` ships `your_...` placeholders that must never be
 * attempted as real connections.
 */
export const supabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your_") &&
    !supabaseAnonKey.includes("your_")
);

/**
 * Anon client, used for public reads. Null until the project owner pastes
 * the real credentials into `.env.local`, so every consumer must handle the
 * missing-database case (public pages fall back to the placeholder content).
 */
export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
