---
id: platform/dev/6.6/assets/adr/catalog-import/examples.md
title: Examples
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/assets/adr/catalog-import/examples.html
sourceHash: d43847afd92374ddbdb1bf39c2667aa3abd89142
keywords: ["catalog import", "import record endpoint", "ADR", "architecture decision record", "product import", "media import", "custom entity import", "category import", "unassign media", "error response", "containsErrors", "product number unique"]
summary: Example request/response payloads for the catalog import record endpoint covering products, media, categories, and custom entities.
lastBuilt: "2026-09-15"
---
## What it is

This page mirrors an architecture decision record (ADR) from the Shopware repository (`adr/assets/catalog-import/examples.md`) and shows example request/response bodies for the catalog import record endpoint.

## Key steps / config

Each example is a `POST` request to an import record endpoint (`/api/import/{{import_id}}/record`, or `.../record/delete` and `.../record/unassign` for those operations), sent as `application/json` with an `Authorization` header using the Bearer scheme (token elided here). The examples given:

- Create a product with new media.
- Update a product and update its media.
- Delete a product and its media.
- Create a product with a custom entity, under `extensions.myCustomEntity`.
- Update a custom entity.
- Create a category and assign products to it, with a `parent` path array.
- Unassign a media item from a product (by id or by `filename`).

Product payload skeleton:

```json
{
  "products": [
    {
      "id": "...",
      "name": "...",
      "productNumber": "...",
      "tax": { "name": "..." },
      "prices": [{ "currency": "...", "gross": 0, "net": 0, "linked": false }],
      "media": [{ "url": "...", "title": "...", "alt": "...", "filename": "..." }]
    }
  ]
}
```

Error responses use a `containsErrors` flag plus a `records[].errors[]` array (each with `message` and `path`), or a batch-status shape with `status`, `totals`, and `failures[].details[]` (each with `severity`, `entity`, `path`, `message`).

## Essential identifiers

- `containsErrors`
- `records[].errors[].message` / `records[].errors[].path`
- `totals.product` / `totals.media` / `totals.total` / `totals.failures`
- `failures[].details[].severity`
- `extensions.myCustomEntity`

## Gotchas

- A missing referenced entity (e.g. updating a product ID that does not exist, or referencing a nonexistent nested product ID inside a category's product list) produces a `containsErrors: true` response with per-path error messages.
- Creating a product with a `productNumber` that is not unique is reported as a `failures[]` entry with severity `error`, not as a top-level `containsErrors` response.
- A media item that fails to download is reported per media path inside `failures[].details[]`, with the product's own failure also listed.
