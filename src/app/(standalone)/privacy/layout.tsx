import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "../../globals.css";

import { inter, instrument } from "@/lib/fonts";
import { cn } from "@/lib/utils";

/**
 * Root shell for the standalone /privacy page (rendered outside the
 * locale-carrying [lang] routes so the store-generated link always works).
 */
export const metadata: Metadata = {
  title: "Privacy Policy — Prince Jahknow Crown Interior Services",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("h-full scroll-smooth", inter.variable, instrument.variable)}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background text-foreground antialiased"
      >
        {children}
      </body>
    </html>
  );
}
