---
id: platform/dev/6.7/products/extensions/migration-assistant/guides/creating-a-new-migration-profile.md
title: Creating a new migration profile
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/guides/creating-a-new-migration-profile.html
sourceHash: 9e03bb668af2f73330df509751ace241553dc501
codeCheckedAgainst: "6.7.13.0"
keywords: ["migration profile", "ProfileInterface", "GatewayInterface", "OwnLocaleGateway", "DataSelectionInterface", "DataSet", "ProductReader", "ShopwareConverter", "shopware.migration.profile", "shopware.migration.gateway", "shopware.migration.reader", "shopware.migration.converter", "credential form", "third-party shop import", "SwagMigrationAssistant"]
summary: "Build a SwagMigrationAssistant profile for a non-Shopware source: profile, gateway, credentials form, DataSelection, reader, converter and writer tags."
lastBuilt: 2026-09-15
---
## What it is

Walkthrough for adding a new migration profile to the Migration Assistant (`SwagMigrationAssistant`) so data from a non-Shopware source (example: a MySQL `product` table with `id`, `product_number`, `price`, `stock`, `product_name`, `tax`) can be migrated into Shopware 6.

## When to use

Importing data from a third-party shop system through the Migration Assistant wizard when no existing profile covers it. For Shopware 5 plugin data, extend the Shopware profile instead.

## Key steps / config

1. **Profile** — `OwnProfile implements SwagMigrationAssistant\Migration\Profile\ProfileInterface`: `getName()` (`'ownProfile'`), `getSourceSystemName()`, `getVersion()`, `getAuthorName()`, `getIconPath()`. No logic. Tag `shopware.migration.profile`.
2. **Gateway** — `SwagMigrationAssistant\Migration\Gateway\GatewayInterface`:

```php
class OwnLocaleGateway implements GatewayInterface
{
    public const GATEWAY_NAME = 'local';
    public function getName(): string { /* ... */ }
    public function supports(MigrationContextInterface $migrationContext): bool { /* ... */ }
    public function getSnippetName(): string { /* ... */ }
    public function read(MigrationContextInterface $migrationContext): array { /* readerRegistry->getReader() */ }
    public function readEnvironmentInformation(MigrationContextInterface $migrationContext, Context $context): EnvironmentInformation { /* ... */ }
    public function readTotals(MigrationContextInterface $migrationContext, Context $context): array { /* ... */ }
}
```

   Connection test via `ConnectionFactoryInterface::createDatabaseConnection()`. Tag `shopware.migration.gateway`.
3. **Credentials form** — component `swag-migration-profile-ownProfile-local-credential-form` (prefix `swag-migration-profile-` + profile + gateway + `-credential-form`) registered with `Shopware.Component.register` in `Resources/app/administration/src/own-profile/profile/index.js`, imported from `main.js`. Data `inputCredentials` (`dbHost`, `dbPort`, `dbUser`, `dbPassword`, `dbName`); emits `onCredentialsChanged`, `onChildRouteReadyChanged`, `onTriggerPrimaryClick`.
4. **DataSet / DataSelection** — `ProductDataSet extends SwagMigrationAssistant\Migration\DataSelection\DataSet\DataSet` (`static getEntity()` returns `'product'`); `ProductDataSelection implements DataSelectionInterface` (`IDENTIFIER = 'products'`, `getData()` returns `new DataSelectionStruct(self::IDENTIFIER, $this->getDataSets(), $this->getDataSetsRequiredForCount(), 'swag-migration.index.selectDataCard.dataSelection.products', 100)`). Register both as tagged services (see Gotchas).
5. **Reader** — `ProductReader extends SwagMigrationAssistant\Profile\Shopware\Gateway\Local\Reader\AbstractReader`: `supports()` and `read(MigrationContextInterface $migrationContext, array $params = [])` using `getOffset()`/`getLimit()`.
6. **Converter** — `ProductConverter extends SwagMigrationAssistant\Profile\Shopware\Converter\ShopwareConverter`: `getSourceIdentifier()`, `supports()`, `writeMapping()`, `convert()` returning `ConvertStruct` (uses `getOrCreateMapping()`, `convertValue()`, `updateMainMapping()`). Field names: see `ProductDefinition`.
7. **Writer** — products reuse the plugin's `ProductWriter`; `WriterRegistry` matches the DataSet entity to the writer's `supports()`.

```php
$services->set(OwnLocaleGateway::class)
    ->args([service(ReaderRegistry::class), service(ConnectionFactory::class)])
    ->tag('shopware.migration.gateway');
$services->set(ProductReader::class)
    ->parent(SwagMigrationAssistant\Profile\Shopware\Gateway\Local\Reader\AbstractReader::class)
    ->args([service(ConnectionFactory::class)])
    ->tag('shopware.migration.reader');
$services->set(ProductConverter::class)
    ->args([service(MappingService::class), service(LoggingService::class)])
    ->tag('shopware.migration.converter');
```

## Essential identifiers

- `ProfileInterface`, `GatewayInterface`, `ReaderRegistry`, `ConnectionFactory`, `DataSelectionStruct`, `AbstractReader`, `ShopwareConverter`, `ConvertStruct`, `WriterRegistry`
- `shopware.migration.profile`, `shopware.migration.gateway`, `shopware.migration.reader`, `shopware.migration.converter`

## Gotchas

- Source tags: `shopware.migration.data_selection` (DataSelection) and `shopware.migration.data_set` (DataSet); these are plugin strings, absent from the installed Shopware packages.
- The source reader also declares `supportsTotal()`, protected `setConnection()` and `readTotal()` (returns `TotalStruct`), consumed by `readTotals()` via `getReaderForTotal()`; plugin API, not in vendor/shopware.
- `getDataSets()` order is processing order (manufacturers before products).
- The source imports `Component` from `src/core/shopware` and uses `sw-field`; the installed Administration uses `Shopware.Component.register` and `sw-text-field`/`sw-password-field`.

## Code check (6.7.13.0)
- absent `supportsTotal` — reader total-support method from the plugin, no hit in the installed code index
- absent `setConnection` — reader helper from the plugin, no hit in the installed code index
- absent `readTotal` — reader total-count method from the plugin, no hit in the installed code index
- absent `shopware.migration.data_selection` — plugin service tag, not in installed Shopware packages
- absent `shopware.migration.data_set` — plugin service tag, not in installed Shopware packages
- corrected `Component.register` — docs: `import { Component } from 'src/core/shopware'`; code registers via global `Shopware.Component.register` — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:199
- corrected `sw-field` — docs: generic `sw-field` input; code registers `sw-text-field` and `sw-password-field` — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:241
- corrected `ProductEntityDefinition` — docs: `ProductEntityDefinition`; installed class is `ProductDefinition` — vendor/shopware/core/Content/Product/ProductDefinition.php:83
- confirmed `Shopware\Core\Framework\Context` — context argument of gateway and converter methods — vendor/shopware/core/Framework/Context.php:17
- unverified `shopware.migration.profile` — SwagMigrationAssistant is not installed under vendor/shopware, plugin tags out of scope
