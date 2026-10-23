import type { Metadata } from "next";
import Link from "next/link";

import { ServiceForm } from "@/components/admin/service-form";

export const metadata: Metadata = { title: "New service · Admin" };

// Behind the guarded shell (which reads cookies); never prerender.
export const instant = false;

export default function NewServicePage() {
  return (
    <main className="min-w-0">
      <header className="border-b border-border pb-6">
        <p className="eyebrow text-gold">
          <Link href="/admin" className="transition-colors hover:text-foreground">
            Dashboard
          </Link>{" "}
          /{" "}
          <Link href="/admin/services" className="transition-colors hover:text-foreground">
            Services
          </Link>{" "}
          / New
        </p>
        <h1 className="mt-2 font-serif text-3xl">Add a service</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Name it, describe it in a sentence or two and add the tile photo.
        </p>
      </header>

      <div className="pt-8">
        <ServiceForm mode="create" />
      </div>
    </main>
  );
}
