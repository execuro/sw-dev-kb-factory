---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2026-05-06-split-large-administration-test-files.md
sourceHash: 224f521bc2760bd32951046cff01a56785d39d4f
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-05-06-split-large-administration-test-files.html
title: Split large Administration test files
version: "6.7"
versions:
  - "6.7"
keywords: ["administration tests", "jest", "spec files", "split spec directory", ".spec directory", ".spec.js", ".spec.ts", "eslint", "test-file-max-lines-warning", "test-file-max-lines-error", "meta.spec.js", "baseline test", "fixtures", "500 lines"]
summary: "ADR: Administration spec files over 500 lines move into a <source>.spec/ directory of *.spec.js/ts files; ESLint warns at 500, errors at 1000."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record for structuring Administration unit tests. Spec files are colocated next to the source file they cover, but single files often grow beyond 500 lines, which makes scenarios hard to scan, increases merge conflicts and makes focused test runs inconvenient. The colocated single-file convention has no structure for a source file that needs many scenario groups, fixtures, builders or mocks. The ADR decides that such tests are split into a directory of smaller spec files.

## When to use

- An Administration spec file approaches or crosses 500 lines.
- You write a new, large test suite for one component or service and want to organise it by behaviour.
- ESLint reports a test-file length warning or error.

## Key steps / config

1. Create a directory next to the source, named after the source file (or, for an `index.js`, after the component folder) with a `.spec` suffix.
2. Put each scenario group in its own file ending in `.spec.js` or `.spec.ts`.
3. Put shared helpers (fixtures, builders, mocks) in the same directory without the `.spec.*` suffix; they are not executed as tests.

```text
src/module/sw-import-export/component/sw-import-export-activity/
  index.js
  sw-import-export-activity.html.twig
  sw-import-export-activity.scss
  sw-import-export-activity.spec/
    export-activities.spec.js
    import-activities.spec.js
    activity-actions.spec.js
    profile-modal.spec.js
    fixtures.js
```

Jest discovers both colocated single-file specs and split specs inside `.spec` directories. The Administration baseline (meta) test counts a `.spec` directory containing at least one `*.spec.js` or `*.spec.ts` file as test coverage for the matching source file, and does not require separate specs for helper files inside that directory.

ESLint enforces the size limits with two rules: a warning when a test file reaches 500 lines and an error at 1000 lines.

## Essential identifiers

- `<name>.spec/` split directory, `*.spec.js`, `*.spec.ts`
- `sw-test-rules/test-file-max-lines-warning` (500 lines), `sw-test-rules/test-file-max-lines-error` (1000 lines)
- `src/meta/meta.spec.js` (Administration baseline test)

## Gotchas

- Files inside a `.spec` directory only run as tests if they use the `*.spec.js`/`*.spec.ts` suffix; a scenario file without that suffix will not run.
- Files above 1000 lines are considered too large for new or migrated specs; prefer splitting once a file crosses 500 lines.
- Some existing oversized specs, including the single spec of the `sw-import-export-activity` example, still opt out with an `eslint-disable` comment for these rules; that is legacy, not the target pattern.

## Code check (6.7.15.1)
- confirmed `.spec/` — files inside split spec directories are excluded from the "needs a spec" list — vendor/shopware/administration/Resources/app/administration/src/meta/meta.spec.js:32
- confirmed `testDirectories` — directories ending in `.spec` containing `*.spec.{js,ts}` files are collected — vendor/shopware/administration/Resources/app/administration/src/meta/meta.spec.js:63
- confirmed `splitSpecDirectory` — split directory named after the source file counts as coverage — vendor/shopware/administration/Resources/app/administration/src/meta/meta.spec.js:104
- confirmed `splitSpecDirectoryWithFolderName` — split directory named after the folder (for index files) also counts — vendor/shopware/administration/Resources/app/administration/src/meta/meta.spec.js:107
- confirmed `sw-test-rules/test-file-max-lines-error` — both ESLint rules disabled in the still-unsplit example spec — vendor/shopware/administration/Resources/app/administration/src/module/sw-import-export/component/sw-import-export-activity/sw-import-export-activity.spec.js:1
- unverified `test-file-max-lines-warning` thresholds (500/1000) — ESLint rule implementation and Jest config live outside src/, out of scope
