import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-none font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-ink",
        // Gold primary for hero/feature CTAs.
        gold: "bg-gold-bright text-ink hover:bg-primary-foreground hover:text-primary",
        outline:
          "border border-foreground/30 bg-transparent text-foreground hover:border-foreground hover:bg-foreground hover:text-background",
        secondary:
          "bg-accent text-accent-foreground hover:bg-sand",
        ghost: "text-foreground hover:bg-accent",
        glass:
          "border border-foreground/20 bg-transparent text-foreground hover:bg-foreground hover:text-background",
        link: "normal-case tracking-normal text-foreground underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-9 px-4",
        default: "h-11 px-6",
        lg: "h-14 px-9",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Shared recipe for the large gold "eyebrow" call-to-action anchors used
 * across marketing pages (hero, CTA band, contact).
 */
const goldCta =
  "eyebrow group inline-flex items-center gap-3 bg-gold-bright px-7 py-4 text-ink transition-colors duration-300 hover:bg-primary-foreground hover:text-primary";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants, goldCta };
