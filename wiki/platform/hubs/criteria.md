---
id: platform/hubs/criteria.md
title: "Criteria & Data Abstraction Layer (DAL)"
summary: "Navigation hub for DAL/Criteria docs: EntityRepository, filters, associations, admin data handling, ADRs, across 6.6 and 6.7."
keywords: ["dal", "data abstraction layer", "criteria", "entityrepository", "repositoryfactory", "filters", "associations", "aggregations", "custom fields", "stock", "admin api", "app scripts", "adr", "versioning", "inheritance"]
members: ["platform/dev/6.6/concepts/framework/data-abstraction-layer.md", "platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/05-http-client.md", "platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md", "platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md", "platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/making-api-requests.md", "platform/dev/6.6/guides/plugins/plugins/content/stock/reading-writing-stock.md", "platform/dev/6.6/guides/plugins/plugins/framework/data-handling/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/data-handling/reading-data.md", "platform/dev/6.6/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md", "platform/dev/6.6/resources/references/adr/2020-11-19-dal-join-filter.md", "platform/dev/6.6/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.md", "platform/dev/6.6/resources/references/adr/2023-02-02-deprecate-autoload-true-in-dal-associations.md", "platform/dev/6.6/resources/references/app-reference/script-reference/data-loading-script-services-reference.md", "platform/dev/6.6/resources/references/core-reference/dal-reference/_index.md", "platform/dev/6.7/concepts/api/_index.md", "platform/dev/6.7/concepts/framework/data-abstraction-layer.md", "platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/data-loading.md", "platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/05-http-client.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md", "platform/dev/6.7/guides/plugins/plugins/content/stock/reading-writing-stock.md", "platform/dev/6.7/guides/plugins/plugins/framework/custom-field/fetching-data-from-entity-selection.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/deleting-associated-data.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md", "platform/dev/6.7/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md", "platform/dev/6.7/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.md", "platform/dev/6.7/resources/references/adr/2023-02-02-deprecate-autoload-true-in-dal-associations.md", "platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md"]
lastBuilt: 2026-09-15
---

This hub covers the Data Abstraction Layer (DAL): building `Criteria` objects, querying and
mutating entities through `EntityRepository`/`repositoryFactory`, filters and aggregations,
associations, translation/versioning/inheritance, and the Administration's JS-side data
handling built on the same concepts. Come here instead of grepping directly when you need to
find the right DAL/Criteria doc for a PHP plugin, an Administration module, an app script, or
an ADR explaining a DAL design decision — most content is duplicated near-identically across
`dev/6.6` and `dev/6.7`, and this hub tells you which pairs are duplicates versus which pages
changed between versions.

## Core concept

- [Data Abstraction Layer](platform/dev/6.6/concepts/framework/data-abstraction-layer.md) — 6.6: EntityRepository CRUD, translation fallback levels, versioning, product/variant inheritance, and indexing.
- [Data Abstraction Layer](platform/dev/6.7/concepts/framework/data-abstraction-layer.md) — 6.7: same concept (EntityRepository via DI, translation fallback, `version_id`, Context, inheritance, indexers) — near-duplicate of the 6.6 page, kept per-version.
- [API](platform/dev/6.7/concepts/api/_index.md) — 6.7 overview of Store API and Admin API, the two HTTP JSON APIs that expose Criteria-based search.
- [DAL Reference](platform/dev/6.6/resources/references/core-reference/dal-reference/_index.md) — 6.6 index for fields, flags, filters and aggregations reference material.
- [Filters Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md) — 6.7: PHP filter classes (`EqualsFilter`, `EqualsAnyFilter`, `ContainsFilter`, `RangeFilter`, `NotFilter`, `MultiFilter`, `PrefixFilter`, `SuffixFilter`) and their API criteria JSON shapes.

## Reading and writing data (PHP plugins)

- [Data Handling / DataAbstractionLayer](platform/dev/6.6/guides/plugins/plugins/framework/data-handling/_index.md) — 6.6 landing page for reading/writing entity data and DAL events.
- [Reading data](platform/dev/6.6/guides/plugins/plugins/framework/data-handling/reading-data.md) — 6.6: filters, associations, aggregations, sorting, paging, `RepositoryIterator`.
- [Reading Data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md) — 6.7 equivalent of the same guide, same techniques.
- [Removing Associated Data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/deleting-associated-data.md) — 6.7 only: nulling ToOne foreign keys vs. deleting ManyToMany/OneToMany mapping rows.
- [Reading and Writing Stock](platform/dev/6.6/guides/plugins/plugins/content/stock/reading-writing-stock.md) — 6.6: `product.stock` field via `getStock()` and product-repository `update()`.
- [Reading and Writing Stock](platform/dev/6.7/guides/plugins/plugins/content/stock/reading-writing-stock.md) — 6.7 equivalent stock guide, near-duplicate of the 6.6 page.
- [Fetching data from "entity selection" custom field](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/fetching-data-from-entity-selection.md) — 6.7 only: resolving an entity-selection custom field's stored ID via a repository search and `addExtension`.

## Administration (JS) data handling

- [Using the data handling](platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md) — 6.6: `Repository`, `Criteria`, `repositoryFactory` for admin CRUD and associations.
- [Using Data Handling](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md) — 6.7 equivalent, adds `syncDeleted`/`assign` coverage.
- [Data Handling and Processing](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/_index.md) — 6.7 only: index of admin data-handling guides (repositories, criteria, data grid, custom fields, media, Vuex state).
- [Using custom fields](platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md) — 6.6: `sw-custom-field-set-renderer` plus a `custom_field_set` repository and Criteria.
- [Using Custom Fields](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md) — 6.7 equivalent, near-duplicate of the 6.6 page.
- [Making API requests](platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/making-api-requests.md) — 6.6 only: building a custom `ApiService` subclass for plugin HTTP requests.

## App SDK / app scripts

- [HTTP-client](platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/05-http-client.md) — 6.6 JS App SDK: `HttpClient`, `EntityRepository`, `SyncService`, media-manager helpers.
- [HTTP-client](platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/05-http-client.md) — 6.7 equivalent, adds automatic OAuth2 token handling.
- [Data Loading](platform/dev/6.7/guides/plugins/apps/app-scripts/data-loading.md) — 6.7 only: app-script `services.repository`/`services.store` with `page-loaded` hooks and Criteria arrays.
- [Data loading services reference](platform/dev/6.6/resources/references/app-reference/script-reference/data-loading-script-services-reference.md) — 6.6: `services.repository` and `services.store` facade reference.
- [Data Loading script services reference](platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md) — 6.7 equivalent reference, near-duplicate of the 6.6 page.

## ADRs (design decisions)

- [The best-practice to always re-fetch the data after saving](platform/dev/6.6/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md) — 6.6: reload via `repository.get` after `repository.save`.
- [The best-practice to always re-fetch the data after saving](platform/dev/6.7/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md) — 6.7, same ADR duplicated per version.
- [DAL join filter](platform/dev/6.6/resources/references/adr/2020-11-19-dal-join-filter.md) — 6.6 only: per-multi-filter join-groups for correct anti-join/join resolution on to-many associations.
- [Extract data handling classes to extension sdk](platform/dev/6.6/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.md) — 6.6: `Entity`/`EntityCollection`/`Criteria` moved to `@shopware-ag/meteor-extension-sdk`.
- [Extract data handling classes to extension sdk](platform/dev/6.7/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.md) — 6.7, same ADR duplicated per version.
- [Deprecate autoloading associations in DAL entity definitions](platform/dev/6.6/resources/references/adr/2023-02-02-deprecate-autoload-true-in-dal-associations.md) — 6.6: deprecates `autoload: true`, requires explicit Criteria associations from 6.6.
- [Deprecate autoloading associations in DAL entity definitions](platform/dev/6.7/resources/references/adr/2023-02-02-deprecate-autoload-true-in-dal-associations.md) — 6.7, same ADR duplicated per version.
