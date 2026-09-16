---
id: platform/dev/6.7/resources/references/adr/2022-10-20-test-structure.md
title: Test structure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-10-20-test-structure.html
sourceHash: 69e70b8da314e95da07a47816ce52bc5980550be
codeCheckedAgainst: "6.7.13.0"
keywords: ["[component name].spec.js|ts", ".spec.ts", ".spec.js", "sw-cms-el-config-image", "administration tests", "colocated tests", "test file location", "unit test naming", "vue component tests", "adr"]
summary: "ADR: administration spec files sit next to the component they test, named [component name].spec.ts or .js; the central test folder is not loaded."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2022-10-20, area administration) that moves administration unit tests out of the central folder `src/Administration/Resources/app/administration/test` and next to the components they test.

## When to use

When adding or locating a test for an administration component or module file, or when deciding how to name a new spec file.

## Key steps / config

1. Put the spec file in the same directory as the component it tests (standard Vue community practice).
2. Name it after the component: `[component name].spec.js|ts` (the brackets are not part of the name). TypeScript (`.spec.ts`) is preferred.
3. ADR example: the test for `sw-cms-el-config-image` goes to `src/Administration/Resources/app/administration/src/module/sw-cms/component/sw-cms-el-config-image/sw-cms-el-config-image.spec.js`. In 6.7 that component is registered from `src/module/sw-cms/elements/image/config/`, so its colocated spec belongs in that directory.

## Essential identifiers

- `[component name].spec.js|ts`
- `src/Administration/Resources/app/administration/src/` (component and spec location)

## Gotchas

- Test files are no longer loaded from the old `test` folder; a spec placed there is not picked up.
- Solves two problems: searching for the matching test while changing a component, and not being able to see which components have tests.
- Spec files are not shipped in the installed administration package, so a colocated spec cannot be looked up in a Composer installation.

## Code check (6.7.13.0)
- corrected `sw-cms-el-config-image` — docs: component under module/sw-cms/component/sw-cms-el-config-image/; registered from elements/image/config — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/image/index.ts:12
- confirmed `sw-cms-el-config-image` — used as configComponent of the image CMS element — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/image/index.ts:27
- unverified `[component name].spec.js|ts` — spec files and test runner config are not part of the installed vendor/shopware administration src
