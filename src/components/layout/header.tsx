"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { WHATSAPP_QUOTE_URL } from "@/lib/constants";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { LanguageSwitcher } from "./language-switcher";
import type { Locale } from "@/i18n/config";

/** Header chrome. Nav labels + language come from the [lang] layout, so the
 *  component itself contains no copy — it stays purely presentational. */
export interface HeaderProps {
  lang: Locale;
  links: { label: string; href: string }[];
  menuLabel: string;
  quoteLabel: string;
  openMenuAria: string;
  closeLabel: string;
  closeMenuAria: string;
  switcherLabel: string;
}

export function Header({
  lang,
  links,
  menuLabel,
  quoteLabel,
  openMenuAria,
  closeLabel,
  closeMenuAria,
  switcherLabel,
}: HeaderProps) {
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
          <Logo lang={lang} />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {links.map((link) => {
              // "/"-style hrefs and bare locale homes ("/fr") match exactly;
              // section sections match by prefix.
              const isHome = link.href.split("/").length <= 2;
              const active = isHome
                ? pathname === link.href
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
            <LanguageSwitcher
              current={lang}
              label={switcherLabel}
              className="hidden sm:flex"
            />
            <a
              href={WHATSAPP_QUOTE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="eyebrow hidden bg-gold-bright px-5 py-3 text-ink transition-colors hover:bg-primary-foreground hover:text-primary sm:inline-block"
            >
              {quoteLabel}
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={openMenuAria}
              aria-expanded={menuOpen}
              className="eyebrow inline-flex items-center gap-2 text-primary-foreground lg:hidden"
            >
              <span aria-hidden className="h-px w-5 bg-gold-bright" />
              {menuLabel}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        lang={lang}
        links={links}
        menuLabel={menuLabel}
        quoteLabel={quoteLabel}
        closeLabel={closeLabel}
        closeMenuAria={closeMenuAria}
        switcherLabel={switcherLabel}
      />
    </>
  );
}
