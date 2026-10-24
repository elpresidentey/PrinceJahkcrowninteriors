import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared";
import { ReloadButton } from "@/components/pwa";
import { BUSINESS_INFO, NAV_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Offline",
  description: "You're offline.",
};

export default function OfflinePage() {
  return (
    <section className="flex min-h-[80svh] flex-col justify-center border-b border-border pb-20 pt-32">
      <Container size="wide" className="px-5 sm:px-8 lg:px-12">
        <p className="eyebrow text-muted-foreground">Offline</p>
        <h1 className="mt-6 max-w-3xl font-serif text-[2.6rem] leading-[1.02] tracking-tight text-foreground sm:text-[3.6rem] md:text-[5rem]">
          You&apos;re offline
        </h1>
        <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
          The connection dropped, but Prince Jahknow Crown Interior Services is still here.
          Reconnect to keep
          browsing, or reach us directly — calls and WhatsApp still work on most
          networks.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ReloadButton />
          <Link href="/" className="link eyebrow text-muted-foreground">
            Go home
          </Link>
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="link eyebrow text-muted-foreground"
          >
            {BUSINESS_INFO.phone}
          </a>
        </div>

        <nav className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link eyebrow text-muted-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  );
}
