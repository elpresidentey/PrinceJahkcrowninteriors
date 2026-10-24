"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BUSINESS_INFO, WHATSAPP_QUOTE_URL } from "@/lib/constants";
import { LanguageSwitcher } from "./language-switcher";
import type { Locale } from "@/i18n/config";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  lang: Locale;
  links: { label: string; href: string }[];
  menuLabel: string;
  quoteLabel: string;
  closeLabel: string;
  closeMenuAria: string;
  switcherLabel: string;
}

export function MobileMenu({
  open,
  onClose,
  lang,
  links,
  menuLabel,
  quoteLabel,
  closeLabel,
  closeMenuAria,
  switcherLabel,
}: MobileMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement>(null);

  /* Close on Escape + lock the page behind the panel. */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  /* The route changed (link, back/forward, redirect) — the menu must not
     stay open on top of the new page. Only reacts to an actual path change,
     never to the menu simply being opened. */
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (open) onClose();
  }, [pathname, open, onClose]);

  /* Move focus into the panel when it opens. */
  useEffect(() => {
    if (!open) return;
    const firstLink = panelRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus({ preventScroll: true });
  }, [open]);

  const close = () => onClose();

  /* inert keeps the off-screen panel out of keyboard order when closed
     (aria-hidden alone does not stop tabbing). */
  return (
      <div
        className={cn(
          "fixed inset-0 z-[80] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
        inert={!open}
      >
      <div
        className={cn(
          "absolute inset-0 bg-foreground/20 transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={close}
      />

      <nav
        ref={panelRef}
        aria-label="Mobile"
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-primary text-primary-foreground shadow-[-24px_0_70px_-40px_rgba(10,20,14,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-[4.75rem] items-center justify-between border-b border-primary-foreground/15 px-5 sm:px-8">
          <span className="eyebrow text-gold-bright">{menuLabel}</span>
          <button
            onClick={close}
            aria-label={closeMenuAria}
            className="eyebrow text-primary-foreground"
          >
            {closeLabel}
          </button>
        </div>

        <ul className="flex flex-1 flex-col overflow-y-auto px-5 py-8 sm:px-8">
          {links.map((link, index) => {
            const isHome = link.href.split("/").length <= 2;
            const active = isHome
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <li key={link.href} className="border-b border-primary-foreground/15">
                <Link
                  href={link.href}
                  onClick={close}
                  style={{
                    animationDelay: open ? `${120 + index * 55}ms` : undefined,
                  }}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-baseline gap-4 py-5 font-serif text-3xl transition-colors focus-visible:-outline-offset-2",
                    active
                      ? "text-gold-bright"
                      : "text-primary-foreground hover:text-gold-bright"
                  )}
                >
                  <span className="eyebrow text-primary-foreground/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="space-y-4 border-t border-primary-foreground/15 px-5 py-8 sm:px-8">
          <a
            href={WHATSAPP_QUOTE_URL}
            onClick={close}
            target="_blank"
            rel="noreferrer noopener"
            className="eyebrow block bg-gold-bright py-4 text-center text-ink transition-colors hover:bg-primary-foreground hover:text-primary"
          >
            {quoteLabel}
          </a>
          <a
            href={WHATSAPP_QUOTE_URL}
            onClick={close}
            target="_blank"
            rel="noreferrer noopener"
            className="eyebrow block text-center text-gold-bright"
          >
            WhatsApp · {BUSINESS_INFO.phone}
          </a>
          <div className="pt-2 text-center">
            <LanguageSwitcher current={lang} label={switcherLabel} className="justify-center" />
          </div>
        </div>
      </nav>
    </div>
  );
}
