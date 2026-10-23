import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { PROCESS_STEPS } from "@/lib/constants";

export function ProcessSteps() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Process"
        title="How a project runs"
        subtitle="Six clear steps from the first conversation to a finished, inspected space."
      />

      <ol className="mt-12 grid gap-x-16 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {PROCESS_STEPS.map((step) => (
          <li
            key={step.number}
            className="group flex flex-col gap-4 border-t border-border pt-6 transition-colors hover:border-gold"
          >
            <span className="font-serif text-4xl leading-none text-gold/40 transition-colors duration-500 group-hover:text-gold">
              {step.number}
            </span>
            <h3 className="mt-2 font-serif text-2xl text-foreground">
              {step.title}
            </h3>
            <p className="max-w-xs text-[0.9rem] leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
