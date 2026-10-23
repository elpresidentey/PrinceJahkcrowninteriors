// Prepares the client logo:
//   1. keys the solid black background to transparency (public/logo.png)
//   2. derives the emblem-only mark (public/logo-mark.png) for small spaces
//   3. renders previews on ivory and ink so the result can be judged
//
// Run with: node scripts/prepare-logo.mjs

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(root, "assets/brand/pjc-logo.jpg");
const tmp = process.env.TEMP ?? "/tmp";

const LO = 14; // at or below this luminance -> fully transparent
const HI = 64; // at or above -> fully opaque
// The "Prince Jahknow Crown" banner plate begins at row 536 of the trimmed
// 674px-tall lockup (0.7953). Cropping there keeps the full crest — crown,
// house, PJC letters and brush — and stops exactly where the artwork's own
// banner overlaps it, instead of slicing mid-letter (the old 0.74).
const EMBLEM_RATIO = 0.7953;
const PADDING = 48; // keep the crest clear of its frame at small display sizes

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const v = Math.max(data[i], data[i + 1], data[i + 2]);
  data[i + 3] = v <= LO ? 0 : v >= HI ? 255 : Math.round(((v - LO) / (HI - LO)) * 255);
}

const keyed = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png()
  .trim({ threshold: 1 })
  .toBuffer();

const { width: kw = 0, height: kh = 0 } = await sharp(keyed).metadata();
console.log(`keyed logo: ${kw}x${kh}`);

const paddedLogo = await sharp(keyed)
  .extend({
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    right: PADDING,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await sharp(paddedLogo)
  .resize({ width: 720, fit: "inside" })
  .webp({ quality: 90, alphaQuality: 100, effort: 6 })
  .toFile(resolve(root, "public/logo.webp"));

const emblemCrop = await sharp(keyed)
  .extract({ left: 0, top: 0, width: kw, height: Math.round(kh * EMBLEM_RATIO) })
  .trim({ threshold: 1 })
  .extend({
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    right: PADDING,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

/**
 * The banner overlaps the letter strokes in the source artwork, so the
 * emblem's flat bottom edge would chop them mid-stroke. Dissolve that edge
 * with a short alpha ramp so the mark fades out like a vignette instead of
 * reading as a bad crop, wherever it is placed on cream or ink.
 */
const FADE = 64; // px of the emblem's content area that fades out
const fadedRaw = await sharp(emblemCrop).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const fr = fadedRaw.info;
const contentBottom = fr.height - PADDING; // trim stopped flush; padding added after
for (let y = Math.max(0, contentBottom - FADE); y < contentBottom; y++) {
  const ramp = (contentBottom - y) / FADE; // 1 -> 0 across the fade band
  for (let x = 0; x < fr.width; x++) {
    const i = (y * fr.width + x) * 4;
    fadedRaw.data[i + 3] = Math.round(fadedRaw.data[i + 3] * ramp);
  }
}
const emblemFaded = await sharp(fadedRaw.data, {
  raw: { width: fr.width, height: fr.height, channels: 4 },
})
  .png()
  .toBuffer();

const emblem = await sharp(emblemFaded)
  .resize({ width: 560, fit: "inside" })
  .webp({ quality: 90, alphaQuality: 100, effort: 6 })
  .toBuffer();

const { width: ew = 0, height: eh = 0 } = await sharp(emblem).metadata();
console.log(`emblem mark: ${ew}x${eh}`);
await sharp(emblem).toFile(resolve(root, "public/logo-mark.webp"));

async function preview(input, label, out, bg = "#f8f6e8", w = 900) {
  const buf = await sharp(input).resize({ width: w, fit: "inside" }).png().toBuffer();
  const m = await sharp(buf).metadata();
  await sharp({ create: { width: w, height: m.height + 80, channels: 4, background: bg } })
    .composite([{ input: buf, left: Math.round((w - m.width) / 2), top: 40 }])
    .jpeg({ quality: 90 })
    .toFile(out);
  console.log(`${label}: ${out}`);
}

await preview(keyed, "logo on ivory ", resolve(tmp, "logo-on-ivory.jpg"));
await preview(emblem, "emblem on ivory", resolve(tmp, "logo-mark-on-ivory.jpg"));
await preview(emblem, "emblem on ink  ", resolve(tmp, "logo-mark-on-ink.jpg"), "#262521", 512);
