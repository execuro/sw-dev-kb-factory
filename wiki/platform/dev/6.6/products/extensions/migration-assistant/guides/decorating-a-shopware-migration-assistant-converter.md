---
id: platform/dev/6.6/products/extensions/migration-assistant/guides/decorating-a-shopware-migration-assistant-converter.md
title: Decorating a Shopware Migration Assistant converter
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/guides/decorating-a-shopware-migration-assistant-converter.html
sourceHash: e4279b03ed2b813c28db760f7a820a1aea0a6af7
keywords: ["migration assistant", "migration converter", "decorator pattern", "AbstractPremappingReader", "premapping", "PremappingStruct", "PremappingEntityStruct", "PremappingChoiceStruct", "ProductConverter", "ConvertStruct", "services.xml decorates", "manufacturer mapping"]
summary: "Guide to decorating a Shopware 6 migration converter with a custom premapping reader for manufacturer mapping."
lastBuilt: "2026-09-15"
---
## What it is

A guide showing how to decorate a Shopware Migration Assistant converter from the Migration Connector plugin so that a decorated converter can enrich converted products with data from a custom `premapping field` (here, manufacturer mapping).

## When to use

Use this when you want to add migration behavior to an existing plugin (instead of writing a whole new migration plugin) and need the migration to map a source-system value (e.g. manufacturer) that the base converter does not handle, without requiring the Migration Assistant plugin as a hard dependency.

## Key steps / config

1. Create a premapping reader extending `AbstractPremappingReader`. It implements `getMappingName()`, `supports(MigrationContextInterface, array $entityGroupNames)`, and `getPremapping(Context, MigrationContextInterface): PremappingStruct`, building entries with `PremappingEntityStruct` and `PremappingChoiceStruct`.
2. Add a snippet file for the premapping card title, e.g. `Resources\administration\snippet\en-GB.json`:
   ```json
   {
     "swag-migration": {
       "index": {
         "premappingCard": {
           "group": { "swag_manufacturer": "Manufacturer" }
         }
       }
     }
   }
   ```
   Register it via `Application.addInitializerDecorator('locale', ...)` in `Resources\administration\main.js`.
3. Decorate the target converter (e.g. `Shopware55ProductConverter`) by extending `ProductConverter`, injecting the original `ConverterInterface` as `$originalProductConverter`, and overriding `convert()` to look up the premapping via `$this->mappingService->getMapping(...)` using `ManufacturerReader::getMappingName()`, then merge the resolved `manufacturerId` into the converted array before returning a new `ConvertStruct`.
4. Register the decorator in `services.xml` using the `decorates` attribute, pointing at the original converter's service id and injecting `.inner`.

## Essential identifiers

- `AbstractPremappingReader`, `PremappingStruct`, `PremappingEntityStruct`, `PremappingChoiceStruct`
- `GatewayRegistryInterface`, `ShopwareGatewayInterface`, `MigrationContextInterface`, `ShopwareProfileInterface`
- `ProductConverter`, `ConverterInterface`, `ConvertStruct`, `MappingServiceInterface`
- `ManufacturerReader::getMappingName()`
- `services.xml` `decorates` attribute

## Gotchas

If you want to decorate more than the one example converter (`Shopware55ProductConverter`), the same decoration pattern must be repeated for each additional Shopware migration converter you need to affect.
