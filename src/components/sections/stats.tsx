import Image from "next/image";
import { cn } from "@/lib/utils";
import { getDictionaryFor } from "@/i18n";
import type { Locale } from "@/i18n/config";

const cellBorders = [
  "border-b border-gold-bright/15 lg:border-b-0",
  "border-b border-l border-gold-bright/15 lg:border-b-0",
  "lg:border-l border-gold-bright/15",
  "border-l border-gold-bright/15",
];

const cellPadding = [
  "",
  "pl-5 sm:pl-7 lg:pl-9",
  "lg:pl-9",
  "pl-5 sm:pl-7 lg:pl-9",
];

export function Stats({ lang }: { lang: Locale }) {
  const t = getDictionaryFor(lang);

  return (
    <section className="relative isolate overflow-hidden border-y border-gold-bright/30 bg-primary text-primary-foreground">
      <Image
        src="/logo-mark.webp"
        alt=""
        aria-hidden
        width={560}
        height={335}
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[120%] w-auto -translate-y-1/2 opacity-[0.035] select-none md:block"
      />

      <dl className="relative mx-auto grid w-full max-w-[1600px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
        {t.stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "group flex flex-col py-9 transition-colors duration-500 hover:bg-primary-foreground/[0.03] sm:py-11 lg:py-14",
              cellBorders[index],
              cellPadding[index]
            )}
          >
            <dt className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="size-1 shrink-0 rotate-45 bg-gold-bright transition-transform duration-500 group-hover:rotate-[135deg]"
              />
              <span className="eyebrow text-gold-bright/85">{stat.label}</span>
            </dt>

            <dd className="mt-7 flex items-end gap-2 sm:mt-9">
              <span className="font-serif text-[clamp(2.9rem,11vw,5.4rem)] leading-[0.78] tracking-[-0.02em] text-primary-foreground">
                {stat.value}
              </span>
              {stat.unit && (
                <span className="mb-1.5 font-sans text-[0.65rem] font-semibold uppercase leading-none tracking-[0.2em] text-gold-bright">
                  {stat.unit}
                </span>
              )}
            </dd>

            <span
              aria-hidden
              className="mt-6 h-px w-8 bg-gold-bright/35 transition-all duration-500 group-hover:w-16 group-hover:bg-gold-bright"
            />

            <p className="mt-4 max-w-[24ch] text-[0.78rem] leading-relaxed text-primary-foreground/60">
              {stat.detail}
            </p>
          </div>
        ))}
      </dl>
    </section>
  );
}
