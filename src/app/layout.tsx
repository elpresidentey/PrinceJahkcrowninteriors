import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

import {
  Header,
  Footer,
  IntroSplash,
} from "@/components/layout";
import { InstallPrompt, OfflineBanner, ServiceWorkerRegister } from "@/components/pwa";
import { WhatsAppButton } from "@/components/shared";
import { cn } from "@/lib/utils";
import { BUSINESS_INFO, META_DEFAULTS, WHATSAPP_QUOTE_MESSAGE } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: META_DEFAULTS.title,
    template: "%s · Prince Jahknow Crown Interior Services",
  },
  description: META_DEFAULTS.description,
  keywords: META_DEFAULTS.keywords.split(", "),
  applicationName: BUSINESS_INFO.name,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: BUSINESS_INFO.shortName,
    statusBarStyle: "default",
  },
  formatDetection: { telephone: true },
  openGraph: {
    type: "website",
    locale: META_DEFAULTS.locale,
    siteName: META_DEFAULTS.siteName,
    title: META_DEFAULTS.title,
    description: META_DEFAULTS.description,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: META_DEFAULTS.title,
    description: META_DEFAULTS.description,
  },
};

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton
          fixed
          phoneNumber={BUSINESS_INFO.whatsapp}
          message={WHATSAPP_QUOTE_MESSAGE}
        />

        <ServiceWorkerRegister />
        <InstallPrompt />
        <OfflineBanner />
        <IntroSplash />
      </body>
    </html>
  );
}
