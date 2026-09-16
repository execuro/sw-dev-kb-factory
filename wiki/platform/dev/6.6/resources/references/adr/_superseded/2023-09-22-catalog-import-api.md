---
id: platform/dev/6.6/resources/references/adr/_superseded/2023-09-22-catalog-import-api.md
title: Catalog Import API
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/_superseded/2023-09-22-catalog-import-api.html
sourceHash: 2a55fdcb7050870d7582b1377e00c4b70ba75bf1
keywords: ["Catalog Import API", "ProductBatch", "importFactory", "record endpoint", "commit endpoint", "status endpoint", "cancel endpoint", "media.enable_url_upload_feature", "Resolvers", "RFC5424", "superseded", "import catalog"]
summary: "Superseded ADR proposing a schema-independent Catalog Import API (PHP + REST) with record/commit/status endpoints; project was aborted."
lastBuilt: 2026-09-15
---
## What it is

This is a superseded ADR proposing a new schema-independent Catalog Import API (PHP layer plus HTTP API) for importing products, categories, media and tax data, replacing the direct-database-schema-mapped import API. The document notes the project was aborted after further issues surfaced.

## When to use

Historical reference only: describes a proposed, never-completed API for building import middlewares against Shopware catalog data without needing to know the DAL/database schema.

## Key steps / config

PHP entry point:

```php
$productBatch = ProductBatch::fromRequestData($myProductData);
$session = $this->importFactory->startSession('my-import');
$session->addProductRecords($productBatch);
$session->commit();
```

Proposed REST endpoints:

- `POST /api/import/catalog/start` — creates an import, returns a unique import identifier.
- `POST /api/import/{{import_id}}/record` — creates/updates entities (staged, not yet imported); custom entities go under an `extensions` key.
- `POST /api/import/{{import_id}}/record/delete` — queues entity deletions.
- `POST /api/import/{{import_id}}/record/unassign` — removes entity associations.
- `POST /api/import/{{import_id}}/commit` — begins the actual import, using the sync API internally for inserts; callable only once.
- `POST /api/import/{{import_id}}/status` — reports status as `started`, `importing`, `cancelled`, or `done`, plus errors so far.
- `POST /api/import/{{import_id}}/cancel` — cancels a non-committed import and deletes its queued records.

Example minimal product payload shape (Appendix A, values elided):

```php
$myProductData = [[
    'id' => '...',
    'name' => '...',
    'productNumber' => '...',
    'tax' => ['name' => '...'],
    'prices' => [['currency' => '...', 'gross' => 0, 'net' => 0, 'linked' => false]],
    'stock' => '...',
    'categories' => [['path' => ['...']]],
    'media' => [['url' => '...', 'title' => '...', 'alt' => '...', 'filename' => '...']],
]];
```

## Essential identifiers

- `POST /api/import/catalog/start`
- `POST /api/import/{{import_id}}/record`
- `POST /api/import/{{import_id}}/commit`
- `POST /api/import/{{import_id}}/status`
- `POST /api/import/{{import_id}}/cancel`
- `media.enable_url_upload_feature`

## Gotchas

Nested entities can be created but not updated via the parent entity — updates must target the root entity directly. `commit` and `cancel` can each only be performed once; subsequent calls return an error. Media is only supported via external URL download in the first iteration, and import skips media entirely if `media.enable_url_upload_feature` is disabled. Errors are classified using severity levels from RFC5424.
