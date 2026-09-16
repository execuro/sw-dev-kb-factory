---
id: platform/dev/6.6/products/extensions/migration-assistant/concept/writer.md
title: Writer
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/concept/writer.html
sourceHash: c43a6be7020525f5891ae71244c57d94e18e6d10
keywords: ["Writer", "AbstractWriter", "WriterInterface", "ProductWriter", "shopware.migration.writer", "supports", "writeData", "MigrationDataWriter", "WriteException", "swag_migration_data"]
summary: "Writer objects read converted data from swag_migration_data and write it to a Shopware 6 table; extend AbstractWriter and implement supports()."
lastBuilt: "2026-09-15"
---
## What it is

`Writer` objects take the converted data stored in `swag_migration_data` and write it into the corresponding Shopware 6 table; each `Writer` supports exactly one entity/target table.

## When to use

Needed when adding write support for a new entity in a migration profile.

## Key steps / config

Register a writer, extending `AbstractWriter`, in the profile's service XML with the `shopware.migration.writer` tag:

```xml
<service id="SwagMigrationAssistant\Migration\Writer\ProductWriter"
         parent="SwagMigrationAssistant\Migration\Writer\AbstractWriter">
    <argument type="service" id="Shopware\Core\Framework\DataAbstractionLayer\Write\EntityWriter"/>
    <argument type="service" id="Shopware\Core\Content\Product\ProductDefinition"/>
    <tag name="shopware.migration.writer"/>
</service>
```

Most writers only need to implement `supports(): string`, returning the entity name the writer handles:

```php
class ProductWriter extends AbstractWriter
{
    public function supports(): string
    {
        return DefaultEntities::PRODUCT;
    }
}
```

For full control, implement `WriterInterface` directly; the class receives converted data in `writeData()`, batched according to the request limit. Error handling lives in the overlying `MigrationDataWriter`: if writing fails with a `WriteException` from the DAL, it excludes the reported failures and retries; on any other exception it retries entries one by one to minimize data loss.

## Essential identifiers

`AbstractWriter`, `WriterInterface`, `ProductWriter`, `shopware.migration.writer` tag, `supports()`, `writeData()`, `MigrationDataWriter`, `WriteException`, `swag_migration_data`.
