import type { Dictionary } from "./en";
import { en } from "./en";

/**
 * Yorùbá — DRAFT-PENDING.
 *
 * The i18n system is live, but a human-reviewed Yorùbá translation is not
 * written yet. Until then this dictionary intentionally mirrors `en` so the
 * site never displays machine-garbled copy. Drop a reviewed translation in
 * here and every /yo page picks it up — the structure comes from Dictionary.
 */
export const yo: Dictionary = {
  ...en,
  language: {
    label: "Èdè",
    names: { en: "English", fr: "Français", yo: "Yorùbá", ha: "Hausa", ig: "Igbo" },
  },
};
