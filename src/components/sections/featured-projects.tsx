import Link from "next/link";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/shared/project-card";
import { getFeaturedProjectItems } from "@/lib/projects";

interface FeaturedProjectsProps {
  limit?: number;
}

export async function FeaturedProjects({ limit = 3 }: FeaturedProjectsProps) {
  const projects = await getFeaturedProjectItems(limit);

  return (
    <Section background="secondary">
      <SectionHeading
        eyebrow="Selected work"
        title="Spaces we have transformed"
        subtitle="Recent ceilings, walls and interiors delivered across Lagos."
      />

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            href={`/projects/${project.slug}`}
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
        <Link href="/projects" className="link eyebrow text-foreground">
          View all projects ↗
        </Link>
      </div>
    </Section>
  );
}
