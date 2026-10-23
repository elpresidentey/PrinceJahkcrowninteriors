import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { BUSINESS_INFO, WHATSAPP_QUOTE_URL } from "@/lib/constants";
import { IMAGES } from "@/lib/image-manifest";
import { goldCta } from "@/components/ui/button";
import { StudioStatusSlider } from "./studio-status-slider";

interface HeroProps {
  /** Small label above the headline. */
  discipline?: string;
  /** Supporting paragraph under the headline. */
  intro?: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
}

const particles = [
  { left: "7%", top: "24%", size: "0.3rem", delay: "-2s", duration: "13s" },
  { left: "17%", top: "72%", size: "0.22rem", delay: "-8s", duration: "16s" },
  { left: "35%", top: "15%", size: "0.28rem", delay: "-4s", duration: "14s" },
  { left: "48%", top: "42%", size: "0.2rem", delay: "-10s", duration: "17s" },
  { left: "62%", top: "18%", size: "0.34rem", delay: "-6s", duration: "15s" },
  { left: "76%", top: "33%", size: "0.24rem", delay: "-1s", duration: "12s" },
  { left: "87%", top: "66%", size: "0.3rem", delay: "-11s", duration: "18s" },
  { left: "91%", top: "22%", size: "0.18rem", delay: "-7s", duration: "14s" },
];

export function Hero({
  discipline = "POP ceilings · Feature walls · Interiors",
  intro = "Prince Jahknow Crown Interior Services designs and builds sculpted ceilings, feature walls and complete interiors across Lagos — drawn around your room, built and finished by hand.",
  primaryCTA = { text: "Get a quote", href: WHATSAPP_QUOTE_URL },
  secondaryCTA = { text: "See our work", href: "/projects" },
}: HeroProps) {
  const feature = IMAGES["living-linear-cove"];

  return (
    <section className="relative isolate flex min-h-[43rem] flex-col overflow-hidden bg-primary text-primary-foreground md:min-h-[46rem] lg:min-h-[calc(100svh-1px)]">
      <Image
        src={feature.src}
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={feature.blurDataURL}
        className="object-cover object-[62%_center]"
      />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,38,23,0.98)_0%,rgba(9,38,23,0.89)_38%,rgba(9,38,23,0.42)_70%,rgba(9,38,23,0.2)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary/60 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle, index) => (
          <span
            key={index}
            className="hero-particle absolute rounded-full bg-gold-bright shadow-[0_0_14px_rgba(201,162,51,0.65)]"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>
      {/* Quiet crest signature — held back so photography stays the anchor. */}
      <Image
        src="/logo-mark.webp"
        alt=""
        aria-hidden
        width={560}
        height={335}
        className="pointer-events-none absolute -right-20 top-16 w-[30rem] opacity-[0.06] brightness-0 invert select-none"
      />

      <div className="relative mx-auto grid w-full max-w-[1600px] flex-1 items-end px-5 pb-10 pt-36 sm:px-8 sm:pb-14 md:pt-40 lg:grid-cols-12 lg:px-12 lg:pb-12 xl:pb-14">
        <div className="lg:col-span-7 xl:col-span-6">
          <div className="flex items-center gap-4 animate-fade-in">
            <span aria-hidden className="h-px w-10 bg-gold-bright" />
            <p className="eyebrow text-gold-bright">{discipline}</p>
          </div>

          <h1
            className="mt-6 max-w-4xl font-serif uppercase leading-[0.88] tracking-[-0.025em] text-primary-foreground animate-fade-in-up"
            style={{ fontSize: "clamp(3.25rem, 7.2vw, 7rem)" }}
          >
            A finer finish
            <br className="hidden sm:block" /> {" "}for every room
          </h1>

          <p className="mt-7 max-w-xl text-[1rem] leading-relaxed text-primary-foreground/72 animate-fade-in [animation-delay:120ms] md:text-[1.05rem]">
            {intro}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-in-up [animation-delay:200ms]">
            <a
              href={primaryCTA.href}
              target="_blank"
              rel="noreferrer noopener"
              className={goldCta}
            >
              {primaryCTA.text}
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
                aria-hidden
              />
            </a>
            <Link
              href={secondaryCTA.href}
              className="link eyebrow text-primary-foreground/75 transition-colors hover:text-primary-foreground"
            >
              {secondaryCTA.text} ↗
            </Link>
          </div>

          <p className="eyebrow mt-11 text-primary-foreground/55 animate-fade-in [animation-delay:340ms]">
            Lagos, Nigeria · {BUSINESS_INFO.areasServed.length} areas served
          </p>
        </div>

        <div className="hidden self-end justify-self-end pb-1 lg:col-span-5 lg:flex lg:items-center lg:gap-4 animate-fade-in [animation-delay:450ms]">
          <span className="eyebrow text-primary-foreground/55">Scroll to explore</span>
          <ArrowDown className="size-4 text-gold-bright animate-bounce" aria-hidden />
        </div>
      </div>
      <StudioStatusSlider />
    </section>
  );
}
