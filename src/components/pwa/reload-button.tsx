"use client";

import { Button } from "@/components/ui/button";

/** Client-only reload affordance for the offline fallback page. */
export function ReloadButton({ className }: { className?: string }) {
  return (
    <Button
      variant="default"
      className={className}
      onClick={() => window.location.reload()}
    >
      Try again
    </Button>
  );
}
