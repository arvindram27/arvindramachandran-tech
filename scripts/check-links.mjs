// Crawls the built site for broken internal links.
//
// Scope: the local build in dist/ only. Absolute URLs (our own and off-site) are skipped so the
// check is deterministic and works offline - it is here to catch the bug class that actually bites
// this project: a link to a file that is not in the build (a missing /resume.pdf, or images left
// behind in a stale dist/). Off-site links were verified against production during S5.
//
// Usage: npm run check:links (expects dist/ to exist - run the build first).

import { LinkChecker } from "linkinator";

const checker = new LinkChecker();

// Off-site links are out of scope. linkinator serves dist/ from a local static server
// (127.0.0.1), so in-build links arrive here as local http URLs and everything else is remote.
// Skipping non-local hosts keeps the check offline-capable and focused on this build.
const skipOffSite = async (href) => {
  const { hostname } = new URL(href);
  return hostname !== "127.0.0.1" && hostname !== "localhost";
};

const result = await checker.check({
  path: "./dist",
  recurse: true,
  linksToSkip: skipOffSite,
  timeout: 30000,
});

const broken = result.links.filter((link) => link.state !== "OK" && link.state !== "SKIPPED");

if (broken.length > 0) {
  console.error(`check-links: FAILED (${broken.length} broken)`);
  for (const link of broken) {
    const parent = link.parent ? ` (linked from ${link.parent})` : "";
    console.error(`  - [${link.status ?? "?"}] ${link.url}${parent}`);
  }
  process.exit(1);
}

const checked = result.links.length;
console.log(
  `check-links: ok - no broken internal links (${checked} link${checked === 1 ? "" : "s"} checked)`,
);
