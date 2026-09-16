---
id: platform/dev/6.7/resources/references/adr/2026-05-06-split-large-administration-test-files.md
title: Split large Administration test files
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-05-06-split-large-administration-test-files.html
sourceHash: 224f521bc2760bd32951046cff01a56785d39d4f
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration tests", "jest", "eslint", ".spec directory", ".spec.js", ".spec.ts", "split test files", "unit test", "test file size", "test fixtures", "baseline test", "sw-import-export-activity"]
summary: "ADR: Administration Jest spec files over 500 lines are split into a <source>.spec/ directory of *.spec.js/ts files; ESLint warns at 500, errors at 1000."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2026-05-06) setting a structure for large Administration unit tests: test files above 500 lines are split into several smaller spec files inside a directory named after the source file with a `.spec` suffix.

## When to use

- An Administration Jest test file next to a component grows beyond 500 lines.
- You need scenario groups, fixtures, builders or mocks for a single source file.

## Key steps / config

1. Keep small suites colocated as a single spec file next to the source.
2. Once a spec crosses 500 lines, create a directory `<source-name>.spec/` next to the source file.
3. Name every executable test inside it `*.spec.js` or `*.spec.ts`, grouped by behaviour. Helper files (fixtures, builders) are allowed and are not executed unless they carry the spec suffix.

```text
src/module/sw-import-export/component/sw-import-export-activity/
  index.js
  sw-import-export-activity.html.twig
  sw-import-export-activity.scss
  sw-import-export-activity.spec/
    export-activities.spec.js
    import-activities.spec.js
    fixtures.js
```

- Jest discovers both colocated single-file specs and specs inside `.spec` directories.
- The Administration baseline test counts a `.spec` directory with at least one `*.spec.js` / `*.spec.ts` file as coverage for the corresponding source file.
- ESLint warns at 500 lines and errors at 1000 lines per test file.

## Gotchas

- Files above 1000 lines are considered too large for new or migrated specs.
- Helper files in a `.spec` directory without the `*.spec.*` suffix never run as tests.

## Code check (6.7.13.0)
- confirmed `sw-import-export-activity` — example component directory exists with index.js, twig and scss — vendor/shopware/administration/Resources/app/administration/src/module/sw-import-export/component/sw-import-export-activity/index.js:4
- unverified `.spec` — installed administration src ships no spec files or `.spec/` directories; Jest config and baseline test live outside the checked roots
- unverified `ESLint 500/1000 line limits` — ESLint configuration lives outside administration src, out of scope
