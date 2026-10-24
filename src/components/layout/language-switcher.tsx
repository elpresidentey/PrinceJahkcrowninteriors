"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LOCALES, LOCALE_NAMES, switchLocalePath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/**
 * The language picker. Renders as a compact native <select> so it needs no
 * popover chrome; choosing a language keeps the current path and simply swaps
 * the locale prefix (/fr/projects -> /yo/projects).
 */
export function LanguageSwitcher({
  current,
  label,
  className,
}: {
  /** The locale whose dictionary is currently rendering. */
  current: Locale;
  /** Accessible name, e.g. "Language" — supplied by the active dictionary. */
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className={cn("flex items-center gap-1.5", className)}>
      <svg
        viewBox="0 0 24 24"
        className="size-4 shrink-0 text-gold-bright"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3z" />
      </svg>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={current}
        onChange={(event) => {
          router.push(switchLocalePath(pathname, event.target.value as Locale));
        }}
        className="eyebrow cursor-pointer appearance-none bg-transparent pr-1 text-primary-foreground/70 outline-none transition-colors hover:text-primary-foreground focus-visible:text-primary-foreground [&>option]:bg-primary [&>option]:text-primary-foreground"
      >
        {LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {LOCALE_NAMES[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
