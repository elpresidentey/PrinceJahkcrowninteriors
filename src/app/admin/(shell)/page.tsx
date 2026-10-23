import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { fetchAdminProjects } from "@/lib/projects";
import { supabaseConfigured } from "@/lib/supabase/client";
import { supabaseConfigured as serverConfigured } from "@/lib/supabase/server";
import { Photo } from "@/components/shared/photo";
import { ProjectActions } from "@/components/admin/project-actions";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Projects · Admin" };

// The dashboard reads live admin data; it must never prerender.
export const instant = false;

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string; error?: string }>;
}) {
  const { setup, error } = await searchParams;
  const dbReady = supabaseConfigured && serverConfigured;
  const projects = dbReady ? await fetchAdminProjects() : [];
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <main className="min-w-0">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="eyebrow text-gold">Dashboard</p>
          <h1 className="mt-2 font-serif text-3xl">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {dbReady
              ? `${projects.length} project${projects.length === 1 ? "" : "s"} · ${featuredCount} on the front page`
              : "Database not connected yet."}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className={buttonVariants({ variant: "gold" })}
        >
          <PlusCircle className="size-4" aria-hidden />
          Add project
        </Link>
      </header>

      <p className="mt-4 text-[0.8rem] text-muted-foreground">
        Also keep the <Link href="/admin/services" className="text-gold transition-colors hover:text-foreground">services list</Link> in shape — it fills the services page, the footer guides and the enquiry form.
      </p>

      {!dbReady && (
        <section className="mt-6 max-w-2xl border border-gold/40 bg-accent/40 p-6 text-sm leading-relaxed text-foreground">
          <p className="font-semibold">Project storage isn&apos;t connected yet.</p>
          <p className="mt-3 text-muted-foreground">
            Until it is, the public site shows the built-in starter portfolio and new
            projects can&apos;t be saved. Follow the storage setup guide in the project
            folder, then reload this page.
          </p>
        </section>
      )}

      {setup === "missing" && (
        <p role="alert" className="mt-6 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          The database is not configured, so that action was blocked. Finish the setup steps above first.
        </p>
      )}

      {error === "unknown-project" && (
        <p role="alert" className="mt-6 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          That deletion could not run — the project id arrived in a form the server did not recognize. Nothing was deleted.
        </p>
      )}
      {error === "unknown-image" && (
        <p role="alert" className="mt-6 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          That image could not be deleted — its id did not match any uploaded photo.
        </p>
      )}

      {dbReady && projects.length === 0 && (
        <section className="mt-10 max-w-xl border border-border bg-card p-10 text-center">
          <h2 className="font-serif text-2xl">No projects yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add the first completed project with its photos. Anything marked featured appears in the
            “Spaces we have transformed” strip on the front page.
          </p>
          <Link
            href="/admin/projects/new"
            className={cn(buttonVariants({ variant: "gold" }), "mt-6")}
          >
            Add project
          </Link>
        </section>
      )}

      {projects.length > 0 && (
        <ul className="mt-8 space-y-0 border-t border-border">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex flex-col gap-4 border-b border-border py-5 sm:flex-row sm:items-center"
            >
              <div className="w-full shrink-0 sm:w-32">
                <Photo
                  src={project.cover_image}
                  alt={project.title}
                  ratio="aspect-[16/10]"
                  sizes="128px"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-lg">{project.title}</h2>
                  {project.featured && (
                    <span className="eyebrow bg-gold/15 px-2 py-1 text-gold">On front page</span>
                  )}
                </div>
                <p className="mt-1 text-[0.8rem] text-muted-foreground">
                  {project.location} · added {formatDate(project.created_at)}
                </p>
              </div>

              <ProjectActions id={project.id} featured={project.featured} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
