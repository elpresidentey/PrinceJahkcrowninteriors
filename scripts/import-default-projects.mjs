/**
 * One-time migration: takes the featured/portfolio projects currently baked
 * into `src/lib/content.ts` (PROJECTS) and turns them into editable rows in
 * Supabase, uploading their placeholder covers to the `projects` bucket.
 *
 * After this, everything shown on the front page and /projects comes from
 * the dashboard — nothing needs the codebase to change.
 *
 * Safe to re-run: projects whose slug already exists are skipped.
 *
 * Usage: node scripts/import-default-projects.mjs
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z]/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)])
);

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** Category labels (content.ts) → the `<select>` values the admin stores. */
const CATEGORY = {
  "POP Ceilings": "pop-ceilings",
  "Living Rooms": "living-rooms",
  Bedrooms: "bedrooms",
  "TV Walls": "tv-walls",
  Commercial: "commercial",
};

/** Style labels (content.ts) → the admin `<select>` values. */
const STYLE = {
  Modern: "modern",
  Luxury: "luxury",
  Minimal: "minimal",
  Classic: "classic",
  Contemporary: "contemporary",
  "African Modern": "african-modern",
};

/** The authored placeholder portfolio, verbatim from src/lib/content.ts. */
const PROJECTS = [
  {
    slug: "lekki-penthouse-ceiling",
    title: "Penthouse Ceiling",
    location: "Lekki, Lagos",
    category: "POP Ceilings",
    style: "Luxury",
    summary:
      "A double-height stairwell ceiling finished with layered coves and a floating chandelier pocket.",
    services: ["POP Ceiling", "Lighting", "Feature Wall"],
    imageKey: "living-linear-cove",
    featured: true,
  },
  {
    slug: "ikoyi-media-wall",
    title: "Illuminated Media Wall",
    location: "Ikoyi, Lagos",
    category: "TV Walls",
    style: "Modern",
    summary:
      "Fluted timber panelling wraps a 75-inch screen with hidden storage and warm accent lighting.",
    services: ["TV Wall", "Joinery"],
    imageKey: "living-feature-wall",
    featured: true,
  },
  {
    slug: "ajah-family-duplex",
    title: "Family Duplex",
    location: "Ajah, Lagos",
    category: "Living Rooms",
    style: "Contemporary",
    summary:
      "A full ground-floor transformation: ceiling, lighting, panelling and soft furnishing.",
    services: ["Interior Decoration", "Lighting"],
    imageKey: "classic-living-room",
    featured: true,
  },
  {
    slug: "victoria-island-office",
    title: "Corporate Reception",
    location: "Victoria Island",
    category: "Commercial",
    style: "Minimal",
    summary:
      "A calm, brand-led reception ceiling with linear light and acoustic timber baffles.",
    services: ["Commercial", "Lighting"],
    imageKey: "ceiling-geometric-cove",
    featured: false,
  },
  {
    slug: "maryland-master-suite",
    title: "Master Suite Retreat",
    location: "Maryland, Lagos",
    category: "Bedrooms",
    style: "Classic",
    summary:
      "A tray ceiling with concealed cove light and a velvet-upholstered headboard wall.",
    services: ["Bedrooms", "Upholstery"],
    imageKey: "bedroom-timber-panelling",
    featured: false,
  },
  {
    slug: "lekki-restaurant-interior",
    title: "Boutique Restaurant",
    location: "Lekki Phase 1",
    category: "Commercial",
    style: "African Modern",
    summary:
      "Warm sculpted ceilings and patterned screens set the mood for an intimate dining room.",
    services: ["Commercial", "Interior Decoration"],
    imageKey: "ceiling-led-strips",
    featured: false,
  },
];

let imported = 0;
let skipped = 0;

for (const project of PROJECTS) {
  const { data: existing } = await db
    .from("projects")
    .select("id")
    .eq("slug", project.slug)
    .maybeSingle();

  if (existing) {
    skipped++;
    console.log(`• ${project.slug} already in the dashboard — skipped`);
    continue;
  }

  // Upload the placeholder cover into storage so the row is fully
  // dashboard-owned (replace it any time from the edit page).
  const localPath = new URL(
    `../public/images/${project.imageKey}.jpg`,
    import.meta.url
  );
  const storagePath = `covers/${project.slug}/cover.jpg`;
  const upload = await db.storage
    .from("projects")
    .upload(storagePath, readFileSync(localPath), {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (upload.error && !/already|exists/i.test(upload.error.message)) {
    console.error(`✗ ${project.slug}: upload failed — ${upload.error.message}`);
    continue;
  }

  const coverUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${storagePath}`;

  const { error } = await db.from("projects").insert({
    title: project.title,
    slug: project.slug,
    location: project.location,
    category: CATEGORY[project.category] ?? project.category,
    style: STYLE[project.style] ?? project.style,
    summary: project.summary,
    description: project.summary,
    services: project.services,
    featured: project.featured,
    cover_image: coverUrl,
  });

  if (error) {
    console.error(`✗ ${project.slug}: insert failed — ${error.message}`);
    continue;
  }

  imported++;
  console.log(`✓ ${project.slug} imported (featured: ${project.featured})`);
}

console.log(`\nDone — ${imported} imported, ${skipped} skipped.`);
console.log("Open http://localhost:3000/admin and edit anything you see.");
