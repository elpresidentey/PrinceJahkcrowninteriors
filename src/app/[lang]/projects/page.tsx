import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Section, ProjectCard } from "@/components/shared";
import { CTASection } from "@/components/sections";
import { getPublicProjectItems } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { WHATSAPP_QUOTE_URL } from "@/lib/constants";
import { getDictionaryFor, hasLocale } from "@/i18n";
import { localePath } from "@/i18n/config";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionaryFor(lang);
  return {
    title: t.projectsIndex.metaTitle,
    description: t.projectsIndex.metaDescription,
  };
}

export default async function ProjectsPage({
  params,
}: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionaryFor(lang);
  const projects = await getPublicProjectItems();

  return (
    <>
      <PageHero
        eyebrow={t.projectsIndex.eyebrow}
        title={t.projectsIndex.title}
        subtitle={t.projectsIndex.subtitle}
      />

      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.slug}
              id={project.slug}
              className={cn(
                "group scroll-mt-24",
                index === 0 && "sm:col-span-2 lg:col-span-2"
              )}
            >
              <ProjectCard
                href={localePath(lang, `/projects/${project.slug}`)}
                title={project.title}
                category={project.category}
                location={project.location}
                style={project.style}
                summary={project.summary}
                image={project.image}
                imageSrc={project.imageSrc}
                alt={project.summary || project.title}
                featured={project.featured}
                large={index === 0}
                ratio={
                  index === 0 ? "aspect-[4/3] sm:aspect-[16/9]" : "aspect-[3/4]"
                }
                sizes={
                  index === 0
                    ? "(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw"
                    : "(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 100vw"
                }
              />
            </article>
          ))}
        </div>
      </Section>

      <CTASection
        eyebrow={t.cta.eyebrow}
        title={t.projectsIndex.ctaTitle}
        subtitle={t.projectsIndex.ctaSubtitle}
        primaryCTA={{ text: t.cta.quoteCta, href: WHATSAPP_QUOTE_URL }}
        whatsappLabel={t.cta.chatWhatsApp}
        secondaryCTA={{ text: t.cta.viewProjects, href: localePath(lang, "/services") }}
      />
    </>
  );
}
