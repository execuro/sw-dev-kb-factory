---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/writer.md
title: Writer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/writer.html
sourceHash: b05268c65dea4efdc691c8974157505bc45edeef
codeCheckedAgainst: "6.7.13.0"
keywords: ["migration writer", "ProductWriter", "AbstractWriter", "WriterInterface", "writeData", "supports", "shopware.migration.writer", "MigrationDataWriter", "WriteException", "swag_migration_data", "DefaultEntities", "migration assistant"]
summary: "Migration Assistant writers: tag shopware.migration.writer, extend the plugin's AbstractWriter, implement supports(); MigrationDataWriter handles retries."
lastBuilt: 2026-09-15
---
## What it is

In the Shopware Migration Assistant, `Writer` objects take converted data from the `swag_migration_data` table and write it to the matching Shopware 6 table. Each writer supports exactly one entity, usually the target table.

## When to use

When a custom migration profile adds a new entity type that must be written to Shopware 6, or when writing needs more control than the plugin's default writer behaviour.

## Key steps / config

1. Register the writer with the plugin's abstract writer as parent service and the writer tag:

```php
$services->set(ProductWriter::class)
    ->parent(AbstractWriter::class)
    ->args([ /* ... */ ])
    ->tag('shopware.migration.writer');
```

2. Usually extend the plugin's `AbstractWriter` (e.g. `SwagMigrationAssistant\Migration\Writer\ProductWriter`); it provides most behaviour, and only `supports()` has to be implemented, returning the entity name (for products `DefaultEntities::PRODUCT`).
3. For full control, implement `WriterInterface` instead; data arrives in `writeData()` as an array of converted values, sized by the request limit.

## Essential identifiers

- `SwagMigrationAssistant\Migration\Writer\ProductWriter`
- `AbstractWriter` (Migration Assistant), `WriterInterface`
- `supports()`, `writeData()`
- `shopware.migration.writer`
- `MigrationDataWriter`, `swag_migration_data`, `DefaultEntities::PRODUCT`

## Gotchas

- Error handling is done by the surrounding `MigrationDataWriter`: on a DAL `WriteException` it excludes the reported failures and writes again; on any other exception it retries entries one by one to minimise data loss. Writers should not duplicate that logic.
- Name clash: core also has `Shopware\Core\Content\ImportExport\Processing\Writer\AbstractWriter`, which requires `append()`, `flush()` and `finish()`. That class is unrelated to the Migration Assistant writer; import the plugin's `AbstractWriter`, not the Import/Export one.

## Code check (6.7.13.0)
- confirmed `WriteException` — DAL write exception class exists — vendor/shopware/core/Framework/DataAbstractionLayer/Write/WriteException.php:11
- corrected `AbstractWriter` — docs: plugin base class; the only installed `AbstractWriter` is Import/Export's, requiring append/flush/finish — vendor/shopware/core/Content/ImportExport/Processing/Writer/AbstractWriter.php:10
- unverified `shopware.migration.writer` — SwagMigrationAssistant plugin tag, out of scope
- unverified `WriterInterface` — plugin code, out of scope
- unverified `MigrationDataWriter` — plugin code, out of scope
- unverified `ProductWriter` — plugin code, out of scope
- unverified `DefaultEntities::PRODUCT` — plugin code, out of scope
