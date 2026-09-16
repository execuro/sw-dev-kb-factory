---
id: platform/dev/6.6/products/extensions/migration-assistant/concept/gateway-and-reader.md
title: Gateway and Reader
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/concept/gateway-and-reader.html
sourceHash: 02e2e717481f29494bda4c436207aff415e87676
keywords: ["Gateway", "GatewayInterface", "GatewayRegistry", "Reader", "shopware.migration.gateway", "ShopwareLocalGateway", "ShopwareApiGateway", "local gateway", "api gateway", "shopware55", "EnvironmentInformation", "readTotals", "readTable"]
summary: "Gateways (local/api) define how Shopware 6 talks to a source system; Reader objects read data via a GatewayRegistry-selected gateway."
lastBuilt: "2026-09-15"
---
## What it is

Describes how a `Gateway` defines communication between Shopware 6 and a source system, and how `Reader` objects behind the gateway actually read the source data.

## When to use

Needed when connecting a new source system, choosing between an HTTP-based and a direct-database migration path, or implementing a custom gateway.

## Key steps / config

Every profile needs at least one gateway. Gateways are registered in the profile's service XML with the `shopware.migration.gateway` tag:

```xml
<service id="SwagMigrationAssistant\Profile\Shopware\Gateway\Local\ShopwareLocalGateway">
    <argument type="service" id="SwagMigrationAssistant\Profile\Shopware\Gateway\Local\ReaderRegistry" />
    <tag name="shopware.migration.gateway" />
</service>
<service id="SwagMigrationAssistant\Profile\Shopware\Gateway\Api\ShopwareApiGateway">
    <argument type="service" id="SwagMigrationAssistant\Migration\Gateway\Reader\ReaderRegistry"/>
    <tag name="shopware.migration.gateway" />
</service>
```

For the `shopware55` profile there are two gateways: the `api` gateway (`ShopwareApiGateway`) which communicates via http/s and requires the Shopware Migration Connector plugin installed in the Shopware 5 source, and the `local` gateway (`ShopwareLocalGateway`) which connects directly to the source database — this requires both systems to run on the same server.

`GatewayRegistry` collects all tagged gateways and picks the right one per migration context: `getGateways()` filters by `supports()`, and `getGateway()` matches the connection's `profileName`/`gatewayName` combination, throwing `GatewayNotFoundException` if none matches.

A gateway implements `GatewayInterface`, exposing `getName()`, `supports(MigrationContextInterface)`, `read(MigrationContextInterface): array`, `readEnvironmentInformation(MigrationContextInterface, Context): EnvironmentInformation`, and `readTotals()`. `ShopwareLocalGateway::read()` delegates to a `Reader` obtained from `ReaderRegistry::getReader()`; `readTable()` delegates to a `TableReaderInterface`.

## Essential identifiers

`GatewayInterface`, `GatewayRegistry`, `GatewayRegistryInterface`, `ShopwareLocalGateway`, `ShopwareApiGateway`, `ReaderRegistry`, `TableReaderInterface`, `shopware.migration.gateway` tag, `GatewayNotFoundException`, `EnvironmentInformation`.

## Gotchas

The `local` gateway only works when the source system's database and Shopware 6 run on the same server; using `ShopwareApiGateway` requires installing the separate Shopware Migration Connector plugin on the Shopware 5 side first.
