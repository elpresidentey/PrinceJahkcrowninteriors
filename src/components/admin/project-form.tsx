"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import {
  createProjectAction,
  updateProjectAction,
  type AdminActionState,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { SERVICES } from "@/lib/content";
import { PROJECT_CATEGORIES, DESIGN_STYLES } from "@/lib/constants";
import type { Project } from "@/types";

interface ProjectFormProps {
  mode: "create" | "edit";
  project?: Project;
}

/** Keep a submit under the transport limit (32 MB), with headroom for
 * multipart overhead — the server re-checks per-file limits anyway. */
const MAX_BATCH_BYTES = 24 * 1024 * 1024;

const formatMB = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(0)} MB`;

const initialState: AdminActionState = {};

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(
    mode === "create" ? createProjectAction : updateProjectAction,
    initialState
  );

  const [coverName, setCoverName] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFileList, setGalleryFileList] = useState<File[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const isEdit = mode === "edit";

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
    setCoverName(file?.name ?? null);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGalleryFileList(event.target.files ? Array.from(event.target.files) : []);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const total =
      (coverFile?.size ?? 0) +
      galleryFileList.reduce((sum, file) => sum + file.size, 0);
    if (total > MAX_BATCH_BYTES) {
      event.preventDefault();
      setLocalError(
        `That's ${formatMB(total)} of photos in one go. Add a few at a time — up to ${formatMB(MAX_BATCH_BYTES)} per save — and add the rest in the gallery manager afterwards.`
      );
    }
  };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="max-w-3xl space-y-8"
    >
      {isEdit && project && <input type="hidden" name="id" value={project.id} />}

      {/* Identity */}
      <section className="space-y-5 border border-border bg-card p-6">
        <h2 className="font-serif text-xl">The basics</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Project title</Label>
            <Input id="title" name="title" required maxLength={120}
              defaultValue={project?.title ?? ""} placeholder="e.g. Penthouse Ceiling" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required
              defaultValue={project?.location ?? ""} placeholder="e.g. Lekki, Lagos" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <NativeSelect id="category" name="category" defaultValue={project?.category ?? "pop-ceilings"}>
              {PROJECT_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <NativeSelect id="style" name="style" defaultValue={project?.style ?? "modern"}>
              {DESIGN_STYLES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </NativeSelect>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="space-y-5 border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Tell the story</h2>
        <div className="space-y-2">
          <Label htmlFor="summary">Short summary (shown on cards)</Label>
          <Input id="summary" name="summary" maxLength={220} defaultValue={project?.summary ?? ""}
            placeholder="One or two lines: what the room needed and what you did." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Full description</Label>
          <Textarea id="description" name="description" rows={6} defaultValue={project?.description ?? ""}
            placeholder="Materials, technique, timeline — write it the way you would tell the client." />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Services involved</legend>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((service) => {
              const checked = project?.services?.includes(service.name) ?? false;
              return (
                <label
                  key={service.name}
                  className="flex cursor-pointer items-center gap-2 border border-input px-3 py-2 text-[0.8rem] transition-colors hover:border-gold has-checked:border-gold has-checked:bg-gold/10"
                >
                  <input type="checkbox" name="services" value={service.name} defaultChecked={checked} className="accent-gold-bright" />
                  {service.name}
                </label>
              );
            })}
          </div>
        </fieldset>
      </section>

      {/* Photos */}
      <section className="space-y-5 border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Photos</h2>

        {project?.cover_image && !(coverPreview && coverName) && (
          <div className="flex items-center gap-4">
            <div className="w-32 shrink-0 relative aspect-[16/10] border border-border overflow-hidden">
              <Image src={project.cover_image} alt="Current cover" fill sizes="128px" className="object-cover" unoptimized />
            </div>
            <p className="text-[0.8rem] text-muted-foreground">Current cover photo</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="cover">
            {isEdit ? "Replace cover (optional)" : "Cover photo (optional)"}
          </Label>
          <Input
            id="cover"
            name="cover"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleCoverChange}
          />
          {coverPreview && (
            <div className="w-32 relative aspect-[16/10] border border-border overflow-hidden">
              <Image src={coverPreview} alt="New cover preview" fill sizes="128px" className="object-cover" unoptimized />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gallery">Gallery photos ({isEdit ? "adds to" : "creates"} the gallery)</Label>
          <Input
            id="gallery"
            name="gallery"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleGalleryChange}
          />
          <p className="text-[0.78rem] text-muted-foreground">
            JPEG, PNG, WebP or AVIF · up to 8 MB each · {isEdit ? "adds to" : "you can add more to"}{" "}
            the gallery later. If you skip the main photo, the first photo here
            becomes the cover.
          </p>
        </div>
      </section>

      {/* Front page */}
      <section className="flex flex-wrap items-center justify-between gap-4 border border-gold/40 bg-accent/30 p-6">
        <div>
          <h2 className="font-serif text-xl">Show on the front page</h2>
          <p className="mt-1 text-[0.8rem] text-muted-foreground">
            Featured projects appear in “Spaces we have transformed” on the homepage, first.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="size-4 accent-gold-bright" />
          Featured
        </label>
      </section>

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

      <div className="flex items-center gap-4 pb-10">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Publish project"}
        </Button>
        <a href="/admin" className="text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground">
          Cancel
        </a>
      </div>
    </form>
  );
}
