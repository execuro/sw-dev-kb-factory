---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/_index.md
title: Concept
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/
sourceHash: 5e2c4494e159358ead571c6d5a057ded668e04e6
codeCheckedAgainst: "6.7.15.1"
keywords: ["SwagMigrationAssistant", "migration concept", "profile", "connection", "DataSelection", "DataSet", "premapping", "gateway", "Reader", "Converter", "MappingService", "Writer", "ShopwareApiGateway", "SwagMigrationConnector", "deltas"]
summary: "Migration Assistant architecture: profile, connection, DataSelection, premapping, gateway/reader, converter/mapping, writer, extension points."
lastBuilt: 2026-10-21
---
## What it is

Overview of the building blocks of the Shopware Migration Assistant (`SwagMigrationAssistant`, source at `https://github.com/shopware/SwagMigrationAssistant`) and how data flows through them, from reading a source system to writing into Shopware 6. It assumes you already know how to use the plugin; usage itself is not explained.

## When to use

- Before extending the Migration Assistant: migrating your own plugin's data, adding API support, decorating a converter, or writing a new profile for a third-party source system.
- To understand which concept (profile, gateway, reader, converter, mapping, writer) a migration problem belongs to.

## Key steps / config

Data flow of one migration:

1. **Profile and connection** — a user creates a connection to a source system; each connection requires a profile describing the source type (e.g. the Shopware 5.5 profile). Connections allow repeated migrations from the same source and keep the mapping correct. Developers can write new profiles or extend existing ones.
2. **DataSelection and DataSet** — define what to migrate. Each `DataSet` represents an entity (e.g. a database table); each `DataSelection` is an ordered group of `DataSets`.
3. **Migration context** — data structure carrying everything needed for the migration.
4. **Premapping** — the user maps source structures that do not match the target (e.g. custom salutations; default ones such as `Mr.` map automatically). Premapping is written into the mapping table, associating old identifiers with new ones.
5. **Gateway and reader** — the gateway defines how to talk to the source; `Reader` objects read the data. For the `shopware55` profile: the `api` gateway (HTTP/S) and the `local` gateway (direct database access to the source).
6. **Converter, mapping, deltas** — `Reader` output goes to `Converter` objects that reshape it for Shopware 6, while mapping-table entries map old identifiers to new ones (see `MappingService`). The mapping is stored per connection and persists; converted data is removed after the migration. A checksum stored with the mapping lets unchanged source data be skipped.
7. **Writer** — `Writer` objects write converted data to Shopware 6; error handling is done by the Migration Assistant.
8. **Media processing** — a dedicated step after writing; gateway-specific processors fetch files via HTTP (`api`) or the local filesystem (`local`).
9. **Logging and error resolution** — errors (mostly during conversion) are logged for the user; the user can inspect an error, fix the cause (e.g. create a missing tax), mark it resolved, and the entity is migrated again.

Extension points:

- Recommended for plugin data: extend the existing profile with a new `DataSelection`.
- For a different shop/source system: create a new profile.
- Guides cover extending a Shopware migration profile (local gateway), extending the Migration Connector (API support), decorating a converter (premapping and changed behavior), and creating a new profile.

## Essential identifiers

- `DataSelection`, `DataSet`
- `Reader`, `Converter`, `Writer`, `MappingService`
- `ShopwareApiGateway`
- profile `shopware55`; gateways `api`, `local`

## Gotchas

- The `local` gateway talks directly to the source database, so both systems must be on the same server.
- `ShopwareApiGateway` requires the Shopware Connector plugin (`https://github.com/shopware/SwagMigrationConnector`) installed in the Shopware 5 shop.

## Code check (6.7.15.1)
- confirmed `SwagMigrationAssistant` — plugin name the admin first-run wizard offers for data import — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:26
- unverified `DataSelection` — defined in the separate SwagMigrationAssistant plugin, not in core/storefront/administration
- unverified `DataSet` — plugin class, out of scope
- unverified `MappingService` — plugin class, out of scope
- unverified `ShopwareApiGateway` — plugin class, out of scope
- unverified `shopware55` — profile name defined in the plugin, out of scope
