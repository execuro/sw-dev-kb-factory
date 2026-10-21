---
id: platform/dev/6.7/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.md
title: Implementation of Meteor Component Library
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.html
sourceHash: db0df2bb28371b20bec70fc181b23a385ea8cc54
codeCheckedAgainst: "6.7.15.1"
keywords: ["meteor component library", "@shopware-ag/meteor-component-library", "mt-", "mt-button", "mt-data-table", "sw-button", "sw-data-grid", "base components", "wrapper component", "codemod", "administration", "vue components"]
summary: "ADR: Meteor Component Library replaces Administration base components; mt- prefixed names, wrapper components during 6.6, codemod migration."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2024-03-21, area administration) about adopting the Meteor Component Library in the Shopware platform. Its components replace the Administration's current base components. The ADR lists four measures to make the transition easier: renaming, parallel usage, an automatic code migration tool, and keeping complicated components in their old implementation.

## When to use

Read it when you build or migrate Administration UI in a plugin and must choose between the old `sw-*` base components and their Meteor (`mt-*`) counterparts. It also explains why some old components still exist next to the new ones.

## Key steps / config

1. **Prefix.** Meteor components carry the prefix `mt-` (Meteor) in their names, and their CSS classes carry the same `mt-` prefix. This avoids conflicts with existing component names and CSS classes. The library keeps its old exports so existing imports still work, but using them logs a deprecation warning. You switch by changing the import path.
2. **Use the `mt-*` component directly.** In 6.7.15.1 the Administration's Vue adapter imports the Meteor components from `@shopware-ag/meteor-component-library/dist/esm/<Name>` and registers each one globally under its kebab-case name (`MtButton` → `mt-button`). Heavier components (`MtDataTable`, `MtColorpicker`, `MtPopover`, `MtPopoverItem`) are registered as async components. Template usage:

```html
<mt-example newProperty="new">Example</mt-example>
```

3. **Migrate with the codemod.** The ADR promises a code migration tool that replaces old components with new ones, including properties and slot usage. It covers the most common cases, not every edge case. Use its output as a base and adjust manually.
4. **Complex components.** Where the old and new APIs differ a lot (the ADR's example is `mt-data-table` versus `sw-data-grid`), the old implementation stays available so developers can migrate in their own time. Manual migrations that contain breaking changes must sit behind a feature flag and be released in a major.

## Essential identifiers

- `@shopware-ag/meteor-component-library`: npm package
- `mt-` prefix for component names and CSS classes
- `mt-button`, `mt-data-table`
- `sw-data-grid`: old grid, kept

## Gotchas

- During 6.6, each old component became a "wrapper" component. The wrapper decides, based on the major feature flag 6.7, whether to render the old component or the Meteor one. The ADR's example shows `<sw-example oldProperty="old">` alongside `<sw-example newProperty="new">` and `<mt-example newProperty="new">`. In 6.7.15.1 the `sw-button` wrapper ("Autoswitches between the two components") is marked `@deprecated tag:v6.8.0 - Will be removed, use mt-button instead`. Use `mt-button`.
- The ADR says `sw-data-grid` is kept "with a deprecation note". The installed `sw-data-grid` carries no `@deprecated` marker in 6.7.15.1.

## Version notes

In the 6.6 major the two libraries run in parallel and the 6.7 major feature flag switches between them. In 6.7 the Meteor components are registered globally by default, and wrappers such as `sw-button` are scheduled for removal in 6.8.0.

## Code check (6.7.15.1)
- confirmed `@shopware-ag/meteor-component-library` — imported by the Administration — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:60
- confirmed `MtButton` — imported from the Meteor ESM build and registered as `mt-button` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:26
- confirmed `MtDataTable` — registered as a lazily loaded async component — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:480
- confirmed `kebabCase` — Meteor component names registered in kebab case — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:487
- deprecated `sw-button` — wrapper for sw-button/mt-button, `@deprecated tag:v6.8.0`, use mt-button — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-button/index.js:10
- corrected `sw-data-grid` — docs: kept with a deprecation note; no `@deprecated` marker in the installed component — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:12
- unverified `codemod` — migration tool not part of the checked package roots
