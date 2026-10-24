import { lang } from "next/root-params";
import { notFound } from "next/navigation";

import { LOCALES, type Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";
import { yo } from "./dictionaries/yo";
import { ha } from "./dictionaries/ha";
import { ig } from "./dictionaries/ig";

const dictionaries: Record<Locale, () => Dictionary> = {
  en: () => en,
  fr: () => fr,
  yo: () => yo,
  ha: () => ha,
  ig: () => ig,
};

export const hasLocale = (locale: string): locale is Locale =>
  (LOCALES as readonly string[]).includes(locale);

/**
 * Loads the dictionary for the current [lang] root parameter. Server
 * Components call this with no arguments — the locale is resolved from the
 * route. Safe under Cache Components: the lookup is derived entirely from
 * the route segment, never from request headers.
 */
export const getDictionary = async (): Promise<Dictionary> => {
  const locale = await lang();
  if (!locale || !hasLocale(locale)) notFound();
  return dictionaries[locale]();
};

/** Same, for the rare place that already has the locale in hand. */
export const getDictionaryFor = (locale: Locale): Dictionary => dictionaries[locale]();

export type { Dictionary, Locale };
