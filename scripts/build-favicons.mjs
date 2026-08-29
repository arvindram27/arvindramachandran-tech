// Regenerates the full cross-platform favicon/icon set from public/favicon.svg
// (the PAL sparkline mark — same motif as the header icon).
//
// Outputs (all into public/):
//   favicon.ico                        (16+32+48 embedded)  desktop/legacy
//   favicon-16x16.png / -32x32.png     desktop tabs
//   apple-touch-icon.png (180)         iOS/Safari home screen
//   android-chrome-192x192.png         Android Chrome (manifest)
//   android-chrome-512x512.png         Android Chrome (manifest)
//   android-chrome-maskable-*.png      Android adaptive icons (artwork inset to safe zone)
//   site.webmanifest                   Android install metadata
//
// NOTE: manifest name/short_name mirror src/data/site.ts — update both together.
// Run via: npm run favicons

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const srcSvg = path.join(publicDir, "favicon.svg");

const PAPER = "#FAFAF7";
const MARK_VIEWBOX = 64;

function densityFor(pixelSize) {
  return Math.ceil((72 * pixelSize) / MARK_VIEWBOX);
}

async function renderSquare(size, outPath) {
  await sharp(srcSvg, { density: densityFor(size) })
    .resize(size, size)
    .png()
    .toFile(outPath);
}

async function renderMaskable(size, outPath) {
  const inner = Math.round(size * 0.7);
  const mark = await sharp(srcSvg, { density: densityFor(inner) })
    .resize(inner, inner)
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: PAPER } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(outPath);
}

async function main() {
  const squares = [
    ["favicon-16x16.png", 16],
    ["favicon-32x32.png", 32],
    ["favicon-48x48.png", 48],
    ["apple-touch-icon.png", 180],
    ["android-chrome-192x192.png", 192],
    ["android-chrome-512x512.png", 512],
  ];
  for (const [name, size] of squares) {
    await renderSquare(size, path.join(publicDir, name));
  }

  await renderMaskable(192, path.join(publicDir, "android-chrome-maskable-192x192.png"));
  await renderMaskable(512, path.join(publicDir, "android-chrome-maskable-512x512.png"));

  const ico = await pngToIco([
    path.join(publicDir, "favicon-16x16.png"),
    path.join(publicDir, "favicon-32x32.png"),
    path.join(publicDir, "favicon-48x48.png"),
  ]);
  await writeFile(path.join(publicDir, "favicon.ico"), ico);

  const manifest = {
    name: "Arvind Ramachandran",
    short_name: "Arvind R",
    start_url: "/",
    display: "standalone",
    background_color: PAPER,
    theme_color: PAPER,
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { src: "/android-chrome-maskable-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/android-chrome-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  await writeFile(path.join(publicDir, "site.webmanifest"), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log("Favicon set regenerated into public/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
