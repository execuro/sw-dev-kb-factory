/**
 * Upstream repository furniture — `AGENTS.md`, `.github/` templates and the like — must never
 * reach the corpus as documentation pages.
 *
 * The developer source is downloaded whole, with the upstream `.docsignore` deliberately not
 * applied, so the docs repo's own `AGENTS.md` and `.github/PULL_REQUEST_TEMPLATE.md` were ingested
 * as ordinary pages — valid frontmatter, real index lines — and would have shipped to consumers in
 * the published package. One predicate now guards three gates; these are the first two.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isDocPagePath } from "../ingest/shared/hygiene.js";
import { filterBySourceGlobs } from "../ingest/platform/sync.js";
import { fixtureRoot } from "./helpers.js";

test("isDocPagePath matches on the path, never on the word", () => {
  // Real pages, including ones *about* AGENTS.md — the reason this cannot be a text search.
  assert.equal(isDocPagePath("platform/dev/6.7/guides/plugins/storefront/templates/agentic-files.md"), true);
  assert.equal(isDocPagePath("platform/dev/6.7/resources/references/adr/2026-06-17-shared-guidance-files.md"), true);
  assert.equal(isDocPagePath("concepts/framework/architecture.md"), true);

  // Repository furniture, at any depth.
  assert.equal(isDocPagePath("AGENTS.md"), false);
  assert.equal(isDocPagePath("platform/dev/6.7/AGENTS.md"), false);
  assert.equal(isDocPagePath("some/deep/path/CONTRIBUTING.md"), false);
  assert.equal(isDocPagePath("PULL_REQUEST_TEMPLATE.md"), false);

  // Any dot segment, which is what `wiki:lint`'s dot-skipping walker used to miss entirely.
  assert.equal(isDocPagePath(".github/PULL_REQUEST_TEMPLATE.md"), false);
  assert.equal(isDocPagePath("platform/dev/6.7/.github/anything.md"), false);
  assert.equal(isDocPagePath(".hidden/page.md"), false);
});

test("the sync tree filter drops furniture even when a source's exclude globs do not", () => {
  // The exclude globs are per-source and editable; the predicate is the floor no source can drop
  // below. Passing [] here is the point of the test.
  const entries = [
    { path: "concepts/real-page.md", type: "blob" },
    { path: "AGENTS.md", type: "blob" },
    { path: ".github/PULL_REQUEST_TEMPLATE.md", type: "blob" },
    { path: "guides/agentic-files.md", type: "blob" },
  ] as Parameters<typeof filterBySourceGlobs>[0];
  assert.deepEqual(
    filterBySourceGlobs(entries, []).map((e) => e.path),
    ["concepts/real-page.md", "guides/agentic-files.md"],
  );
  // And the globs still apply on top of it.
  assert.deepEqual(
    filterBySourceGlobs(entries, ["**/agentic-files.md"]).map((e) => e.path),
    ["concepts/real-page.md"],
  );
});

test("wiki:lint reports furniture by name, including behind a dot directory", async () => {
  // Regression guard for the disagreement this fixed: lint reported 0 errors on a tree that
  // test/purity.test.ts rejected, because lint's own walker skipped dot entries.
  //
  // Asserting on the message, not the exit code: the fixture wiki fails lint for plenty of
  // unrelated reasons, so `code === 1` would pass even with the gate removed.
  const dir = mkdtempSync(join(tmpdir(), "kb-nonpage-"));
  const realWrite = process.stderr.write.bind(process.stderr);
  const lines: string[] = [];
  try {
    const wiki = join(dir, "wiki");
    cpSync(fixtureRoot, wiki, { recursive: true });
    mkdirSync(join(wiki, "platform", ".github"), { recursive: true });
    writeFileSync(join(wiki, "platform", ".github", "PULL_REQUEST_TEMPLATE.md"), "x\n");
    writeFileSync(join(wiki, "platform", "AGENTS.md"), "x\n");

    const { run } = await import("../ingest/platform/lint.js");
    (process.stderr as { write: unknown }).write = (chunk: string | Uint8Array) => {
      lines.push(String(chunk));
      return true;
    };
    await run({ layer: "platform", wiki });
  } finally {
    (process.stderr as { write: unknown }).write = realWrite;
    rmSync(dir, { recursive: true, force: true });
  }
  const errors = lines.filter((l) => l.includes("non-page file in the corpus"));
  assert.ok(
    errors.some((l) => l.includes("platform/.github/PULL_REQUEST_TEMPLATE.md")),
    `expected the dot-directory file to be reported, got:\n${errors.join("")}`,
  );
  assert.ok(
    errors.some((l) => l.includes("platform/AGENTS.md")),
    `expected the furniture basename to be reported, got:\n${errors.join("")}`,
  );
});
