import type { ReactNode } from "react";
import Image from "next/image";
import { Container } from "./container";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Editorial masthead for interior pages. Includes the top padding needed to
 * clear the fixed site header.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: PageHeroProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-border bg-secondary pb-14 pt-32 md:pb-20 md:pt-44",
        className
      )}
    >
      {/* Crest watermark, tinted into the canvas */}
      <Image
        src="/logo-mark.webp"
        alt=""
        aria-hidden
        width={560}
        height={335}
        className="pointer-events-none absolute -right-16 top-8 h-40 w-auto opacity-[0.06] select-none md:top-12 md:h-64"
      />

      <Container size="wide" className="relative px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            {eyebrow && (
              <span className="eyebrow mb-6 flex items-center gap-3 text-gold animate-fade-in">
                <span aria-hidden className="inline-block h-px w-10 bg-gold-bright" />
                {eyebrow}
              </span>
            )}
            <h1 className="font-serif text-[2.8rem] leading-[0.96] tracking-tight text-foreground sm:text-[3.8rem] md:text-[5.25rem] animate-fade-in-up">
              {title}
            </h1>
          </div>
          <div className="flex flex-col justify-end gap-6 md:col-span-4">
            {subtitle && (
              <p className="text-[0.95rem] leading-relaxed text-muted-foreground animate-fade-in-up [animation-delay:120ms]">
                {subtitle}
              </p>
            )}
            {children && (
              <div className="animate-fade-in-up [animation-delay:220ms]">
                {children}
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
