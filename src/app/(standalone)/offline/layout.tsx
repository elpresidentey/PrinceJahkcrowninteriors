import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "../../globals.css";

import { inter, instrument } from "@/lib/fonts";
import { cn } from "@/lib/utils";

/**
 * Root shell for the standalone /offline fallback (the PWA service worker
 * navigates here directly, locale-free, when a cached page is missing).
 */
export const metadata: Metadata = {
  title: "Offline",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function StandaloneLayout({ children }: { children: ReactNode }) {
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
