import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IMAGES, type ImageKey } from "@/lib/image-manifest";

interface PhotoProps {
  /** Key into IMAGES (see "@/lib/image-manifest"). */
  image?: ImageKey;
  /** Direct image URL (e.g. a Supabase Storage cover). Takes precedence. */
  src?: string;
  /** Override the manifest's default description. */
  alt?: string;
  /** Tailwind aspect utility, e.g. "aspect-[3/4]". */
  ratio?: string;
  /** Responsive sizes hint; defaults to a three-up grid. */
  sizes?: string;
  priority?: boolean;
  /** Tailwind object-position utility, e.g. "object-top". */
  position?: string;
  className?: string;
  /** Overlays rendered inside the tile after the image (e.g. captions). */
  children?: ReactNode;
}

/**
 * Photography tile in the editorial register: flat frame, no chrome, a slow
 * zoom on hover when an ancestor carries the `group` class. Accepts either
 * an entry of the generated image manifest or a direct URL for photos the
 * client uploads from the admin.
 */
export function Photo({
  image,
  src,
  alt,
  ratio = "aspect-[3/4]",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  position = "object-center",
  className,
  children,
}: PhotoProps) {
  const asset = image ? IMAGES[image] : undefined;
  const resolvedSrc = src ?? asset?.src;
  if (!resolvedSrc) return null;
  const resolvedAlt = alt ?? asset?.alt ?? "";

  return (
    <div className={cn("relative overflow-hidden bg-accent", ratio, className)}>
      <Image
        src={resolvedSrc}
        alt={resolvedAlt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={asset ? "blur" : undefined}
        blurDataURL={asset?.blurDataURL}
        className={cn(
          "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]",
          position
        )}
      />
      {children}
    </div>
  );
}
