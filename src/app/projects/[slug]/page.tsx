import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { PageHero, Section, Photo } from "@/components/shared";
import { CTASection } from "@/components/sections";
import { getProjectDetail } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Project",
  description:
    "A completed POP ceiling, feature wall or interior project by Prince Jahknow Crown Interior Services — photos, location and the scope of work.",
};

// The project data and the params are runtime data; render this route
// blocking instead of against a prerendered shell.
export const instant = false;

/**
 * One finished project. Photos live per row (gallery / before / after), with
 * the cover as the opening frame. Params are runtime data under Cache
 * Components, so param access happens inside Suspense.
 */
export default function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="One project, start to finish"
        subtitle="A real space in Lagos — designed, built and finished by the same hands that will finish yours."
      />

      <Suspense fallback={<DetailSkeleton />}>
        <ProjectContent params={params} />
      </Suspense>

      <CTASection
        title="Want your space here next?"
        subtitle="Tell us what you have in mind and we'll show you what's possible within your budget."
      />
    </>
  );
}

async function ProjectContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getProjectDetail(slug);
  if (!detail) notFound();

  const { item, gallery } = detail;

  return (
    <Section containerSize="wide">
      <Link
        href="/projects"
        className="eyebrow inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        All projects
      </Link>

      {/* Opening frame */}
      <div className="mt-8">
        <Photo
          image={item.image}
          src={item.imageSrc}
          alt={item.summary || item.title}
          ratio="aspect-[4/3] sm:aspect-[16/9]"
          sizes="(min-width: 1024px) 80rem, 100vw"
          priority
        />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="eyebrow text-gold">{item.category}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
            {item.title}
          </h1>
          <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            {item.summary}
          </p>
        </div>

        <dl className="md:col-span-5 md:border-l md:border-border md:pl-10">
          <div className="border-b border-border py-4">
            <dt className="eyebrow text-muted-foreground">Location</dt>
            <dd className="mt-1.5 text-[0.95rem] text-foreground">{item.location}</dd>
          </div>
          {item.style && (
            <div className="border-b border-border py-4">
              <dt className="eyebrow text-muted-foreground">Style</dt>
              <dd className="mt-1.5 text-[0.95rem] text-foreground">{item.style}</dd>
            </div>
          )}
          {item.services.length > 0 && (
            <div className="border-b border-border py-4">
              <dt className="eyebrow text-muted-foreground">Scope</dt>
              <dd className="mt-1.5 flex flex-wrap gap-2">
                {item.services.map((service) => (
                  <span
                    key={service}
                    className="border border-border px-2.5 py-1 text-[0.75rem] text-muted-foreground"
                  >
                    {service}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Gallery — only database-backed projects carry photos */}
      {gallery.length > 0 && (
        <div className="mt-14 border-t border-border pt-12">
          <p className="eyebrow text-muted-foreground">The work</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {gallery.map((image, index) => (
              <figure key={image.url + index} className="m-0">
                <Photo
                  src={image.url}
                  alt={`${item.title} — ${image.type === "before" ? "before finishing" : image.type === "after" ? "after finishing" : "detail"}`}
                  ratio="aspect-[4/3]"
                  sizes="(min-width: 640px) 50vw, 100vw"
                  priority={index === 0}
                />
                {image.type !== "gallery" && (
                  <figcaption className="eyebrow mt-2 text-muted-foreground">
                    {image.type === "before" ? "Before" : "After"}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

function DetailSkeleton() {
  return (
    <Section containerSize="wide">
      <div className="aspect-[4/3] w-full animate-pulse bg-accent sm:aspect-[16/9]" />
      <div className="mt-10 grid gap-10 md:grid-cols-12">
        <div className="h-40 md:col-span-7" />
        <div className="h-40 md:col-span-5" />
      </div>
    </Section>
  );
}
