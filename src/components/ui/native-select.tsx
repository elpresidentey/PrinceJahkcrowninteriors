import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Styled native <select> — mirrors Input visually. Used where a plain,
 * always-accessible dropdown is enough (forms, admin).
 */
function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        "h-11 w-full rounded-none border border-input bg-transparent px-3 text-sm outline-none transition-colors focus-visible:border-gold disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { NativeSelect };
