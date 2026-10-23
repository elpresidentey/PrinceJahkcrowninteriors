import Link from "next/link";
import { Container } from "@/components/shared";
import { NAV_LINKS } from "@/lib/constants";

export default function NotFound() {
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
          <Link href="/" className="link eyebrow text-foreground">
            Back home ↗
          </Link>
          <Link href="/projects" className="link eyebrow text-muted-foreground">
            Browse projects
          </Link>
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
