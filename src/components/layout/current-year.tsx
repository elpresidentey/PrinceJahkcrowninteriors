"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Renders the current year on the client only.
 *
 * Reading the clock during prerender is disallowed under Cache Components, so
 * the year is resolved after hydration.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => String(new Date().getFullYear()),
    () => ""
  );

  return <>{year}</>;
}
