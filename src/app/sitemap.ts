import type { MetadataRoute } from "next";
import { getPublicProjectItems } from "@/lib/projects";

/**
 * Static pages plus one entry per published project, so search engines can
 * index individual portfolio work instead of just the /projects grid.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly" as const, priority: 1 },
    { url: `${siteUrl}/projects`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteUrl}/services`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "yearly" as const, priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly" as const, priority: 0.7 },
    { url: `${siteUrl}/quote`, changeFrequency: "yearly" as const, priority: 0.8 },
  ].map((entry) => ({ ...entry, lastModified: new Date() }));

  try {
    const projects = await getPublicProjectItems();
    const projectEntries: MetadataRoute.Sitemap = projects
      .filter((project) => /^[a-z0-9-]+$/.test(project.slug))
      .map((project) => ({
        url: `${siteUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
    return [...staticEntries, ...projectEntries];
  } catch {
    // Sitemap should never fail a build over database availability.
    return staticEntries;
  }
}
