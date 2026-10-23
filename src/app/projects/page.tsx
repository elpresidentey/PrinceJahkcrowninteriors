import type { Metadata } from "next";
import { PageHero, Section, ProjectCard } from "@/components/shared";
import { CTASection } from "@/components/sections";
import { getPublicProjectItems } from "@/lib/projects";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected POP ceilings, feature walls and interior finishing projects delivered across Lagos.",
};

export default async function ProjectsPage() {
  const projects = await getPublicProjectItems();
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Every ceiling has a story"
        subtitle="A portfolio of ceilings, walls and full interiors across Lagos — every one finished by hand and inspected before handover."
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
                href={`/projects/${project.slug}`}
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
        title="Want your space on this page?"
        subtitle="Tell us what you have in mind and we'll show you what's possible within your budget."
      />
    </>
  );
}
