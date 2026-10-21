---
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/_index.md
title: Data Handling and Processing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/
sourceHash: 71394db43888d279fc5bd8653fcd2c223a416e53
codeCheckedAgainst: "6.7.15.1"
keywords: ["data handling", "repository", "criteria", "associations", "custom fields", "media", "data grid", "search", "vuex state", "Shopware.Store", "Shopware.State", "shopware object"]
summary: Overview of Administration plugin guides on data handling - repositories, criteria, data grid, custom fields, media, search, state, Shopware object.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/search-custom-data.md"]
---
## What it is

Section index for the plugin guides on working with data in the Administration (and Storefront): manipulating, displaying and extending data with repositories, criteria, associations, custom fields, media and the related UI components.

## When to use

Entry point when you need one of these guides:

- Using Data Handling (repositories, criteria, associations)
- Using the Data Grid Component
- Using Custom Fields
- Handling Media
- [Add Custom Data to the Search](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/search-custom-data.md)
- Using Vuex State
- The Shopware Object (the global `Shopware` object with `Shopware.Component`, `Shopware.Data`, `Shopware.Store`)

## Version notes

In 6.7 the Vuex-based `Shopware.State` is deprecated (removal planned for 6.8) in favour of the Pinia-based `Shopware.Store`; prefer `Shopware.Store` when following the "Using Vuex State" guide.

## Code check (6.7.15.1)
- deprecated `Shopware.State` — tagged `@deprecated tag:v6.8.0`, use Store instead — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:182
- deprecated `vuex` — Vuex state factory deprecated for removal in 6.8 — vendor/shopware/administration/Resources/app/administration/src/core/factory/state.factory.ts:6
- confirmed `Shopware.Store` — global store instance — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:184
- confirmed `Shopware.Data` — data layer (repositories, Criteria) on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:275
- confirmed `Shopware.Component` — component factory on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:134
