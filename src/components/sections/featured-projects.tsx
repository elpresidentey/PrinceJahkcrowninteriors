import Link from "next/link";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/shared/project-card";
import { getFeaturedProjectItems } from "@/lib/projects";
import { getDictionaryFor } from "@/i18n";
import { localePath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

interface FeaturedProjectsProps {
  lang: Locale;
  limit?: number;
}

export async function FeaturedProjects({ lang, limit = 3 }: FeaturedProjectsProps) {
  const t = getDictionaryFor(lang);
  const projects = await getFeaturedProjectItems(limit);

  return (
    <Section background="secondary">
      <SectionHeading
        eyebrow={t.featured.eyebrow}
        title={t.featured.title}
        subtitle={t.featured.subtitle}
      />

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            href={localePath(lang, `/projects/${project.slug}`)}
            title={project.title}
            category={project.category}
            location={project.location}
            style={project.style}
            summary={project.summary}
            image={project.image}
            imageSrc={project.imageSrc}
            alt={project.summary || project.title}
          />
        ))}
      </div>

      <div className="mt-10">
        <Link href={localePath(lang, "/projects")} className="link eyebrow text-foreground">
          {t.featured.all} ↗
        </Link>
      </div>
    </Section>
  );
}
