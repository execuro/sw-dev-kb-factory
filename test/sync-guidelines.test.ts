/** `sync.ts`'s code checkout, and the single whole-repository download of the developer
 *  documentation source that serves every consumer of it — pure-logic
 *  unit tests only, no network: `filterBySourceGlobs`, `pickLatestTag`,
 *  `matchesCodeCheckoutIncludes`, `prepareCheckoutDir`, `codeCheckoutInScope`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  codeCheckoutInScope,
  filterBySourceGlobs,
  matchesCodeCheckoutIncludes,
  parseJsonResponse,
  performGitCheckout,
  pickLatestTag,
  prepareCheckoutDir,
  type GitRunner,
} from "../ingest/platform/sync.js";
import { FetchAbortError } from "../ingest/shared/fetchLimited.js";

test("parseJsonResponse: non-2xx status and invalid JSON both become a FetchAbortError, a valid 200 JSON body parses", () => {
  assert.throws(() => parseJsonResponse(404, "not found", "https://api.github.com/x"), FetchAbortError);
  assert.throws(() => parseJsonResponse(200, "<html>error page</html>", "https://api.github.com/x"), FetchAbortError);
  assert.deepEqual(parseJsonResponse<{ a: number }>(200, '{"a":1}', "https://api.github.com/x"), { a: 1 });
});

test("filterBySourceGlobs: excludes matching paths, keeps everything else (developer source's shape; the repository is downloaded whole, so filtering happens here)", () => {
  const entries = [
    { path: "resources/guidelines/code/foo.md", type: "blob" as const, sha: "a" },
    { path: "resources/references/adr/2020-01-01-x.md", type: "blob" as const, sha: "c" },
    { path: "docs/some-other-page.md", type: "blob" as const, sha: "d" },
    { path: "README.md", type: "blob" as const, sha: "e" },
  ];
  const included = filterBySourceGlobs(entries, ["**/README.md"]);
  assert.deepEqual(
    included.map((e) => e.path),
    ["resources/guidelines/code/foo.md", "resources/references/adr/2020-01-01-x.md", "docs/some-other-page.md"],
  );
});

test("filterBySourceGlobs: empty exclude keeps every path", () => {
  const entries = [
    { path: "docs/a.md", type: "blob" as const, sha: "a" },
    { path: "resources/guidelines/code/foo.md", type: "blob" as const, sha: "b" },
  ];
  const included = filterBySourceGlobs(entries, []);
  assert.deepEqual(
    included.map((e) => e.path),
    ["docs/a.md", "resources/guidelines/code/foo.md"],
  );
});

test("pickLatestTag: semver-picks the highest v6.6.x.y tag, ignoring non-matching and non-semver tags", () => {
  const tags = ["v6.6.9.0", "v6.6.10.1", "v6.7.0.0", "v6.6.10.10", "not-a-tag", "v6.6.2.0"];
  assert.equal(pickLatestTag(tags, "v6.6.*"), "v6.6.10.10");
});

test("pickLatestTag: no matching tag returns undefined", () => {
  assert.equal(pickLatestTag(["v6.7.0.0", "v6.7.1.0"], "v6.6.*"), undefined);
});

test("pickLatestTag: three-part tags (no patch-of-patch) sort correctly against four-part ones", () => {
  assert.equal(pickLatestTag(["v6.6.9", "v6.6.10.1"], "v6.6.*"), "v6.6.10.1");
});

test("matchesCodeCheckoutIncludes: src/Core, src/Storefront, administration src/technical-docs/AGENTS.md, nested AGENTS.md", () => {
  assert.equal(matchesCodeCheckoutIncludes("src/Core/Checkout/Cart/LineItem.php"), true);
  assert.equal(matchesCodeCheckoutIncludes("src/Storefront/Controller/CartController.php"), true);
  assert.equal(matchesCodeCheckoutIncludes("src/Administration/Resources/app/administration/src/module/foo.js"), true);
  assert.equal(matchesCodeCheckoutIncludes("src/Administration/Resources/app/administration/technical-docs/06-ui/foo.md"), true);
  assert.equal(matchesCodeCheckoutIncludes("src/Administration/Resources/app/administration/AGENTS.md"), true);
  assert.equal(matchesCodeCheckoutIncludes("src/Core/Checkout/Cart/AGENTS.md"), true);
  assert.equal(matchesCodeCheckoutIncludes("src/Elasticsearch/Product/ElasticsearchProductDefinition.php"), false);
  assert.equal(matchesCodeCheckoutIncludes("src/Administration/Resources/app/administration/test/foo.spec.js"), false);
});

test("prepareCheckoutDir: wipes an existing checkout naming a different tag", () => {
  const codeDir = mkdtempSync(join(tmpdir(), "kb-checkout-dir-"));
  try {
    writeFileSync(resolve(codeDir, "stale.txt"), "old tag content");
    prepareCheckoutDir(codeDir, "v6.6.9.0", "v6.6.10.0");
    assert.equal(existsSync(codeDir), false);
  } finally {
    rmSync(codeDir, { recursive: true, force: true });
  }
});

test("codeCheckoutInScope: unscoped run always includes it; --source developer (whole or :<version>) includes it; a different --source excludes it", () => {
  assert.equal(codeCheckoutInScope({ layer: "platform", wiki: "wiki" }, "6.6"), true);
  assert.equal(codeCheckoutInScope({ layer: "platform", wiki: "wiki", source: "developer" }, "6.6"), true);
  assert.equal(codeCheckoutInScope({ layer: "platform", wiki: "wiki", source: "developer:6.6" }, "6.6"), true);
  assert.equal(codeCheckoutInScope({ layer: "platform", wiki: "wiki", source: "developer:6.7" }, "6.6"), false);
  assert.equal(codeCheckoutInScope({ layer: "platform", wiki: "wiki", source: "merchant" }, "6.6"), false);
});

test("performGitCheckout: runs clone + sparse-checkout set --no-cone with the CODE_CHECKOUT_INCLUDE_GLOBS patterns, strips .git, renames atomically, writes .tag last", () => {
  const cacheCodeRoot = mkdtempSync(join(tmpdir(), "kb-git-checkout-"));
  try {
    const codeDir = resolve(cacheCodeRoot, "6.6");
    const calls: { args: string[]; cwd?: string }[] = [];
    const fakeGit: GitRunner = (args, opts) => {
      calls.push({ args, cwd: opts?.cwd });
      if (args[0] === "clone") {
        const dest = args[args.length - 1];
        mkdirSync(resolve(dest, "src/Core"), { recursive: true });
        writeFileSync(resolve(dest, "src/Core/foo.php"), "<?php\n");
        mkdirSync(resolve(dest, ".git"), { recursive: true });
        writeFileSync(resolve(dest, ".git", "HEAD"), "ref: refs/heads/main\n");
      }
    };

    const result = performGitCheckout(codeDir, "shopware/shopware", "v6.6.10.0", fakeGit);
    assert.equal(result.error, undefined);
    assert.equal(result.fetched, 1);

    assert.equal(calls[0].args[0], "clone");
    assert.deepEqual(calls[0].args.slice(1, -2), ["--depth", "1", "--filter=blob:none", "--sparse", "--branch", "v6.6.10.0"]);
    assert.equal(calls[0].args.at(-2), "https://github.com/shopware/shopware.git");

    assert.deepEqual(calls[1].args.slice(0, 3), ["sparse-checkout", "set", "--no-cone"]);
    assert.ok(calls[1].args.includes("src/Core/**"));
    assert.ok(calls[1].args.includes("src/Storefront/**"));
    assert.ok(calls[1].args.includes("src/Administration/Resources/app/administration/src/**"));
    assert.ok(calls[1].args.includes("src/Administration/Resources/app/administration/technical-docs/**"));
    assert.ok(calls[1].args.includes("src/Administration/Resources/app/administration/AGENTS.md"));
    assert.ok(calls[1].args.includes("**/AGENTS.md"));
    assert.equal(calls[1].cwd, calls[0].args.at(-1)); // sparse-checkout runs in the clone dest dir

    assert.equal(existsSync(resolve(codeDir, ".git")), false, ".git stripped");
    assert.equal(readFileSync(resolve(codeDir, ".tag"), "utf8").trim(), "v6.6.10.0");
    assert.equal(existsSync(resolve(codeDir, "src/Core/foo.php")), true);
    // The temp clone dir (calls[1].cwd) no longer exists — it was renamed to codeDir.
    assert.equal(existsSync(calls[1].cwd!), false);
  } finally {
    rmSync(cacheCodeRoot, { recursive: true, force: true });
  }
});

test("performGitCheckout: a git failure returns {fetched: 0, error} instead of throwing, and leaves no temp dir behind", () => {
  const cacheCodeRoot = mkdtempSync(join(tmpdir(), "kb-git-checkout-fail-"));
  try {
    const codeDir = resolve(cacheCodeRoot, "6.6");
    const failingGit: GitRunner = () => {
      throw new Error("git clone failed: repository not found");
    };
    const result = performGitCheckout(codeDir, "shopware/shopware", "v6.6.10.0", failingGit);
    assert.equal(result.fetched, 0);
    assert.match(result.error ?? "", /repository not found/);
    assert.equal(existsSync(codeDir), false);
    assert.deepEqual(readdirSync(cacheCodeRoot), []);
  } finally {
    rmSync(cacheCodeRoot, { recursive: true, force: true });
  }
});

test("prepareCheckoutDir: no-op when there is no prior checkout or the tag already matches", () => {
  const codeDir = mkdtempSync(join(tmpdir(), "kb-checkout-dir-"));
  try {
    writeFileSync(resolve(codeDir, "keep.txt"), "current tag content");
    prepareCheckoutDir(codeDir, undefined, "v6.6.10.0");
    assert.equal(existsSync(resolve(codeDir, "keep.txt")), true, "no prior tag: untouched");
    prepareCheckoutDir(codeDir, "v6.6.10.0", "v6.6.10.0");
    assert.equal(existsSync(resolve(codeDir, "keep.txt")), true, "same tag: untouched");
  } finally {
    rmSync(codeDir, { recursive: true, force: true });
  }
});
