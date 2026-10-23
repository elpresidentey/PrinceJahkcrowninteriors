import type { MetadataRoute } from "next";
import { BUSINESS_INFO } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BUSINESS_INFO.name} — ${BUSINESS_INFO.tagline}`,
    short_name: BUSINESS_INFO.shortName,
    description: BUSINESS_INFO.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f2e3",
    theme_color: "#12482c",
    categories: ["business", "lifestyle", "shopping"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Get a quote",
        short_name: "Quote",
        url: "/quote",
      },
      {
        name: "View our work",
        short_name: "Projects",
        url: "/projects",
      },
      {
        name: "Contact us",
        short_name: "Contact",
        url: "/contact",
      },
    ],
  };
}
