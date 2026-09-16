---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/gateway-and-reader.md
title: Gateway and Reader
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/gateway-and-reader.html
sourceHash: 1e00517f485c6c67c95ada1e441f5daee2241347
codeCheckedAgainst: "6.7.13.0"
keywords: ["gateway", "reader", "shopware.migration.gateway", "GatewayRegistry", "GatewayInterface", "ShopwareLocalGateway", "ShopwareApiGateway", "ReaderRegistry", "readTotals", "local gateway", "api gateway", "SwagMigrationConnector", "migration assistant"]
summary: "Migration Assistant gateways (api, local) tagged shopware.migration.gateway, selected by GatewayRegistry; Readers fetch source data and totals."
lastBuilt: 2026-09-15
---
## What it is

In the Migration Assistant, a gateway defines how Shopware 6 talks to the source system (e.g. Shopware 5). A gateway reads entity data through `Reader` objects. For the `shopware55` profile there are two gateways. The `api` gateway talks to the source system over HTTP/S. The `local` gateway reads the source database directly, so both systems must be on the same server.

## When to use

When adding a gateway to a migration profile, or when debugging which gateway/reader serves a connection.

## Key steps / config

1. Every profile needs at least one gateway. Register each gateway with the `shopware.migration.gateway` tag:

```php
$services->set(ShopwareLocalGateway::class)
    ->args([ /* ... */ ])
    ->tag('shopware.migration.gateway');
$services->set(ShopwareApiGateway::class)
    ->args([ /* ... */ ])
    ->tag('shopware.migration.gateway');
```

2. Implement `GatewayInterface`. The docs example, `SwagMigrationAssistant\Profile\Shopware\Gateway\Local\ShopwareLocalGateway`, implements `ShopwareGatewayInterface` and provides:
   - `getName(): string`: returns `GATEWAY_NAME` (`'local'`).
   - `getSnippetName(): string`, e.g. `'swag-migration.wizard.pages.connectionCreate.gateways.shopwareLocal'`.
   - `supports(ProfileInterface $profile): bool`.
   - `read(MigrationContextInterface)`: calls `ReaderRegistry::getReader($migrationContext)`, then `$reader->read(...)`.
   - `readEnvironmentInformation(MigrationContextInterface, Context): EnvironmentInformation`: uses the environment reader and looks up the target currency `Defaults::CURRENCY`.
   - `readTotals(MigrationContextInterface): array`: calls `ReaderRegistry::getReaderForTotal()`, then `readTotal()` on each reader, skips `null` results, and keys the rest by `getEntityName()`.
   - `readTable(MigrationContextInterface, string $tableName, array $filter = []): array`.
3. `SwagMigrationAssistant\Migration\Gateway\GatewayRegistry` receives all tagged gateways (`iterable $gateways`):
   - `getGateways($migrationContext)` returns every gateway whose `supports($profile)` is true.
   - `getGateway($migrationContext)` returns the supporting gateway whose `getName()` matches the connection's gateway name. If none matches, it throws `MigrationException::gatewayNotFound($profileName, $gatewayName)`.

## Essential identifiers

- `shopware.migration.gateway` (service tag)
- `GatewayRegistry`, `GatewayRegistryInterface`, `GatewayInterface`, `ShopwareGatewayInterface`
- `ShopwareLocalGateway` (`'local'`), `ShopwareApiGateway` (`'api'`)
- `ReaderRegistry`, `EnvironmentReaderInterface`, `TableReaderInterface`, `ConnectionFactoryInterface`
- `EnvironmentInformation`

## Gotchas

- `ShopwareApiGateway` requires the Shopware 5 plugin [Shopware Migration Connector](https://github.com/shopware/SwagMigrationConnector) on the source shop.
- The `local` gateway only works if the source database can be reached from the same server.
- `ShopwareLocalGateway` builds its fingerprint with `Hasher::hash($config['esdKey'] . $config['installationDate'])`.

## Code check (6.7.13.0)
- unverified `shopware.migration.gateway` — plugin service tag, SwagMigrationAssistant not installed in vendor/shopware
- unverified `GatewayRegistry` — plugin class, plugin not installed in vendor/shopware
- unverified `GatewayInterface` — plugin interface, plugin not installed in vendor/shopware
- unverified `ShopwareLocalGateway` — plugin class, plugin not installed in vendor/shopware
- unverified `ReaderRegistry` — plugin class, plugin not installed in vendor/shopware
- confirmed `Defaults::CURRENCY` — core default currency id constant — vendor/shopware/core/Defaults.php:25
- confirmed `Hasher::hash()` — core static hash helper — vendor/shopware/core/Framework/Util/Hasher.php:17
- confirmed `EntityRepository` — core DAL repository class — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:36
- confirmed `Criteria` — core DAL search criteria — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:25
- confirmed `Context` — core context class — vendor/shopware/core/Framework/Context.php:17
