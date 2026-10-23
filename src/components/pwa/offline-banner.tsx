"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/**
 * Connectivity indicator. Uses the browser's online/offline events, which is
 * enough to reassure a user on a flaky mobile connection that their work
 * isn't lost. When the connection returns the bar slides away on its own.
 */
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 backdrop-blur-sm animate-fade-in-up"
    >
      <p className="mx-auto flex w-full max-w-[1600px] items-center justify-center gap-3 px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:px-8 lg:px-12">
        <WifiOff className="size-3.5" />
        Offline — we&apos;ll sync when you reconnect
      </p>
    </div>
  );
}
