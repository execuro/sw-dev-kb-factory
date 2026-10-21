---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/media-processing.md
title: Media Processing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/media-processing.html
sourceHash: 54ad397ba940e101bd0079ccfd12b3cdb0252bb9
codeCheckedAgainst: "6.7.15.1"
keywords: ["media processing", "swag_migration_media_file", "MediaConverter", "MediaFileService", "MediaFileProcessorRegistry", "MediaFileProcessorInterface", "HttpMediaDownloadService", "HttpDownloadServiceBase", "LocalMediaProcessor", "BaseMediaService", "media download", "file import", "migration assistant"]
summary: Migration Assistant media - converters queue files in swag_migration_media_file; a gateway-specific processor downloads or copies them.
lastBuilt: 2026-10-21
---
## What it is

Media migration in the Shopware Migration Assistant runs in two phases: during conversion the media mapping is created and file metadata is queued in `swag_migration_media_file`; during the media-processing step a gateway-specific processor imports the files into Shopware 6.

## When to use

When writing a converter that produces media, adding a media processor for a custom profile/gateway, or debugging media files that were not imported.

## Key steps / config

1. **Queue during conversion.** `SwagMigrationAssistant\Profile\Shopware\Converter\MediaConverter::convert()` generates a checksum, gets or creates the main mapping (`DefaultEntities::MEDIA`, source id, checksum) and uses its `entityId` as the media id, then queues one record:

```php
$this->mediaFileService->saveMediaFile([
    'runId' => /* current run id */,
    'entity' => MediaDataSet::getEntity(),
    'uri' => $data['uri'] ?? $data['path'],
    'fileName' => $data['name'] ?? $converted['id'],
    'fileSize' => (int) $data['file_size'],
    'mediaId' => $converted['id'],
]);
```

2. `MediaFileService` persists the records and marks them `written` once the related entity write has completed.
3. **Processor selection.** `SwagMigrationAssistant\Migration\Media\MediaFileProcessorRegistry::getProcessor()` returns the first processor whose `supports($migrationContext)` is true; if none matches it throws a `MigrationException` naming the connection's profile and gateway.
4. **API gateway.** `SwagMigrationAssistant\Profile\Shopware\Media\HttpMediaDownloadService` extends `SwagMigrationAssistant\Migration\Media\Processor\HttpDownloadServiceBase` (which extends `BaseMediaService` and implements `MediaFileProcessorInterface`). It supports a Shopware profile + `ShopwareApiGateway::GATEWAY_NAME` + the media data set entity, and provides `getMediaEntity()` (`DefaultEntities::MEDIA`) and `getHttpClient()` (`HttpSimpleClient`). The base `process()` maps the workload by media id, loads media files, issues parallel download requests (`doMediaDownloadRequests()`, settled with `Utils::settle()`), and calls `setProcessedFlag()` with finished and failed ids.
5. **Local gateway.** `SwagMigrationAssistant\Profile\Shopware\Media\LocalMediaProcessor` (extends `BaseMediaService`, implements `MediaFileProcessorInterface`) supports Shopware profile + `ShopwareLocalGateway::GATEWAY_NAME` + media data set; `process()` resolves local paths via `getMediaPathMapping()` and copies files with `copyMediaFiles()`.

## Essential identifiers

- Table `swag_migration_media_file`; status fields `written` (entity write finished), `processed` (import succeeded), `processFailure` (column `process_failure`, processing failed)
- `MediaFileService::saveMediaFile()`
- `MediaFileProcessorRegistry::getProcessor()`, `MediaFileProcessorInterface::supports()` / `process()`
- `HttpMediaDownloadService`, `HttpDownloadServiceBase`, `LocalMediaProcessor`, `BaseMediaService`

## Gotchas

- Exactly one processor is resolved per migration context — the first whose `supports()` returns true; the built-in processors check profile, gateway name and data set entity together.
- The source names the registry's failure factory `MigrationException::processorNotFound()`; that identifier is absent from the installed Shopware code index.

## Code check (6.7.15.1)
- absent `processorNotFound` — not found anywhere in the installed code index
- unverified `MediaFileProcessorRegistry` — SwagMigrationAssistant plugin, outside installed core roots
- unverified `HttpDownloadServiceBase` — SwagMigrationAssistant plugin, out of scope
- unverified `LocalMediaProcessor` — SwagMigrationAssistant plugin, out of scope
- unverified `swag_migration_media_file` — plugin table, not defined in Shopware core
- unverified `Utils::settle()` — Guzzle promises, vendor package out of scope
- confirmed `Context` — core context class in process() signature — vendor/shopware/core/Framework/Context.php:18
