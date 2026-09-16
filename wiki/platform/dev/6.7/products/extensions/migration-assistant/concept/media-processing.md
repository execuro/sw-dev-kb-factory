---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/media-processing.md
title: Media Processing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/media-processing.html
sourceHash: 54ad397ba940e101bd0079ccfd12b3cdb0252bb9
codeCheckedAgainst: "6.7.13.0"
keywords: ["media processing", "swag_migration_media_file", "MediaConverter", "MediaFileService", "MediaFileProcessorRegistry", "MediaFileProcessorInterface", "HttpMediaDownloadService", "HttpDownloadServiceBase", "LocalMediaProcessor", "BaseMediaService", "media download", "image migration", "migration assistant"]
summary: "Migration Assistant media: converters queue files in swag_migration_media_file; MediaFileProcessorRegistry picks the HTTP download or local copy processor."
lastBuilt: 2026-09-15
---
## What it is

Migration Assistant media migration has two phases:

1. During conversion, the converter creates the media mapping and queues file metadata in `swag_migration_media_file`.
2. During the media-processing step, a processor for the active gateway imports the files into Shopware 6.

## When to use

When writing a converter that migrates files, or a processor for a new gateway or profile, or when debugging media that failed to import.

## Key steps / config

1. **Queue files in the converter** (docs example: `SwagMigrationAssistant\Profile\Shopware\Converter\MediaConverter::convert()`). Get or create the mapping with `$this->mappingService->getOrCreateMapping($connectionId, DefaultEntities::MEDIA, $data['id'], $context, $this->checksum)`. Then queue the file:

```php
$this->mediaFileService->saveMediaFile([
    'runId' => $migrationContext->getRunUuid(),
    'entity' => MediaDataSet::getEntity(),
    'uri' => $data['uri'] ?? $data['path'],
    'fileName' => $data['name'] ?? $converted['id'],
    'fileSize' => (int) $data['file_size'],
    'mediaId' => $converted['id'],
]);
```

   `MediaFileService` stores these records and marks them `written` once the related entity write has completed.
2. **Processor selection**: `SwagMigrationAssistant\Migration\Media\MediaFileProcessorRegistry::getProcessor($migrationContext)` returns the first processor whose `supports($migrationContext)` is true. If none matches, it throws a `MigrationException` naming the profile and gateway.
3. **Implement a processor** as `MediaFileProcessorInterface` with `supports()` and `process(MigrationContextInterface $migrationContext, Context $context, array $workload): array`:
   - API gateway: `SwagMigrationAssistant\Profile\Shopware\Media\HttpMediaDownloadService extends HttpDownloadServiceBase`. It supports the context when the profile is a `ShopwareProfileInterface`, the gateway name is `ShopwareApiGateway::GATEWAY_NAME`, and the data set entity is `MediaDataSet::getEntity()`. It overrides `getMediaEntity()` and `getHttpClient()`, which returns `HttpSimpleClient`. `HttpDownloadServiceBase::process()` maps the workload by media id and calls `getMediaFiles()`. It then sends the download requests concurrently (`doMediaDownloadRequests()`, `Utils::settle(...)->wait()`) and records the outcome with `setProcessedFlag()`.
   - Local gateway: `SwagMigrationAssistant\Profile\Shopware\Media\LocalMediaProcessor extends BaseMediaService` uses the same checks with `ShopwareLocalGateway::GATEWAY_NAME`. Its `process()` calls `getMediaFiles()`, then `getMediaPathMapping()`, then `copyMediaFiles()`.

## Essential identifiers

- Table `swag_migration_media_file` with status fields `written`, `processed`, `processFailure` (column `process_failure`)
- `MediaFileService::saveMediaFile()`
- `MediaFileProcessorRegistry`, `MediaFileProcessorRegistryInterface`, `MediaFileProcessorInterface`
- `HttpDownloadServiceBase`, `HttpMediaDownloadService`, `LocalMediaProcessor`, `BaseMediaService`

## Gotchas

- Only one processor is used per migration context: the first one whose `supports()` returns true.
- If no processor matches, the registry throws via `MigrationException::processorNotFound($profileName, $gatewayName)`. That factory name comes from the docs and is not present in the installed code index (see Code check).
- The `written` flag means the entity write finished. It does not mean the file was imported; that is `processed`, or `processFailure` if the import failed.

## Code check (6.7.13.0)
- absent `processorNotFound` — not found in the installed code index; SwagMigrationAssistant is not installed under vendor/shopware
- confirmed `MediaDefinition::ENTITY_NAME` — core media entity name `'media'` — vendor/shopware/core/Content/Media/MediaDefinition.php:65
- confirmed `Context` — core context passed to process() — vendor/shopware/core/Framework/Context.php:17
- unverified `swag_migration_media_file` — plugin table, plugin not installed in vendor/shopware
- unverified `MediaFileProcessorRegistry` — plugin class, plugin not installed in vendor/shopware
- unverified `MediaFileProcessorInterface` — plugin interface, plugin not installed in vendor/shopware
- unverified `HttpDownloadServiceBase` — plugin class, plugin not installed in vendor/shopware
- unverified `LocalMediaProcessor` — plugin class, plugin not installed in vendor/shopware
- unverified `Utils::settle()` — guzzlehttp/promises, out of scope
