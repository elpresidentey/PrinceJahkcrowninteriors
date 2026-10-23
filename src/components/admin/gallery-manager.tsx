"use client";

import Image from "next/image";
import { useActionState, useState, useTransition } from "react";

import {
  addGalleryImagesAction,
  deleteProjectImageAction,
  type AdminActionState,
} from "@/app/admin/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProjectImage } from "@/types";

interface GalleryManagerProps {
  projectId: string;
  images: ProjectImage[];
}

const initialState: AdminActionState = {};

/** Same batch-size headroom as the project form (32 MB transport limit). */
const MAX_BATCH_BYTES = 24 * 1024 * 1024;

/** Edit-mode gallery: add photos in batches; each photo removes individually. */
export function GalleryManager({ projectId, images }: GalleryManagerProps) {
  const [state, formAction, uploadPending] = useActionState(addGalleryImagesAction, initialState);
  const [isPending, startTransition] = useTransition();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const files = Array.from(
      (event.currentTarget.elements.namedItem("gallery") as HTMLInputElement).files ?? []
    );
    const total = files.reduce((sum, file) => sum + file.size, 0);
    if (total > MAX_BATCH_BYTES) {
      event.preventDefault();
      setLocalError(
        `That's ${(total / (1024 * 1024)).toFixed(0)} MB of photos in one go. Split them across two uploads.`
      );
    }
  };

  return (
    <section className="space-y-5 border border-border bg-card p-6">
      <h2 className="font-serif text-xl">Gallery ({images.length} photo{images.length === 1 ? "" : "s"})</h2>

      <form action={formAction} onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="id" value={projectId} />
        <Input
          name="gallery"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="max-w-sm border-dashed"
        />
        <Button type="submit" size="default" disabled={uploadPending}>
          {uploadPending ? "Uploading…" : "Add photos"}
        </Button>
      </form>

      {localError && (
        <p role="alert" className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {localError}
        </p>
      )}
      {state.error && (
        <p role="alert" className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-foreground">
          {state.success}
        </p>
      )}

      {images.length > 0 && (
        <ul className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${isPending ? "opacity-50" : ""}`}>
          {images.map((image) => (
            <li key={image.id} className="group relative">
              <div className="relative aspect-[4/3] overflow-hidden border border-border">
                <Image src={image.image_url} alt="Project photo" fill sizes="200px" className="object-cover" unoptimized />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm("Remove this photo from the project?")) return;
                  const formData = new FormData();
                  formData.set("imageId", image.id);
                  formData.set("projectId", projectId);
                  startTransition(async () => {
                    await deleteProjectImageAction(formData);
                  });
                }}
                className="absolute right-2 top-2 bg-ink/80 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
