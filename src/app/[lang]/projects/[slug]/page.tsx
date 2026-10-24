import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { PageHero, Section, Photo } from "@/components/shared";
import { CTASection } from "@/components/sections";
import { getProjectDetail } from "@/lib/projects";
import { getDictionaryFor, hasLocale } from "@/i18n";
import { localePath } from "@/i18n/config";
import { WHATSAPP_QUOTE_URL } from "@/lib/constants";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionaryFor(lang);
  return {
    title: t.projectDetail.metaTitle,
    description: t.projectDetail.metaDescription,
  };
}

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
}: PageProps<"/[lang]/projects/[slug]">) {
  return (
    <>
      <LocalizedHero params={params} />
      <Suspense fallback={<DetailSkeleton />}>
        <ProjectContent params={params} />
      </Suspense>
      <LocalizedCTA params={params} />
    </>
  );
}

async function LocalizedHero({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionaryFor(lang);

  return (
    <PageHero
      eyebrow={t.projectDetail.eyebrow}
      title={t.projectDetail.title}
      subtitle={t.projectDetail.subtitle}
    />
  );
}

async function ProjectContent({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug, lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionaryFor(lang);
  const detail = await getProjectDetail(slug);
  if (!detail) notFound();

  const { item, gallery } = detail;

  return (
    <Section containerSize="wide">
      <Link
        href={localePath(lang, "/projects")}
        className="eyebrow inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        {t.projectDetail.back}
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
            <dt className="eyebrow text-muted-foreground">{t.projectDetail.location}</dt>
            <dd className="mt-1.5 text-[0.95rem] text-foreground">{item.location}</dd>
          </div>
          {item.style && (
            <div className="border-b border-border py-4">
              <dt className="eyebrow text-muted-foreground">{t.projectDetail.style}</dt>
              <dd className="mt-1.5 text-[0.95rem] text-foreground">{item.style}</dd>
            </div>
          )}
          {item.services.length > 0 && (
            <div className="border-b border-border py-4">
              <dt className="eyebrow text-muted-foreground">{t.projectDetail.scope}</dt>
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
          <p className="eyebrow text-muted-foreground">{t.projectDetail.theWork}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {gallery.map((image, index) => (
              <figure key={image.url + index} className="m-0">
                <Photo
                  src={image.url}
                  alt={
                    image.type === "before"
                      ? t.projectDetail.altBefore.replace("{title}", item.title)
                      : image.type === "after"
                        ? t.projectDetail.altAfter.replace("{title}", item.title)
                        : t.projectDetail.altDetail.replace("{title}", item.title)
                  }
                  ratio="aspect-[4/3]"
                  sizes="(min-width: 640px) 50vw, 100vw"
                  priority={index === 0}
                />
                {image.type !== "gallery" && (
                  <figcaption className="eyebrow mt-2 text-muted-foreground">
                    {image.type === "before"
                      ? t.projectDetail.before
                      : t.projectDetail.after}
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

async function LocalizedCTA({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionaryFor(lang);

  return (
    <CTASection
      eyebrow={t.cta.eyebrow}
      title={t.projectDetail.ctaTitle}
      subtitle={t.projectDetail.ctaSubtitle}
      primaryCTA={{ text: t.cta.quoteCta, href: WHATSAPP_QUOTE_URL }}
      whatsappLabel={t.cta.chatWhatsApp}
      secondaryCTA={{ text: t.cta.viewProjects, href: localePath(lang, "/projects") }}
    />
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
