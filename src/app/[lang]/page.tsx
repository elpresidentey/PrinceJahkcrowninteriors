import {
  Hero,
  Stats,
  Features,
  ServicesPreview,
  FeaturedProjects,
  ProcessSteps,
  Testimonials,
  CTASection,
} from "@/components/sections";
import { WHATSAPP_QUOTE_URL } from "@/lib/constants";
import { getDictionaryFor, hasLocale } from "@/i18n";
import { localePath } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionaryFor(lang);

  return (
    <>
      <Hero lang={lang} />
      <Stats lang={lang} />
      <Features lang={lang} />
      <ServicesPreview lang={lang} />
      <FeaturedProjects lang={lang} />
      <ProcessSteps lang={lang} />
      <Testimonials lang={lang} />
      <CTASection
        eyebrow={t.cta.eyebrow}
        title={t.cta.title}
        subtitle={t.cta.subtitle}
        primaryCTA={{ text: t.cta.quoteCta, href: WHATSAPP_QUOTE_URL }}
        whatsappLabel={t.cta.chatWhatsApp}
        secondaryCTA={{ text: t.cta.viewProjects, href: localePath(lang, "/projects") }}
      />
    </>
  );
}
