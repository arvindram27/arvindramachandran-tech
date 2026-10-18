// Wipes dist/ before a build, and fails loudly if it cannot.
//
// Why this exists instead of a one-liner `fs.rmSync`:
// this project lives inside a OneDrive folder, where directories are reparse points and
// files can be cloud-only placeholders. In that environment `fs.rmSync(dist, { recursive: true,
// force: true })` can return successfully without deleting anything, which means the next build
// silently layers on top of the previous one. That failure mode is not theoretical: it shipped a
// stale `/redesign/` route and stale `/journey/` images to production.
//
// So: try the Node API, fall back to the platform's recursive delete, then verify the directory is
// actually gone. If it is still there, exit non-zero rather than let a stale build deploy.

import { existsSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");

const attempt = (fn) => {
  try {
    fn();
  } catch {
    // Fall through to the next strategy; the existence check below is the real verdict.
  }
};

if (existsSync(dist)) {
  attempt(() => rmSync(dist, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }));
}

if (existsSync(dist) && process.platform === "win32") {
  attempt(() => execFileSync("cmd", ["/c", "rmdir", "/s", "/q", dist], { stdio: "ignore" }));
}

if (existsSync(dist)) {
  console.error(
    `clean-dist: FAILED - could not remove ${dist}. A stale build would ship; refusing to continue.`,
  );
  process.exit(1);
}

console.log("clean-dist: dist/ removed");
