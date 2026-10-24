import type { MetadataRoute } from "next";
import { getPublicProjectItems } from "@/lib/projects";
import { LOCALES, localePath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/**
 * One entry per locale for every public page (so search engines can index
 * each language separately), with hreflang cross-links on every entry.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  /** hreflang alternates for one page across all locales (+ x-default = en). */
  const languages = (make: (locale: Locale) => string) =>
    Object.fromEntries([
      ...LOCALES.map((locale) => [locale, new URL(make(locale), siteUrl).toString()]),
      ["x-default", new URL(make("en"), siteUrl).toString()],
    ]);

  const page = (href: string, locale: Locale, priority: number, changeFrequency: "monthly" | "weekly" | "yearly" = "monthly"): MetadataRoute.Sitemap[number] => ({
    url: new URL(localePath(locale, href), siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages: languages((l) => (href === "/" ? `/${l}` : `/${l}${href}`)) },
  });

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    page("/", locale, 1),
    page("/projects", locale, 0.9, "weekly"),
    page("/services", locale, 0.9),
    page("/about", locale, 0.7, "yearly"),
    page("/contact", locale, 0.7, "yearly"),
    page("/quote", locale, 0.8, "yearly"),
  ]);

  try {
    const projects = await getPublicProjectItems();
    const projectEntries: MetadataRoute.Sitemap = projects
      .filter((project) => /^[a-z0-9-]+$/.test(project.slug))
      .flatMap((project) =>
        LOCALES.map((locale) => ({
          url: new URL(localePath(locale, `/projects/${project.slug}`), siteUrl).toString(),
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.8,
          alternates: {
            languages: languages((l) => `/${l}/projects/${project.slug}`),
          },
        }))
      );
    return [...staticEntries, ...projectEntries];
  } catch {
    // Sitemap should never fail a build over database availability.
    return staticEntries;
  }
}
