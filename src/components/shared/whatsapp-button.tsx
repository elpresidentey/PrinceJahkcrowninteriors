"use client";

import * as React from "react";
import { WHATSAPP_PATH } from "@/lib/socials";
import { cn, whatsappUrl } from "@/lib/utils";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  fixed?: boolean;
  className?: string;
  /** Accessible name for the floating button ("Chat on WhatsApp"). */
  ariaLabel?: string;
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hello, I'd like to inquire about your services",
  fixed = false,
  className,
  ariaLabel = "Chat on WhatsApp",
}: WhatsAppButtonProps) {
  const chatUrl = whatsappUrl(phoneNumber, message);
  const handleClick = () => {
    window.open(chatUrl, "_blank");
  };

  if (fixed) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "fixed bottom-[5.5rem] right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-gold-bright bg-primary text-gold-bright shadow-[0_12px_28px_rgba(9,37,22,0.3)] transition-all duration-300 hover:scale-105 hover:bg-gold-bright hover:text-ink md:bottom-5 md:right-5",
          className
        )}
        aria-label={ariaLabel}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden>
          <path d={WHATSAPP_PATH} />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
          "eyebrow inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-gold-bright hover:text-ink",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <path d={WHATSAPP_PATH} />
      </svg>
      {ariaLabel}
    </button>
  );
}
