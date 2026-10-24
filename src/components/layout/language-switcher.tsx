"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LOCALES, LOCALE_NAMES, switchLocalePath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/**
 * The language picker, styled to the brand's "ledger" system: a compact
 * trigger (globe + endonym + chevron) that opens a dark gold-lined panel of
 * endonyms. Choosing a language keeps the current path and swaps the locale
 * prefix (/fr/projects → /yo/projects).
 *
 * `placement` flips the popover upward — used inside the mobile menu where
 * the trigger sits near the bottom of the screen.
 */
export function LanguageSwitcher({
  current,
  label,
  className,
  placement = "bottom",
}: {
  /** The locale whose dictionary is currently rendering. */
  current: Locale;
  /** Accessible name, e.g. "Language" — supplied by the active dictionary. */
  label: string;
  className?: string;
  /** Which way the panel opens. */
  placement?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  /* Outside click / Escape dismiss, while the panel is open. */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
        rootRef.current?.querySelector("button")?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /* Route changed (pick, back/forward) — the panel must not stay open. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Keyboard: focus the active option on open, then let ↑/↓ walk the list. */
  useEffect(() => {
    if (!open) return;
    (rootRef.current?.querySelector<HTMLButtonElement>("[data-autofocus]") ??
      rootRef.current?.querySelector<HTMLButtonElement>("button"))?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onKeyDownInPanel = (event: ReactKeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>("button[role=option]") ?? []
    );
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      event.key === "ArrowDown"
        ? items[(index + 1 + items.length) % items.length]
        : items[(index - 1 + items.length) % items.length];
    next?.focus();
  };

  const pick = (locale: Locale) => {
    setOpen(false);
    router.push(switchLocalePath(pathname, locale));
  };

  return (
    <div ref={rootRef} className={cn("group relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${LOCALE_NAMES[current]}`}
        className={cn(
          "eyebrow flex items-center gap-2 py-1.5 text-primary-foreground/70 outline-none transition-colors duration-300 hover:text-gold-bright focus-visible:text-gold-bright",
          open && "text-gold-bright"
        )}
      >
        <GlobeIcon />
        <span className="whitespace-nowrap">{LOCALE_NAMES[current]}</span>
        <svg
          viewBox="0 0 24 24"
          className={cn(
            "size-3 transition-transform duration-300",
            open ? "rotate-180" : "group-hover:translate-y-px"
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          onKeyDown={onKeyDownInPanel}
          className={cn(
            "absolute right-0 z-[90] min-w-[11.5rem] animate-fade-in border border-gold-bright/30 bg-primary text-primary-foreground shadow-[0_18px_50px_-16px_rgba(10,20,14,0.55)] focus:outline-none",
            placement === "bottom" ? "top-full mt-3" : "bottom-full mb-3"
          )}
        >
          {/* Gold rule opening the panel, ledger-style */}
          <span
            aria-hidden
            className="absolute -top-px left-0 block h-[2px] w-7 bg-gold-bright/80"
          />
          <ul className="py-1.5">
            {LOCALES.map((locale, index) => {
              const active = locale === current;
              return (
                <li key={locale}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => pick(locale)}
                    data-autofocus={locale === current ? "" : undefined}
                    className={cn(
                      "eyebrow flex w-full items-center justify-between gap-6 px-4 py-2.5 text-left transition-colors duration-200 focus-visible:text-gold-bright focus-visible:outline-none",
                      index !== LOCALES.length - 1 && "border-b border-primary-foreground/10",
                      active
                        ? "text-gold-bright"
                        : "text-primary-foreground/75 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                    )}
                  >
                    {LOCALE_NAMES[locale]}
                    {active && (
                      <svg
                        viewBox="0 0 24 24"
                        className="size-3 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Site's globe glyph — thin line, gold when hovered (inherits text color). */
function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9s-1.4 6.4-3.9 9c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3z" />
    </svg>
  );
}
