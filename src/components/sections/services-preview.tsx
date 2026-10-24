import Link from "next/link";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/shared/project-card";
import { getPublicServices } from "@/lib/services";
import { getDictionaryFor } from "@/i18n";
import { localePath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

interface ServicesPreviewProps {
  lang: Locale;
  limit?: number;
}

/** Service rows are authored in the dashboard, so their names stay as
 *  entered; the band's headings and links are translated. */
export async function ServicesPreview({ lang, limit = 6 }: ServicesPreviewProps) {
  const t = getDictionaryFor(lang);
  const services = (await getPublicServices()).slice(0, limit);

  return (
    <Section>
      <SectionHeading
        eyebrow={t.servicesPreview.eyebrow}
        title={t.servicesPreview.title}
        subtitle={t.servicesPreview.subtitle}
      />

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ProjectCard
            key={service.slug}
            href={`${localePath(lang, "/services")}#${service.slug}`}
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
        <Link href={localePath(lang, "/services")} className="link eyebrow text-foreground">
          {t.servicesPreview.all} ↗
        </Link>
      </div>
    </Section>
  );
}
