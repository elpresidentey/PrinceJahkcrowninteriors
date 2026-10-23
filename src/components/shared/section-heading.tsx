import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  /** Small uppercase kicker above the title. */
  eyebrow?: string;
  align?: "left" | "center";
}

const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(
  ({ className, title, subtitle, eyebrow, align = "left", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-5",
          align === "center" && "items-center text-center",
          className
        )}
        {...props}
      >
        {eyebrow && (
          <span className="eyebrow flex items-center gap-3 text-gold">
            <span aria-hidden className="inline-block h-px w-8 bg-gold-bright" />
            {eyebrow}
          </span>
        )}
        <div
          className={cn(
            "flex flex-col gap-5 border-t border-border pt-6",
            align === "center" ? "items-center" : "md:flex-row md:items-end md:justify-between"
          )}
        >
          <h2 className="max-w-3xl font-serif text-[2.15rem] leading-[1.02] tracking-tight text-foreground sm:text-[2.8rem] md:text-[3.45rem]">
            {title}
          </h2>
          {subtitle && (
            <p
              className={cn(
                "max-w-md text-[0.95rem] leading-relaxed text-muted-foreground",
                align === "center" && "text-center"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }
);
SectionHeading.displayName = "SectionHeading";

export { SectionHeading };
