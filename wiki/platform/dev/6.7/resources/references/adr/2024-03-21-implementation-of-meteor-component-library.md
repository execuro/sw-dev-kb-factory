---
id: platform/dev/6.7/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.md
title: Implementation of Meteor Component Library
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.html
sourceHash: db0df2bb28371b20bec70fc181b23a385ea8cc54
codeCheckedAgainst: "6.7.13.0"
keywords: ["meteor component library", "mt-", "mt-button", "mt-data-table", "sw-data-grid", "MtButton", "MtDataTable", "@shopware-ag/meteor-component-library", "wrapper component", "base components", "codemod", "administration", "adr"]
summary: "ADR 2024-03-21: Meteor Component Library (mt- prefix) replaces admin base components; sw-* wrappers switch by 6.7 flag; sw-data-grid kept."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2024-03-21, area administration) to adopt the Meteor Component Library in the Shopware Administration as the replacement for the existing base components, and how the transition is staged.

## When to use

When migrating plugin Administration templates from the old `sw-*` base components to Meteor `mt-*` components, or when deciding whether a component (e.g. a data grid) has a direct Meteor successor.

## Key steps / config

1. **Prefix `mt-`**: Meteor components and their CSS classes carry the `mt-` prefix to avoid clashes with the existing base components and CSS classes. Old exports stay in the library (with a console deprecation warning); switching means changing the import path.
2. **Parallel usage (6.6 phase)**: each base component moved into a wrapper component that renders the old or the Meteor implementation based on the major feature flag for 6.7. Meteor components can also be used directly with the `mt-` prefix:
   ```html
   <sw-example oldProperty="old">Example</sw-example>
   <sw-example newProperty="new">Example</sw-example>
   <mt-example newProperty="new">Example</mt-example>
   ```
3. **Code migration tool**: a codemod replaces old components, properties and slot usage with Meteor equivalents for the common cases; edge cases need manual work, using the codemod output as a base.
4. **Complex components stay**: where the Meteor component differs substantially (e.g. `mt-data-table` vs. `sw-data-grid`), the old implementation is kept so developers can migrate at their own pace. Manual migrations that contain breaking changes must be done behind a feature flag and released in a major.
5. In the installed 6.7 Administration, Meteor components are registered globally from `@shopware-ag/meteor-component-library` (e.g. `MtButton` eagerly, `MtDataTable` lazily), so `mt-button` / `mt-data-table` can be used in templates directly.

## Essential identifiers

- `mt-` prefix (components and CSS classes)
- `mt-button`, `mt-data-table`
- `sw-data-grid`
- `@shopware-ag/meteor-component-library`

## Gotchas

- `sw-button` is a wrapper that auto-switches between the old button and `mt-button`; in 6.7.13 it is marked `@deprecated tag:v6.8.0` ("use mt-button instead").
- The codemod does not cover every edge case.
- `mt-data-table` is not a drop-in replacement for `sw-data-grid`.
- The ADR says `sw-data-grid` would get a deprecation note; the installed 6.7.13 `sw-data-grid` component carries no `@deprecated` annotation.

## Version notes

- 6.6: Meteor and old base components run in parallel, switched via the 6.7 major feature flag inside wrapper components.
- 6.7: wrappers such as `sw-button` remain but are deprecated for removal in 6.8.0.

## Code check (6.7.13.0)
- confirmed `MtButton` — imported from the Meteor library and registered globally — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:26
- confirmed `MtDataTable` — registered as lazy Meteor component — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:484
- confirmed `@shopware-ag/meteor-component-library` — styles imported in admin main — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:58
- deprecated `sw-button` — wrapper for sw-button/mt-button, removed in v6.8.0 — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-button/index.js:10
- corrected `sw-data-grid` — docs: kept with a deprecation note; installed component has no deprecation annotation — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:13
