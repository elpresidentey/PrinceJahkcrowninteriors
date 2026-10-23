import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Client brand marks.
 *
 * `logo.webp` / `logo-mark.webp` are generated from the supplied artwork by
 * scripts/prepare-logo.mjs (the solid black plate is keyed to transparency so
 * the crest sits on the cream canvas).
 *
 * The emblem is far too detailed to read as a tiny 36px image, so the header
 * pairs a legibly-sized crest with the name set in the display serif — a real
 * lockup rather than a smudge.
 */
const MARK = { src: "/logo-mark.webp", width: 560, height: 335 };

export const BRAND_NAME = "Prince Jahknow Crown Interior Services";
/** Compact display form — the header lockup, where the full legal name wraps. */
export const BRAND_MARK = "Prince Jahknow Crown";
export const BRAND_SHORT = "Plaster Decors";

/** Emblem only (crown + PJC monogram) — for tight spaces like the header. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src={MARK.src}
      alt={`${BRAND_NAME} — ${BRAND_SHORT}`}
      width={MARK.width}
      height={MARK.height}
      priority
      className={cn("h-12 w-auto md:h-[3.35rem]", className)}
    />
  );
}

interface LogoProps {
  className?: string;
  size?: "sm" | "lg";
}

/**
 * Header lockup: crest emblem + the name in the display serif. Legible at a
 * glance and unmistakably on-brand.
 */
export function Logo({ className, size = "sm" }: LogoProps) {
  const tall = size === "lg";
  return (
    <Link
      href="/"
      aria-label={`${BRAND_NAME} — home`}
      className={cn(
        "group inline-flex items-center gap-3.5 transition-opacity hover:opacity-90",
        className
      )}
    >
      <LogoMark className={tall ? "h-14 md:h-16" : "h-11 md:h-12"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "whitespace-nowrap font-serif uppercase tracking-[0.015em] text-primary-foreground",
            tall ? "text-xl md:text-2xl" : "text-[0.83rem] md:text-[0.95rem]"
          )}
        >
          {BRAND_MARK}
        </span>
        <span className="eyebrow mt-1.5 text-gold-bright">{BRAND_SHORT}</span>
      </span>
    </Link>
  );
}

/** Full lockup (emblem + name) — for the footer and other generous spaces. */
export function LogoLockup({ className }: { className?: string }) {
  return <Logo size="lg" className={className} />;
}
