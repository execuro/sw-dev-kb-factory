---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/migration-assistant/guides/creating-a-new-migration-profile.md
sourceHash: 9e03bb668af2f73330df509751ace241553dc501
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/guides/creating-a-new-migration-profile.html
title: Creating a new migration profile
version: "6.7"
versions:
  - "6.7"
keywords: ["migration profile", "SwagMigrationAssistant", "ProfileInterface", "GatewayInterface", "shopware.migration.profile", "shopware.migration.gateway", "shopware.migration.reader", "shopware.migration.converter", "ShopwareConverter", "AbstractReader", "DataSelectionInterface", "third-party source system", "custom import source"]
summary: "Migration Assistant profile for a non-Shopware source: profile, gateway, credentials form, DataSet/DataSelection, reader, converter, writer."
lastBuilt: 2026-10-21
---
## What it is

A walkthrough for adding a new source system to the Migration Assistant plugin (`SwagMigrationAssistant`, a separate plugin, not part of Shopware core). The example migrates a third-party `product` table (`id`, `product_number`, `price`, `stock`, `product_name`, `tax`) into Shopware 6 products. For converting Shopware plugin data instead, the guide points to "Extending a Shopware Migration Profile".

## When to use

You need to import data from a system other than Shopware 5/6 and want to plug it into the Migration Assistant wizard (profile/gateway selection, credentials, data selection, migration run).

## Key steps / config

1. **Profile** — `class OwnProfile implements SwagMigrationAssistant\Migration\Profile\ProfileInterface` with `getName()` (`'ownProfile'`), `getSourceSystemName()`, `getVersion()`, `getAuthorName()`, `getIconPath()`. It holds no logic; it only bundles the executing classes. Register in `services.php` with tag `shopware.migration.profile`.
2. **Gateway** — `OwnLocaleGateway implements SwagMigrationAssistant\Migration\Gateway\GatewayInterface` (`GATEWAY_NAME = 'local'`) with `getName()`, `supports()` (profile `instanceof OwnProfile`), `getSnippetName()`, `read()`, `readEnvironmentInformation()`. The latter tests the source DB via `ConnectionFactoryInterface::createDatabaseConnection()`, returns an `EnvironmentInformation` (with a `RequestStatusStruct` built from `DatabaseConnectionException` on failure) and collects entity counts from the `ReaderRegistry`.
   ```php
   $services->set(SwagMigrationOwnProfileExample\Profile\OwnProfile\Gateway\OwnLocaleGateway::class)
       ->args([
           service(SwagMigrationAssistant\Migration\Gateway\Reader\ReaderRegistry::class),
           service(SwagMigrationAssistant\Profile\Shopware\Gateway\Connection\ConnectionFactory::class),
       ])
       ->tag('shopware.migration.gateway');
   ```
3. **Credentials page** — Administration component in `Resources/app/administration/src/own-profile/profile` named `swag-migration-profile-ownProfile-local-credential-form` (prefix `swag-migration-profile-` + profile name + gateway name + suffix `-credential-form`). It holds `inputCredentials` (`dbHost`, `dbPort`, `dbUser`, `dbPassword`, `dbName`), emits `onCredentialsChanged`, `onChildRouteReadyChanged` and `onTriggerPrimaryClick`, and uses template `swag-migration-profile-ownProfile-local-credential-form.html.twig`. Import it in `main.js`: `import './own-profile/profile';`.
4. **DataSet and DataSelection** — `ProductDataSet extends SwagMigrationAssistant\Migration\DataSelection\DataSet\DataSet` (`getEntity()` returns `'product'`, `supports()`); `ProductDataSelection implements DataSelectionInterface` (`IDENTIFIER = 'products'`) whose `getData()` returns `new DataSelectionStruct(self::IDENTIFIER, $this->getDataSets(), $this->getDataSetsRequiredForCount(), 'swag-migration.index.selectDataCard.dataSelection.products', 100)`. Register both in `services.php` with the data-selection and data-set tags named in Gotchas.
5. **Reader** — `ProductReader extends SwagMigrationAssistant\Profile\Shopware\Gateway\Local\Reader\AbstractReader` with `supports()` (profile + `ProductDataSet::getEntity()`) and `read(MigrationContextInterface $migrationContext, array $params = [])`, paging with `getOffset()`/`getLimit()`. Register with `->parent(...AbstractReader::class)`, arg `ConnectionFactory`, tag `shopware.migration.reader`. Then implement the gateway's `read()` as `$this->readerRegistry->getReader($migrationContext)->read($migrationContext)`.
6. **Converter** — `ProductConverter extends SwagMigrationAssistant\Profile\Shopware\Converter\ShopwareConverter` with `getSourceIdentifier()`, `supports()`, `writeMapping()`, `convert()` returning `ConvertStruct($converted, $data, $this->mainMapping['id'])`. It uses `generateChecksum()`, `mappingService->getOrCreateMapping()`, `convertValue()` (e.g. `self::TYPE_INTEGER`), `getTaxUuid()`, `createMapping(..., DefaultEntities::TAX, ...)`, `getCurrencyUuid(..., 'EUR', ...)` and `updateMainMapping()`. Register with args `MappingService`, `LoggingService`, tag `shopware.migration.converter`. Check the target structure in the core `ProductDefinition`.
7. **Writer** — for products the plugin's existing `ProductWriter` (`supports()` returns `DefaultEntities::PRODUCT`) is picked by the `WriterRegistry`, which matches the DataSet entity name against each writer's `supports()`. New entities need their own writer class.

## Essential identifiers

- `ProfileInterface`, `GatewayInterface`, `ReaderRegistry`, `ConnectionFactory`, `EnvironmentInformation`, `RequestStatusStruct`
- `DataSet`, `DataSelectionInterface`, `DataSelectionStruct`, `AbstractReader`, `TotalStruct`
- `ShopwareConverter`, `ConvertStruct`, `DefaultEntities`, `MappingService`, `LoggingService`, `WriterRegistry`
- Tags: `shopware.migration.profile`, `shopware.migration.gateway`, `shopware.migration.reader`, `shopware.migration.converter`

## Gotchas

- The order of `getDataSets()` decides processing order — e.g. manufacturers must come before products.
- The guide tags the DataSelection with `shopware.migration.data_selection` and the DataSet with `shopware.migration.data_set`; the reader additionally implements `supportsTotal()`, `readTotal()` (returning `TotalStruct`) and a protected `setConnection()`. All of these live in the separate Migration Assistant plugin and cannot be verified against installed Shopware core.
- The reader snippet uses older Doctrine DBAL calls (`ResultStatement`, `fetchColumn()`, `fetchAll()`); check them against the DBAL version your installation ships.
- The credentials template uses `sw-field`, which is not registered as a component in the installed 6.7 Administration; `sw-text-field` and `sw-container` are.
- The guide names the product definition `ProductEntityDefinition`; the core class is `ProductDefinition`.
- A full example lives in the `swag-docs-create-migration-profile` repository under `shopwareArchive` on GitHub.

## Code check (6.7.15.1)
- absent `supportsTotal` — Migration Assistant reader method, not in the installed code index
- absent `setConnection` — Migration Assistant reader method, not in the installed code index
- absent `readTotal` — Migration Assistant reader method, not in the installed code index
- absent `shopware.migration.data_selection` — plugin DI tag, not in the installed code index
- absent `shopware.migration.data_set` — plugin DI tag, not in the installed code index
- corrected `ProductDefinition` — docs: ProductEntityDefinition — vendor/shopware/core/Content/Product/ProductDefinition.php:83
- confirmed `AbstractWriter::append()` — core's AbstractWriter is the ImportExport writer, unrelated to the plugin's migration AbstractWriter — vendor/shopware/core/Content/ImportExport/Processing/Writer/AbstractWriter.php:15
- unverified `sw-field` — no Component.register for it in the installed 6.7 Administration src
- confirmed `sw-text-field` — registered Administration component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:203
- confirmed `sw-container` — registered Administration component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:440
