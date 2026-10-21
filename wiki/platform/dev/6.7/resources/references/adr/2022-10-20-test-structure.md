---
id: platform/dev/6.7/resources/references/adr/2022-10-20-test-structure.md
title: Test structure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-10-20-test-structure.html
sourceHash: 69e70b8da314e95da07a47816ce52bc5980550be
codeCheckedAgainst: "6.7.15.1"
keywords: ["test structure", "adr", "administration", "jest", "spec.js", "spec.ts", "colocated tests", "unit tests", "sw-cms-el-config-image", "wrapTestComponent", "test file naming", "typescript"]
summary: "ADR 2022-10-20: Administration Jest tests live next to the component they test as [component name].spec.js|ts instead of a central test folder."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area: administration, 2022-10-20) that moves Administration unit tests out of the single central folder `src/Administration/Resources/app/administration/test` and into the same folder as the component each test covers.

## When to use

When writing or locating a Jest test for an Administration component or module, and when deciding where a new spec file goes and how to name it.

## Key steps / config

- Place the spec file in the same directory as the component it tests (the usual Vue-community layout). The central `test` folder no longer holds component tests; test files are not loaded from it.
- Name the file after the component: `[component name].spec.js|ts` (the brackets are not part of the name), for example `sw-cms-sidebar.spec.js` next to the `sw-cms-sidebar` component in `src/module/sw-cms/component/sw-cms-sidebar/`.
- Use `.js` or `.ts`; TypeScript is preferred for new tests.
- In the installed code, specs mount the component under test by its registered name via `wrapTestComponent('<component-name>', { ... })`.

## Essential identifiers

- `src/Administration/Resources/app/administration/test` — the former central test folder
- `[component name].spec.js` / `[component name].spec.ts` — required file-name pattern
- `wrapTestComponent` — helper the colocated specs use to mount a component

## Gotchas

- The motivation stated by the ADR: with one central folder you had to search for the matching test when changing a component, and you could not see which components had tests at all.
- The ADR's example path `src/module/sw-cms/component/sw-cms-el-config-image/sw-cms-el-config-image.spec.js` does not exist in 6.7. The `sw-cms-el-config-image` component lives in `src/module/sw-cms/elements/image/config/`, and its colocated spec there is named `config.spec.js` (after the folder, not the component), so the naming rule is not applied uniformly to element config components.

## Code check (6.7.15.1)
- corrected `sw-cms-el-config-image` — docs: test at `component/sw-cms-el-config-image/sw-cms-el-config-image.spec.js`; actual spec is `elements/image/config/config.spec.js` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/image/config/config.spec.js:10
- confirmed `sw-cms-el-config-image` — registered from `./config` in the image element module — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/image/index.ts:12
- confirmed `sw-cms-sidebar` — spec `sw-cms-sidebar.spec.js` sits beside the component and follows the naming rule — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/component/sw-cms-sidebar/sw-cms-sidebar.spec.js:90
- confirmed `wrapTestComponent` — colocated specs mount the component by registered name — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/image/config/config.spec.js:10
