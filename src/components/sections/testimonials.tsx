import { Star } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { TESTIMONIALS } from "@/lib/content";

export function Testimonials() {
  return (
    <Section background="secondary">
      <SectionHeading
        eyebrow="Kind words"
        title="Trusted by homeowners across Lagos"
        subtitle="Real feedback from clients whose spaces we have finished."
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
                aria-label={`Rated ${testimonial.rating} out of 5`}
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
