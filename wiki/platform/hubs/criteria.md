---
id: platform/hubs/criteria.md
title: "criteria"
summary: "Criteria in the DAL and Administration: filters, associations, aggregations, repositories, and related ADRs across 6.6 and 6.7."
keywords: ["criteria", "dal", "data abstraction layer", "entityrepository", "filters", "associations", "aggregations", "repositoryfactory", "repositoryiterator", "join filter", "store api", "app scripts"]
members: ["platform/dev/6.6/concepts/framework/data-abstraction-layer.md", "platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/05-http-client.md", "platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md", "platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md", "platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/making-api-requests.md", "platform/dev/6.6/guides/plugins/plugins/content/stock/reading-writing-stock.md", "platform/dev/6.6/guides/plugins/plugins/framework/data-handling/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/data-handling/reading-data.md", "platform/dev/6.6/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md", "platform/dev/6.6/resources/references/adr/2020-11-19-dal-join-filter.md", "platform/dev/6.6/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.md", "platform/dev/6.6/resources/references/adr/2023-02-02-deprecate-autoload-true-in-dal-associations.md", "platform/dev/6.6/resources/references/app-reference/script-reference/data-loading-script-services-reference.md", "platform/dev/6.6/resources/references/core-reference/dal-reference/_index.md", "platform/dev/6.7/concepts/api/_index.md", "platform/dev/6.7/concepts/framework/data-abstraction-layer.md", "platform/dev/6.7/guides/development/troubleshooting/dal-reference/_index.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/data-loading.md", "platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/05-http-client.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md", "platform/dev/6.7/guides/plugins/plugins/framework/custom-field/fetching-data-from-entity-selection.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md", "platform/dev/6.7/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md", "platform/dev/6.7/resources/references/adr/2020-11-19-dal-join-filter.md", "platform/dev/6.7/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.md", "platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md"]
lastBuilt: 2026-10-21
---

# Criteria

`Criteria` is the query object used to read data through the Data Abstraction Layer (DAL): filters, sorting, paging, associations and aggregations. It is used by PHP `EntityRepository` code, the Administration `repositoryFactory`, app scripts, the JS App SDK and the Admin/Store APIs. Come here to find which page covers a given consumer of `Criteria`, or the ADRs that explain a behaviour (join filters, autoloading associations, re-fetching after save). Most pages exist for both 6.6 and 6.7 with near-identical content; where a 6.6 and a 6.7 page share a title, they are the same topic per version.

## Shopware 6.6

DAL concepts and reference
- [Data Abstraction Layer](platform/dev/6.6/concepts/framework/data-abstraction-layer.md) — EntityRepository CRUD, translation fallback, versioning, inheritance, indexing.
- [DAL Reference](platform/dev/6.6/resources/references/core-reference/dal-reference/_index.md) — index of fields, flags, filters and aggregations.
- [Data Handling / DataAbstractionLayer](platform/dev/6.6/guides/plugins/plugins/framework/data-handling/_index.md) — landing page for adding, reading and writing entity data.
- [Reading data](platform/dev/6.6/guides/plugins/plugins/framework/data-handling/reading-data.md) — filters, associations, aggregations, sorting, paging, RepositoryIterator.
- [Reading and Writing Stock](platform/dev/6.6/guides/plugins/plugins/content/stock/reading-writing-stock.md) — product.stock via the product repository.

Administration
- [Using the data handling](platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md) — Repository, Criteria and repositoryFactory for CRUD.
- [Using custom fields](platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md) — sw-custom-field-set-renderer with a repository.
- [Making API requests](platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/making-api-requests.md) — custom ApiService subclass.

Apps and scripts
- [HTTP-client](platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/05-http-client.md) — JS App SDK HttpClient, EntityRepository, SyncService.
- [Data loading services reference](platform/dev/6.6/resources/references/app-reference/script-reference/data-loading-script-services-reference.md) — services.repository and services.store.

ADRs
- [The best-practice to always re-fetch the data after saving](platform/dev/6.6/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md) — repository.get after repository.save.
- [DAL join filter](platform/dev/6.6/resources/references/adr/2020-11-19-dal-join-filter.md) — join-groups for to-many association filters.
- [Extract data handling classes to extension sdk](platform/dev/6.6/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.md) — Entity, EntityCollection, Criteria move to the Meteor extension SDK.
- [Deprecate autoloading associations in DAL entity definitions](platform/dev/6.6/resources/references/adr/2023-02-02-deprecate-autoload-true-in-dal-associations.md) — `autoload: true` deprecated in 6.5; explicit criteria associations from 6.6.

## Shopware 6.7

DAL concepts and reference
- [Data Abstraction Layer](platform/dev/6.7/concepts/framework/data-abstraction-layer.md) — 6.7 version of the DAL concept page.
- [DAL Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/_index.md) — field types, flags, filters, aggregations (moved under troubleshooting guides).
- [API](platform/dev/6.7/concepts/api/_index.md) — Store API and Admin API sharing Criteria-based search.
- [Data Handling / Data Abstraction Layer](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/_index.md) — which guide to use for migrations, entities, reading, writing.
- [Reading Data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md) — filters, post filters, aggregations, count modes.
- [Fetching data from "entity selection" custom field](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/fetching-data-from-entity-selection.md) — resolve stored IDs with product.repository.

Administration
- [Data Handling and Processing](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/_index.md) — overview of Administration data-handling guides.
- [Using Data Handling](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md) — repositoryFactory.create, search, association handling.
- [Using Custom Fields](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md) — render custom field sets in an Admin module.

Apps and scripts
- [Data Loading](platform/dev/6.7/guides/plugins/apps/app-scripts/data-loading.md) — load extra Storefront data in app scripts.
- [HTTP-client](platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/05-http-client.md) — JS App Server SDK HttpClient, Criteria, SyncService.
- [Data Loading script services reference](platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md) — search(), ids(), aggregate().

ADRs (same topics as the 6.6 ADRs above)
- [The best-practice to always re-fetch the data after saving](platform/dev/6.7/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md) — 6.7 copy.
- [DAL join filter](platform/dev/6.7/resources/references/adr/2020-11-19-dal-join-filter.md) — 6.7 copy, adds JoinGroup and JoinGroupBuilder detail.
- [Extract data handling classes to extension sdk](platform/dev/6.7/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.md) — 6.7 copy, references the Meteor admin SDK.
