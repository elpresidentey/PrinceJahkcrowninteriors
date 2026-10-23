"use client";

import { useEffect } from "react";

/**
 * Registers the service worker that powers the offline shell.
 *
 * Registration is intentionally limited to production builds: a service
 * worker sitting in front of Turbopack's dev server can serve stale chunks
 * and break hot reloading. Run `next build && next start` to test offline
 * behaviour, as recommended in the Next.js PWA guide.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch((error) => {
          console.warn("Service worker registration failed:", error);
        });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
