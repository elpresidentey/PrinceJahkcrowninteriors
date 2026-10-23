"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Share } from "lucide-react";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

/**
 * Compulsory install prompt.
 *
 * Chromium browsers expose `beforeinstallprompt`, which we capture and replay
 * from our own button. Safari/iOS has no such event, so we fall back to a
 * timed hint with the Share → Add to Home Screen instructions.
 *
 * The dialog is presented as an enforced modal: no outside-click or Escape
 * dismissal, no persisted "never ask again" — every visitor answers it once
 * per visit, and it returns on the next visit until the app is installed.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    let showTimer: ReturnType<typeof setTimeout> | undefined;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      showTimer = setTimeout(() => setVisible(true), 2500);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isIOS && isSafari) {
      timer = setTimeout(() => {
        setIosHint(true);
        setVisible(true);
      }, 6000);
    }

    const onInstalled = () => setVisible(false);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      if (showTimer) clearTimeout(showTimer);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    lockScroll();
    dialogRef.current?.focus();

    return () => {
      unlockScroll();
    };
  }, [visible]);

  const dismiss = () => setVisible(false);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setVisible(false);
    else setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex animate-fade-in items-center justify-center bg-ink/50 px-4 backdrop-blur-[2px]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Install Prince Jahknow Crown"
        tabIndex={-1}
        className="relative w-full max-w-sm animate-fade-in-up border border-gold-bright/40 bg-background p-6 pt-8 text-center text-foreground shadow-[0_32px_90px_-32px_rgba(10,20,14,0.75)] outline-none"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-1.5 border border-gold-bright/25"
        />

        <Image
          src="/logo-mark.webp"
          alt=""
          width={560}
          height={291}
          className="mx-auto h-12 w-auto"
        />
        <p className="eyebrow mt-6 text-gold">Prince Jahknow Crown</p>
        <p className="mt-3 font-serif text-[1.65rem] leading-tight">
          Install the app
        </p>

        {iosHint ? (
          <>
            <p className="mx-auto mt-3 max-w-[32ch] text-[0.85rem] leading-relaxed text-muted-foreground">
              Tap <Share className="mx-1 inline size-3.5 align-[-2px]" /> Share,
              then <span className="text-foreground">Add to Home Screen</span> to
              keep us a tap away.
            </p>
            <button
              onClick={dismiss}
              className="eyebrow mt-7 w-full bg-primary py-4 text-primary-foreground transition-colors hover:bg-gold-bright hover:text-ink"
            >
              Got it
            </button>
          </>
        ) : (
          <>
            <p className="mx-auto mt-3 max-w-[32ch] text-[0.85rem] leading-relaxed text-muted-foreground">
              Add Prince Jahknow Crown to your home screen for a faster,
              full-screen experience.
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <button
                onClick={install}
                className="eyebrow w-full bg-primary py-4 text-primary-foreground transition-colors hover:bg-gold-bright hover:text-ink"
              >
                Install app
              </button>
              <button
                onClick={dismiss}
                className="eyebrow py-2 text-muted-foreground transition-colors hover:text-gold"
              >
                Not now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
