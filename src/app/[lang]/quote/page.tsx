import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Section, SectionHeading, FaqList } from "@/components/shared";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { FAQS } from "@/lib/content";
import { getDictionaryFor, hasLocale } from "@/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/quote">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionaryFor(lang);
  return {
    title: t.quote.metaTitle,
    description: t.quote.metaDescription,
  };
}

export default async function QuotePage({ params }: PageProps<"/[lang]/quote">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionaryFor(lang);

  return (
    <>
      <PageHero
        eyebrow={t.quote.eyebrow}
        title={t.quote.title}
        subtitle={t.quote.subtitle}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow={t.quote.stepsEyebrow}
              title={t.quote.stepsTitle}
              className="mb-8"
            />
            <ol className="border-t border-border">
              {t.quote.steps.map((step, index) => (
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
              {t.quote.noPressure}
            </p>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm variant="quote" strings={t.form} />
          </div>
        </div>
      </Section>

      <Section background="secondary">
        <SectionHeading
          eyebrow={t.quote.faqEyebrow}
          title={t.quote.faqTitle}
          subtitle={t.quote.faqSubtitle}
        />
        <div className="mt-12 max-w-3xl">
          <FaqList items={FAQS} />
        </div>
      </Section>
    </>
  );
}
