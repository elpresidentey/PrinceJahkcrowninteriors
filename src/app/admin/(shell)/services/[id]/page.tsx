import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchAdminService } from "@/lib/services";
import { ServiceForm } from "@/components/admin/service-form";

export const metadata: Metadata = { title: "Edit service · Admin" };

// Behind the guarded shell (which reads cookies); never prerender.
export const instant = false;

const UUID_PATTERN = /^[0-9a-f-]{36}$/i;

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const service = await fetchAdminService(id);
  if (!service) notFound();

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
          / Edit
        </p>
        <h1 className="mt-2 font-serif text-3xl">{service.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          slug <code className="font-mono">{service.slug}</code>
        </p>
      </header>

      <div className="pt-8">
        <ServiceForm mode="edit" service={service} />
      </div>
    </main>
  );
}
