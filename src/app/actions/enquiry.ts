"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Backup lead capture for the quote / contact forms. The primary conversion
 * path is the WhatsApp deep link, which the visitor's own device opens — this
 * action persists the same details into `enquiries` (service-role key, RLS
 * denies the anon key everything) so that a blocked popup or an abandoned
 * WhatsApp still leaves a lead behind.
 *
 * Because a server action is publicly callable, keep the surface small:
 * validate, clamp lengths, and never trust more than the plain fields.
 */

const PROPERTY_TYPES = [
  "house",
  "apartment",
  "office",
  "shop",
  "restaurant",
  "hotel",
  "church",
  "other",
] as const;

type PropertyTypeValue = (typeof PROPERTY_TYPES)[number];

export interface EnquiryPayload {
  variant: "quote" | "contact";
  name: string;
  phone: string;
  whatsapp?: string;
  location: string;
  service: string;
  propertyType: string;
  details: string;
}

function clamp(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export async function submitEnquiryAction(
  payload: EnquiryPayload
): Promise<{ saved: boolean }> {
  const name = clamp(payload.name, 120);
  const phone = clamp(payload.phone, 40);
  if (name.length < 2 || phone.replace(/\D/g, "").length < 7 || !supabaseAdmin) {
    return { saved: false };
  }

  const propertyType =
    PROPERTY_TYPES.includes(payload.propertyType as PropertyTypeValue)
      ? (payload.propertyType as PropertyTypeValue)
      : "other";

  const row = {
    name,
    phone,
    whatsapp: clamp(payload.whatsapp ?? payload.phone, 40),
    service: clamp(payload.service || (payload.variant === "contact" ? "General enquiry" : "Not sure yet"), 120),
    property_type: propertyType,
    location: clamp(payload.location || "Not provided", 160),
    description: payload.details ? clamp(payload.details, 4000) : null,
    status: "new" as const,
  };

  const { error } = await supabaseAdmin.from("enquiries").insert(row);
  if (error) {
    console.error("Enquiry backup save failed:", error.message);
    return { saved: false };
  }
  return { saved: true };
}
