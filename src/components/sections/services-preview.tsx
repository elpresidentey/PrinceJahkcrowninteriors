import Link from "next/link";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/shared/project-card";
import { getPublicServices } from "@/lib/services";

interface ServicesPreviewProps {
  limit?: number;
}

export async function ServicesPreview({ limit = 6 }: ServicesPreviewProps) {
  const services = (await getPublicServices()).slice(0, limit);

  return (
    <Section>
      <SectionHeading
        eyebrow="Services"
        title="What we make"
        subtitle="One team for the whole job — from sculpted ceilings and coves to the last coat of finish."
      />

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ProjectCard
            key={service.slug}
            href={`/services#${service.slug}`}
            title={service.name}
            summary={service.description}
            image={service.image}
            imageSrc={service.imageSrc}
            alt={service.description}
            ratio="aspect-[4/5]"
          />
        ))}
      </div>

      <div className="mt-10">
        <Link href="/services" className="link eyebrow text-foreground">
          All services ↗
        </Link>
      </div>
    </Section>
  );
}
