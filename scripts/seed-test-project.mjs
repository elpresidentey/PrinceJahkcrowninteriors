// Seeds one test project through the same storage + table path the admin
// actions use, so the public read pipeline can be verified end to end.
// Usage: node scripts/seed-test-project.mjs [--cleanup]

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

const STORAGE_PATH = "covers/test-project/test-cover.jpg";
const cleanup = process.argv.includes("--cleanup");

if (cleanup) {
  const { data: rows } = await db.from("projects").select("id, cover_image").eq("slug", "test-project");
  for (const row of rows ?? []) {
    await db.from("projects").delete().eq("id", row.id);
    const marker = "/object/public/projects/";
    if (row.cover_image?.includes(marker)) {
      await db.storage.from("projects").remove([row.cover_image.split(marker)[1]]);
    }
  }
  console.log(`cleanup done (${(rows ?? []).length} row(s) removed)`);
  process.exit(0);
}

const file = await readFileSync(new URL("../public/images/living-linear-cove.jpg", import.meta.url));

const upload = await db.storage.from("projects").upload(STORAGE_PATH, file, {
  contentType: "image/jpeg",
  upsert: false,
});
if (upload.error && !/exists|duplicate/i.test(upload.error.message)) {
  throw new Error(`upload: ${upload.error.message}`);
}
const coverUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${STORAGE_PATH}`;

const { data, error } = await db
  .from("projects")
  .insert({
    title: "Test Project",
    slug: "test-project",
    location: "Lekki, Lagos",
    category: "pop-ceilings",
    style: "luxury",
    summary: "A seeded test project verifying the admin CRUD pipeline.",
    description: "This row exists only to prove create-read-update-delete works end to end.",
    services: ["POP Ceiling", "Lighting"],
    featured: true,
    cover_image: coverUrl,
  })
  .select("id")
  .single();

if (error) {
  if (/duplicate/i.test(error.message)) {
    console.log("test project already exists");
    process.exit(0);
  }
  throw new Error(`insert: ${error.message}`);
}
console.log(`inserted test project id ${data.id}`);
console.log(`cover: ${coverUrl.slice(0, 80)}…`);
