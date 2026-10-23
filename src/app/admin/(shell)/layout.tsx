import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/admin-auth";
import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";

/**
 * The guarded shell: no admin page renders inside it without a valid
 * session cookie. Server actions additionally re-check the session, so
 * crafted POSTs straight to an action are rejected too.
 */
export const instant = false;
export default async function AdminShellLayout({ children }: { children: ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="mx-auto flex w-full max-w-[1600px]">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col justify-between bg-ink py-8 text-primary-foreground lg:flex">
        <div>
          <div className="px-5">
            <p className="eyebrow text-gold-bright">PJC Interior</p>
            <p className="mt-1 font-serif text-lg">Admin</p>
          </div>
          <div className="mt-8">
            <AdminNav />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-primary-foreground/10 bg-ink px-5 py-3 text-primary-foreground lg:hidden">
          <p className="eyebrow text-gold-bright">PJC Admin</p>
          <div className="flex items-center gap-4 text-[0.8rem]">
            <a href="/" target="_blank" rel="noreferrer">
              View site ↗
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-primary-foreground/50 transition-colors hover:text-primary-foreground"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 lg:px-12 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
