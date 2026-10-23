"use client";

import Link from "next/link";
import { useTransition } from "react";

import {
  deleteServiceAction,
  toggleServiceActiveAction,
} from "@/app/admin/actions";
import { cn } from "@/lib/utils";

interface ServiceActionsProps {
  id: string;
  active: boolean;
}

/**
 * Row actions for the services table. Destructive and visibility changes
 * run through server actions after an in-page confirm, with pending feedback.
 */
export function ServiceActions({ id, active }: ServiceActionsProps) {
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
          formData.set("active", active ? "false" : "true");
          run(toggleServiceActiveAction, formData);
        }}
        className="text-gold transition-colors hover:text-foreground"
      >
        {active ? "Hide from site" : "Show on site"}
      </button>

      <Link href={`/admin/services/${id}`} className="text-foreground/70 transition-colors hover:text-foreground">
        Edit
      </Link>

      <button
        type="button"
        onClick={() => {
          if (!window.confirm("Delete this service permanently?")) return;
          const formData = new FormData();
          formData.set("id", id);
          run(deleteServiceAction, formData);
        }}
        className="text-destructive transition-colors hover:opacity-80"
      >
        Delete
      </button>
    </div>
  );
}
