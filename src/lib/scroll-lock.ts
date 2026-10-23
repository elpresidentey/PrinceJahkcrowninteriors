let lockCount = 0;

/**
 * Reference-counted body scroll lock so stacked consumers (intro splash,
 * install prompt) can lock and release independently without one clearing
 * the other's lock.
 */
export function lockScroll() {
  if (typeof document === "undefined") return;
  lockCount += 1;
  document.body.style.overflow = "hidden";
}

export function unlockScroll() {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = "";
  }
}
