"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/shared/container";
import { DEFAULT_LOCALE, isLocale, localePath } from "@/i18n/config";

/**
 * 404 for the public site. It sits inside the [lang] branch, but Next renders
 * not-found without route params — so the locale is read off the pathname
 * (client-side) and every link stays inside the visitor's language.
 */
export default function NotFoundPage() {
  return <NotFoundContent />;
}

export function NotFoundContent() {
  const pathname = usePathname();
  const first = pathname.split("/")[1] ?? "";
  const locale = isLocale(first) ? first : DEFAULT_LOCALE;

  return (
    <section className="flex min-h-[80svh] flex-col justify-center border-b border-border pb-20 pt-32">
      <Container size="wide" className="px-5 sm:px-8 lg:px-12">
        <p className="eyebrow text-muted-foreground">Error 404</p>
        <h1 className="mt-6 font-serif text-[4rem] leading-[0.9] tracking-tight text-foreground sm:text-[7rem] md:text-[10rem]">
          Not found
        </h1>
        <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
          We couldn&apos;t find that page. It may have moved, or the link was
          mistyped.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href={localePath(locale)}
            className="link eyebrow text-foreground"
          >
            Back home ↗
          </Link>
          <Link
            href={localePath(locale, "/projects")}
            className="link eyebrow text-muted-foreground"
          >
            Browse projects
          </Link>
        </div>
      </Container>
    </section>
  );
}
