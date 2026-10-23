import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchAdminProject, fetchProjectImages } from "@/lib/projects";
import { ProjectForm } from "@/components/admin/project-form";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const metadata: Metadata = { title: "Edit project · Admin" };

// Behind the guarded shell (which reads cookies); never prerender.
export const instant = false;

const UUID_PATTERN = /^[0-9a-f-]{36}$/i;

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  if (!UUID_PATTERN.test(id)) notFound();

  const project = await fetchAdminProject(id);
  if (!project) notFound();

  const images = await fetchProjectImages(id);

  return (
    <main className="min-w-0">
      {error === "unknown-image" && (
        <p
          role="alert"
          className="mb-8 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          That image could not be deleted — its id did not match any uploaded photo.
        </p>
      )}
      <header className="border-b border-border pb-6">
        <p className="eyebrow text-gold">
          <Link href="/admin" className="transition-colors hover:text-foreground">
            Projects
          </Link>{" "}
          / Edit
        </p>
        <h1 className="mt-2 font-serif text-3xl">{project.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {project.location} · slug <code className="font-mono">{project.slug}</code>
        </p>
      </header>

      <div className="space-y-10 pt-8">
        <ProjectForm mode="edit" project={project} />
        <GalleryManager projectId={project.id} images={images} />
      </div>
    </main>
  );
}
