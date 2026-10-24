import { Star } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { TESTIMONIALS } from "@/lib/content";
import { getDictionaryFor } from "@/i18n";
import type { Locale } from "@/i18n/config";

/** People write their own names and quotes in the dashboard — those stay as
 *  entered. Only the section chrome is translated. */
export function Testimonials({ lang }: { lang: Locale }) {
  const t = getDictionaryFor(lang);

  return (
    <Section background="secondary">
      <SectionHeading
        eyebrow={t.testimonials.eyebrow}
        title={t.testimonials.title}
        subtitle={t.testimonials.subtitle}
      />

      <div className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex flex-col gap-6 border-t border-gold pt-8 transition-colors duration-500 hover:border-gold-bright"
          >
            <span aria-hidden className="font-serif text-5xl leading-none text-gold-bright">
              &ldquo;
            </span>
            <blockquote className="-mt-4 font-serif text-xl leading-[1.4] text-foreground">
              {testimonial.content}
            </blockquote>
            <figcaption className="mt-auto space-y-3">
              <div
                role="img"
                aria-label={t.testimonials.rated.replace("{rating}", String(testimonial.rating))}
                className="flex gap-1 text-gold-bright"
              >
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star
                    key={index}
                    aria-hidden
                    className="size-3 fill-current"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <p className="text-[0.9rem] text-foreground">{testimonial.name}</p>
              <p className="eyebrow text-gold">
                {testimonial.projectType} · {testimonial.location}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
