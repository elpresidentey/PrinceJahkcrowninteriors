import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { PROCESS_STEPS } from "@/lib/constants";
import { getDictionaryFor } from "@/i18n";
import type { Locale } from "@/i18n/config";

export function ProcessSteps({ lang }: { lang: Locale }) {
  const t = getDictionaryFor(lang);

  return (
    <Section>
      <SectionHeading
        eyebrow={t.process.eyebrow}
        title={t.process.title}
        subtitle={t.process.subtitle}
      />

      <ol className="mt-12 grid gap-x-16 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Numbers stay ledger-style from PROCESS_STEPS; copy comes from the
            dictionary, index-aligned (both lists have six steps). */}
        {t.process.steps.map((step, index) => (
          <li
            key={step.title}
            className="group flex flex-col gap-4 border-t border-border pt-6 transition-colors hover:border-gold"
          >
            <span className="font-serif text-4xl leading-none text-gold/40 transition-colors duration-500 group-hover:text-gold">
              {PROCESS_STEPS[index].number}
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
