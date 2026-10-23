import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-none border px-2.5 py-1 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.16em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground",
        gold: "border-gold-bright/60 bg-gold-bright/15 text-gold",
        secondary: "border-transparent bg-accent text-accent-foreground",
        outline: "border-foreground/25 text-muted-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
