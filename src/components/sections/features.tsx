import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { TRUST_PILLARS } from "@/lib/content";

export function Features() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Approach"
        title="A quieter kind of luxury"
        subtitle="Considered design, honest materials and a finish that still looks intentional years later."
      />

      <div className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
        {TRUST_PILLARS.map((pillar) => (
          <div
            key={pillar.title}
            className="group flex flex-col gap-6 border-t border-border pt-8 transition-colors duration-500 hover:border-gold/50"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center border border-gold/25 bg-accent/25 text-gold transition-colors duration-500 group-hover:border-gold/60 group-hover:bg-accent/60">
                <pillar.icon
                  className="size-[1.1rem]"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </span>
              <span
                aria-hidden
                className="h-px w-10 bg-border transition-all duration-500 group-hover:w-16 group-hover:bg-gold/50"
              />
            </div>
            <h3 className="font-serif text-2xl text-foreground md:text-3xl">
              {pillar.title}
            </h3>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
