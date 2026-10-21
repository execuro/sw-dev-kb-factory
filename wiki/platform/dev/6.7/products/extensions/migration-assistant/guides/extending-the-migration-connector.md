---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/migration-assistant/guides/extending-the-migration-connector.md
sourceHash: db67643412481d2fbdcc2cc19005d8b3821d2c88
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/guides/extending-the-migration-connector.html
title: Extending the Migration Connector
version: "6.7"
versions:
  - "6.7"
keywords: ["SwagMigrationConnector", "SwagMigrationAssistant", "migration connector", "AbstractRepository", "AbstractApiService", "ControllerReturnStruct", "ApiReader", "ShopwareApiGateway", "getApiRoute", "shopware.migration.reader", "shopware 5 api", "SwagAdvDevBundle"]
summary: Expose SW5 plugin data (SwagAdvDevBundle) via a SwagMigrationConnector API controller and read it in Shopware 6 with an ApiReader.
lastBuilt: 2026-10-21
---
## What it is

A guide for extending the Shopware 5 Migration Connector plugin (`SwagMigrationConnector`) so bundle data of `SwagAdvDevBundle` can be migrated to Shopware 6 via the API gateway, not only the local gateway. It builds on the `SwagMigrationBundleExample` plugin from "Extending a Shopware Migration Profile".

## When to use

Your Shopware 5 plugin data is already migratable via the local gateway and you also need it over the API gateway. Prerequisites: `SwagAdvDevBundle` and the Migration Connector in Shopware 5; your own plugin, the Migration Assistant (`SwagMigrationAssistant`) and `SwagMigrationBundleExample` in Shopware 6.

## Key steps / config

Shopware 5 side (connector extension):

1. **Repository** — `SwagMigrationBundleApiExample\Repository\BundleRepository extends SwagMigrationConnector\Repository\AbstractRepository` with `fetch($offset = 0, $limit = 250)` (uses `fetchIdentifiers('s_bundles', ...)` and `addTableSelection()`, which prefixes all columns) and `fetchBundleProducts(array $ids)` on `s_bundle_products`. Register with a parent:
   ```php
   $services->set('swag_migration_bundle_api_example.bundle_repository', SwagMigrationBundleApiExample\Repository\BundleRepository::class)
       ->parent(SwagMigrationConnector\Repository\AbstractRepository::class);
   ```
2. **Service** — `BundleService extends SwagMigrationConnector\Service\AbstractApiService`, constructor takes an `ApiRepositoryInterface`; `getBundles($offset, $limit)` fetches bundles and products, strips the `bundles` prefix via `mapData($bundles, [], ['bundles'])`, attaches products and returns `cleanupResultSet($bundles)`. Service id `swag_migration_bundle_api_example.bundle_service`, arg `service('swag_migration_bundle_api_example.bundle_repository')`.
3. **API controller** — `Shopware_Controllers_Api_SwagMigrationBundles extends Shopware_Controllers_Api_Rest`; `indexAction()` reads `offset`/`limit` (default 250) request params, calls `getBundles()` and assigns `(new ControllerReturnStruct($bundles, empty($bundles)))->jsonSerialize()` to the view.

Shopware 6 side (in `SwagMigrationBundleExample`):

4. **API reader** — `BundleReader extends SwagMigrationAssistant\Profile\Shopware\Gateway\Api\Reader\ApiReader`; `supports()` requires `ShopwareProfileInterface`, `ShopwareApiGateway::GATEWAY_NAME` and `BundleDataSet::getEntity()`; `getApiRoute()` returns `'SwagMigrationBundles'`. Register:
   ```php
   $services->set(SwagMigrationBundleExample\Profile\Shopware\Gateway\Api\BundleReader::class)
       ->parent(SwagMigrationAssistant\Profile\Shopware\Gateway\Api\Reader\ApiReader::class)
       ->tag('shopware.migration.reader');
   ```

## Essential identifiers

- `SwagMigrationConnector\Repository\AbstractRepository`, `ApiRepositoryInterface`, `SwagMigrationConnector\Service\AbstractApiService`, `ControllerReturnStruct`
- `Shopware_Controllers_Api_SwagMigrationBundles`, API route `SwagMigrationBundles`
- `ApiReader`, `getApiRoute()`, `ShopwareApiGateway`, tag `shopware.migration.reader`

## Gotchas

- The reader class is declared in namespace `...\Gateway\Api\Reader`, but the service registration in the guide uses `SwagMigrationBundleExample\Profile\Shopware\Gateway\Api\BundleReader` (no `Reader` segment) — align the service id with the actual class name.
- The repository and controller run on Shopware 5 and use its legacy DBAL/controller APIs.
- Full example: `swag-docs-extending-shopware-migration-connector` in the `shopwareArchive` GitHub organisation.

## Code check (6.7.15.1)
- confirmed `SwagMigrationAssistant` — core Administration only references it as an installable plugin name — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:26
- unverified `SwagMigrationConnector\Repository\AbstractRepository` — Shopware 5 connector plugin, out of scope
- unverified `SwagMigrationConnector\Service\AbstractApiService` — Shopware 5 connector plugin, out of scope
- unverified `ControllerReturnStruct` — Shopware 5 connector plugin, out of scope
- unverified `Shopware_Controllers_Api_Rest` — Shopware 5 core, out of scope
- unverified `ApiReader` — SwagMigrationAssistant plugin, out of scope
- unverified `ShopwareApiGateway` — SwagMigrationAssistant plugin, out of scope
- unverified `shopware.migration.reader` — DI tag defined by SwagMigrationAssistant, out of scope
