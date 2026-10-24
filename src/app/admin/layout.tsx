import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "../globals.css";

import { inter, instrument } from "@/lib/fonts";
import { cn } from "@/lib/utils";

/**
 * Root shell for the admin branch. Because public routes live under
 * /app/[lang] (whose layout carries <html>), admin provides its own <html>
 * root so the dashboard stays English-only and locale-prefix free.
 */
export const metadata: Metadata = {
  title: {
    default: "Admin · PJC Interior",
    template: "%s · PJC Admin",
  },
  formatDetection: { telephone: false },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
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
        {/* min-h-screen wrapper keeps the old chrome for nested admin pages */}
        <div className="min-h-screen bg-background text-foreground">{children}</div>
      </body>
    </html>
  );
}
