import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import "../globals.css";

import { BUSINESS_INFO, WHATSAPP_QUOTE_MESSAGE } from "@/lib/constants";
import { inter, instrument } from "@/lib/fonts";
import {
  Header,
  Footer,
  IntroSplash,
} from "@/components/layout";
import { InstallPrompt, OfflineBanner, ServiceWorkerRegister } from "@/components/pwa";
import { WhatsAppButton } from "@/components/shared";
import { getDictionaryFor, hasLocale } from "@/i18n";
import { LOCALES, LOCALE_HTML_LANG, localePath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { META_DEFAULTS } from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** OpenGraph wants an underscore tag; our segment is the bare language. */
const LOCALE_OG: Record<Locale, string> = {
  en: "en_NG",
  fr: "fr_FR",
  yo: "yo_NG",
  ha: "ha_NG",
  ig: "ig_NG",
};

/** Prefetch/portrait of the shared Viewport export (same for every locale). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f2e3" },
    { media: "(prefers-color-scheme: dark)", color: "#102018" },
  ],
};

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const t = getDictionaryFor(lang);
  const alternateHref = (locale: Locale) => new URL(localePath(locale), siteUrl).toString();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t.meta.title,
      template: `%s · ${BUSINESS_INFO.name}`,
    },
    description: t.meta.description,
    keywords: META_DEFAULTS.keywords.split(", "),
    applicationName: BUSINESS_INFO.name,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: BUSINESS_INFO.shortName,
      statusBarStyle: "default",
    },
    formatDetection: { telephone: true },
    alternates: {
      canonical: alternateHref(lang),
      languages: Object.fromEntries(
        LOCALES.map((locale) => [LOCALE_HTML_LANG[locale], alternateHref(locale)])
      ),
    },
    openGraph: {
      type: "website",
      locale: LOCALE_OG[lang],
      siteName: META_DEFAULTS.siteName,
      title: t.meta.title,
      description: t.meta.description,
      url: alternateHref(lang),
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
    },
  };
}

/**
 * Public root shell — one per locale, so every language gets its own
 * <html lang>, prefetches, hreflang and chrome.
 */
export default async function LangRootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionaryFor(lang);

  const links = [
    { label: t.nav.home, href: localePath(lang) },
    { label: t.nav.projects, href: localePath(lang, "/projects") },
    { label: t.nav.services, href: localePath(lang, "/services") },
    { label: t.nav.about, href: localePath(lang, "/about") },
    { label: t.nav.contact, href: localePath(lang, "/contact") },
  ];

  return (
    <html
      lang={LOCALE_HTML_LANG[lang]}
      data-scroll-behavior="smooth"
      className={cn("h-full scroll-smooth", inter.variable, instrument.variable)}
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
          attributes like data-gr-ext-installed onto <body> before React
          hydrates, which would otherwise surface as a hydration mismatch. */}
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background text-foreground antialiased"
      >
        <Header
          lang={lang}
          links={links}
          menuLabel={t.nav.menu}
          quoteLabel={t.nav.getQuote}
          openMenuAria={t.nav.openMenuAria}
          closeLabel={t.nav.closeMenu}
          closeMenuAria={t.nav.closeMenuAria}
          switcherLabel={t.language.label}
        />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />

        <WhatsAppButton
          fixed
          phoneNumber={BUSINESS_INFO.whatsapp}
          message={WHATSAPP_QUOTE_MESSAGE}
          ariaLabel={t.whatsapp.aria}
        />

        <ServiceWorkerRegister />
        <InstallPrompt strings={t.install} />
        <OfflineBanner banner={t.offline.banner} />
        <IntroSplash tagline={t.intro.tagline} skipHint={t.intro.skip} />
      </body>
    </html>
  );
}
