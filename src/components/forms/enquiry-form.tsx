"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { cn, whatsappUrl } from "@/lib/utils";
import { BUSINESS_INFO } from "@/lib/constants";
import { SERVICES } from "@/lib/content";
import { submitEnquiryAction } from "@/app/actions/enquiry";
import type { Dictionary } from "@/i18n/dictionaries/en";

interface EnquiryFormProps {
  /** "quote" asks for a service + project details; "contact" is a short message. */
  variant?: "quote" | "contact";
  className?: string;
  /** Translated labels/placeholders/messages from the active dictionary. */
  strings: Dictionary["form"];
}

const PROPERTY_TYPES = [
  { value: "house", label: "house" },
  { value: "apartment", label: "apartment" },
  { value: "office", label: "office" },
  { value: "shop", label: "shop" },
  { value: "restaurant", label: "restaurant" },
  { value: "hotel", label: "hotel" },
  { value: "church", label: "church" },
  { value: "other", label: "other" },
];

export function EnquiryForm({ variant = "quote", className, strings: t }: EnquiryFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("other");
  const [service, setService] = useState("");
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);
  const [missing, setMissing] = useState(false);
  /** Last valid WhatsApp link — kept so the success note can offer a real link. */
  const [waLink, setWaLink] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setMissing(true);
      return;
    }
    setMissing(false);

    const lines = [
      variant === "quote"
        ? "New quote request from the Prince Jahknow Crown Interior Services website"
        : "New message from the Prince Jahknow Crown Interior Services website",
      `Name: ${name}`,
      `Phone: ${phone}`,
    ];
    if (location) lines.push(`Location: ${location}`);
    if (variant === "quote") {
      if (propertyType && propertyType !== "other")
        lines.push(`Property: ${propertyType}`);
      if (service) lines.push(`Service: ${service}`);
    }
    if (details) lines.push(`Details: ${details}`);

    const url = whatsappUrl(BUSINESS_INFO.whatsapp, lines.join("\n"));
    setWaLink(url);

    // Backup record on the server (service key, RLS-denied to anon). Fired
    // AFTER `window.open` on purpose: opening the popup must stay inside the
    // synchronous user gesture or some mobile browsers will block it.
    //
    // The honeypot says a bot filled the form — save nothing, open nothing,
    // and just let the bot believe it succeeded.
    const honeypot = event.currentTarget.elements.namedItem(
      "company"
    ) as HTMLInputElement | null;
    if (!honeypot?.value) {
      void submitEnquiryAction({
        variant,
        name,
        phone,
        location,
        propertyType,
        service,
        details,
      }).catch(() => {
        /* WhatsApp is the primary path; a failed backup save is logged server-side */
      });

      const popup = window.open(url, "_blank", "noopener");
      if (!popup) {
        // Popup blocked → fall back to a same-tab navigation, which browsers
        // never block. The site loses the visitor tabs, but never the lead:
        // the details are already saved in the database.
        window.location.href = url;
        return;
      }
    }

    setSent(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("border-t border-border bg-bone px-6 md:px-8", className)}
    >
      <div className="border-b border-border py-7">
        <span className="eyebrow flex items-center gap-3 text-gold">
          <span aria-hidden className="h-px w-8 bg-gold-bright" />
          {t.eyebrow}
        </span>
        <p className="mt-3 max-w-md font-serif text-2xl leading-tight text-foreground">
          {t.headline}
        </p>
      </div>

      <div className="grid gap-x-10 gap-y-7 py-8 md:grid-cols-2">
        {/* Honeypot — visually hidden, bots that fill it silently no-op. */}
        <div aria-hidden="true" className="hidden">
          <label>
            Company
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </label>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="name">{t.fullName}</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t.yourName}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="phone">{t.phone}</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="080 0000 0000"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="location">{t.location}</Label>
          <Input
            id="location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder={t.locationPlaceholder}
          />
        </div>

        {variant === "quote" && (
          <>
            <div className="space-y-2.5">
              <Label htmlFor="property-type">{t.propertyType}</Label>
              <NativeSelect
                id="property-type"
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
              >
                {PROPERTY_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {t.options[item.value as keyof typeof t.options]}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="service">{t.service}</Label>
              <NativeSelect
                id="service"
                value={service}
                onChange={(event) => setService(event.target.value)}
              >
                <option value="">{t.notSure}</option>
                {SERVICES.map((item) => (
                  <option key={item.slug} value={item.name}>
                    {item.name}
                  </option>
                ))}
                <option value="Something else">{t.somethingElse}</option>
              </NativeSelect>
            </div>
          </>
        )}

        <div className="space-y-2.5 md:col-span-2">
          <Label htmlFor="details">
            {variant === "quote" ? t.messageQuote : t.messageContact}
          </Label>
          <Textarea
            id="details"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            rows={4}
            placeholder={
              variant === "quote" ? t.placeholderQuote : t.placeholderContact
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 border-t border-border py-8 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant="default" size="lg">
          {variant === "quote" ? t.submitQuote : t.submitContact}
        </Button>
        <p className="text-[0.8rem] text-muted-foreground">
          {t.whatsappNote}
        </p>
      </div>

      {missing && !sent && (
        <p role="alert" className="border-t border-border py-5 text-[0.85rem] text-destructive">
          {t.missing}
        </p>
      )}

      {sent && (
        <p role="status" className="border-t border-border py-5 text-[0.85rem] text-clay">
          {t.sentTitle}{" "}
          {waLink ? (
            <a href={waLink} target="_blank" rel="noreferrer noopener" className="underline">
              {t.sentLink}
            </a>
          ) : (
            t.sentFallback
          )}{" "}
          {t.sentDirect.replace("{phone}", BUSINESS_INFO.phone)}
        </p>
      )}
    </form>
  );
}
