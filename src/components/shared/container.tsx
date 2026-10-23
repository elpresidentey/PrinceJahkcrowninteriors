import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide" | "full";
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    const sizeClasses = {
      narrow: "max-w-3xl",
      default: "max-w-6xl",
      wide: "max-w-[1600px]",
      full: "max-w-none",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full px-5 sm:px-8 lg:px-12",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = "Container";

export { Container };
