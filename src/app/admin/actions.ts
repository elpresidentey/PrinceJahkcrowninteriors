"use server";

import { revalidatePath, updateTag } from "next/cache";

import { redirect } from "next/navigation";

import {
  adminConfigured,
  createAdminSession,
  destroyAdminSession,
  isAdmin,
} from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  describeUploadProblem,
  removeProjectImageByUrl,
  removeServiceImageByUrl,
  uploadProjectImage,
  uploadServiceImage,
} from "@/lib/supabase/storage";
import { generateSlug } from "@/lib/utils";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { PROJECTS_TAG } from "@/lib/projects";
import { SERVICES_TAG } from "@/lib/services";

export interface AdminActionState {
  error?: string;
  success?: string;
}

const CATEGORY_VALUES = PROJECT_CATEGORIES.map((c) => c.value).filter(
  (value) => value !== "all"
) as [string, ...string[]];

/** Uploads are sequential — keep any single form submit bounded. */
const MAX_GALLERY_PER_REQUEST = 8;

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

/* Login moved to POST /api/admin/login (a plain route handler) — see the
 * comment there. The server-action path was prone to a Next 16 form
 * regression where a retry after a failed submit never reached the server. */

export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/* Shared validation                                                   */
/* ------------------------------------------------------------------ */

interface ProjectFields {
  title: string;
  slug: string;
  location: string;
  category: string;
  style: string;
  summary: string | null;
  description: string | null;
  services: string[];
  featured: boolean;
}

function parseProjectFields(
  formData: FormData
): { fields?: ProjectFields; error?: string } {
  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const style = String(formData.get("style") ?? "modern").trim();
  const summaryRaw = String(formData.get("summary") ?? "").trim();
  const descriptionRaw = String(formData.get("description") ?? "").trim();
  const services = formData.getAll("services").map(String).filter(Boolean);
  const featured = formData.get("featured") === "on";

  if (title.length < 2 || title.length > 120) {
    return { error: "Give the project a title between 2 and 120 characters." };
  }
  if (!location) {
    return { error: "Add the project location, e.g. ‘Lekki, Lagos’." };
  }
  if (!CATEGORY_VALUES.includes(category)) {
    return { error: "Pick one of the project categories." };
  }

  const summary = summaryRaw || (descriptionRaw ? `${descriptionRaw.slice(0, 180).trim()}…` : null);
  const description = descriptionRaw || null;

  return {
    fields: {
      title,
      slug: generateSlug(title) || `project-${Date.now().toString(36)}`,
      location,
      category,
      style,
      summary,
      description,
      services,
      featured,
    },
  };
}

function coverFile(formData: FormData): File | null {
  const entry = formData.get("cover");
  return entry instanceof File && entry.size > 0 ? entry : null;
}

function galleryFiles(formData: FormData): File[] {
  return formData.getAll("gallery").filter((f): f is File => f instanceof File && f.size > 0);
}

function guardAdmin(): void {
  if (!isAdmin()) redirect("/admin/login");
}

function guardDb(): void {
  if (!supabaseAdmin) {
    redirect("/admin?setup=missing");
  }
}

/* ------------------------------------------------------------------ */
/* Create / Update / Delete                                            */
/* ------------------------------------------------------------------ */

export async function createProjectAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  guardAdmin();
  guardDb();

  const parsed = parseProjectFields(formData);
  if (parsed.error || !parsed.fields) return { error: parsed.error };
  const fields = parsed.fields;
  const db = supabaseAdmin as NonNullable<typeof supabaseAdmin>;

  // A cover is required, but if the owner only attached property photos,
  // promote the FIRST gallery photo to the cover instead of rejecting them.
  const chosenCover = coverFile(formData);
  let gallery = galleryFiles(formData);
  let cover = chosenCover;
  if (!cover && gallery.length > 0) {
    cover = gallery[0];
    gallery = gallery.slice(1);
  }
  if (!cover) {
    return {
      error:
        "Add at least one photo — the first one becomes the cover of the project.",
    };
  }
  const coverProblem = describeUploadProblem(cover);
  if (coverProblem) return { error: coverProblem };

  const uploaded = await uploadProjectImage(db, cover, fields.slug, "covers");
  if (!uploaded.url) return { error: uploaded.error };

  // Slug must be unique — append a short suffix on collision and retry once.
  let row = { ...fields, cover_image: uploaded.url };
  for (let attempt = 0; attempt < 2; attempt++) {
    const { data, error } = await db
      .from("projects")
      .insert(row)
      .select("id")
      .single();

    if (!error && data) {
      await storeGallery(db, (data.id as string), fields.slug, gallery);
      revalidatePublic();
      revalidatePath("/admin");
      redirect(`/admin/projects/${data.id}?created=1`);
    }

    // Unique-slug collision → suffix and retry once. Anything else is fatal.
    if (error?.code === "23505") {
      row = { ...fields, slug: `${fields.slug}-${Date.now().toString(36)}`, cover_image: uploaded.url };
      continue;
    }
    return { error: `Could not save the project: ${error?.message ?? "unknown error"}` };
  }
  return { error: "Could not save the project — the slug is already taken. Try a more specific title." };
}

export async function updateProjectAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  guardAdmin();
  guardDb();

  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { error: "Unknown project." };

  const parsed = parseProjectFields(formData);
  if (parsed.error || !parsed.fields) return { error: parsed.error };
  const fields = parsed.fields;
  const db = supabaseAdmin as NonNullable<typeof supabaseAdmin>;

  // Keep the existing cover unless a new one was chosen.
  const { data: current } = await db.from("projects").select("cover_image, slug").eq("id", id).single();
  if (!current) return { error: "That project no longer exists." };

  const update: Record<string, unknown> = {
    title: fields.title,
    slug: fields.slug,
    location: fields.location,
    category: fields.category,
    style: fields.style,
    summary: fields.summary,
    description: fields.description,
    services: fields.services,
    featured: fields.featured,
  };

  const cover = coverFile(formData);
  if (cover) {
    const problem = describeUploadProblem(cover);
    if (problem) return { error: problem };
    const uploaded = await uploadProjectImage(db, cover, fields.slug, "covers");
    if (!uploaded.url) return { error: uploaded.error };
    update.cover_image = uploaded.url;
  }

  // Slug must be unique — on a collision, suffix and retry once instead of
  // leaking a raw Postgres "duplicate key" error into the form.
  let updateRow = update;
  for (let attempt = 0; attempt < 2; attempt++) {
    const { error: updateError } = await db
      .from("projects")
      .update(updateRow)
      .eq("id", id);
    if (!updateError) break;

    if (updateError.code === "23505" && attempt === 0) {
      updateRow = { ...updateRow, slug: `${String(updateRow.slug)}-${Date.now().toString(36)}` };
      continue;
    }
    return { error: `Could not save changes: ${updateError.message}` };
  }

  // Only now that the row is actually saved do we swap the cover photo.
  // Deleting first would leave a live project pointing at a missing file
  // whenever the update failed.
  if (update.cover_image) {
    await removeProjectImageByUrl(db, current.cover_image as string);
  }

  const gallery = galleryFiles(formData);
  if (gallery.length > MAX_GALLERY_PER_REQUEST) {
    return {
      error: `Too many photos — up to ${MAX_GALLERY_PER_REQUEST} per save. Add the rest with the gallery manager.`,
    };
  }
  await storeGallery(db, id, `${String(updateRow.slug)}`, gallery);

  revalidatePublic();
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/admin");
  return { success: "Changes saved." };
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  guardAdmin();
  guardDb();

  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    // Not a silent no-op: surface that the deletion did not happen.
    redirect("/admin?error=unknown-project");
  }

  const db = supabaseAdmin as NonNullable<typeof supabaseAdmin>;

  // Collect storage URLs first — the rows cascade away with the project.
  const { data: project } = await db.from("projects").select("cover_image").eq("id", id).single();
  const { data: images } = await db.from("project_images").select("image_url").eq("project_id", id);

  await db.from("projects").delete().eq("id", id);

  if (project?.cover_image) removeProjectImageByUrl(db, project.cover_image as string);
  for (const image of images ?? []) {
    removeProjectImageByUrl(db, image.image_url as string);
  }

  revalidatePublic();
  revalidatePath("/admin");
  redirect("/admin");
}

export async function toggleFeaturedAction(formData: FormData): Promise<void> {
  guardAdmin();
  guardDb();

  const id = String(formData.get("id") ?? "");
  const featured = formData.get("featured") === "true";
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin");

  const db = supabaseAdmin as NonNullable<typeof supabaseAdmin>;
  const { error } = await db.from("projects").update({ featured }).eq("id", id);
  if (error) console.error("toggleFeatured failed:", error.message);

  revalidatePublic();
  revalidatePath("/admin");
}

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

export async function addGalleryImagesAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  guardAdmin();
  guardDb();

  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { error: "Unknown project." };

  const files = galleryFiles(formData);
  if (files.length === 0) return { error: "Choose at least one photo." };
  if (files.length > MAX_GALLERY_PER_REQUEST) {
    return {
      error: `Too many photos — up to ${MAX_GALLERY_PER_REQUEST} per upload. Add them in smaller batches.`,
    };
  }
  for (const file of files) {
    const problem = describeUploadProblem(file);
    if (problem) return { error: problem };
  }

  const db = supabaseAdmin as NonNullable<typeof supabaseAdmin>;
  const { data: project } = await db.from("projects").select("slug").eq("id", id).single();
  if (!project) return { error: "That project no longer exists." };

  const inserted = await storeGallery(db, id, project.slug as string, files);
  revalidatePublic();
  revalidatePath(`/admin/projects/${id}`);
  return inserted > 0
    ? { success: `Added ${inserted} photo${inserted === 1 ? "" : "s"}.` }
    : { error: "The upload did not go through — check the photos and try again." };
}

export async function deleteProjectImageAction(formData: FormData): Promise<void> {
  guardAdmin();
  guardDb();

  const imageId = String(formData.get("imageId") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  if (!imageId || !/^[0-9a-f-]{36}$/i.test(projectId)) {
    redirect("/admin?error=unknown-image");
  }
  if (!/^[0-9a-f-]{36}$/i.test(imageId)) {
    redirect(`/admin/projects/${projectId}?error=unknown-image`);
  }

  const db = supabaseAdmin as NonNullable<typeof supabaseAdmin>;
  const { data: image } = await db
    .from("project_images")
    .select("image_url")
    .eq("id", imageId)
    .single();

  if (image?.image_url) {
    await db.from("project_images").delete().eq("id", imageId);
    removeProjectImageByUrl(db, image.image_url as string);
  }

  revalidatePublic();
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/admin");
  redirect(`/admin/projects/${projectId}`);
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

async function storeGallery(
  db: NonNullable<typeof supabaseAdmin>,
  projectId: string,
  slug: string,
  files: File[]
): Promise<number> {
  if (files.length === 0) return 0;

  const rows: { project_id: string; image_url: string; type: "gallery"; sort_order: number }[] = [];

  // Sort order continues after whatever the project already has.
  const existing = await db
    .from("project_images")
    .select("sort_order")
    .eq("project_id", projectId);
  const base = (existing.data ?? []).reduce(
    (max, row) => Math.max(max, Number(row.sort_order ?? 0)),
    0
  );

  let stored = 0;
  for (let i = 0; i < files.length; i++) {
    const uploaded = await uploadProjectImage(db, files[i], slug, "gallery");
    if (!uploaded.url) continue;
    rows.push({
      project_id: projectId,
      image_url: uploaded.url,
      type: "gallery",
      sort_order: base + i + 1,
    });
    stored++;
  }

  if (rows.length > 0) {
    const { error } = await db.from("project_images").insert(rows);
    if (error) console.error("gallery insert failed:", error.message);
  }
  return stored;
}

function revalidatePublic(): void {
  // updateTag = revalidateTag with zero staleness, the form the docs
  // recommend inside Server Actions.
  updateTag(PROJECTS_TAG);
  updateTag(SERVICES_TAG);
  revalidatePath("/projects");
  revalidatePath("/services");
  revalidatePath("/");
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

interface ServiceFields {
  name: string;
  slug: string;
  description: string | null;
  highlights: string[];
}

function parseServiceFields(formData: FormData): { fields?: ServiceFields; error?: string } {
  const name = String(formData.get("name") ?? "").trim();
  const descriptionRaw = String(formData.get("description") ?? "").trim();
  const highlights = String(formData.get("highlights") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6);

  if (name.length < 2 || name.length > 120) {
    return { error: "Give the service a name between 2 and 120 characters." };
  }

  return {
    fields: {
      name,
      slug: generateSlug(name) || `service-${Date.now().toString(36)}`,
      description: descriptionRaw || null,
      highlights,
    },
  };
}

function servicePhoto(formData: FormData): File | null {
  const entry = formData.get("photo");
  return entry instanceof File && entry.size > 0 ? entry : null;
}

export async function createServiceAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  guardAdmin();
  guardDb();

  const parsed = parseServiceFields(formData);
  if (parsed.error || !parsed.fields) return { error: parsed.error };
  const fields = parsed.fields;
  const db = supabaseAdmin as NonNullable<typeof supabaseAdmin>;

  const photo = servicePhoto(formData);
  if (!photo) {
    return { error: "Add a photo — it is the tile the service is presented with." };
  }
  const photoProblem = describeUploadProblem(photo);
  if (photoProblem) return { error: photoProblem };

  const uploaded = await uploadServiceImage(db, photo, fields.slug);
  if (!uploaded.url) return { error: uploaded.error };

  let slug = fields.slug;
  for (let attempt = 0; attempt < 2; attempt++) {
    const { error } = await db.from("services").insert({
      name: fields.name,
      slug,
      description: fields.description,
      highlights: fields.highlights,
      image: uploaded.url,
    });

    if (!error) {
      revalidatePublic();
      revalidatePath("/admin/services");
      redirect("/admin/services?created=1");
    }

    // Unique-slug collision → suffix and retry once. Anything else is fatal.
    if (error?.code === "23505" && attempt === 0) {
      slug = `${fields.slug}-${Date.now().toString(36)}`;
      continue;
    }
    return { error: `Could not save the service: ${error?.message ?? "unknown error"}` };
  }
  return { error: "Could not save the service — the web address it needs is already taken. Try a more specific name." };
}

export async function updateServiceAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  guardAdmin();
  guardDb();

  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { error: "Unknown service." };

  const parsed = parseServiceFields(formData);
  if (parsed.error || !parsed.fields) return { error: parsed.error };
  const fields = parsed.fields;
  const db = supabaseAdmin as NonNullable<typeof supabaseAdmin>;

  const { data: current } = await db
    .from("services")
    .select("image, slug")
    .eq("id", id)
    .single();
  if (!current) return { error: "That service no longer exists." };

  // The slug is the card's anchor on the site — keep it, so their existing
  // links (footer shortcuts, enquiry form anchors) do not silently break.
  const update: Record<string, unknown> = {
    name: fields.name,
    description: fields.description,
    highlights: fields.highlights,
  };

  const photo = servicePhoto(formData);
  if (photo) {
    const problem = describeUploadProblem(photo);
    if (problem) return { error: problem };
    const uploaded = await uploadServiceImage(db, photo, String(current.slug));
    if (!uploaded.url) return { error: uploaded.error };
    update.image = uploaded.url;
  }

  const { error: updateError } = await db.from("services").update(update).eq("id", id);
  if (updateError) return { error: `Could not save changes: ${updateError.message}` };

  // Swap storage files only after the row saved successfully.
  if (update.image) {
    await removeServiceImageByUrl(db, String(current.image));
  }

  revalidatePublic();
  revalidatePath("/admin/services");
  return { success: "Changes saved." };
}

export async function toggleServiceActiveAction(formData: FormData): Promise<void> {
  guardAdmin();
  guardDb();

  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/services");

  const db = supabaseAdmin as NonNullable<typeof supabaseAdmin>;
  const { error } = await db.from("services").update({ active }).eq("id", id);
  if (error) console.error("toggleServiceActive failed:", error.message);

  revalidatePublic();
  revalidatePath("/admin/services");
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  guardAdmin();
  guardDb();

  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    redirect("/admin/services?error=unknown-service");
  }

  const db = supabaseAdmin as NonNullable<typeof supabaseAdmin>;
  const { data: service } = await db.from("services").select("image").eq("id", id).single();

  await db.from("services").delete().eq("id", id);

  if (service?.image) {
    await removeServiceImageByUrl(db, service.image as string);
  }

  revalidatePublic();
  revalidatePath("/admin/services");
  redirect("/admin/services");
}
