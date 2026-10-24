"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

const PLAY_KEY = "pjc:intro-played";
const SHOW_MS = 3400;
const LEAVE_MS = 750;

const WORDS = [
  { text: "Prince", delay: 950 },
  { text: "Jahknow", delay: 1090 },
  { text: "Crown", delay: 1230 },
] as const;

interface IntroSplashProps {
  /** Brand line under the crest, e.g. "Plaster Decors · Est. in Lagos". */
  tagline: string;
  /** Skip hint, e.g. "Press any key to skip". */
  skipHint: string;
}

type Phase = "hidden" | "playing" | "leaving";

/**
 * Mini brand intro — a short cinematic ident that plays once per session:
 * the gold rule draws, the crest rises, the wordmark climbs word by word,
 * and a video-style progress bar runs the timeline. Once through, the
 * overlay dissolves into the page.
 */
export function IntroSplash({ tagline, skipHint }: IntroSplashProps) {
  const [phase, setPhase] = useState<Phase>("hidden");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let hasPlayed = false;
    try {
      hasPlayed = window.sessionStorage.getItem(PLAY_KEY) === "1";
    } catch {
      /* ignore private-mode storage errors */
    }

    if (hasPlayed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    try {
      window.sessionStorage.setItem(PLAY_KEY, "1");
    } catch {
      /* ignore private-mode storage errors */
    }

    // The timers own the whole lifecycle: StrictMode's synthetic unmount must
    // not strand the overlay, so they are never cancelled by effect cleanup —
    // firing against an unmounted component is a harmless no-op.
    lockScroll();
    setPhase("playing");
    setTimeout(() => setPhase("leaving"), SHOW_MS);
    setTimeout(() => {
      setPhase("hidden");
      unlockScroll();
    }, SHOW_MS + LEAVE_MS);
  }, []);

  const skip = useCallback(() => {
    if (phase !== "playing") return;
    setPhase("leaving");
    setTimeout(() => {
      setPhase("hidden");
      unlockScroll();
    }, LEAVE_MS - 200);
  }, [phase]);

  // Press any key to enter the app — modifier-only presses and browser
  // shortcuts (with held Ctrl/Alt) are left untouched.
  useEffect(() => {
    if (phase !== "playing") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (["Shift", "Control", "Alt", "Meta"].includes(event.key)) return;
      skip();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, skip]);

  if (phase === "hidden") return null;

  return (
    <div
      aria-label="Intro"
      className={cn(
        "fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden bg-primary text-ivory",
        phase === "leaving" && "animate-intro-out"
      )}
    >
      {/* Regal hairline frame */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-2 border border-gold-bright/25 md:inset-3"
      />

      <div aria-hidden className="flex flex-col items-center">
        <Image
          src="/logo-mark.webp"
          alt=""
          width={560}
          height={291}
          className="h-20 w-auto animate-reveal [animation-delay:250ms] md:h-24"
        />

        <p className="mt-9 flex flex-wrap items-baseline justify-center gap-x-[0.45em] px-6 font-serif text-[clamp(2.5rem,9vw,6.4rem)] uppercase leading-[0.95] tracking-[-0.01em] text-ivory">
          {WORDS.map((word) => (
            <span key={word.text} className="overflow-hidden">
              <span
                className={cn(
                  "inline-block animate-intro-word",
                  word.text === "Prince" && "[animation-delay:950ms]",
                  word.text === "Jahknow" && "[animation-delay:1090ms]",
                  word.text === "Crown" && "[animation-delay:1230ms]"
                )}
              >
                {word.text}
              </span>
            </span>
          ))}
        </p>

        <span
          aria-hidden
          className="mt-7 block h-px w-28 origin-center animate-intro-line bg-gold-bright/80 [animation-delay:1300ms] md:w-36"
        />

        <p className="eyebrow mt-5 animate-fade-in text-gold-bright [animation-delay:1500ms]">
          {tagline}
        </p>
      </div>

      <button
        type="button"
        onClick={skip}
        className="eyebrow absolute bottom-8 right-5 text-gold/70 transition-colors hover:text-gold md:right-8"
      >
        {skipHint}
      </button>

      {/* Video-style timeline */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-gold-bright/20">
        <span className="absolute inset-y-0 left-0 w-full origin-left animate-intro-progress bg-gold-bright" />
      </div>
    </div>
  );
}
