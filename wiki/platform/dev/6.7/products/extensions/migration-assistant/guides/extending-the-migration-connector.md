---
id: platform/dev/6.7/products/extensions/migration-assistant/guides/extending-the-migration-connector.md
title: Extending the Migration Connector
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/guides/extending-the-migration-connector.html
sourceHash: db67643412481d2fbdcc2cc19005d8b3821d2c88
codeCheckedAgainst: "6.7.13.0"
keywords: ["migration connector", "SwagMigrationConnector", "api gateway migration", "AbstractRepository", "AbstractApiService", "ControllerReturnStruct", "Shopware_Controllers_Api_Rest", "ApiReader", "getApiRoute", "shopware.migration.reader", "BundleReader", "shopware 5 api"]
summary: "Extend the SW5 SwagMigrationConnector with a BundleRepository, BundleService and API controller, plus an ApiReader in SW6 to migrate bundles via API."
lastBuilt: 2026-09-15
---
## What it is

Example of extending the Shopware 5 Migration Connector plugin (`SwagMigrationConnector`) so `SwagAdvDevBundle` bundle data can be migrated to Shopware 6 through the API gateway, not only the local gateway.

## When to use

You already extended the Shopware migration profile for plugin data (`SwagMigrationBundleExample` with the Migration Assistant in Shopware 6) and need the same data when the source shop is connected via API.

## Key steps / config

**Shopware 5 side:**

1. **Repository** — `SwagMigrationBundleApiExample\Repository\BundleRepository extends SwagMigrationConnector\Repository\AbstractRepository`: `fetch($offset = 0, $limit = 250)` uses `fetchIdentifiers('s_bundles', ...)` and `addTableSelection()` (prefixes table columns); `fetchBundleProducts(array $ids)` reads `s_bundle_products`.

```php
$services->set('swag_migration_bundle_api_example.bundle_repository', SwagMigrationBundleApiExample\Repository\BundleRepository::class)
    ->parent(SwagMigrationConnector\Repository\AbstractRepository::class);
```

2. **Service** — `SwagMigrationBundleApiExample\Service\BundleService extends SwagMigrationConnector\Service\AbstractApiService` (constructor: `ApiRepositoryInterface`). `getBundles($offset = 0, $limit = 250)` strips the `bundles` prefix with `mapData()`, attaches `products`, returns `cleanupResultSet()`. Service id `swag_migration_bundle_api_example.bundle_service`, argument the repository service.
3. **API controller** — `Shopware_Controllers_Api_SwagMigrationBundles extends Shopware_Controllers_Api_Rest`; `indexAction()` reads `offset`/`limit`, calls `getBundles()`, assigns `ControllerReturnStruct($bundles, empty($bundles))->jsonSerialize()` to the view.

**Shopware 6 side (`SwagMigrationBundleExample`):**

4. **API reader** — only defines the route:

```php
class BundleReader extends ApiReader
{
    public function supports(MigrationContextInterface $migrationContext): bool
    { /* Shopware profile + API gateway + bundle entity */ }

    protected function getApiRoute(): string { return 'SwagMigrationBundles'; }
}
```

```php
$services->set(SwagMigrationBundleExample\Profile\Shopware\Gateway\Api\BundleReader::class)
    ->parent(SwagMigrationAssistant\Profile\Shopware\Gateway\Api\Reader\ApiReader::class)
    ->tag('shopware.migration.reader');
```

## Essential identifiers

- `SwagMigrationConnector\Repository\AbstractRepository`, `SwagMigrationConnector\Service\AbstractApiService`, `ControllerReturnStruct`
- `Shopware_Controllers_Api_Rest`, route `SwagMigrationBundles`
- `SwagMigrationAssistant\Profile\Shopware\Gateway\Api\Reader\ApiReader`, `getApiRoute()`, tag `shopware.migration.reader`

## Gotchas

- The source declares the reader in namespace `SwagMigrationBundleExample\Profile\Shopware\Gateway\Api\Reader` but registers `SwagMigrationBundleExample\Profile\Shopware\Gateway\Api\BundleReader`; keep the service id equal to the real class.

## Code check (6.7.13.0)
- confirmed `SwagMigrationAssistant` — core only references the plugin by name; its classes are not under vendor/shopware — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:33
- unverified `SwagMigrationConnector\Repository\AbstractRepository` — Shopware 5 plugin, not in vendor/shopware
- unverified `SwagMigrationConnector\Service\AbstractApiService` — Shopware 5 plugin, not in vendor/shopware
- unverified `SwagMigrationConnector\Service\ControllerReturnStruct` — Shopware 5 plugin, not in vendor/shopware
- unverified `Shopware_Controllers_Api_Rest` — Shopware 5 core class, out of scope
- unverified `SwagMigrationAssistant\Profile\Shopware\Gateway\Api\Reader\ApiReader` — SwagMigrationAssistant not installed, out of scope
- unverified `shopware.migration.reader` — plugin service tag, SwagMigrationAssistant not installed, out of scope
