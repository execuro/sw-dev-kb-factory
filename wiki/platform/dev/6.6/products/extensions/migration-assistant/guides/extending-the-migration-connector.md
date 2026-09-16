---
id: platform/dev/6.6/products/extensions/migration-assistant/guides/extending-the-migration-connector.md
title: Extending the Migration Connector
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/guides/extending-the-migration-connector.html
sourceHash: 9231847e1755661b9e218475c284d78b2847b357
keywords: ["migration connector", "BundleRepository", "AbstractRepository", "BundleService", "AbstractApiService", "shopware.migration.reader", "ApiReader", "addTableSelection", "API gateway", "migration API"]
summary: "Example of extending the Migration Connector plugin to expose a custom entity via the Shopware 5 migration API."
lastBuilt: "2026-09-15"
---
## What it is

A worked example of extending the Migration Connector plugin (Shopware 5 side) so a custom "bundle" entity can be migrated to Shopware 6 via the API gateway, complementing an entity that is otherwise only migratable via the local gateway.

## When to use

Use this when you already migrate an entity locally (same database) but also need to support API-based migration (separate systems, no shared DB access) for that same entity.

## Key steps / config

1. Create a repository extending `AbstractRepository` (from the Migration Connector), using its `addTableSelection()` helper to prefix table columns in Doctrine query builder calls, e.g. fetching `s_bundles`/`s_bundle_products`. Register it in `service.xml` with `parent="SwagMigrationConnector\Repository\AbstractRepository"`.
2. Create a service extending `AbstractApiService` that injects the repository (typed as `ApiRepositoryInterface`) and assembles the result set, calling `$this->cleanupResultSet($bundles)` before returning.
3. Create an API controller (e.g. `Shopware_Controllers_Api_SwagMigrationBundles`) with an `indexAction()` that reads `offset`/`limit` request params, calls the service, and returns a `ControllerReturnStruct`.
4. On the Shopware 6 side, create a `BundleReader` extending `ApiReader`, implementing `supports(MigrationContextInterface)` (checking `ShopwareApiGateway::GATEWAY_NAME` and the target `DataSet`) and `getApiRoute()` returning the controller's route name (e.g. `'SwagMigrationBundles'`). Register it in the Symfony container with `parent="...ApiReader"` and tag `shopware.migration.reader`.

## Essential identifiers

- `AbstractRepository`, `addTableSelection()`
- `AbstractApiService`, `ApiRepositoryInterface`
- `Shopware_Controllers_Api_SwagMigrationBundles::indexAction()`, `ControllerReturnStruct`
- `ApiReader`, `ApiReader::getApiRoute()`, `ShopwareApiGateway::GATEWAY_NAME`
- `shopware.migration.reader` (service tag)

## Gotchas

Data that only exists in the source database and cannot be reached over the API (per this example, bundle data) must still be migrated via the local gateway; the API gateway extension shown here covers a separate, API-reachable path, not a replacement for the local reader.
