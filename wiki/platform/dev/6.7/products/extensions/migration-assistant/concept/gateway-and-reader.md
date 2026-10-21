---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/gateway-and-reader.md
title: Gateway and Reader
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/gateway-and-reader.html
sourceHash: 1e00517f485c6c67c95ada1e441f5daee2241347
codeCheckedAgainst: "6.7.15.1"
keywords: ["gateway", "reader", "shopware.migration.gateway", "GatewayRegistry", "GatewayInterface", "ShopwareLocalGateway", "ShopwareApiGateway", "ReaderRegistry", "SwagMigrationConnector", "local gateway", "api gateway", "migration assistant", "source system"]
summary: Migration Assistant gateways (api, local) tagged shopware.migration.gateway, selected by GatewayRegistry; readers fetch source-system data per profile.
lastBuilt: 2026-10-21
---
## What it is

In the Shopware Migration Assistant, a gateway defines how Shopware 6 communicates with the source system (e.g. Shopware 5); `Reader` objects behind it read the actual data. The `shopware55` profile ships the `api` gateway (HTTP/S to the source) and the `local` gateway (direct access to the source database, so both systems must be on the same server).

## When to use

When adding a gateway to a custom migration profile, or when diagnosing which gateway/reader a connection uses.

## Key steps / config

1. Every profile needs at least one gateway. Register each gateway in the service configuration with the tag `shopware.migration.gateway`:

```php
$services->set(ShopwareLocalGateway::class)
    ->args([/* ... */])
    ->tag('shopware.migration.gateway');
$services->set(ShopwareApiGateway::class)
    ->args([/* ... */])
    ->tag('shopware.migration.gateway');
```

2. `SwagMigrationAssistant\Migration\Gateway\GatewayRegistry` receives all tagged gateways (`iterable $gateways`). `getGateways()` returns those whose `supports($profile)` is true; selecting the active gateway matches `supports()` plus `getName()` against the connection's gateway name and throws `MigrationException::gatewayNotFound($profileName, $gatewayName)` when nothing matches.
3. The gateway class implements `GatewayInterface` (the Shopware profile gateways implement `ShopwareGatewayInterface`). Members shown for `SwagMigrationAssistant\Profile\Shopware\Gateway\Local\ShopwareLocalGateway`:
   - `GATEWAY_NAME = 'local'`, returned by `getName()`
   - `getSnippetName()` → `swag-migration.wizard.pages.connectionCreate.gateways.shopwareLocal`
   - `supports(ProfileInterface $profile)` → `$profile instanceof ShopwareProfileInterface`
   - `read()` → `ReaderRegistry::getReader($migrationContext)->read($migrationContext)`
   - `readEnvironmentInformation()` → uses the environment reader, loads the target currency via `Defaults::CURRENCY`, reads totals, returns `EnvironmentInformation`
   - `readTotals()` → iterates `ReaderRegistry::getReaderForTotal()`, skips `null` totals, keys by entity name
   - `readTable($migrationContext, $tableName, $filter)` → delegates to the `TableReaderInterface`
4. Local gateway constructor dependencies: `ReaderRegistry`, `EnvironmentReaderInterface`, `TableReaderInterface`, `ConnectionFactoryInterface`, and currency and language `EntityRepository` instances.

## Essential identifiers

- `shopware.migration.gateway` (service tag)
- `GatewayRegistry`, `GatewayRegistryInterface`, `GatewayInterface`, `ShopwareGatewayInterface`
- `ShopwareLocalGateway` (`local`), `ShopwareApiGateway` (`api`)
- `ReaderRegistry`, `EnvironmentReaderInterface`, `TableReaderInterface`

## Gotchas

- `ShopwareApiGateway` requires the Shopware 5 plugin [Shopware Migration Connector](https://github.com/shopware/SwagMigrationConnector) installed on the source shop.
- The `local` gateway only works when source and target share a server (direct DB access).
- The source's registry snippet names the selector method `getGateway()`; that identifier is absent from the installed Shopware code index, so it is not verifiable here.

## Code check (6.7.15.1)
- unverified `shopware.migration.gateway` — tag consumed by the SwagMigrationAssistant plugin, outside installed core roots
- unverified `GatewayRegistry` — SwagMigrationAssistant plugin, out of scope
- unverified `ShopwareLocalGateway` — SwagMigrationAssistant plugin, out of scope
- unverified `ShopwareApiGateway` — SwagMigrationAssistant plugin, out of scope
- absent `getGateway` — not found in the installed code index
- confirmed `Defaults::CURRENCY` — core default currency id constant — vendor/shopware/core/Defaults.php:25
- confirmed `Hasher::hash()` — used for the source fingerprint — vendor/shopware/core/Framework/Util/Hasher.php:17
- confirmed `Criteria` — DAL search criteria class — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:25
- confirmed `EntityRepository` — DAL repository class — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:37
- confirmed `Context` — core context class — vendor/shopware/core/Framework/Context.php:18
