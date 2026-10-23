"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { NAV_LINKS, WHATSAPP_QUOTE_URL } from "@/lib/constants";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const scrolled = useScroll(12);
  const pathname = usePathname();

  /** Close the mobile menu and hand focus back to its trigger. */
  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-gold-bright/30 bg-primary/95 text-primary-foreground backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-500",
          scrolled
            ? "border-primary-foreground/10 bg-primary shadow-[0_8px_30px_rgba(9,31,18,0.2)]"
            : "shadow-none"
        )}
      >
        <div className="mx-auto flex h-[4.75rem] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "eyebrow relative text-primary-foreground/70 transition-colors after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold-bright after:transition-transform after:duration-300 hover:text-primary-foreground hover:after:scale-x-100",
                    active && "text-gold-bright after:scale-x-100"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 sm:gap-5">
            <a
              href={WHATSAPP_QUOTE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="eyebrow hidden bg-gold-bright px-5 py-3 text-ink transition-colors hover:bg-primary-foreground hover:text-primary sm:inline-block"
            >
              Get a quote
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="eyebrow inline-flex items-center gap-2 text-primary-foreground lg:hidden"
            >
              <span aria-hidden className="h-px w-5 bg-gold-bright" />
              Menu
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
