import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle2, CircleDashed } from "lucide-react";

import { isAdmin, adminConfigured } from "@/lib/admin-auth";
import { supabaseConfigured } from "@/lib/supabase/client";
import { supabaseConfigured as serverConfigured } from "@/lib/supabase/server";
import { Container } from "@/components/shared/container";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin sign in" };

// The session check reads cookies, so this route must never prerender.
// `instant = false` allows blocking navigations; `ensureStatic = false`
// additionally opts the route out of the partial-prerender stages that
// otherwise fail prerender (and were observed to break the second form
// submit after a returned error state).
export const instant = false;
export const ensureStatic = false;

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  const dbReady = supabaseConfigured && serverConfigured;
  const passwordReady = adminConfigured();

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center bg-ink px-5 text-primary-foreground">
      <Container size="wide" className="flex flex-col items-center">
        <div className="w-full max-w-md py-20">
          <p className="eyebrow text-gold-bright">PJC Interior Services</p>
          <h1 className="mt-3 font-serif text-3xl">Admin dashboard</h1>
          <p className="mt-2 text-sm text-primary-foreground/60">
            Add projects, upload photos and choose what shows on the front page.
          </p>

          <LoginForm />

          {/* Setup status — surfaces exactly what is left to configure. */}
          <ul className="mt-10 space-y-2.5 border-t border-primary-foreground/15 pt-6 text-[0.8rem] text-primary-foreground/60">
            <li className="flex items-center gap-2.5">
              {passwordReady ? (
                <CheckCircle2 className="size-4 text-gold-bright" aria-hidden />
              ) : (
                <CircleDashed className="size-4" aria-hidden />
              )}
              Admin access configured
            </li>
            <li className="flex items-center gap-2.5">
              {dbReady ? (
                <CheckCircle2 className="size-4 text-gold-bright" aria-hidden />
              ) : (
                <CircleDashed className="size-4" aria-hidden />
              )}
              Project storage connected
            </li>
          </ul>
        </div>
      </Container>
    </main>
  );
}
