import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, LOCALES, localeFromHeader } from "@/i18n/config";

/**
 * Locale prefix routing for the public site.
 *
 * Every public page lives under /en /fr /yo /ha /ig. A request without a
 * prefix (e.g. "/projects") is redirected to the visitor's best language —
 * from Accept-Language, falling back to English. Paths that must stay
 * unprefixed (admin, PWA artifacts, sitemap, media) pass straight through.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (pathnameHasLocale) return;

  const locale = localeFromHeader(request.headers.get("accept-language"));
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    /*
     * Run on everything except:
     * - Next internals and API/admin/server-action paths
     * - metadata and PWA artifacts (manifest, service worker, robots, sitemap)
     * - media files (images, icons, fonts) that carry an extension
     */
    "/((?!_next|api|admin|offline|manifest\\.webmanifest|sw\\.js|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
  ],
};
