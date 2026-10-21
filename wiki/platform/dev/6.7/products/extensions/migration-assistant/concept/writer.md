---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/writer.md
title: Writer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/writer.html
sourceHash: b05268c65dea4efdc691c8974157505bc45edeef
codeCheckedAgainst: "6.7.15.1"
keywords: ["migration writer", "ProductWriter", "AbstractWriter", "WriterInterface", "writeData", "supports", "MigrationDataWriter", "WriteException", "swag_migration_data", "DefaultEntities", "migration assistant", "write converted data"]
summary: Migration Assistant writers - move converted data from swag_migration_data into Shopware 6 tables, one entity per writer, with retry on WriteException.
lastBuilt: 2026-10-21
---
## What it is

In the Shopware Migration Assistant, `Writer` objects take converted data from the `swag_migration_data` table and write it to the matching Shopware 6 table. Each writer supports exactly one entity, usually the target table.

## When to use

When adding migration support for a new entity, or when you need custom write behaviour beyond the default DAL write of the converted payload.

## Key steps / config

1. Create a writer class for your entity, typically extending the plugin's `AbstractWriter` (`SwagMigrationAssistant\Migration\Writer`), which provides most behaviour. In that case you only implement `supports()`, returning the entity name - the source's `ProductWriter` returns `DefaultEntities::PRODUCT`.
2. Register it as a service with `->parent(AbstractWriter::class)`, its constructor `->args([...])`, and the Migration Assistant's writer tag (exact tag string: see Gotchas).
3. For full control, implement `WriterInterface` yourself instead; the class receives data in `writeData()` as an array of converted values. The batch size depends on the request limit.

## Essential identifiers

- `SwagMigrationAssistant\Migration\Writer\ProductWriter`
- `AbstractWriter` (plugin base), `WriterInterface`, `writeData()`, `supports()`
- `MigrationDataWriter` - surrounding class that handles errors
- `DefaultEntities::PRODUCT`
- `swag_migration_data`

## Gotchas

- Error handling lives in `MigrationDataWriter`: if a write fails with a DAL `WriteException`, it excludes the reported failures and writes again; on any other exception it retries the entries one by one to minimise data loss. Writers need not catch these themselves.
- The source tags writers with `->tag('shopware.migration.writer')`. This tag is defined by the separate SwagMigrationAssistant plugin and does not appear in Shopware core; check it against the installed plugin.
- Do not confuse the plugin's writer base with core's `Shopware\Core\Content\ImportExport\Processing\Writer\AbstractWriter`: the core class (import/export) requires `append()`, `flush()` and `finish()`, which a migration writer does not implement.

## Code check (6.7.15.1)
- confirmed `WriteException` — core DAL write exception the retry logic reacts to — vendor/shopware/core/Framework/DataAbstractionLayer/Write/WriteException.php:11
- confirmed `AbstractWriter::append()` — core import/export AbstractWriter (same short name, different class) declares it abstract — vendor/shopware/core/Content/ImportExport/Processing/Writer/AbstractWriter.php:15
- confirmed `AbstractWriter::flush()` — abstract in core import/export writer — vendor/shopware/core/Content/ImportExport/Processing/Writer/AbstractWriter.php:17
- confirmed `AbstractWriter::finish()` — abstract in core import/export writer — vendor/shopware/core/Content/ImportExport/Processing/Writer/AbstractWriter.php:19
- absent `shopware.migration.writer` — not in the installed core code index; plugin-defined tag
- unverified `ProductWriter` — SwagMigrationAssistant plugin class, out of scope
- unverified `WriterInterface` — plugin interface, out of scope
- unverified `MigrationDataWriter` — plugin class, out of scope
- unverified `DefaultEntities::PRODUCT` — plugin constant, out of scope
