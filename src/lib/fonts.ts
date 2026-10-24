import { Inter, Instrument_Serif } from "next/font/google";

/**
 * Shared font instances. Both root layouts (the public [lang] shell and the
 * admin/offline shells) render <html> themselves, so the fonts are declared
 * once here and re-used as class variables on each shell.
 */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
