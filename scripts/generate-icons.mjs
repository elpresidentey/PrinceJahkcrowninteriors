// Generates the PWA raster icon set from the client's brand mark.
//
// Depends on public/logo-mark.webp (produced by scripts/prepare-logo.mjs).
// Run with: node scripts/prepare-logo.mjs && node scripts/generate-icons.mjs

import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MARK = resolve(root, "public/logo-mark.webp");

const INK = "#262521";
const INK_DEEP = "#343434";

/** Ink tile with a soft top-left sheen, matching the site's dark surfaces. */
function tile(size) {
  return sharp({
    create: { width: size, height: size, channels: 4, background: INK },
  }).composite([
    {
      input: Buffer.from(
        `<svg width="${size}" height="${size}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${INK_DEEP}"/><stop offset="100%" stop-color="${INK}"/></linearGradient></defs><rect width="${size}" height="${size}" fill="url(#g)"/></svg>`
      ),
      left: 0,
      top: 0,
    },
  ]);
}

/** `fill` is the share of the tile width the mark occupies. */
async function icon(size, fill, outPath) {
  const markWidth = Math.round(size * fill);
  const mark = await sharp(MARK).resize({ width: markWidth, fit: "inside" }).png().toBuffer();
  const { width: mw = 0, height: mh = 0 } = await sharp(mark).metadata();

  await tile(size)
    .composite([
      {
        input: mark,
        left: Math.round((size - mw) / 2),
        top: Math.round((size - mh) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  console.log(`  ✓ ${outPath.replace(root, "").replace(/^[\\/]/, "")}`);
}

async function main() {
  await mkdir(resolve(root, "public/icons"), { recursive: true });

  console.log("Generating PWA icons…");
  await icon(192, 0.86, resolve(root, "public/icons/icon-192.png"));
  await icon(512, 0.86, resolve(root, "public/icons/icon-512.png"));
  await icon(512, 0.62, resolve(root, "public/icons/maskable-512.png"));
  await icon(180, 0.88, resolve(root, "public/icons/apple-touch-icon.png"));
  await icon(180, 0.88, resolve(root, "src/app/apple-icon.png"));
  await icon(512, 0.8, resolve(root, "src/app/icon.png"));
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
