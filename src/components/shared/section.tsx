import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  containerSize?: "default" | "narrow" | "wide" | "full";
  spacing?: "default" | "tight" | "loose";
  background?: "default" | "secondary" | "muted";
  /** Render children full-bleed, outside the container. */
  bleed?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      containerSize = "default",
      spacing = "default",
      background = "default",
      bleed = false,
      children,
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      tight: "py-12 md:py-16",
      default: "py-16 md:py-24",
      loose: "py-24 md:py-32",
    };

    const backgroundClasses = {
      default: "bg-background",
      secondary: "bg-secondary",
      muted: "bg-accent",
    };

    return (
      <section
        ref={ref}
        className={cn(
          spacingClasses[spacing],
          backgroundClasses[background],
          className
        )}
        {...props}
      >
        {bleed ? children : <Container size={containerSize}>{children}</Container>}
      </section>
    );
  }
);
Section.displayName = "Section";

export { Section };
