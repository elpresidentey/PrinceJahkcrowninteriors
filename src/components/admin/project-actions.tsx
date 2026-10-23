"use client";

import Link from "next/link";
import { useTransition } from "react";

import {
  deleteProjectAction,
  toggleFeaturedAction,
} from "@/app/admin/actions";
import { cn } from "@/lib/utils";

interface ProjectActionsProps {
  id: string;
  featured: boolean;
}

/**
 * Row actions for the projects table. Destructive and flag changes run
 * through server actions after an in-page confirm, with pending feedback.
 */
export function ProjectActions({ id, featured }: ProjectActionsProps) {
  const [isPending, startTransition] = useTransition();

  const run = (fn: (formData: FormData) => Promise<void>, formData: FormData) => {
    startTransition(async () => {
      await fn(formData);
    });
  };

  return (
    <div className={cn("flex items-center justify-end gap-4 text-[0.8rem]", isPending && "opacity-50")}>
      <button
        type="button"
        onClick={() => {
          const formData = new FormData();
          formData.set("id", id);
          formData.set("featured", featured ? "false" : "true");
          run(toggleFeaturedAction, formData);
        }}
        className="text-gold transition-colors hover:text-foreground"
      >
        {featured ? "Remove from front page" : "Feature on front page"}
      </button>

      <Link href={`/admin/projects/${id}`} className="text-foreground/70 transition-colors hover:text-foreground">
        Edit
      </Link>

      <button
        type="button"
        onClick={() => {
          if (!window.confirm("Delete this project permanently? Its photos are removed too.")) return;
          const formData = new FormData();
          formData.set("id", id);
          run(deleteProjectAction, formData);
        }}
        className="text-destructive transition-colors hover:opacity-80"
      >
        Delete
      </button>
    </div>
  );
}
