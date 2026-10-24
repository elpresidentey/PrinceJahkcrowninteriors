import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { CurrentYear } from "./current-year";
import { BRAND_NAME } from "./logo";
import { BUSINESS_INFO, WHATSAPP_QUOTE_URL } from "@/lib/constants";
import { SOCIALS, WHATSAPP_PATH } from "@/lib/socials";
import { SERVICES } from "@/lib/content";
import { getDictionaryFor } from "@/i18n";
import { localePath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

interface FooterProps {
  lang: Locale;
}

/**
 * The footer brands itself with the complete crest — crown, house, PJC
 * monogram and the "Prince Jahknow Crown / Plaster Decors" banner — exactly
 * as the artwork was drawn, with nothing sliced off.
 */
function BrandCrest({ lang, tagline }: { lang: Locale; tagline: string }) {
  const t = getDictionaryFor(lang);
  return (
    <Link
      href={localePath(lang)}
      aria-label={t.footer.homeAria.replace("{brand}", BRAND_NAME)}
      className="group inline-block transition-opacity hover:opacity-90"
    >
      <Image
        src="/logo.webp"
        alt={`${BRAND_NAME} — ${tagline}`}
        width={720}
        height={525}
        className="h-[4.5rem] w-auto md:h-16"
      />
    </Link>
  );
}

/** Small gold rule that opens every column, per the "ledger" system. */
function ColumnHead({ children }: { children: string }) {
  return (
    <>
      <span
        aria-hidden
        className="mb-3 block h-[2px] w-7 bg-gold-bright/70"
      />
      <h2 className="eyebrow text-gold-bright">{children}</h2>
    </>
  );
}

/** Gold-dash list marker used across the ledger columns. */
function Dash({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`h-px w-3 shrink-0 bg-gold-bright/60 transition-colors duration-300 group-hover:bg-gold-bright ${className ?? ""}`}
    />
  );
}

export function Footer({ lang }: FooterProps) {
  const t = getDictionaryFor(lang);

  const navLinks = [
    { label: t.nav.home, href: localePath(lang) },
    { label: t.nav.projects, href: localePath(lang, "/projects") },
    { label: t.nav.services, href: localePath(lang, "/services") },
    { label: t.nav.about, href: localePath(lang, "/about") },
    { label: t.nav.contact, href: localePath(lang, "/contact") },
  ];

  return (
    <footer className="bg-ink text-primary-foreground">
      {/* ------------------------------------------------ main ledger grid */}
      <Container size="wide" className="px-5 sm:px-8 lg:px-12">
        <div className="grid gap-x-10 gap-y-12 py-14 md:grid-cols-2 md:gap-y-14 lg:grid-cols-12 lg:py-16">
          {/* Brand, quote panel, socials */}
          <div className="lg:col-span-4">
            <BrandCrest lang={lang} tagline={t.intro.tagline} />

            <div className="mt-8 bg-gold p-6 text-ink">
              <p className="font-serif text-xl leading-snug">
                {t.footer.quotePanel}
              </p>
              <Link
                href={localePath(lang, "/contact")}
                className="eyebrow mt-4 inline-block bg-ink px-5 py-3 text-primary-foreground transition-colors hover:bg-charcoal"
              >
                {t.footer.startProject}
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center border border-primary-foreground/20 text-primary-foreground/70 transition-colors duration-300 hover:border-gold-bright hover:text-gold-bright"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4 fill-current"
                    aria-hidden
                  >
                    <path
                      d={social.path}
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              ))}
              <a
                href={WHATSAPP_QUOTE_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={t.nav.chatWhatsApp}
                className="flex size-9 items-center justify-center border border-primary-foreground/20 text-primary-foreground/70 transition-colors duration-300 hover:border-gold-bright hover:text-gold-bright"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 fill-current"
                  aria-hidden
                >
                  <path d={WHATSAPP_PATH} />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav
            aria-label="Footer explore"
            className="lg:col-span-2"
          >
            <ColumnHead>{t.footer.explore}</ColumnHead>
            <ul className="mt-5 space-y-3.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link text-[0.95rem] text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div className="lg:col-span-2">
            <ColumnHead>{t.footer.servicesColumn}</ColumnHead>
            <ul className="mt-5 space-y-3.5">
              {SERVICES.slice(0, 5).map((service) => (
                <li key={service.name}>
                  <Link
                    href={`${localePath(lang, "/services")}#${service.slug}`}
                    className="link text-[0.95rem] text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={localePath(lang, "/services")}
                  className="link inline-block pt-1 text-[0.95rem] font-medium text-gold-bright transition-colors hover:text-primary-foreground"
                >
                  {t.footer.allServices.replace("{n}", String(SERVICES.length))}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 lg:col-start-9">
            <ColumnHead>{t.footer.contact}</ColumnHead>
            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="group flex items-center gap-3 text-[0.95rem] text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                >
                  <Dash />
                  {BUSINESS_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="group flex items-center gap-3 text-[0.95rem] text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                >
                  <Dash />
                  {BUSINESS_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_QUOTE_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center gap-3 text-[0.95rem] text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                >
                  <Dash />
                  {t.nav.chatWhatsApp}
                </a>
              </li>
              <li className="group flex items-start gap-3 pt-1 text-[0.95rem] text-primary-foreground/60">
                <Dash className="mt-2.5" />
                {BUSINESS_INFO.address}
              </li>
              <li className="group flex items-center gap-3 text-[0.95rem] text-primary-foreground/60">
                <Dash />
                {t.footer.hours}
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* ---------------------------------------------------- legal band */}
      <div className="bg-primary-foreground/[0.04]">
        <Container size="wide" className="px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-2.5 py-6 md:flex-row md:items-center md:justify-between">
            <p className="eyebrow text-primary-foreground/55">
              © <CurrentYear />{" "}
              <span className="text-gold-bright">
                {BUSINESS_INFO.name.split(" ").slice(0, 3).join(" ")}
              </span>{" "}
              · {t.footer.origin}
            </p>
            <p className="eyebrow text-primary-foreground/55">
              {t.footer.regLine.replace("{reg}", BUSINESS_INFO.regNo)}
            </p>
            <p className="eyebrow text-primary-foreground/55">
              {t.footer.serving}
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
