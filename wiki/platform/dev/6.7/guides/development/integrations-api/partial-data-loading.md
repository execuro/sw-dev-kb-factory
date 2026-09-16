---
id: platform/dev/6.7/guides/development/integrations-api/partial-data-loading.md
title: Partial Data Loading
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/partial-data-loading.html
sourceHash: 83852e04300c4549fcaf8e5dc8bf83155106f020
codeCheckedAgainst: "6.7.13.0"
keywords: ["partial data loading", "fields", "select specific fields", "includes", "core.listing.partialDataLoading", "Runtime", "runtime fields", "Criteria::addFields", "reduce response size", "search api", "entity fields", "database level"]
summary: The criteria fields parameter loads only selected entity fields at DB level (unlike includes); Runtime flag dependencies and listing config.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/integrations-api/search-criteria.md", "platform/dev/6.7/guides/hosting/performance/performance-tweaks.md"]
---
## What it is

Partial data loading lets an API search request select specific entity fields via the `fields` criteria parameter, so only those fields are loaded from the database. Shopware uses the same mechanism for storefront product listings when `core.listing.partialDataLoading` is enabled (see [Reduced product data in listings](platform/dev/6.7/guides/hosting/performance/performance-tweaks.md)).

## When to use

When a client needs only a few fields of an entity and you want smaller responses and less database work than loading the full entity.

## Key steps / config

Send `fields` in a search criteria payload:

```http
POST /api/search/currency
Content-Type: application/json

{ "fields": ["name", "salesChannels.name"] }
```

- Fields may reference association fields (`salesChannels.name`); the API adds the needed associations automatically.
- The response still contains entity envelope data (`id`, `translated`, `apiAlias`, `extensions`, `_uniqueIdentifier`).

Runtime fields in a custom entity definition declare the fields they depend on in the `Runtime` flag constructor, so those are loaded when the runtime field is requested:

```php
protected function defineFields(): FieldCollection
{
    return new FieldCollection([
        (new IdField('id', 'id'))->addFlags(new ApiAware(), new PrimaryKey(), new Required()),
        (new StringField('path', 'path'))->addFlags(new ApiAware()),
        (new StringField('url', 'url'))->addFlags(new ApiAware(), new Runtime(['path'])),
    ]);
}
```

Storefront listings: system config `core.listing.partialDataLoading` (bool, default `false`) applies partial loading only when the criteria has no explicit fields or excluded fields.

## Essential identifiers

- `fields` (criteria payload key), `Criteria::addFields()`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Runtime` (`new Runtime(['path'])`)
- `core.listing.partialDataLoading`
- `includes` (the post-processing alternative, see [search criteria](platform/dev/6.7/guides/development/integrations-api/search-criteria.md))

## Gotchas

- Partial data loading is not `includes`: `includes` filters the output after the full entity is loaded; `fields` restricts what the database loads.
- `id` and join-related fields such as foreign keys are always loaded and cannot be removed.
- Runtime fields (e.g. currency `isSystemDefault`) are loaded by default when the referenced data is available; otherwise request them explicitly in `fields`.
- It works only on the entity level. Custom Store API responses (product detail page, CMS) need the whole entity and do not support it; use `includes` there for smaller responses.

## Code check (6.7.13.0)
- confirmed `fields` — request criteria payload key passed to Criteria::addFields — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:256
- confirmed `Criteria::addFields()` — criteria method storing selected fields — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:629
- confirmed `includes` — separate criteria payload key setting includes — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:168
- confirmed `Runtime` — flag class whose constructor takes the depends-on field list — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Runtime.php:12
- confirmed `Runtime::getDepends()` — returns the declared dependencies, used by the criteria fields resolver — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Runtime.php:23
- confirmed `core.listing.partialDataLoading` — read per sales channel in listing loader, only without explicit fields — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingLoader.php:146
- confirmed `partialDataLoading` — bool config field, default false — vendor/shopware/core/System/Resources/config/listing.xml:36
- unverified `url` — the documented core runtime `url`/`path` example was not located verbatim in the installed code
