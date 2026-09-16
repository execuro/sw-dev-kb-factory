---
id: platform/dev/6.6/products/extensions/migration-assistant/concept/media-processing.md
title: Media Processing
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/concept/media-processing.html
sourceHash: 4339d486ef757d5a35bcad4fd5873a2611385e82
keywords: ["MediaFileProcessorInterface", "HttpMediaDownloadService", "swag_migration_media_file", "MediaConverter", "mediaFileService", "saveMediaFile", "MediaDefinition", "media table", "MediaWriter", "api gateway"]
summary: "How media files are imported: a media_file table row is processed by a MediaFileProcessorInterface, e.g. HttpMediaDownloadService."
lastBuilt: "2026-09-15"
---
## What it is

Explains how the Migration Assistant imports media files: creating a media entity plus a row in the `swag_migration_media_file` table, then processing that row with a `MediaFileProcessorInterface` implementation.

## When to use

Needed when writing or debugging a converter that handles media/files, or when implementing a custom media processor for a new gateway.

## Key steps / config

Two steps import a file: create a media object (`MediaDefinition` / `media` table, handled by `MediaConverter`) and create a matching entry in `SwagMigrationMediaFileDefinition` / `swag_migration_media_file`. The `MediaConverter::convert()` method calls:

```php
$this->mediaFileService->saveMediaFile([
    'runId' => $migrationContext->getRunUuid(),
    'entity' => MediaDataSet::getEntity(),
    'uri' => $data['uri'] ?? $data['path'],
    'fileName' => $data['name'],
    'fileSize' => (int) $data['file_size'],
    'mediaId' => $converted['id'],
]);
```

Every `swag_migration_media_file` row for the current run is processed by an implementation of `MediaFileProcessorInterface` (its `supports()` matches profile, gateway, and `DataSet`). For the `api` gateway, `HttpMediaDownloadService` downloads the files via HTTP, using promises (`Promise\settle`) to await all requests even if some fail; it then saves files to a temporary folder, copies them to the Shopware 6 filesystem, sets a `processed` flag, and saves any warnings via `LoggingService::saveLogging`. The `local` gateway instead copies/renames files directly in the local filesystem.

## Essential identifiers

`MediaFileProcessorInterface`, `HttpMediaDownloadService`, `MediaConverter`, `MediaDataSet`, `swag_migration_media_file`, `mediaFileService::saveMediaFile()`, `MediaWriter`.

## Gotchas

The processor used depends on both the gateway and whether the entry is a document or normal media file — implementations differ accordingly, so a new gateway typically needs its own `MediaFileProcessorInterface` implementation.
