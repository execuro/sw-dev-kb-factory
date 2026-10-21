---
id: platform/dev/6.7/guides/development/integrations-api/partial-data-loading.md
title: Partial Data Loading
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/partial-data-loading.html
sourceHash: 83852e04300c4549fcaf8e5dc8bf83155106f020
codeCheckedAgainst: "6.7.15.1"
keywords: ["partial data loading", "fields", "Criteria::addFields", "PartialEntity", "Runtime", "core.listing.partialDataLoading", "includes", "excludeFields", "select fields", "reduce response size", "field selection", "search api"]
summary: Use the search criteria fields parameter to load only selected entity fields at database level, incl. association fields and Runtime flag dependencies.
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/development/integrations-api/search-criteria.md", "platform/dev/6.7/guides/hosting/performance/performance-tweaks.md"]
---
## What it is

Partial data loading lets an API client select which fields of an entity are returned. Unlike `includes`, it already works at the database level: only the requested fields are read, so response size and backend load drop. In the DAL it maps to `Criteria::addFields()`, and the read returns `PartialEntity` instances in a generic collection instead of the definition's entity classes.

## When to use

- A client needs only a few fields of an entity (e.g. currency names) and should not load the whole entity.
- You want less database work than `includes` gives you. `includes` loads the full entity and only filters the output (see [Search Criteria](platform/dev/6.7/guides/development/integrations-api/search-criteria.md)).

## Key steps / config

1. Send a `fields` array in the search criteria body of a `POST /api/search/<entity>` request:

```json
{
  "fields": ["name", "salesChannels.name"]
}
```

2. Dotted paths reference association fields. The API adds the needed associations automatically (`salesChannels` above).
3. The response keeps the normal shape (`total`, `data[]`, `aggregations`). Each record carries the requested fields plus `id`, `translated`, `extensions`, `_uniqueIdentifier` and `apiAlias`.
4. For a custom entity definition with a runtime-computed field, pass the storage fields it depends on to the `Runtime` flag constructor. They are then loaded whenever the runtime field is requested:

```php
(new StringField('path', 'path'))->addFlags(new ApiAware()),
// requesting "url" also loads "path"
(new StringField('url', 'url'))->addFlags(new ApiAware(), new Runtime(['path'])),
```

Core does this itself, e.g. `MediaDefinition` declares `url` with `new Runtime(['path', 'private', 'updatedAt'])`.

Storefront product listings use a related mechanism when the system config `core.listing.partialDataLoading` is enabled (default `false`). See [Reduced product data in listings](platform/dev/6.7/guides/hosting/performance/performance-tweaks.md).

## Essential identifiers

- Criteria payload key `fields`
- `Criteria::addFields()`, `PartialEntity`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Runtime` (constructor arg: list of dependent fields)
- `core.listing.partialDataLoading`
- `includes` (response-only filtering, for comparison)

## Gotchas

- Some fields are always loaded and cannot be removed, such as `id` and join-related fields like foreign keys.
- Runtime fields (e.g. `isSystemDefault` on currency) are loaded by default when their referenced data is available. Otherwise, list them in `fields` to force loading.
- Partial loading works only on the entity level. Custom Store API responses (product detail page, CMS) need the full entity and cannot use it. Use `includes` there for smaller responses.
- In code, `addFields()` and `excludeFields()` are mutually exclusive and throw if combined. The listing setting `core.listing.partialDataLoading` actually uses the denylist variant `excludeFields()`: it drops `description`, `keywords` and `customSearchKeywords` and keeps typed entities. It only applies when the criteria has neither fields nor excluded fields set.

## Code check (6.7.15.1)
- confirmed `fields` — accepted criteria payload key, passed to addFields — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:256
- confirmed `Criteria::addFields()` — allowlist of storage fields, returns PartialEntity instances — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:649
- confirmed `PartialEntity` — entity class returned for partial reads — vendor/shopware/core/Framework/DataAbstractionLayer/PartialEntity.php:12
- confirmed `Runtime::__construct()` — takes array dependsOn of fields loaded alongside — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Runtime.php:14
- confirmed `CriteriaFieldsResolver` — adds associations for dotted accessors and Runtime dependencies — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/CriteriaFieldsResolver.php:15
- confirmed `Runtime` — media url depends on path, private, updatedAt — vendor/shopware/core/Content/Media/MediaDefinition.php:119
- confirmed `core.listing.partialDataLoading` — read per sales channel in listing loader — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingLoader.php:146
- confirmed `partialDataLoading` — bool system config, default false — vendor/shopware/core/System/Resources/config/listing.xml:36
- corrected `Criteria::excludeFields()` — docs: listings use partial data loading; code applies the excludeFields denylist — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingLoader.php:149
- confirmed `Criteria::excludeFields()` — mutually exclusive with addFields — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:687
