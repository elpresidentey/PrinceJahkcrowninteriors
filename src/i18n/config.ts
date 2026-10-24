/**
 * Locale configuration for the public site.
 *
 * Public pages live under `app/[lang]` so every language has its own URL
 * (/en/projects, /fr/projects, …) that search engines can index separately.
 * The admin dashboard stays outside the segment and is English-only, and any
 * content authored in the admin (projects, services, testimonials) is not
 * translated — it renders exactly as written.
 */
export const LOCALES = ["en", "fr", "yo", "ha", "ig"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Endonyms — how each language calls itself (shown in the switcher). */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  yo: "Yorùbá",
  ha: "Hausa",
  ig: "Igbo",
};

/** HTML lang attr per locale (BCP 47). */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: "en-NG",
  fr: "fr-FR",
  yo: "yo-NG",
  ha: "ha-NG",
  ig: "ig-NG",
};

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

/** `/en`, `/fr/yo` style prefix. Home stays compact: `/en`, `/fr`. */
export const homepage = (locale: Locale) => `/${locale}`;

/** Prefix any site path with the locale: "" -> "/fr", "/projects" -> "/fr/projects". */
export const localePath = (locale: Locale, path = "/") => {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
};

/** Given a pathname any locale prefix, swap it for `next`. */
export const switchLocalePath = (pathname: string, next: Locale) => {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return homepage(next);
    if (pathname.startsWith(`/${locale}/`)) return localePath(next, pathname.slice(locale.length + 1));
  }
  return localePath(next, pathname);
};

/** First matching locale in an Accept-Language header, else the default. */
export const localeFromHeader = (header: string | null): Locale => {
  if (!header) return DEFAULT_LOCALE;
  const tags = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean) as string[];
  for (const tag of tags) {
    const base = tag.split("-")[0];
    if (base && isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
};
