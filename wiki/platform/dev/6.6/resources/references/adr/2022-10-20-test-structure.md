---
id: platform/dev/6.6/resources/references/adr/2022-10-20-test-structure.md
title: Test structure
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-10-20-test-structure.html"
sourceHash: 69e70b8da314e95da07a47816ce52bc5980550be
keywords: ["test structure", "spec.js", "spec.ts", "sw-cms-el-config-image", "administration tests", "Vue community convention", "component test location", "test naming convention"]
summary: "Documents moving Administration component tests next to their components, named [component].spec.js|ts, TypeScript preferred."
lastBuilt: "2026-09-15"
---
## What it is

ADR documenting the move of Shopware 6 Administration component tests from a single shared `test` folder into the same folder as the component each test covers.

## When to use

Relevant when writing or locating a test for an Administration Vue component, or when wondering why test files no longer live under `src/Administration/Resources/app/administration/test`.

## Key steps / config

- Context: previously, all tests lived in `src/Administration/Resources/app/administration/test`, which made it hard to find the test for a given component while editing it, and hard to see at a glance which components were tested and which were not.
- Decision: move each test next to the component it tests, following the pattern common in the Vue community. For example, the test for `sw-cms-el-config-image` moves to `src/Administration/Resources/app/administration/src/module/sw-cms/component/sw-cms-el-config-image/sw-cms-el-config-image.spec.js`.
- Naming convention: the test file must be named after the component it tests, following the pattern `[component name].spec.js|ts` (the brackets are not part of the file name). Test files can be `.js` or `.ts`, with TypeScript preferred.
- Consequence: test files are no longer loaded from the old shared `test` folder.

## Essential identifiers

- `*.spec.js` / `*.spec.ts` naming convention
- `src/Administration/Resources/app/administration/src/module/<module>/component/<component>/`

## Gotchas

Any tooling or documentation that still references the old shared `src/Administration/Resources/app/administration/test` folder is stale — that folder is no longer where component tests are loaded from.
