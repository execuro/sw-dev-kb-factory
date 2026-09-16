---
id: platform/dev/6.6/products/extensions/migration-assistant/guides/creating-a-new-migration-profile.md
title: Creating a new migration profile
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/guides/creating-a-new-migration-profile.html
sourceHash: d14e1aefe6f7bb33bc8499c398ff1f7eb66d23c3
keywords: ["ProfileInterface", "shopware.migration.profile", "GatewayInterface", "shopware.migration.gateway", "DataSet", "DataSelection", "shopware.migration.data_selection", "shopware.migration.data_set", "AbstractReader", "shopware.migration.reader", "ShopwareConverter", "shopware.migration.converter", "ProductWriter", "WriterRegistry", "credential form"]
summary: "Step-by-step guide to building a new Migration Assistant profile: profile, gateway, credentials UI, DataSet/DataSelection, reader, converter, and writer."
lastBuilt: "2026-09-15"
---
## What it is

A full walkthrough for building a brand-new Migration Assistant profile for a third-party source system (not Shopware), covering every component needed: profile, gateway, credentials page, DataSet/DataSelection, reader, converter, and writer.

## When to use

Use this guide when migrating from a source system other than Shopware. If instead you want to convert plugin data from an existing Shopware source, use "Extending a Shopware Migration Profile" instead.

## Key steps / config

1. **Setup**: install the Migration Assistant plugin and create a demo source database with a `product` table:
   ```sql
   CREATE TABLE product (
     id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
     product_number varchar(255) NOT NULL,
     price float NOT NULL,
     stock int NOT NULL,
     product_name varchar(255) NOT NULL,
     tax float NOT NULL
   );
   ```
2. **Profile**: implement `ProfileInterface` (e.g. `OwnProfile`) with `PROFILE_NAME`, `SOURCE_SYSTEM_NAME`, `SOURCE_SYSTEM_VERSION`, `AUTHOR_NAME`, `ICON_PATH` constants and their getters, then register/tag it with `shopware.migration.profile` in `service.xml`.
3. **Gateway**: implement `GatewayInterface` (e.g. `OwnLocaleGateway`) with `getName()`, `supports()`, `getSnippetName()`, `read()`, `readEnvironmentInformation()`, `readTotals()`; use `ConnectionFactoryInterface::createDatabaseConnection()` to test connectivity. Register/tag with `shopware.migration.gateway`.
4. **Credentials page**: add an `index.js` under `Resources/app/administration/src/own-profile/profile` that registers a Vue component named `swag-migration-profile-<profileName>-<gatewayName>-credential-form` (e.g. `swag-migration-profile-ownProfile-local-credential-form`), with its own `.html.twig` template, and import it from `main.js`. Without this component the wizard shows an error on the credentials step.
5. **DataSet and DataSelection**: create a `ProductDataSet extends DataSet` with `getEntity(): string` and `supports()`, then a `ProductDataSelection implements DataSelectionInterface` with `IDENTIFIER = 'products'`, `getData(): DataSelectionStruct`, `getDataSets()`, `getDataSetsRequiredForCount()`. Register both, tagging `shopware.migration.data_selection` and `shopware.migration.data_set` respectively. Order in `getDataSets()` matters (e.g. manufacturers before products).
6. **Reader**: create a `ProductReader extends AbstractReader` implementing `supports()`, `supportsTotal()`, `setConnection()`, `readTotal(): ?TotalStruct`, and `read(MigrationContextInterface, array $params = []): array` (querying the source `product` table with `getOffset()`/`getLimit()`). Register/tag with `shopware.migration.reader`, then call it from the gateway's `read()` via `ReaderRegistry::getReader()`.
7. **Converter**: create a `ProductConverter extends ShopwareConverter` implementing `getSourceIdentifier()`, `supports()`, and `convert(array $data, Context $context, MigrationContextInterface $migrationContext): ConvertStruct`, using `MappingService::getOrCreateMapping()` for the product UUID and `convertValue()` helpers for field mapping (e.g. `productNumber` <- `product_number`). Register/tag with `shopware.migration.converter`.
8. **Writer**: reuse the existing `ProductWriter extends AbstractWriter` (`supports(): string { return DefaultEntities::PRODUCT; }`) — the `WriterRegistry` matches it to the `DataSet` by comparing `getEntity()`/`supports()`.

## Essential identifiers

`ProfileInterface`, `shopware.migration.profile`, `GatewayInterface`, `shopware.migration.gateway`, `DataSet`, `DataSelectionInterface`, `shopware.migration.data_selection`, `shopware.migration.data_set`, `AbstractReader`, `shopware.migration.reader`, `ShopwareConverter`, `ConvertStruct`, `shopware.migration.converter`, `ProductWriter`, `AbstractWriter`, `WriterRegistry`.

## Gotchas

If no credentials-page component matching the `swag-migration-profile-<profile>-<gateway>-credential-form` naming convention exists, the Administration wizard shows an error instead of letting the user proceed past the credentials step. Check the target entity's `EntityDefinition` (e.g. `ProductEntityDefinition`) to know exactly which fields/requirements the converter must populate.
