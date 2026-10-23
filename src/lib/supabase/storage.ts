import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "projects";
const SERVICE_BUCKET = "services";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function describeUploadProblem(file: File): string | null {
  if (!ALLOWED_TYPES[file.type]) {
    return `${file.name} is not a JPEG, PNG, WebP or AVIF image.`;
  }
  if (file.size > MAX_BYTES) {
    return `${file.name} is larger than 8 MB — please compress it first.`;
  }
  return null;
}

/** Folder-scoped storage path with a collision-safe suffix. */
function storagePath(folder: "covers" | "gallery", slug: string, file: File): string {
  const ext = ALLOWED_TYPES[file.type] ?? "jpg";
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${folder}/${slug}/${slug}-${stamp}-${rand}.${ext}`;
}

/**
 * Upload an image to the public `projects` bucket and return its permanent
 * public URL. Callers must verify the admin session and file limits first.
 */
export async function uploadProjectImage(
  db: SupabaseClient,
  file: File,
  slug: string,
  folder: "covers" | "gallery"
): Promise<{ url?: string; error?: string }> {
  const { data, error } = await db.storage.from(BUCKET).upload(storagePath(folder, slug, file), file, {
    contentType: file.type,
    upsert: false,
  });
  if (!data || error) return { error: `Upload failed for ${file.name}: ${error?.message}` };

  const result = await db.storage.from(BUCKET).getPublicUrl(data.path);
  return { url: result.data?.publicUrl ?? undefined };
}

/**
 * Best-effort delete of a stored file given its public URL. Orphaned storage
 * files are harmless, so failures only log.
 */
export async function removeProjectImageByUrl(
  db: SupabaseClient,
  url: string
): Promise<void> {
  const marker = `/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = url.slice(index + marker.length);
  const { error } = await db.storage.from(BUCKET).remove([path]);
  if (error) console.warn(`Could not remove object '${path}':`, error.message);
}

/** Folder-scoped storage path in the `services` bucket. */
function serviceStoragePath(slug: string, file: File): string {
  const ext = ALLOWED_TYPES[file.type] ?? "jpg";
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${slug}/${slug}-${stamp}-${rand}.${ext}`;
}

/** Upload a service photo to the public `services` bucket. */
export async function uploadServiceImage(
  db: SupabaseClient,
  file: File,
  slug: string
): Promise<{ url?: string; error?: string }> {
  const { data, error } = await db.storage
    .from(SERVICE_BUCKET)
    .upload(serviceStoragePath(slug, file), file, {
      contentType: file.type,
      upsert: false,
    });
  if (!data || error) return { error: `Upload failed for ${file.name}: ${error?.message}` };

  const result = await db.storage.from(SERVICE_BUCKET).getPublicUrl(data.path);
  return { url: result.data?.publicUrl ?? undefined };
}

/** Best-effort delete of a service photo given its public URL. */
export async function removeServiceImageByUrl(
  db: SupabaseClient,
  url: string
): Promise<void> {
  const marker = `/object/public/${SERVICE_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = url.slice(index + marker.length);
  const { error } = await db.storage.from(SERVICE_BUCKET).remove([path]);
  if (error) console.warn(`Could not remove object '${path}':`, error.message);
}
