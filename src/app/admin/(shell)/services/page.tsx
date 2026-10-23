import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { fetchAdminServices, serviceCover } from "@/lib/services";
import { supabaseConfigured } from "@/lib/supabase/client";
import { supabaseConfigured as serverConfigured } from "@/lib/supabase/server";
import { Photo } from "@/components/shared/photo";
import { ServiceActions } from "@/components/admin/service-actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Services · Admin" };

// The listing reads live admin data; it must never prerender.
export const instant = false;

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const { created, error } = await searchParams;
  const dbReady = supabaseConfigured && serverConfigured;
  const services = dbReady ? await fetchAdminServices() : [];

  return (
    <main className="min-w-0">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="eyebrow text-gold">
            <Link href="/admin" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>{" "}
            / Services
          </p>
          <h1 className="mt-2 font-serif text-3xl">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {dbReady
              ? `${services.length} service${services.length === 1 ? "" : "s"} · what the enquiry form and footer advertise`
              : "Database not connected yet."}
          </p>
        </div>
        {dbReady && (
          <Link href="/admin/services/new" className={buttonVariants({ variant: "gold" })}>
            <PlusCircle className="size-4" aria-hidden />
            Add service
          </Link>
        )}
      </header>

      {created && (
        <p role="status" className="mt-6 border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-foreground">
          Service added — it is already live on the site.
        </p>
      )}
      {error === "unknown-service" && (
        <p role="alert" className="mt-6 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          That deletion could not run — the id arrived in a form the server did not recognize. Nothing was deleted.
        </p>
      )}

      {!dbReady && (
        <section className="mt-6 max-w-2xl border border-gold/40 bg-accent/40 p-6 text-sm leading-relaxed text-foreground">
          <p className="font-semibold">Service storage isn&apos;t connected yet.</p>
          <p className="mt-3 text-muted-foreground">
            Until it is, the public site shows the built-in starter services and edits can&apos;t be
            saved. Follow the storage setup guide in the project folder, then reload this page.
          </p>
        </section>
      )}

      {dbReady && services.length === 0 && (
        <section className="mt-10 max-w-xl border border-border bg-card p-10 text-center">
          <h2 className="font-serif text-2xl">No services yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add the first service with its photo. Hidden services stay saved but leave the site, so
            you can take a whole category off while work is paused.
          </p>
          <Link
            href="/admin/services/new"
            className={cn(buttonVariants({ variant: "gold" }), "mt-6")}
          >
            Add service
          </Link>
        </section>
      )}

      {services.length > 0 && (
        <ul className="mt-8 space-y-0 border-t border-border">
          {services.map((service) => {
            const cover = serviceCover(service);
            return (
              <li
                key={service.id}
                className="flex flex-col gap-4 border-b border-border py-5 sm:flex-row sm:items-center"
              >
                <div className="w-full shrink-0 sm:w-24">
                  <Photo
                    image={cover.image}
                    imageSrc={cover.imageSrc}
                    alt={service.name}
                    ratio="aspect-[4/5]"
                    sizes="96px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-lg">{service.name}</h2>
                    {!service.active && (
                      <span className="eyebrow border border-border px-2 py-1 text-muted-foreground">Hidden</span>
                    )}
                  </div>
                  <p className="mt-1 text-[0.8rem] text-muted-foreground">
                    {(service.highlights?.length ?? 0) > 0
                      ? service.highlights?.join(" · ")
                      : service.description || "—"}
                  </p>
                </div>

                <ServiceActions id={service.id} active={service.active} />
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
