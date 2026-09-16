---
id: platform/dev/6.7/assets/adr/catalog-import/examples.md
title: Examples
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/assets/adr/catalog-import/examples.html
sourceHash: d43847afd92374ddbdb1bf39c2667aa3abd89142
codeCheckedAgainst: "6.7.13.0"
keywords: ["catalog import", "import api", "adr", "import record", "bulk import", "products", "media", "categories", "extensions", "unassign media", "import error response", "failures"]
summary: Catalog-import ADR asset - example requests/responses for a proposed import API (products, media, categories, custom entities); absent in 6.7.13.0.
lastBuilt: 2026-09-15
---
## What it is

An asset of the catalog-import architecture decision record (ADR), mirrored from the ADR section of the Shopware 6 repository. It lists example HTTP requests and responses for a proposed import API that creates, updates, deletes and un-assigns catalog records (products, media, categories, custom entities) within an import run identified by an import id.

## When to use

When reading the catalog-import ADR and needing concrete payload shapes, or when checking whether the proposed import API exists in the installed Shopware version (it does not in 6.7.13.0 - see Gotchas).

## Key steps / config

All examples are JSON `POST` requests authenticated against the Admin API. Records are grouped by top-level entity key.

Create / update (records keyed by entity; nested entities and custom entities via `extensions`):

```json
{
  "products": [
    { "id": "...", "name": "...", "productNumber": "...",
      "tax": { "name": "..." },
      "prices": [ { "currency": "EUR", "gross": 0, "net": 0, "linked": false } ],
      "media": [ { "url": "https://...", "title": "...", "alt": "...", "filename": "..." } ],
      "extensions": { "myCustomEntity": { "id": "...", "name": "..." } } }
  ],
  "media": [ { "id": "...", "title": "..." } ],
  "categories": [ { "name": "...", "parent": ["Home", "..."], "products": [ { "id": "..." } ] } ]
}
```

- Updates reuse the same shape with only `id` plus changed fields; a top-level `extensions.myCustomEntity` list updates custom entity records.
- Categories reference their parent by a name path (`parent: ["Home", "Category 2", ...]`).
- Delete: body lists ids per entity, e.g. `{ "products": ["<id>"], "media": ["<id>"] }`.
- Un-assign: `{ "products": { "id": "...", "media": [ { "id": "..." }, { "filename": "..." } ] } }` - media matched by `id` or `filename`.

## Gotchas

- The proposed endpoints are `POST /api/import/{import_id}/record`, `.../record/delete` and `.../record/unassign`. None of these routes exists in the installed 6.7.13.0 code - this page describes an ADR proposal, not a usable API.
- Synchronous resolution errors return per-record errors with a dotted `path`:

```json
{ "containsErrors": true,
  "records": [ { "id": "...", "errors": [ { "message": "ID prod1d1 not found", "path": "categories.0.products.1" } ] } ] }
```

- Import status responses report asynchronous failures (e.g. non-unique product number, media download failure) under `failures[].details[]` with `severity`, `entity`, `path`, `message`, plus `status`, `startTime`, `duration` and `totals` (`product`, `media`, `total`, `failures`). A failing nested media also adds a failure on the parent product.

## Code check (6.7.13.0)
- absent `/api/import/{import_id}/record` — no `api/import` route string anywhere in the installed Shopware code
- absent `/api/import/{import_id}/record/unassign` — no `record/unassign` route in the installed Shopware code
- absent `containsErrors` — response key not found anywhere in the installed Shopware code
