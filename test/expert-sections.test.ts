/** `ingest/shared/expertSections.ts` — pure-logic unit tests: extraction, splice placement, tag lint. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { extractExpertSections, expertBytes, spliceExpertSections, lintExpertSections, EXPERT_TAG_LINE } from "../ingest/shared/expertSections.js";
import { isExpertTagLine } from "../src/wiki/fs.js";

const FM = `---
id: platform/guidelines/6.7/x-guidelines.md
title: X
docType: guideline
version: "6.7"
---
`;

const OLD = `${FM}
Preamble line.

## Alpha

Generated alpha.

Read more: platform/dev/6.7/a.md

## Beta
> [expert] verified by a maintainer

- Expert beta rule.

## Gamma

Generated gamma.

## Delta
> [expert]

- Expert delta rule.

## Code check (6.7.0.0+abc)

- confirmed \`Foo\` — core/Foo.php:1
`;

test("isExpertTagLine: exact tag, trailing free text, surrounding whitespace; not a look-alike", () => {
  assert.ok(isExpertTagLine("> [expert]"));
  assert.ok(isExpertTagLine(">  [expert] reviewed 2026-09-17"));
  assert.ok(isExpertTagLine("  > [expert]  "));
  assert.ok(!isExpertTagLine("> [experts]"));
  assert.ok(!isExpertTagLine("> [platform expert] platform/x.md#a"));
  assert.ok(!isExpertTagLine("[expert]"));
});

test("extractExpertSections: tagged sections only, in order, with predecessor anchors and byte sizes", () => {
  const sections = extractExpertSections(OLD);
  assert.deepEqual(
    sections.map((s) => [s.anchor, s.predecessorAnchor]),
    [
      ["beta", "alpha"],
      ["delta", "gamma"],
    ],
  );
  assert.equal(sections[0].lines[0], "## Beta");
  assert.ok(sections[0].lines[1].startsWith(EXPERT_TAG_LINE));
  assert.equal(sections[0].lines[sections[0].lines.length - 1], "- Expert beta rule.", "trailing blank lines trimmed");
  assert.equal(expertBytes(sections), sections[0].bytes + sections[1].bytes);
  assert.equal(sections[0].bytes, Buffer.byteLength(sections[0].lines.join("\n") + "\n"));
});

test("spliceExpertSections: each section lands after its former predecessor when that anchor survived", () => {
  const writer = `${FM}
## Alpha

New alpha.

## Gamma

New gamma.

## Code check (6.7.0.0+abc)

- confirmed \`Foo\` — core/Foo.php:1
`;
  const out = spliceExpertSections(writer, extractExpertSections(OLD));
  const order = out
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => l.slice(3));
  assert.deepEqual(order, ["Alpha", "Beta", "Gamma", "Delta", "Code check (6.7.0.0+abc)"]);
  assert.match(out, /## Beta\n> \[expert\] verified by a maintainer\n\n- Expert beta rule\.\n\n## Gamma/);
  assert.ok(out.startsWith(FM), "frontmatter untouched");
  assert.ok(out.endsWith("core/Foo.php:1\n"), "single trailing newline");
});

test("spliceExpertSections: a vanished predecessor sends the section before ## Code check; no Code check → end; same anchor → replaced", () => {
  const writer = `${FM}
## Alpha

New alpha.

## Beta

Writer wrote beta anyway.

## Code check (6.7.0.0+abc)

- confirmed \`Foo\` — core/Foo.php:1
`;
  const out = spliceExpertSections(writer, extractExpertSections(OLD));
  const order = out
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => l.slice(3));
  assert.deepEqual(order, ["Alpha", "Beta", "Delta", "Code check (6.7.0.0+abc)"], "gamma gone: delta goes before Code check");
  assert.ok(!out.includes("Writer wrote beta anyway"), "the expert beta replaced the writer's beta");
  assert.match(out, /## Beta\n> \[expert\]/);

  const noCodeCheck = `${FM}\n## Alpha\n\nA.\n`;
  const out2 = spliceExpertSections(noCodeCheck, extractExpertSections(OLD));
  assert.deepEqual(
    out2
      .split("\n")
      .filter((l) => l.startsWith("## "))
      .map((l) => l.slice(3)),
    ["Alpha", "Beta", "Delta"],
  );
  assert.equal(spliceExpertSections(noCodeCheck, []), noCodeCheck, "no sections: text returned unchanged");
});

test("lintExpertSections: valid placement passes; stray, non-first, Index/Code check and after-Code-check tags error", () => {
  assert.deepEqual(lintExpertSections(OLD.split("---\n").slice(2).join("---\n")), []);

  const bad = `
> [expert]

## Index
> [expert]

- x

## Rule

Text first.
> [expert]

## Code check (6.7.0.0+abc)
> [expert]

- confirmed \`Foo\` — core/Foo.php:1

## Late
> [expert]

- too late
`;
  const issues = lintExpertSections(bad);
  assert.ok(issues.some((i) => i.includes("outside a ## section")), issues.join("\n"));
  assert.ok(issues.some((i) => i.startsWith("## Index:") && i.includes("not allowed")));
  assert.ok(issues.some((i) => i.startsWith("## Rule:") && i.includes("first line under the heading")));
  assert.ok(issues.some((i) => i.startsWith("## Code check") && i.includes("not allowed")));
  assert.ok(issues.some((i) => i.startsWith("## Late:") && i.includes("before ## Code check")));
  assert.equal(issues.length, 5);
});
