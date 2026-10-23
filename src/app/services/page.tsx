import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { WHATSAPP_QUOTE_URL } from "@/lib/constants";
import { PageHero, Section, ProjectCard } from "@/components/shared";
import { ProcessSteps, CTASection } from "@/components/sections";
import { cn } from "@/lib/utils";
import { getPublicServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "POP ceilings, feature walls, lighting design, wall finishes and full interior decoration across Lagos.",
};

export default async function ServicesPage() {
  const services = await getPublicServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Finishing that
            <br />
            earns the space
          </>
        }
        subtitle="One team for the whole job — from sculpted ceilings and coves to the last coat of finish. Every service is quoted clearly and delivered on schedule."
      />

      <Section>
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:gap-y-24">
          {services.map((service, index) => (
            <article
              key={service.slug}
              id={service.slug}
              className={cn(
                "group scroll-mt-24",
                index === 0 && "md:col-span-2"
              )}
            >
              <div
                className={cn(
                  index === 0 && "grid gap-7 md:grid-cols-12 md:items-end md:gap-10"
                )}
              >
                <ProjectCard
                  title={service.name}
                  summary={index === 0 ? undefined : service.highlights.join(" · ")}
                  image={service.image}
                  imageSrc={service.imageSrc}
                  alt={service.description}
                  ratio={index === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}
                  sizes={
                    index === 0
                      ? "(min-width: 768px) 62vw, 100vw"
                      : "(min-width: 768px) 46vw, 100vw"
                  }
                  large={index === 0}
                  className={index === 0 ? "md:col-span-7" : undefined}
                />
                <div className={index === 0 ? "md:col-span-5 md:pb-1" : undefined}>
                  <p className="mt-6 max-w-md text-[0.9rem] leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  {service.highlights.length > 0 && (
                    <p className="mt-4 max-w-md text-[0.82rem] leading-relaxed text-muted-foreground">
                      {service.highlights.join(" · ")}
                    </p>
                  )}
                  <a
                    href={WHATSAPP_QUOTE_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="eyebrow mt-7 inline-flex items-center gap-2 text-foreground transition-colors hover:text-gold"
                  >
                    Request this
                    <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <ProcessSteps />

      <CTASection
        title="Not sure which service you need?"
        subtitle="Send a few photos of the space and we'll advise honestly — including what you don't need."
        primaryCTA={{ text: "Ask an expert", href: "/contact" }}
      />
    </>
  );
}
