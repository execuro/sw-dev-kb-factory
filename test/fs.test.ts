import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildMatcher,
  compileGlob,
  globSyntaxError,
  grepLines,
  headings,
  joinRange,
  pathSyntaxError,
  sectionRange,
  slugify,
  splitLines,
  LruCache,
} from "../src/wiki/fs.js";

test("B1 path syntax: every forbidden form is rejected without touching the filesystem", () => {
  const bad = [
    "../etc/passwd",
    "platform/../../x",
    "platform/./x",
    "/platform/index.md",
    "platform//index.md",
    "platform/%2e%2e/x",
    "~/platform",
    "platform\\index.md",
    "C:/platform",
    "platform/index.md\0",
    "platform/a b.md",
    "platform/ä.md",
    "",
    "x".repeat(513),
  ];
  for (const p of bad) assert.ok(pathSyntaxError(p), `should reject ${JSON.stringify(p)}`);
  assert.equal(pathSyntaxError(""), "path must not be empty");
  assert.equal(pathSyntaxError("", true), null);
  for (const p of ["platform", "platform/dev/6.7/_index.md", "platform/func/settings/rules@6.6.10.0.md", "README.md"]) {
    assert.equal(pathSyntaxError(p), null, p);
  }
});

test("glob syntax: no `..`, ≤ 256 chars", () => {
  assert.ok(globSyntaxError("../*"));
  assert.ok(globSyntaxError("*".repeat(257)));
  assert.ok(globSyntaxError(""));
  assert.equal(globSyntaxError("**/*cart*"), null);
  assert.equal(globSyntaxError("!index.md"), null);
});

test("glob: gitignore-style semantics, case-insensitive by default", () => {
  const anyCart = compileGlob("**/*cart*", false);
  assert.ok(anyCart.test("guides/checkout/cart/add-cart-discounts.md"));
  assert.ok(anyCart.test("Cart.md"));
  assert.ok(!anyCart.test("guides/plugins.md"));
  assert.ok(!compileGlob("**/*cart*", true).test("guides/CART.md"));
  assert.ok(compileGlob("*.md", false).test("a/b/c.md")); // basename match at any depth
  assert.ok(compileGlob("guides/**", false).test("guides/x/y.md"));
  assert.ok(!compileGlob("guides/**", false).test("other/guides/y.md"));
  assert.ok(compileGlob("!index.md", false).test("a/page.md"));
  assert.ok(!compileGlob("!index.md", false).test("a/index.md"));
  assert.ok(compileGlob("*.{md,json}", false).test("manifest.json"));
  assert.ok(compileGlob("page-?.md", false).test("page-1.md"));
  assert.ok(!compileGlob("page-?.md", false).test("page-12.md"));
  assert.ok(compileGlob("[ab]*.md", false).test("b1.md"));
});

test("slugify + headings + section slicing (H3 → enclosing H2, fenced headings ignored)", () => {
  assert.equal(slugify("Key steps / config"), "key-steps-config");
  assert.equal(slugify("What it is"), "what-it-is");
  assert.equal(slugify("  ##Weird!! "), "weird");
  const lines = [
    "---",
    "title: t",
    "---",
    "## What it is",
    "a",
    "",
    "## Key steps / config",
    "```",
    "## not a heading",
    "```",
    "### Install and activate",
    "b",
    "",
    "## Gotchas",
    "c",
    "",
  ];
  const hs = headings(lines, 4);
  assert.deepEqual(
    hs.map((h) => [h.level, h.slug, h.line]),
    [
      [2, "what-it-is", 4],
      [2, "key-steps-config", 7],
      [3, "install-and-activate", 11],
      [2, "gotchas", 14],
    ],
  );
  assert.deepEqual(sectionRange(lines, "key-steps-config", 4), { resolved: "key-steps-config", lineFrom: 7, lineTo: 12 });
  assert.deepEqual(sectionRange(lines, "install-and-activate", 4), { resolved: "key-steps-config", lineFrom: 7, lineTo: 12 });
  assert.deepEqual(sectionRange(lines, "gotchas", 4), { resolved: "gotchas", lineFrom: 14, lineTo: 15 });
  assert.equal(sectionRange(lines, "nope", 4), null);
  assert.equal(sectionRange(lines, "not-a-heading", 4), null);
});

test("splitLines/joinRange reproduce the file bytes exactly", () => {
  const text = "a\nb\nc\n";
  const { lines, endsWithNewline } = splitLines(text);
  assert.deepEqual(lines, ["a", "b", "c"]);
  assert.equal(joinRange(lines, 1, 3, endsWithNewline), text);
  assert.equal(joinRange(lines, 2, 2, endsWithNewline), "b\n");
  const noNl = splitLines("a\nb");
  assert.equal(joinRange(noNl.lines, 1, 2, noNl.endsWithNewline), "a\nb");
  assert.equal(joinRange(noNl.lines, 1, 1, noNl.endsWithNewline), "a\n");
});

test("matcher: literal escapes, regex, case, whole word; grepLines context + 400-char cap", () => {
  assert.ok(buildMatcher("a.b", { regex: false, caseSensitive: false, wholeWord: false }).test("xA.By"));
  assert.ok(!buildMatcher("a.b", { regex: false, caseSensitive: false, wholeWord: false }).test("axb"));
  assert.ok(buildMatcher("a.b", { regex: true, caseSensitive: false, wholeWord: false }).test("axb"));
  assert.ok(!buildMatcher("Cart", { regex: false, caseSensitive: true, wholeWord: false }).test("cart"));
  assert.ok(buildMatcher("cart", { regex: false, caseSensitive: false, wholeWord: true }).test("the cart!"));
  assert.ok(!buildMatcher("cart", { regex: false, caseSensitive: false, wholeWord: true }).test("carts"));
  assert.throws(() => buildMatcher("(", { regex: true, caseSensitive: false, wholeWord: false }));
  const lines = ["l1", "hit one", "l3", "l4", "hit two", "x".repeat(500)];
  const m = buildMatcher("hit|x{10}", { regex: true, caseSensitive: false, wholeWord: false });
  const hits = grepLines(lines, m, 1, 2, 10);
  assert.deepEqual(hits.map((h) => h.line), [2, 5, 6]);
  assert.deepEqual(hits[0].before, ["l1"]);
  assert.deepEqual(hits[0].after, ["l3", "l4"]);
  assert.equal(hits[2].text.length, 400);
  assert.equal(hits[2].truncatedLine, true);
  assert.equal(grepLines(lines, m, 0, 0, 1).length, 1);
});

test("LRU cache evicts by bytes", () => {
  const c = new LruCache<string>(10);
  c.set("a", "aaaa", 4);
  c.set("b", "bbbb", 4);
  assert.equal(c.get("a"), "aaaa"); // touch a → b is LRU
  c.set("c", "cccc", 4);
  assert.equal(c.get("b"), undefined);
  assert.equal(c.get("a"), "aaaa");
  c.set("huge", "x", 11); // larger than the cache: not stored
  assert.equal(c.get("huge"), undefined);
});
