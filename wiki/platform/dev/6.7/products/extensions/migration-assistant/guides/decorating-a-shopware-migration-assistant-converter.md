---
id: platform/dev/6.7/products/extensions/migration-assistant/guides/decorating-a-shopware-migration-assistant-converter.md
title: Decorating a Shopware Migration Assistant converter
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/guides/decorating-a-shopware-migration-assistant-converter.html
sourceHash: 12865764d08fac95289b1984fb47a707715d0399
codeCheckedAgainst: "6.7.13.0"
keywords: ["converter decoration", "premapping", "AbstractPremappingReader", "PremappingStruct", "Shopware55ProductConverter", "ProductConverter", "ConvertStruct", "MappingService", "manufacturer mapping", "swag_manufacturer", "premapping card snippet", "SwagMigrationAssistant", "decorate converter"]
summary: "Decorate SwagMigrationAssistant Shopware55ProductConverter via a premapping reader (AbstractPremappingReader) to map SW5 manufacturers to SW6 ones."
lastBuilt: 2026-09-15
---
## What it is

Guide for decorating a Shopware (5) product converter of the Migration Assistant: a custom premapping reader lets the user map source manufacturers to existing Shopware 6 manufacturers, and a decorated converter writes the chosen `manufacturerId` into the converted product.

## When to use

Changing how an existing Shopware migration converter maps data (here: manufacturers are premapped, not created), possibly from an existing plugin that must stay installable without the Migration Assistant.

## Key steps / config

1. **Premapping reader** — `ManufacturerReader extends SwagMigrationAssistant\Migration\Premapping\AbstractPremappingReader`:
   - `MAPPING_NAME = 'swag_manufacturer'`, returned by `public static function getMappingName(): string`.
   - `supports(MigrationContextInterface $migrationContext, array $entityGroupNames): bool` — Shopware profile and product DataSelection identifier in `$entityGroupNames`.
   - `getPremapping(Context $context, MigrationContextInterface $migrationContext): PremappingStruct` — reads `s_articles_supplier` through the gateway's `readTable()`, builds `PremappingEntityStruct` entries, loads choices (`PremappingChoiceStruct`) from the manufacturer `EntityRepository` with a `Criteria` sorted by `FieldSorting('name')`, preselects by name, returns `new PremappingStruct(self::getMappingName(), $mapping, $choices)`.
2. **Card title snippet** — en-GB JSON registered from the plugin's Administration `main.js` with `Shopware.Locale.extend('en-GB', enGBSnippets)`:

```json
{ "swag-migration": { "index": { "premappingCard": { "group": {
    "swag_manufacturer": "Manufacturer"
} } } } }
```

3. **Decorated converter** — `Shopware55DecoratedProductConverter extends SwagMigrationAssistant\Profile\Shopware\Converter\ProductConverter`; constructor gets the inner `ConverterInterface` plus `MappingServiceInterface`, `LoggingServiceInterface`, `MediaFileServiceInterface` (passed to `parent::__construct`). `supports()`, `getSourceIdentifier()`, `getMediaUuids()`, `writeMapping()` delegate to the inner converter. `convert()` removes `$data['manufacturer']`, looks up `mappingService->getMapping(connectionId, getMappingName(), manufacturerId, context)`, runs the inner `convert()`, sets `manufacturerId` from `entityUuid` and returns a new `ConvertStruct($converted, getUnmapped(), getMappingUuid())`.
4. **Register the decoration**:

```php
$services->set(Shopware55DecoratedProductConverter::class)
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
- `Shopware55ProductConverter`, `ConverterInterface`, `ConvertStruct`, `MappingService`
- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`, `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`

## Gotchas

- Only `Shopware55ProductConverter` is decorated; to cover all Shopware source versions, decorate each Shopware product converter the same way.
- The source registers snippets with `Application.addInitializerDecorator('locale', ...)`; that API is not in the installed Administration — use `Shopware.Locale.extend`.

## Code check (6.7.13.0)
- confirmed `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository` — manufacturer repository type — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:36
- confirmed `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria` — criteria for manufacturer choices — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:25
- confirmed `Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting` — sorting by name — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Sorting/FieldSorting.php:10
- confirmed `Shopware\Core\Content\Product\Aggregate\ProductManufacturer\ProductManufacturerEntity` — manufacturer entity class — vendor/shopware/core/Content/Product/Aggregate/ProductManufacturer/ProductManufacturerEntity.php:14
- confirmed `Shopware\Core\Framework\Context` — context argument — vendor/shopware/core/Framework/Context.php:17
- absent `addInitializerDecorator` — not found in any installed Shopware package
- confirmed `LocaleFactory.extend` — exposed as `Shopware.Locale.extend` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:192
- confirmed `SwagMigrationAssistant` — core only references the plugin by name; its classes are not under vendor/shopware — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:33
- unverified `Shopware55ProductConverter` — SwagMigrationAssistant plugin not installed, out of scope
- unverified `AbstractPremappingReader` — SwagMigrationAssistant plugin not installed, out of scope
