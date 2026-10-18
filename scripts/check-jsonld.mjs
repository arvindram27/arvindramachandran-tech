// Validates the JSON-LD in every built HTML page.
//
// Checks (SEO-AEO brief §4, Phase 3 acceptance):
//   1. every <script type="application/ld+json"> block parses as valid JSON
//   2. @id values are unique across the build, and the same @id never carries
//      conflicting content (compared by canonical JSON)
//   3. every block declares an @context and at least one @type or @graph
//
// Exits non-zero on failure so `npm run build` cannot ship broken structured data.
// No dependencies: walks dist/ and uses the platform JSON parser only.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

const SCRIPT_RE = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await findHtmlFiles(full)));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function unescapeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function collectIds(node, found) {
  if (Array.isArray(node)) {
    for (const item of node) collectIds(item, found);
    return;
  }
  if (!node || typeof node !== "object") return;
  // A bare { "@id": ... } is a *reference* to an entity defined elsewhere; only an object
  // that carries @id plus at least one other property is a *definition* whose content
  // must be unique across the build.
  if (typeof node["@id"] === "string" && Object.keys(node).length > 1) {
    found.push({ id: node["@id"], canonical: JSON.stringify(node) });
  }
  for (const value of Object.values(node)) collectIds(value, found);
}

async function main() {
  let htmlFiles;
  try {
    htmlFiles = await findHtmlFiles(distDir);
  } catch {
    console.error(`check-jsonld: no dist/ directory at ${distDir}. Run the build first.`);
    process.exit(1);
  }

  const errors = [];
  const idOwners = new Map();
  let blockCount = 0;
  const pagesWithJsonLd = [];

  for (const file of htmlFiles) {
    const rel = path.relative(root, file);
    const html = await readFile(file, "utf8");
    const blocks = [...html.matchAll(SCRIPT_RE)].map((match) => match[1].trim());
    if (blocks.length > 0) pagesWithJsonLd.push(`${rel} (${blocks.length})`);

    blocks.forEach((raw, index) => {
      const where = `${rel} block ${index + 1}`;
      blockCount += 1;

      let parsed;
      try {
        parsed = JSON.parse(unescapeHtml(raw));
      } catch (error) {
        errors.push(`${where}: invalid JSON (${error.message})`);
        return;
      }

      if (!parsed["@context"]) errors.push(`${where}: missing @context`);
      if (!parsed["@type"] && !parsed["@graph"]) {
        errors.push(`${where}: missing @type or @graph`);
      }

      const ids = [];
      collectIds(parsed, ids);
      for (const { id, canonical } of ids) {
        const previous = idOwners.get(id);
        if (previous && previous.canonical !== canonical) {
          errors.push(
            `${where}: @id ${id} already defined in ${previous.where} with different content`,
          );
        } else if (!previous) {
          idOwners.set(id, { where, canonical });
        }
      }
    });
  }

  if (errors.length > 0) {
    console.error(`check-jsonld: FAILED (${errors.length} problem${errors.length === 1 ? "" : "s"})`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  console.log(
    `check-jsonld: ok - ${blockCount} block${blockCount === 1 ? "" : "s"} across ${htmlFiles.length} page${htmlFiles.length === 1 ? "" : "s"}, ${idOwners.size} distinct @id value${idOwners.size === 1 ? "" : "s"}`,
  );
  for (const page of pagesWithJsonLd) console.log(`  - ${page}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
