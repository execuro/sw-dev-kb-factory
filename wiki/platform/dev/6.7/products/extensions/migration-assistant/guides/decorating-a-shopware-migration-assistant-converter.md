---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/migration-assistant/guides/decorating-a-shopware-migration-assistant-converter.md
sourceHash: 12865764d08fac95289b1984fb47a707715d0399
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/guides/decorating-a-shopware-migration-assistant-converter.html
title: Decorating a Shopware Migration Assistant converter
version: "6.7"
versions:
  - "6.7"
keywords: ["SwagMigrationAssistant", "converter decoration", "Shopware55ProductConverter", "AbstractPremappingReader", "premapping", "PremappingStruct", "MappingService", "ConvertStruct", "manufacturer mapping", "decorate", "swag_manufacturer", "shopware 5 migration"]
summary: Decorate Shopware55ProductConverter with a premapping reader so migrated products get a manufacturer chosen in a new premapping card.
lastBuilt: 2026-10-21
---
## What it is

A guide for decorating a product converter of the Migration Assistant plugin (`SwagMigrationAssistant`) so converted Shopware 5 products receive a manufacturer the user picks in a premapping card, instead of new manufacturers being created. Requires the Migration Assistant in Shopware 6 and a running Shopware 5 reachable via API or local gateway.

## When to use

You want to change how Shopware 5 data is converted (here: product manufacturer) without forking the Migration Assistant — ideally inside an existing plugin that stays installable without it (optional requirement; migration services are injected only when the plugin is present).

## Key steps / config

1. **Premapping reader** — `ManufacturerReader extends SwagMigrationAssistant\Migration\Premapping\AbstractPremappingReader` (args: manufacturer `EntityRepository`, `GatewayRegistryInterface`).
   - static `getMappingName()` returns `'swag_manufacturer'`.
   - `supports($migrationContext, array $entityGroupNames)` — `ShopwareProfileInterface` profile and `ProductDataSelection::IDENTIFIER` in the group names.
   - `getPremapping(Context, MigrationContextInterface)` returns `new PremappingStruct(self::getMappingName(), $mapping, $choices)`: mapping = `PremappingEntityStruct` per row of source table `s_articles_supplier` (via `readTable()`), choices = Shopware 6 manufacturers sorted by `FieldSorting('name')` as `PremappingChoiceStruct`, optional preselection via `setDestinationUuid()`.
2. **Snippets** — card title under `swag-migration.index.premappingCard.group.swag_manufacturer` in `Resources\administration\snippet`, registered for `en-GB` in `Resources\administration\main.js` via the locale factory's `extend('en-GB', enGBSnippets)`.
   ```json
   { "swag-migration": { "index": { "premappingCard": { "group": { "swag_manufacturer": "Manufacturer" } } } } }
   ```
3. **Decorated converter** — `Shopware55DecoratedProductConverter extends SwagMigrationAssistant\Profile\Shopware\Converter\ProductConverter`, constructor `(ConverterInterface $originalProductConverter, MappingServiceInterface, LoggingServiceInterface, MediaFileServiceInterface)`. Delegate `supports()`, `getSourceIdentifier()`, `getMediaUuids()`, `writeMapping()` to the original. In `convert()`: take and unset `$data['manufacturer']`, look up `mappingService->getMapping($connectionId, ManufacturerReader::getMappingName(), $manufacturerId, $context)`, run the original `convert()`, set `$converted['manufacturerId'] = $mapping['entityUuid']`, return a new `ConvertStruct`.
4. **Register** in `services.php`:
   ```php
   $services->set(SwagMigrationExtendConverterExample\Profile\Shopware\Converter\Shopware55DecoratedProductConverter::class)
       ->decorate(SwagMigrationAssistant\Profile\Shopware55\Converter\Shopware55ProductConverter::class)
       ->args([
           service('.inner'),
           service(SwagMigrationAssistant\Migration\Mapping\MappingService::class),
           service(SwagMigrationAssistant\Migration\Logging\LoggingService::class),
           service(SwagMigrationAssistant\Migration\Media\MediaFileService::class),
       ]);
   ```

## Essential identifiers

- `AbstractPremappingReader`, `PremappingStruct`, `PremappingEntityStruct`, `PremappingChoiceStruct`
- `Shopware55ProductConverter`, `ProductConverter`, `ConverterInterface`, `ConvertStruct`, `MappingService`
- Core: `ProductManufacturerEntity`, `EntityRepository`, `Criteria`, `FieldSorting`

## Gotchas

- Only `Shopware55ProductConverter` is decorated; to cover all Shopware profiles, decorate each product converter the same way.
- Without a manufacturer id or a found premapping, return the original converter's result unchanged.
- The guide registers snippets with `Application.addInitializerDecorator('locale', ...)`, which does not exist in the installed 6.7 Administration; the locale factory's `extend()` adds the messages.
- Full example: `swag-docs-decorate-shopware-migration-converter` in the `shopwareArchive` GitHub organisation.

## Code check (6.7.15.1)
- absent `addInitializerDecorator` — not defined anywhere in the installed 6.7 code index
- confirmed `extend` — locale factory extends a locale with translations — vendor/shopware/administration/Resources/app/administration/src/core/factory/locale.factory.ts:100
- confirmed `ProductManufacturerEntity` — core manufacturer entity — vendor/shopware/core/Content/Product/Aggregate/ProductManufacturer/ProductManufacturerEntity.php:17
- confirmed `EntityRepository` — core DAL repository — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:37
- confirmed `Criteria` — core search criteria — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:25
- confirmed `FieldSorting` — core sorting — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Sorting/FieldSorting.php:10
- confirmed `Context` — core context class — vendor/shopware/core/Framework/Context.php:18
- unverified `AbstractPremappingReader` — SwagMigrationAssistant plugin, out of scope
- unverified `Shopware55ProductConverter` — SwagMigrationAssistant plugin, out of scope
- unverified `MappingService` — SwagMigrationAssistant plugin, out of scope
