"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";

import {
  createServiceAction,
  updateServiceAction,
  type AdminActionState,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Service } from "@/types";

interface ServiceFormProps {
  mode: "create" | "edit";
  service?: Service;
}

const initialState: AdminActionState = {};

export function ServiceForm({ mode, service }: ServiceFormProps) {
  const [state, formAction, pending] = useActionState(
    mode === "create" ? createServiceAction : updateServiceAction,
    initialState
  );

  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const isEdit = mode === "edit";

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPhotoName(file?.name ?? null);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      {isEdit && service && <input type="hidden" name="id" value={service.id} />}

      {/* Identity */}
      <section className="space-y-5 border border-border bg-card p-6">
        <h2 className="font-serif text-xl">The basics</h2>

        <div className="space-y-2">
          <Label htmlFor="name">Service name</Label>
          <Input
            id="name"
            name="name"
            required
            maxLength={120}
            defaultValue={service?.name ?? ""}
            placeholder="e.g. POP Ceiling Design"
          />
          {isEdit && (
            <p className="text-[0.78rem] text-muted-foreground">
              The web address for this card (<code className="font-mono">#{service?.slug}</code>)
              stays the same, so links to it keep working.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={service?.description ?? ""}
            placeholder="One or two sentences: what you do and who it suits."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="highlights">Highlights (one per line, up to 6)</Label>
          <Textarea
            id="highlights"
            name="highlights"
            rows={4}
            defaultValue={service?.highlights?.join("\n") ?? ""}
            placeholder={"e.g.\nSuspended & drop ceilings\nCove & recessed detail"}
          />
          <p className="text-[0.78rem] text-muted-foreground">
            These appear as the short line under the card title on the services page.
          </p>
        </div>
      </section>

      {/* Photo */}
      <section className="space-y-5 border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Photo</h2>

        {service?.image && !(photoPreview && photoName) && (
          <div className="flex items-center gap-4">
            <div className="w-32 shrink-0 relative aspect-[4/5] border border-border overflow-hidden">
              <Image src={service.image} alt="Current photo" fill sizes="128px" className="object-cover" unoptimized />
            </div>
            <p className="text-[0.8rem] text-muted-foreground">Current photo</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="photo">
            {isEdit ? "Replace photo (optional)" : "Photo"}
          </Label>
          <Input
            id="photo"
            name="photo"
            type="file"
            required={!isEdit}
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handlePhotoChange}
          />
          {photoPreview && (
            <div className="w-32 relative aspect-[4/5] border border-border overflow-hidden">
              <Image src={photoPreview} alt="New photo preview" fill sizes="128px" className="object-cover" unoptimized />
            </div>
          )}
          <p className="text-[0.78rem] text-muted-foreground">
            JPEG, PNG, WebP or AVIF · up to 8 MB · portrait tiles (4:5) look best.
          </p>
        </div>
      </section>

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
          {pending ? "Saving…" : isEdit ? "Save changes" : "Add service"}
        </Button>
        <Link href="/admin/services" className="text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground">
          Cancel
        </Link>
      </div>
    </form>
  );
}
