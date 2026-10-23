import type { MetadataRoute } from "next";

/** Keep the admin panel and the offline shell out of search results. */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/offline"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
