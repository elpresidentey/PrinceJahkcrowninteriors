import type { Metadata } from "next";
import { MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHero, Section, SectionHeading, FaqList } from "@/components/shared";
import { CTASection } from "@/components/sections";
import { goldCta } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUSINESS_INFO, WHATSAPP_QUOTE_URL } from "@/lib/constants";
import { SOCIALS } from "@/lib/socials";
import { FAQS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Prince Jahknow Crown Interior Services about your ceiling or interior project. Message on WhatsApp, call, email or find us on Instagram and Facebook — we usually reply within a few hours.",
};

const direct = [
  {
    icon: Phone,
    label: "Phone",
    value: BUSINESS_INFO.phone,
    href: `tel:${BUSINESS_INFO.phone}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: BUSINESS_INFO.email,
    href: `mailto:${BUSINESS_INFO.email}`,
  },
  {
    icon: MapPin,
    label: "Studio",
    value: BUSINESS_INFO.address,
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Sat, 8am – 6pm",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your space"
        subtitle="Send photos of the room on WhatsApp — tell us what you have in mind and we'll tell you honestly what it takes."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* WhatsApp first, then the socials */}
          <div className="lg:col-span-6">
            <div className="relative isolate overflow-hidden bg-primary p-8 text-primary-foreground md:p-10">
              <span aria-hidden className="absolute right-6 top-6 size-16 border border-gold-bright/30" />
              <span className="eyebrow relative text-gold-bright">Fastest reply</span>
              <h2 className="relative mt-4 font-serif text-[2.1rem] leading-[1.02] tracking-tight md:text-[2.8rem]">
                Chat on WhatsApp
              </h2>
              <p className="relative mt-5 max-w-md text-[0.95rem] leading-relaxed text-primary-foreground/70">
                Send photos and room sizes, tell us the timeline you are working to,
                and we will come back with a clear, itemised quote within a week.
                No obligation, no pressure.
              </p>

              <a
                href={WHATSAPP_QUOTE_URL}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(goldCta, "relative mt-8")}
              >
                <MessageCircle className="size-4" aria-hidden />
                Start a conversation
              </a>

              <p className="eyebrow relative mt-6 text-primary-foreground/55">
                {BUSINESS_INFO.phone}
              </p>
            </div>

            <div className="mt-10">
              <h3 className="eyebrow text-gold">Follow the studio</h3>
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
              eyebrow="Direct"
              title="Or reach us the old-fashioned way"
              subtitle="Call, email or visit the studio — we are happy to talk it through either way."
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
              Visits are by appointment — message on WhatsApp first so someone is
              expecting you. We work across Lagos, from Lekki to Surulere.
            </p>

            <p className="eyebrow mt-8 text-muted-foreground">
              BN Reg. No. {BUSINESS_INFO.regNo} · CAC, Nigeria
            </p>
          </div>
        </div>
      </Section>

      <Section background="secondary">
        <SectionHeading
          eyebrow="Good to know"
          title="Questions we hear a lot"
          subtitle="Still unsure about something? Message us — there's no such thing as a silly question."
        />
        <div className="mt-12 max-w-3xl">
          <FaqList items={FAQS} />
        </div>
      </Section>

      <CTASection
        title="Prefer a proper quote?"
        subtitle="Send photos and dimensions on WhatsApp — receive a clear, itemised estimate within a week."
        primaryCTA={{ text: "Message us on WhatsApp", href: WHATSAPP_QUOTE_URL }}
        showWhatsApp={false}
      />
    </>
  );
}
