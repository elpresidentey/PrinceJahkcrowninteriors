import type { Dictionary } from "./en";
import { en } from "./en";

/**
 * Igbo — DRAFT-PENDING.
 *
 * The i18n system is live, but a human-reviewed Igbo translation is not
 * written yet. Until then this dictionary intentionally mirrors `en` so the
 * site never displays machine-garbled copy. Drop a reviewed translation in
 * here and every /ig page picks it up — the structure comes from Dictionary.
 */
export const ig: Dictionary = {
  ...en,
  language: {
    label: "Asụsụ",
    names: { en: "English", fr: "Français", yo: "Yorùbá", ha: "Hausa", ig: "Igbo" },
  },
};
