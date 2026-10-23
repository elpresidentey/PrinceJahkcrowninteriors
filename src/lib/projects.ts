import { cacheTag } from "next/cache";

import { supabase } from "@/lib/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/server";
import { PROJECTS, type ProjectItem } from "@/lib/content";
import { DESIGN_STYLES, PROJECT_CATEGORIES } from "@/lib/constants";
import type { Project, ProjectImage } from "@/types";

/**
 * Public project data. Reads are cached under the `projects` tag so the
 * front page and the projects page stay static-friendly; every admin
 * mutation revalidates the tag, so the site updates the moment the owner
 * saves something.
 */

export const PROJECTS_TAG = "projects";

function categoryLabel(value: string): string {
  return PROJECT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

function styleLabel(value: string): string {
  const label = DESIGN_STYLES.find((s) => s.value === value)?.label;
  if (label) return label;
  // Authored rows may store a display string ("Modern") directly.
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toCardItem(project: Project): ProjectItem {
  return {
    slug: project.slug,
    title: project.title,
    location: project.location,
    category: categoryLabel(project.category),
    style: styleLabel(project.style ?? "modern"),
    summary: project.summary ?? project.description ?? "",
    services: project.services ?? [],
    imageSrc: project.cover_image,
    tone: "#e6d9ae",
    featured: project.featured,
  };
}

/** Raw DB rows for the public site, cached under `PROJECTS_TAG`. */
async function loadProjectRows(): Promise<Project[] | null> {
  "use cache";
  cacheTag(PROJECTS_TAG);

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Public project query failed:", error.message);
    return null;
  }
  return (data as Project[]) ?? [];
}

/**
 * Everything to show on /projects. Falls back to the authored placeholder
 * content while the database is unconfigured or empty, so the site never
 * renders an empty portfolio by accident.
 */
export async function getPublicProjectItems(): Promise<ProjectItem[]> {
  const rows = await loadProjectRows();
  if (!rows || rows.length === 0) return PROJECTS;
  return rows.map(toCardItem);
}

/** The homepage picks: featured rows first, newest overall as fallback. */
export async function getFeaturedProjectItems(limit = 3): Promise<ProjectItem[]> {
  const items = await getPublicProjectItems();
  const featured = items.filter((item) => item.featured);
  return (featured.length > 0 ? featured : items).slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Public project detail (cached under the same tag)                   */
/* ------------------------------------------------------------------ */

export interface ProjectGalleryImage {
  url: string;
  type: "gallery" | "before" | "after";
}

export interface PublicProjectDetail {
  item: ProjectItem;
  gallery: ProjectGalleryImage[];
}

async function loadProjectDetail(slug: string): Promise<PublicProjectDetail | null> {
  "use cache";
  cacheTag(PROJECTS_TAG);

  if (!supabase) return null;
  if (!/^[a-z0-9-]{1,120}$/i.test(slug)) return null;

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !project) {
    if (error) console.error("Public project detail query failed:", error.message);
    return null;
  }

  const { data: images, error: imagesError } = await supabase
    .from("project_images")
    .select("image_url, type, sort_order")
    .eq("project_id", (project as Project).id)
    .order("sort_order", { ascending: true });
  if (imagesError) console.error("Project gallery query failed:", imagesError.message);

  return {
    item: toCardItem(project as Project),
    gallery: (images ?? []).map((image) => ({
      url: (image as Pick<ProjectImage, "image_url">).image_url,
      type: (image as Pick<ProjectImage, "type">).type,
    })),
  };
}

/**
 * One project for the /projects/[slug] detail page. Falls back to the
 * authored placeholder portfolio while the database is unconfigured, so the
 * sample pages stay browsable.
 */
export async function getProjectDetail(slug: string): Promise<PublicProjectDetail | null> {
  const detail = await loadProjectDetail(slug);
  if (detail) return detail;
  const authored = PROJECTS.find((item) => item.slug === slug);
  return authored ? { item: authored, gallery: [] } : null;
}

/* ------------------------------------------------------------------ */
/* Admin reads (uncached — admin pages want live data)                 */
/* ------------------------------------------------------------------ */

export async function fetchAdminProjects(): Promise<Project[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Admin project listing failed:", error.message);
    return [];
  }
  return (data as Project[]) ?? [];
}

export async function fetchAdminProject(id: string): Promise<Project | null> {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.from("projects").select("*").eq("id", id).single();
  if (error) {
    console.error("Admin project load failed:", error.message);
    return null;
  }
  return (data as Project) ?? null;
}

export async function fetchProjectImages(projectId: string): Promise<ProjectImage[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("Project image loading failed:", error.message);
    return [];
  }
  return (data as ProjectImage[]) ?? [];
}
