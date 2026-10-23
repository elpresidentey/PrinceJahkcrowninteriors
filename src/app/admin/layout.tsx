import type { ReactNode } from "react";

/**
 * Base chrome for every admin route. The auth gate lives in the `(shell)`
 * group layout so `/admin/login` stays reachable without it.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}
