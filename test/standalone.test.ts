import { test } from "node:test";
import assert from "node:assert/strict";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { call, copyFixture, serverPath, spawnServer } from "./helpers.js";

const PLUGIN = "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md";

/**
 * Fresh-clone guarantee: the committed bundle must run where no `node_modules`
 * is reachable. Node's ESM resolver rescues a bare `import "x"` only from an
 * ancestor `node_modules/`, so the bundle is copied to a temp "island" whose
 * ancestors are checked to have none — the check fails (never skips) so the
 * regression cannot hide behind an unusual TMPDIR.
 */
test("standalone: committed bundle runs with no node_modules reachable (fresh-clone guarantee)", async () => {
  const island = realpathSync(mkdtempSync(join(tmpdir(), "kb-island-")));
  for (let d = island; ; d = dirname(d)) {
    assert.ok(!existsSync(join(d, "node_modules")), `${join(d, "node_modules")} would mask a missing dependency; set TMPDIR elsewhere`);
    if (dirname(d) === d) break;
  }
  mkdirSync(join(island, "dist"));
  const bundle = join(island, "dist", "server.js");
  copyFileSync(serverPath, bundle);
  // Sibling temp dir, not a parent of dist/ — validateWikiRoot refuses a root that contains the bundle.
  const wiki = copyFixture("kb-island-wiki-");

  const s = await spawnServer({ WIKI_ROOT: wiki }, [], bundle);
  try {
    const st = await call(s.client, "kb_status");
    assert.ok(!st.isError, JSON.stringify(st));
    const platform = st.structuredContent.layers.find((l: any) => l.layer === "platform");
    assert.equal(platform.status, "implemented");

    const read = await call(s.client, "read_doc", { path: PLUGIN });
    assert.ok(!read.isError, JSON.stringify(read));
    assert.equal(read.structuredContent.frontmatter.title, "Plugin base guide");

    assert.match(s.stderr.join(""), /platform=implemented/);
  } finally {
    await s.close();
  }
});
