"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { goldCta } from "@/components/ui/button";
import { WHATSAPP_QUOTE_URL } from "@/lib/constants";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  showWhatsApp?: boolean;
}

export function CTASection({
  title = "Ready to transform your space?",
  subtitle = "Tell us about the room — we'll come back with honest advice and a clear, itemised quote within a week.",
  primaryCTA = { text: "Get a quote", href: WHATSAPP_QUOTE_URL },
  secondaryCTA = { text: "View projects", href: "/projects" },
  showWhatsApp = true,
}: CTASectionProps) {
  const primaryIsExternal = /^(https?:|mailto:|tel:)/.test(primaryCTA.href);

  return (
    <section className="relative isolate overflow-hidden border-y border-gold-bright/25 bg-primary text-primary-foreground">
      <Image
        src="/logo-mark.webp"
        alt=""
        aria-hidden
        width={560}
        height={335}
        className="pointer-events-none absolute -right-20 -top-20 w-[34rem] opacity-[0.05] brightness-0 invert select-none"
      />
      <Container size="wide" className="relative">
        <div className="grid gap-10 py-20 md:grid-cols-12 md:items-end md:py-24 lg:py-28">
          <div className="md:col-span-8 lg:col-span-7">
            <span className="eyebrow flex items-center gap-3 text-gold-bright">
              <span aria-hidden className="h-px w-9 bg-gold-bright" />
              Start a conversation
            </span>
            <h2 className="mt-6 max-w-3xl font-serif text-[2.55rem] leading-[0.96] tracking-tight text-primary-foreground sm:text-[3.6rem] md:text-[4.5rem]">
              {title}
            </h2>
            <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-primary-foreground/68">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col items-start justify-end gap-6 md:col-span-4 md:items-end">
            {primaryIsExternal ? (
              <a
                href={primaryCTA.href}
                target="_blank"
                rel="noreferrer noopener"
                className={goldCta}
              >
                {primaryCTA.text}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </a>
            ) : (
              <Link href={primaryCTA.href} className={goldCta}>
                {primaryCTA.text}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
            )}
            {showWhatsApp ? (
              <a
                href={WHATSAPP_QUOTE_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="eyebrow inline-flex items-center gap-2 text-primary-foreground/65 transition-colors hover:text-primary-foreground"
              >
                <MessageCircle className="size-4 text-gold-bright" aria-hidden />
                Chat on WhatsApp
              </a>
            ) : (
              <Link
                href={secondaryCTA.href}
                className="link eyebrow text-primary-foreground/65 transition-colors hover:text-primary-foreground"
              >
                {secondaryCTA.text}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
