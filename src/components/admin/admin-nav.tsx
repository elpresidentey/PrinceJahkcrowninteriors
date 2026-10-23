"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const links = [
  { label: "Projects", href: "/admin" },
  { label: "Services", href: "/admin/services" },
  { label: "New project", href: "/admin/projects/new" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="space-y-1">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block border-l-2 px-4 py-2.5 text-[0.85rem] transition-colors",
              active
                ? "border-gold-bright bg-primary-foreground/[0.06] text-primary-foreground"
                : "border-transparent text-primary-foreground/60 hover:border-primary-foreground/30 hover:text-primary-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}

      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="block border-l-2 border-transparent px-4 py-2.5 text-[0.85rem] text-primary-foreground/60 transition-colors hover:border-primary-foreground/30 hover:text-primary-foreground"
      >
        View site ↗
      </a>

      <form action={logoutAction} className="pt-6">
        <button
          type="submit"
          className="block w-full border-l-2 border-transparent px-4 py-2.5 text-left text-[0.85rem] text-primary-foreground/40 transition-colors hover:border-destructive/60 hover:text-destructive"
        >
          Sign out
        </button>
      </form>
    </nav>
  );
}
