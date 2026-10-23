import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { CurrentYear } from "./current-year";
import { BRAND_NAME } from "./logo";
import {
  BUSINESS_INFO,
  NAV_LINKS,
  WHATSAPP_QUOTE_URL,
} from "@/lib/constants";
import { SOCIALS, WHATSAPP_PATH } from "@/lib/socials";
import { SERVICES } from "@/lib/content";

/**
 * The footer brands itself with the complete crest — crown, house, PJC
 * monogram and the "Prince Jahknow Crown / Plaster Decors" banner — exactly
 * as the artwork was drawn, with nothing sliced off.
 */
function BrandCrest() {
  return (
    <Link
      href="/"
      aria-label={`${BRAND_NAME} — home`}
      className="group inline-block transition-opacity hover:opacity-90"
    >
      <Image
        src="/logo.webp"
        alt={`${BRAND_NAME} — ${BUSINESS_INFO.tagline}`}
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

export function Footer() {
  return (
    <footer className="bg-ink text-primary-foreground">
      {/* ------------------------------------------------ main ledger grid */}
      <Container size="wide" className="px-5 sm:px-8 lg:px-12">
        <div className="grid gap-x-10 gap-y-12 py-14 md:grid-cols-2 md:gap-y-14 lg:grid-cols-12 lg:py-16">
          {/* Brand, quote panel, socials */}
          <div className="lg:col-span-4">
            <BrandCrest />

            <div className="mt-8 bg-gold p-6 text-ink">
              <p className="font-serif text-xl leading-snug">
                Get a clear, itemised quote within 7 days.
              </p>
              <Link
                href="/contact"
                className="eyebrow mt-4 inline-block bg-ink px-5 py-3 text-primary-foreground transition-colors hover:bg-charcoal"
              >
                Start a project ↗
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
                aria-label="WhatsApp"
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
            <ColumnHead>Explore</ColumnHead>
            <ul className="mt-5 space-y-3.5">
              {NAV_LINKS.map((link) => (
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
            <ColumnHead>Services</ColumnHead>
            <ul className="mt-5 space-y-3.5">
              {SERVICES.slice(0, 5).map((service) => (
                <li key={service.name}>
                  <Link
                    href="/services"
                    className="link text-[0.95rem] text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="link inline-block pt-1 text-[0.95rem] font-medium text-gold-bright transition-colors hover:text-primary-foreground"
                >
                  All {SERVICES.length} services ↗
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 lg:col-start-9">
            <ColumnHead>Contact</ColumnHead>
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
                  Chat on WhatsApp
                </a>
              </li>
              <li className="group flex items-start gap-3 pt-1 text-[0.95rem] text-primary-foreground/60">
                <Dash className="mt-2.5" />
                {BUSINESS_INFO.address}
              </li>
              <li className="group flex items-center gap-3 text-[0.95rem] text-primary-foreground/60">
                <Dash />
                Mon – Sat, 8am – 6pm
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
              · Lagos, Nigeria
            </p>
            <p className="eyebrow text-primary-foreground/55">
              BN Reg. No. {BUSINESS_INFO.regNo} · CAC, Nigeria
            </p>
            <p className="eyebrow text-primary-foreground/55">
              Serving Lagos &amp; beyond
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
