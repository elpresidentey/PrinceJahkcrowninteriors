import type { Metadata } from "next";
import Link from "next/link";

import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = { title: "New project · Admin" };

// Behind the guarded shell (which reads cookies); never prerender.
export const instant = false;

export default function NewProjectPage() {
  return (
    <main className="min-w-0">
      <header className="border-b border-border pb-6">
        <p className="eyebrow text-gold">
          <Link href="/admin" className="transition-colors hover:text-foreground">
            Projects
          </Link>{" "}
          / New
        </p>
        <h1 className="mt-2 font-serif text-3xl">Add a project</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe the job, upload the photos and decide whether it fronts the site.
        </p>
      </header>

      <div className="pt-8">
        <ProjectForm mode="create" />
      </div>
    </main>
  );
}
