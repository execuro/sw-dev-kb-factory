import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { packageDir } from "./helpers.js";
import { REPO_INTERNAL_NEEDLES } from "../ingest/shared/hygiene.js";

const wikiDir = join(packageDir, "wiki");
// Purity needles — REPO_INTERNAL_NEEDLES is `checkPurity`'s single source of truth
// (ingest/shared/hygiene.ts), reused here instead of a second, driftable copy.
// Needles naming generic tool-ecosystem files that upstream Shopware docs legitimately
// discuss (the MCP-server pages explain Claude Code's `.mcp.json` / `.claude/` config),
// and whose mentions flow into generated aggregates (article pages, per-directory
// index.md summary lines, hubs, manifest.json). Enforced only on platform/index.md —
// the sole hand-committed protocol file.
const ECOSYSTEM_COLLISION_NEEDLES = [".mcp.json", ".claude/"];
const PROTOCOL_FILE = "platform/index.md";
// The root protocol file's "Source fall-through" section deliberately documents the
// ingest/ snapshot path for offline source lookup; every other needle still applies to it.
const ALLOWED_REFERENCES: Record<string, readonly string[]> = { [PROTOCOL_FILE]: ["ingest/"] };
const FORBIDDEN_TEXT = [...REPO_INTERNAL_NEEDLES, ...ECOSYSTEM_COLLISION_NEEDLES];

test("package purity: wiki/ contains only allowlisted regular files ≤ 1 MB with no tooling references", () => {
  // No conditional skip: the corpus is committed in-repo and `files` ships `wiki/`, so an absent
  // wiki/ is either a broken checkout or a deliberate move of the corpus out of this repository.
  // Skipping here would let the purity gate — the only thing standing between repo-internal paths
  // and a published tarball — disappear silently the day that move happens.
  assert.ok(
    existsSync(wikiDir),
    `wiki/ is missing at ${wikiDir}. The corpus is expected in-repo (package.json "files" ships wiki/). ` +
      "If it was moved out of the repository on purpose, point this test at the new corpus root and keep it running — do not skip it.",
  );
  const problems: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const abs = join(dir, name);
      const rel = relative(wikiDir, abs);
      const st = lstatSync(abs);
      if (name.startsWith(".")) {
        problems.push(`dot-entry: ${rel}`);
        continue;
      }
      if (st.isSymbolicLink()) {
        problems.push(`symlink: ${rel}`);
        continue;
      }
      if (st.isDirectory()) {
        walk(abs);
        continue;
      }
      if (!st.isFile()) {
        problems.push(`not a regular file: ${rel}`);
        continue;
      }
      const isRoot = dir === wikiDir;
      const allowed = name.endsWith(".md") || name === "manifest.json" || (isRoot && (name === "README.md" || name === "composer.json"));
      if (!allowed) problems.push(`not allowlisted: ${rel}`);
      if (st.mode & 0o111) problems.push(`executable bit: ${rel}`);
      if (st.size > 1024 * 1024) problems.push(`larger than 1 MB: ${rel}`);
      // manifest.json is exempt from the 512 KB generated-file cap, same as lint.ts's
      // lintTreeSafety (`!rel.endsWith("manifest.json")`) — it grows with the corpus.
      if (name !== "manifest.json" && st.size > 512 * 1024) problems.push(`larger than 512 KB (build limit): ${rel}`);
      const text = readFileSync(abs, "utf8");
      for (const needle of FORBIDDEN_TEXT) {
        if (ALLOWED_REFERENCES[rel]?.includes(needle)) continue;
        if (ECOSYSTEM_COLLISION_NEEDLES.includes(needle) && rel !== PROTOCOL_FILE) continue;
        if (text.includes(needle)) problems.push(`references "${needle}": ${rel}`);
      }
    }
  };
  walk(wikiDir);
  assert.deepEqual(problems, []);
});
