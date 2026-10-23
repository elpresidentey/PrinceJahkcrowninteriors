import { describe, expect, it } from "vitest";
import { formatPhoneNumber, generateSlug, whatsappUrl, truncate } from "@/lib/utils";

describe("generateSlug", () => {
  it("slugs plain titles", () => {
    expect(generateSlug("Penthouse Ceiling")).toBe("penthouse-ceiling");
  });

  it("collapses repeats and strips punctuation", () => {
    expect(generateSlug("  Living   Room —  Curated, & Finished! ")).toBe(
      "living-room-curated-finished"
    );
  });

  it("returns an empty string when nothing survives", () => {
    expect(generateSlug("🎉")).toBe("");
  });
});

describe("whatsappUrl", () => {
  it("strips formatting from the number", () => {
    expect(whatsappUrl("+234 810 303 3773")).toMatch(/^https:\/\/wa\.me\/2348103033773$/);
  });

  it("url-encodes the message", () => {
    const url = whatsappUrl("2348103033773", "Quote & more?");
    expect(url).toContain("?text=Quote%20%26%20more%3F");
  });
});

describe("formatPhoneNumber", () => {
  it("formats international numbers", () => {
    expect(formatPhoneNumber("2348103033773")).toBe("+234 810 303 3773");
  });

  it("formats local numbers", () => {
    expect(formatPhoneNumber("08031234567")).toBe("0803 123 4567");
  });

  it("leaves alien input untouched", () => {
    expect(formatPhoneNumber("123")).toBe("123");
  });
});

describe("truncate", () => {
  it("keeps short text whole", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("cuts long text and appends the ellipsis", () => {
    expect(truncate("abcdefghij", 6)).toBe("abcdef...");
  });
});
