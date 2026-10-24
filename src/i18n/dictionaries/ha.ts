import type { Dictionary } from "./en";
import { en } from "./en";

/**
 * Hausa — DRAFT-PENDING.
 *
 * The i18n system is live, but a human-reviewed Hausa translation is not
 * written yet. Until then this dictionary intentionally mirrors `en` so the
 * site never displays machine-garbled copy. Drop a reviewed translation in
 * here and every /ha page picks it up — the structure comes from Dictionary.
 */
export const ha: Dictionary = {
  ...en,
  language: {
    label: "Harshe",
    names: { en: "English", fr: "Français", yo: "Yorùbá", ha: "Hausa", ig: "Igbo" },
  },
};
