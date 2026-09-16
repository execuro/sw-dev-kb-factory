---
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/_index.md
title: Data Handling and Processing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/
sourceHash: 71394db43888d279fc5bd8653fcd2c223a416e53
codeCheckedAgainst: "6.7.13.0"
keywords: ["data handling", "administration data", "repository", "criteria", "associations", "custom fields", "media", "data grid", "vuex state", "Shopware.State", "Shopware.Store", "the shopware object", "search"]
summary: Index of Administration plugin guides on data handling - repositories, criteria, data grid, custom fields, media, search, Vuex state, the Shopware object.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/search-custom-data.md"]
---
## What it is

Section index for the guides on how plugins work with data in the Administration (and Storefront): manipulating, displaying and extending data, including repositories, criteria, associations, custom fields, media and the related UI components.

## When to use

Start here when an Administration plugin needs to load, save, list or display entity data and you need to pick the right sub-guide.

## Key steps / config

Guides in this section, in source order:

- Using Data Handling — repositories, criteria, associations.
- Using the Data Grid Component.
- Using Custom Fields.
- Handling Media — upload, upload listener and preview components.
- Add Custom Data to the Search — [platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/search-custom-data.md](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/search-custom-data.md).
- Using Vuex State.
- The Shopware Object — the global `Shopware` object.

## Essential identifiers

- `Shopware.Store` — state store accessor on the global object
- `repositoryFactory` — injected service used by Administration components to create entity repositories

## Gotchas

- The "Using Vuex State" guide relates to `Shopware.State`, which the installed 6.7 Administration marks `@deprecated tag:v6.8.0` ("use Store instead"); new code should use `Shopware.Store`.

## Code check (6.7.13.0)
- deprecated `Shopware.State` — `public State = StateFactory()` marked deprecated for v6.8.0, use Store — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:169
- confirmed `Shopware.Store` — `public Store = Store.instance` on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:171
- confirmed `repositoryFactory` — injected and used via `repositoryFactory.create('media')` — vendor/shopware/administration/Resources/app/administration/src/app/component/utils/sw-upload-listener/index.js:50
