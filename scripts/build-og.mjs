// Builds the default Open Graph / social card: public/og/default.png (1200x630).
//
// Design language mirrors the site: paper background, hairline rule, mono micro-label,
// amber accent used exactly once (the PAL sparkline end-dot). See src/styles/global.css tokens.
//
// FONT NOTE: the site's real webfonts (Space Grotesk, IBM Plex Mono) are shipped by
// @fontsource as woff2 only, and sharp's SVG renderer (librsvg) resolves fonts through
// fontconfig, which cannot read woff2. This card therefore asks for a system stand-in and
// lets fontconfig fall back. See build-log M19 for the TODO(owner) upgrade path.
//
// Run via: npm run og

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const WIDTH = 1200;
const HEIGHT = 630;

const PAPER = "#FAFAF7";
const INK = "#141412";
const MUTED = "#6B6B66";
const LINE = "#E6E4DC";
const ACCENT = "#9A4A08";

const DISPLAY_FONT = "Segoe UI Variable Text, Segoe UI, Arial, sans-serif";
const MONO_FONT = "Consolas, Courier New, monospace";

// Sparkline motif shared with favicon.svg / the header mark, drawn at card scale.
const markPoints = [
  [0, 168],
  [44, 126],
  [80, 152],
  [128, 62],
  [164, 104],
  [216, 12],
  [268, 50],
];

const mark = markPoints.map(([x, y]) => `${x + 840},${y + 380}`).join(" ");
const markEnd = markPoints[markPoints.length - 1];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>
  <rect x="24" y="24" width="${WIDTH - 48}" height="${HEIGHT - 48}" fill="none" stroke="${LINE}" stroke-width="2"/>

  <text x="96" y="150" font-family="${MONO_FONT}" font-size="21" letter-spacing="3.2" fill="${MUTED}">ARVINDRAMACHANDRAN.TECH</text>

  <text x="96" y="308" font-family="${DISPLAY_FONT}" font-size="88" font-weight="600" letter-spacing="-2.4" fill="${INK}">Arvind Ramachandran</text>
  <text x="96" y="368" font-family="${DISPLAY_FONT}" font-size="34" font-weight="400" fill="${MUTED}">Data Engineer in Chennai</text>

  <rect x="96" y="404" width="96" height="5" fill="${ACCENT}"/>

  <text x="96" y="520" font-family="${MONO_FONT}" font-size="22" letter-spacing="1.6" fill="${MUTED}">MED · PRICE ADJUSTMENT LATENCY</text>
  <text x="96" y="556" font-family="${MONO_FONT}" font-size="22" letter-spacing="1.6" fill="${MUTED}">PYTHON · DATABRICKS · LANGGRAPH</text>

  <polyline points="${mark}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${markEnd[0] + 840}" cy="${markEnd[1] + 380}" r="10" fill="${ACCENT}"/>
</svg>`;

async function main() {
  const out = path.join(root, "public", "og", "default.png");
  await mkdir(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
  console.log(`OG card written: ${path.relative(root, out)} (${WIDTH}x${HEIGHT})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
