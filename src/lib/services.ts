import { cacheTag } from "next/cache";

import { supabase } from "@/lib/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/server";
import { IMAGES, type ImageKey } from "@/lib/image-manifest";
import { SERVICES } from "@/lib/content";
import type { Service } from "@/types";

/**
 * Public services data. Reads are cached under the `services` tag so the
 * front page and the services page stay static-friendly; every admin
 * mutation revalidates the tag, so the site updates the moment the owner
 * saves something.
 */

export const SERVICES_TAG = "services";

/** The shape the public pages render (matches `ServiceItem` minus the icon). */
export interface PublicService {
  slug: string;
  name: string;
  description: string;
  highlights: string[];
  /** Manifest key for the cover (authored placeholders). */
  image?: ImageKey;
  /** Direct cover URL (Supabase Storage). Takes precedence over `image`. */
  imageSrc?: string;
}

const DEFAULT_IMAGE_KEY: ImageKey = "ceiling-led-strips";

/**
 * Resolve a row's `image` column into a Photo cover. Only real remote URLs
 * (admin uploads into Storage) pass through as `imageSrc`; everything that
 * is not a manifest key — e.g. placeholder paths from the sample SQL that
 * live nowhere on disk — falls back to a working starter tile.
 */
export function serviceCover(row: Pick<Service, "image">): Pick<PublicService, "image" | "imageSrc"> {
  if (row.image.startsWith("http://") || row.image.startsWith("https://")) {
    return { imageSrc: row.image };
  }
  if (row.image in IMAGES) {
    return { image: row.image as ImageKey };
  }
  return { image: DEFAULT_IMAGE_KEY };
}

function toPublicService(row: Service): PublicService {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    highlights: row.highlights ?? [],
    ...serviceCover(row),
  };
}

function toPublicServiceAuthored(item: (typeof SERVICES)[number]): PublicService {
  return {
    slug: item.slug,
    name: item.name,
    description: item.description,
    highlights: item.highlights,
    image: item.image,
  };
}

/** Raw DB rows for the public site, cached under `SERVICES_TAG`. */
async function loadServiceRows(): Promise<Service[] | null> {
  "use cache";
  cacheTag(SERVICES_TAG);

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Public services query failed:", error.message);
    return null;
  }
  return (data as Service[]) ?? [];
}

/**
 * Everything to show on /services. Falls back to the authored placeholder
 * content while the database is unconfigured or empty, so the site never
 * renders an empty services list by accident. Inactive rows stay hidden.
 */
export async function getPublicServices(): Promise<PublicService[]> {
  const rows = await loadServiceRows();
  if (!rows || rows.length === 0) return SERVICES.map(toPublicServiceAuthored);
  return rows.filter((row) => row.active).map(toPublicService);
}

/* ------------------------------------------------------------------ */
/* Admin reads (uncached — admin pages want live data)                 */
/* ------------------------------------------------------------------ */

export async function fetchAdminServices(): Promise<Service[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Admin service listing failed:", error.message);
    return [];
  }
  return (data as Service[]) ?? [];
}

export async function fetchAdminService(id: string): Promise<Service | null> {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.from("services").select("*").eq("id", id).single();
  if (error) {
    console.error("Admin service load failed:", error.message);
    return null;
  }
  return (data as Service) ?? null;
}
