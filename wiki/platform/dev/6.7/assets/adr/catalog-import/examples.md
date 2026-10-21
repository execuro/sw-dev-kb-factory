---
id: platform/dev/6.7/assets/adr/catalog-import/examples.md
title: Examples
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/assets/adr/catalog-import/examples.html
sourceHash: d43847afd92374ddbdb1bf39c2667aa3abd89142
codeCheckedAgainst: "6.7.15.1"
keywords: ["catalog import", "import api", "/api/import/{import_id}/record", "/api/import/{import_id}/record/delete", "/api/import/{import_id}/record/unassign", "containsErrors", "failures", "adr", "bulk product import", "media import", "custom entity extensions", "category assignment"]
summary: ADR request/response examples for a proposed catalog import API (/api/import/{import_id}/record, delete, unassign) - not implemented in Shopware 6.7.15.1.
lastBuilt: 2026-10-20
---
## What it is

A set of request and response examples attached to an architecture decision record (ADR) on catalog import, mirrored from the Shopware repository's ADR section. It sketches an import endpoint family under `/api/import/{{import_id}}/record` that accepts products, media, categories and custom-entity extensions in one payload and reports per-record errors. The installed 6.7.15.1 code contains none of these routes (see Gotchas and Code check), so this is a design proposal, not a usable API.

## When to use

When reading or discussing the catalog-import ADR and you need the proposed payload shapes. For working bulk imports on 6.7, use the existing Admin API sync route `/api/_action/sync`.

## Key steps / config

All proposed requests are `POST` with a JSON body (`Content-Type: application/json`, `Accept: application/json`) and an authenticated Admin API token.

Record payload skeleton (create/update):

```json
{
  "products": [{
    "id": "...", "name": "...", "productNumber": "...",
    "tax": { "name": "..." },
    "prices": [{ "currency": "EUR", "gross": 0, "net": 0, "linked": false }],
    "media": [{ "url": "https://...", "title": "...", "alt": "...", "filename": "..." }],
    "extensions": { "myCustomEntity": { "id": "...", "name": "..." } }
  }],
  "media": [{ "id": "...", "title": "..." }],
  "categories": [{ "name": "...", "parent": ["Home", "..."], "products": [{ "id": "..." }] }]
}
```

- Tax is referenced by `name`; a category parent by a name path array (`["Home", "Category 2", "Category 3"]`).
- Updating a custom entity sends a top-level `extensions.myCustomEntity` array next to `products`.
- Delete payload: ID lists per entity, `{"products": ["..."], "media": ["..."]}`.
- Unassign payload: `{"products": {"id": "...", "media": [{"id": "..."}, {"filename": "..."}]}}` — a media can be matched by `id` or `filename`.

Status response skeleton (asynchronous processing result):

```json
{ "status": "done", "startTime": "...", "duration": "...",
  "totals": { "product": 0, "media": 0, "total": 0, "failures": 0 },
  "failures": [{ "entity": "product", "path": "products.0",
    "details": [{ "severity": "error", "entity": "media", "path": "products.0.media.0", "message": "..." }] }] }
```

## Gotchas

- None of the proposed routes exist in 6.7.15.1: `/api/import/{{import_id}}/record` (create/update), `/api/import/{{import_id}}/record/delete` and `/api/import/{{import_id}}/record/unassign`.
- Unresolvable root IDs ("ID ... not found", path `products.0`) and nested IDs (path `categories.0.products.1`) are meant to be reported synchronously as `{"containsErrors": true, "records": [{"id": "...", "errors": [{"message": "...", "path": "..."}]}]}`.
- Validation failures such as a non-unique `productNumber`, or media that fails to download, appear only in the status response under `failures[].details[]`, each with its own `entity` and `path`.

## Code check (6.7.15.1)
- absent `/api/import/{import_id}/record` — no route with this path exists anywhere in the installed code
- absent `/api/import/{import_id}/record/delete` — no such route in the installed code
- absent `/api/import/{import_id}/record/unassign` — no such route in the installed code
- absent `containsErrors` — response key not found anywhere in the installed code
- confirmed `/api/_action/sync` — existing Admin API bulk-write route usable for imports today — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
