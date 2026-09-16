---
id: platform/dev/6.6/guides/integrations-api/general-concepts/partial-data-loading.md
title: Partial Data Loading
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/integrations-api/general-concepts/partial-data-loading.html
sourceHash: aa790b49ce3b4794e9928120a7f0e7f7356a48ba
keywords: ["partial data loading", "fields parameter", "includes", "search api", "runtime field", "ApiAware", "Runtime flag", "PrimaryKey", "database level filtering", "custom entity definition"]
summary: "The `fields` request parameter loads only requested entity fields at the database level, unlike the post-processing `includes` feature."
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/guides/integrations-api/general-concepts/search-criteria.md
---

## What it is

Partial data loading lets a caller select specific fields of an entity for the API to
return, reducing response size and improving performance.

## When to use

When only a subset of an entity's fields is needed, especially for high-volume or
performance-sensitive calls — instead of loading and then discarding the whole entity.

## Key steps / config

- Difference from `includes`: `includes` filters the already-loaded full entity after the
  fact (post-output processing); partial data loading restricts what the database query
  itself loads.
- Request a `POST /api/search/<entity>` call with a `fields` array in the JSON body
  naming top-level or association fields, e.g. `name` or `salesChannels.name`; associated
  fields needed for the request are added automatically.
- Response shape (fields elided):
  ```json
  {
    "total": 0,
    "data": [
      { "id": "...", "name": "...", "apiAlias": "..." }
    ],
    "aggregations": []
  }
  ```
- Some fields (like `id` and join-relevant foreign keys) are always loaded and cannot be
  removed.
- Runtime fields (e.g. `isSystemDefault`) are computed at request time and loaded by
  default when their source data is available, or can be forced via `fields`.
- Custom entity definitions with a runtime field must list the fields it depends on in the
  field's flags, e.g.:
  ```php
  (new StringField('url', 'url'))->addFlags(new ApiAware(), new Runtime(['path']));
  ```

## Essential identifiers

- `fields` (request body parameter), `POST /api/search/<entity>`
- `ApiAware`, `Runtime`, `PrimaryKey`, `Required`, `IdField`, `StringField`

## Gotchas

- Partial data loading only works at the Entity level — custom Store API responses (e.g.
  product detail pages, CMS) always need the whole entity and cannot use this feature; use
  `includes` for those instead.
