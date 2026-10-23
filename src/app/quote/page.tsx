import type { Metadata } from "next";
import { PageHero, Section, SectionHeading, FaqList } from "@/components/shared";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { FAQS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Get a quote",
  description:
    "Request a free, itemised POP ceiling or interior decoration quote from Prince Jahknow Crown Interior Services. Clear pricing within a week.",
};

const steps = [
  {
    title: "Tell us about the space",
    description: "Share your location, room sizes and the look you're after.",
  },
  {
    title: "Free site visit",
    description: "We measure, check the ceiling condition and talk through options.",
  },
  {
    title: "Itemised quote",
    description: "A clear breakdown — materials, labour and lighting — within a week.",
  },
  {
    title: "Scheduled start",
    description: "Approve the quote and we lock in a start date that suits you.",
  },
];

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Free quote"
        title="A quote you can plan around"
        subtitle="No vague estimates, no hidden extras. Tell us about your project and we'll send a clear, itemised quote within a week."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="What happens next" title="Four simple steps" className="mb-8" />
            <ol className="border-t border-border">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-6 border-b border-border py-6"
                >
                  <span className="eyebrow shrink-0 pt-1 text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-serif text-xl text-foreground">{step.title}</p>
                    <p className="mt-1 max-w-sm text-[0.9rem] leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-[0.85rem] leading-relaxed text-muted-foreground">
              A quote is just information. Take your time, compare it, ask us
              anything — there&apos;s no obligation and no pressure.
            </p>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm variant="quote" />
          </div>
        </div>
      </Section>

      <Section background="secondary">
        <SectionHeading
          eyebrow="Details"
          title="Before you send"
          subtitle="The questions we get asked most about pricing and process."
        />
        <div className="mt-12 max-w-3xl">
          <FaqList items={FAQS} />
        </div>
      </Section>
    </>
  );
}
