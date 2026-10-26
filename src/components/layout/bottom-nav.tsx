"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, FolderOpen, ClipboardList, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  services: Layers,
  projects: FolderOpen,
  quote: ClipboardList,
  contact: Phone,
};

export interface BottomNavItem {
  href: string;
  label: string;
  /** Key into the icon set — see ICONS above. */
  icon: "home" | "services" | "projects" | "quote" | "contact";
  /** The quote CTA is visually emphasised as the main action. */
  accent?: boolean;
}

interface BottomNavProps {
  items: BottomNavItem[];
  /** Accessible label for the <nav> landmark. */
  ariaLabel: string;
}

/**
 * Mobile bottom navigation bar — the phone-style tab strip. Desktop keeps the
 * regular header; this renders only below the `md` breakpoint, so it sits
 * inside the TWA/App-Store wrappers as an app-like tab bar. Safe-area padding
 * keeps it clear of iPhone home-indicator edges.
 */
export function BottomNav({ items, ariaLabel }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Spacer so the fixed bar never covers the footer's last lines. */}
      <div
        aria-hidden="true"
        className="h-[calc(env(safe-area-inset-bottom)+4.5rem)] md:hidden"
      />

      <nav
        aria-label={ariaLabel}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-bright/20 bg-ink/95 text-primary-foreground backdrop-blur-md md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-5">
          {items.map((item) => {
            const Icon = ICONS[item.icon];
            const path = item.href.replace(/\/$/, "");
            const active =
              item.accent !== true &&
              (item.icon === "home"
                ? pathname === path || pathname === path + "/"
                : pathname === path || pathname.startsWith(path + "/"));
            return (
              <li key={item.href} className="flex">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "flex min-h-16 flex-1 flex-col items-center justify-center gap-1.5 px-0.5 py-2 text-[0.68rem] font-medium leading-none transition-colors " +
                    (item.accent
                      ? "text-gold-bright"
                      : active
                        ? "text-gold-bright"
                        : "text-primary-foreground/65 hover:text-primary-foreground")
                  }
                >
                  <Icon
                    strokeWidth={active || item.accent ? 2.2 : 1.8}
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                  <span className="max-w-full truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
