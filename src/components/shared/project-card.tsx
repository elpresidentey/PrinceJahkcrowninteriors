import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/i18n";
import { Photo } from "./photo";

interface ProjectCardProps {
  /** Destination when the card is clickable; omit for standalone tiles. */
  href?: string;
  title: string;
  category?: string;
  location?: string;
  /** Appended after the location, e.g. "Lagos · Luxury". */
  style?: string;
  /** Label above the title; defaults to `category`. */
  eyebrow?: string;
  summary?: string;
  /** Manifest key for the cover (authored placeholders). */
  image?: Parameters<typeof Photo>[0]["image"];
  /** Direct cover URL (Supabase Storage). Takes precedence over `image`. */
  imageSrc?: string;
  alt?: string;
  ratio?: string;
  sizes?: string;
  /** Renders a small gold "Featured" chip on the tile. */
  featured?: boolean;
  /** Larger type scale for spans-two-columns layouts. */
  large?: boolean;
  className?: string;
}

/**
 * The modern project card: edge-to-edge photography with a dark gradient
 * rising from the base so the name and meta sit directly on the image.
 * The summary and "view" cue slide in from the bottom on hover; on touch
 * devices the essentials (category, name, location) are always visible.
 */
export async function ProjectCard({
  href,
  title,
  category,
  location,
  style,
  eyebrow,
  summary,
  image,
  imageSrc,
  alt,
  ratio = "aspect-[3/4]",
  sizes,
  featured,
  large,
  className,
}: ProjectCardProps) {
  const t = await getDictionary();
  const body = (
    <>
      <Photo
        image={image}
        src={imageSrc}
        alt={alt ?? title}
        ratio={ratio}
        sizes={sizes}
      >
        {/* Dark opacity floor — deep under the caption, clear up top */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-ink/0"
        />
        {/* Gold hairline blooms in on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 border border-primary-foreground/0 transition-colors duration-500 group-hover:border-gold-bright/60"
        />
        {featured && (
          <span className="eyebrow absolute left-4 top-4 border border-gold-bright/40 bg-ink/60 px-2.5 py-1 text-gold-bright">
            {t.card.featured}
          </span>
        )}

        {/* Caption — lives on the photo */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-6">
          {(eyebrow ?? category) && (
            <span className="eyebrow text-gold-bright">{eyebrow ?? category}</span>
          )}
          <h3
            className={cn(
              "mt-2 font-serif leading-tight text-primary-foreground",
              large ? "sm:text-3xl" : "text-2xl"
            )}
          >
            {title}
          </h3>
          {(location ?? style) && (
            <p className="mt-1.5 text-[0.8rem] text-primary-foreground/70">
              {location}
              {location && style ? ` · ${style}` : style}
            </p>
          )}

          {summary && (
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] motion-reduce:transition-none">
              <div className="overflow-hidden">
                <p className="max-w-md pt-3 text-[0.85rem] leading-relaxed text-primary-foreground/85">
                  {summary}
                </p>
                {href && (
                  <span className="eyebrow mt-3 inline-flex items-center gap-2 text-gold-bright">
                    {t.card.view}
                    <ArrowUpRight className="size-3" aria-hidden />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Photo>
    </>
  );

  if (!href) return <div className={cn("group relative block", className)}>{body}</div>;

  return (
    <Link href={href} className={cn("group relative block", className)}>
      {body}
    </Link>
  );
}
