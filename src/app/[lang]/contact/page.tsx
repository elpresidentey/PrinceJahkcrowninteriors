import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHero, Section, SectionHeading, FaqList } from "@/components/shared";
import { CTASection } from "@/components/sections";
import { goldCta } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUSINESS_INFO, WHATSAPP_QUOTE_URL } from "@/lib/constants";
import { SOCIALS } from "@/lib/socials";
import { FAQS } from "@/lib/content";
import { getDictionaryFor, hasLocale } from "@/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionaryFor(lang);
  return {
    title: t.contact.metaTitle,
    description: t.contact.metaDescription,
  };
}

export default async function ContactPage({
  params,
}: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionaryFor(lang);

  const direct = [
    {
      icon: Phone,
      label: t.contact.labelPhone,
      value: BUSINESS_INFO.phone,
      href: `tel:${BUSINESS_INFO.phone}`,
    },
    {
      icon: Mail,
      label: t.contact.labelEmail,
      value: BUSINESS_INFO.email,
      href: `mailto:${BUSINESS_INFO.email}`,
    },
    {
      icon: MapPin,
      label: t.contact.labelStudio,
      value: BUSINESS_INFO.address,
    },
    {
      icon: Clock,
      label: t.contact.labelHours,
      value: t.footer.hours,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        subtitle={t.contact.subtitle}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* WhatsApp first, then the socials */}
          <div className="lg:col-span-6">
            <div className="relative isolate overflow-hidden bg-primary p-8 text-primary-foreground md:p-10">
              <span aria-hidden className="absolute right-6 top-6 size-16 border border-gold-bright/30" />
              <span className="eyebrow relative text-gold-bright">{t.contact.fastest}</span>
              <h2 className="relative mt-4 font-serif text-[2.1rem] leading-[1.02] tracking-tight md:text-[2.8rem]">
                {t.contact.chatTitle}
              </h2>
              <p className="relative mt-5 max-w-md text-[0.95rem] leading-relaxed text-primary-foreground/70">
                {t.contact.chatBody}
              </p>

              <a
                href={WHATSAPP_QUOTE_URL}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(goldCta, "relative mt-8")}
              >
                <MessageCircle className="size-4" aria-hidden />
                {t.contact.startConversation}
              </a>

              <p className="eyebrow relative mt-6 text-primary-foreground/55">
                {BUSINESS_INFO.phone}
              </p>
            </div>

            <div className="mt-10">
              <h3 className="eyebrow text-gold">{t.contact.followUs}</h3>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex h-full items-center gap-4 border border-border p-5 transition-colors duration-300 hover:border-gold hover:bg-secondary/40"
                    >
                      <span className="flex size-12 shrink-0 items-center justify-center border border-gold/25 bg-accent/25 text-gold transition-colors duration-300 group-hover:border-gold/60 group-hover:bg-accent/60">
                        <svg
                          viewBox="0 0 24 24"
                          className="size-5 fill-current"
                          aria-hidden
                        >
                          <path
                            d={social.path}
                            fillRule="evenodd"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-serif text-lg leading-tight text-foreground">
                          {social.label}
                        </span>
                        <span className="eyebrow mt-1.5 block truncate text-muted-foreground">
                          {social.handle}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The rest, plainly listed */}
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow={t.contact.directEyebrow}
              title={t.contact.directTitle}
              subtitle={t.contact.directSubtitle}
              className="mb-10"
            />

            <dl className="border-t border-border">
              {direct.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-8 border-b border-border py-6"
                >
                  <dt className="eyebrow flex items-center gap-3 text-muted-foreground">
                    <row.icon
                      className="size-4 shrink-0 text-gold/80"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    {row.label}
                  </dt>
                  <dd className="max-w-[22ch] text-right text-[0.95rem] leading-relaxed text-foreground">
                    {row.href ? (
                      <a href={row.href} className="link">
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 max-w-md text-[0.9rem] leading-relaxed text-muted-foreground">
              {t.contact.visitsNote}
            </p>

            <p className="eyebrow mt-8 text-muted-foreground">
              {t.contact.regNote.replace("{reg}", BUSINESS_INFO.regNo)}
            </p>
          </div>
        </div>
      </Section>

      <Section background="secondary">
        <SectionHeading
          eyebrow={t.contact.faqEyebrow}
          title={t.contact.faqTitle}
          subtitle={t.contact.faqSubtitle}
        />
        <div className="mt-12 max-w-3xl">
          <FaqList items={FAQS} />
        </div>
      </Section>

      <CTASection
        eyebrow={t.cta.eyebrow}
        title={t.contact.ctaTitle}
        subtitle={t.contact.ctaSubtitle}
        primaryCTA={{ text: t.contact.ctaButton, href: WHATSAPP_QUOTE_URL }}
        whatsappLabel={t.cta.chatWhatsApp}
        showWhatsApp={false}
      />
    </>
  );
}
