import * as React from "react";
import { cn } from "@/lib/utils";

interface ToneVisualProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Any CSS colour; the flat "material" field standing in for photography. */
  tone?: string;
  /** Tailwind aspect utility, e.g. "aspect-[3/4]". */
  ratio?: string;
  /** Small caption tucked into the corner. */
  index?: string;
  label?: string;
}

/**
 * Flat tonal panel used in place of project/service photography.
 *
 * The reference aesthetic is image-led; until real site photos are available
 * these panels keep the layout honest and on-palette. Swap `ToneVisual` for a
 * `next/image` and the surrounding markup still holds.
 */
export function ToneVisual({
  tone = "var(--greige)",
  ratio = "aspect-[4/5]",
  index,
  label,
  className,
  children,
  ...props
}: ToneVisualProps) {
  return (
    <div
      className={cn("relative overflow-hidden", ratio, className)}
      style={{ backgroundColor: tone }}
      {...props}
    >
      {/* Faint ceiling-cove motif, tonal-on-tonal */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full text-foreground/[0.07]"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="0" cy="200" r="70" />
          <circle cx="0" cy="200" r="120" />
          <circle cx="0" cy="200" r="170" />
        </g>
      </svg>

      {index && (
        <span className="absolute left-4 top-4 eyebrow text-foreground/50">
          {index}
        </span>
      )}
      {label && (
        <span className="absolute bottom-4 left-4 right-4 eyebrow text-foreground/50">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
