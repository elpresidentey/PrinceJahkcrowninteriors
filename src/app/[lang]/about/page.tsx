import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Section, SectionHeading, Photo } from "@/components/shared";
import { Features, ProcessSteps, Stats, CTASection } from "@/components/sections";
import { getDictionaryFor, hasLocale } from "@/i18n";
import { WHATSAPP_QUOTE_URL } from "@/lib/constants";
import { localePath } from "@/i18n/config";
import type { ImageKey } from "@/lib/image-manifest";

/** Per-locale metadata for this page. */
export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionaryFor(lang);
  return {
    title: t.about.metaTitle,
    description: t.about.metaDescription,
  };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionaryFor(lang);

  return (
    <>
      <PageHero
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        subtitle={t.about.subtitle}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow={t.about.storyEyebrow}
              title={t.about.storyTitle}
              className="mb-8"
            />
            <div className="max-w-xl space-y-6 text-[0.95rem] leading-relaxed text-muted-foreground">
              <p>{t.about.storyP1}</p>
              <p>{t.about.storyP2}</p>
            </div>
            <blockquote className="mt-10 border-l-2 border-foreground/20 pl-6">
              <p className="font-serif text-2xl italic leading-snug text-foreground">
                &ldquo;{t.about.quote}&rdquo;
              </p>
              <footer className="eyebrow mt-4 text-muted-foreground">
                {t.about.quoteAuthor}
              </footer>
            </blockquote>
          </div>

          <div className="lg:col-span-5">
            <Photo image="living-linear-cove" ratio="aspect-[4/5]" />
          </div>
        </div>
      </Section>

      <Section background="secondary" id="behind-the-build" className="scroll-mt-20">
        <SectionHeading
          eyebrow={t.about.buildEyebrow}
          title={t.about.buildTitle}
          subtitle={t.about.buildSubtitle}
        />

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {buildShots(lang, t.about.buildCaptions).map((shot) => (
            <figure key={shot.image} className="group">
              <Photo
                image={shot.image}
                ratio="aspect-[3/4]"
                sizes="(min-width: 1024px) 23vw, 46vw"
              />
              <figcaption className="eyebrow mt-4 text-muted-foreground">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Stats lang={lang} />
      <Features lang={lang} />
      <ProcessSteps lang={lang} />
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

/** Build shots with captions pulled from the active dictionary. */
function buildShots(_lang: string, captions: string[]): { image: ImageKey; caption: string }[] {
  const images: ImageKey[] = [
    "build-scaffold-01",
    "build-site-01",
    "build-shell-02",
    "build-scaffold-02",
  ];
  return images.map((image, index) => ({ image, caption: captions[index] }));
}
