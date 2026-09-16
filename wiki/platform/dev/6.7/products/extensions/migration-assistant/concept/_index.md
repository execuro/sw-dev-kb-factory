---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/_index.md
title: Concept
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/
sourceHash: 5e2c4494e159358ead571c6d5a057ded668e04e6
codeCheckedAgainst: "6.7.13.0"
keywords: ["migration assistant", "SwagMigrationAssistant", "profile", "connection", "DataSelection", "DataSet", "premapping", "gateway", "Reader", "ShopwareApiGateway", "Converter", "MappingService", "Writer", "shopware55", "SwagMigrationConnector"]
summary: "Migration Assistant concepts: profiles, connections, gateways/readers, DataSelection/DataSet, premapping, converters, mapping, writers, extension points."
lastBuilt: 2026-09-15
---
## What it is

Overview of the building blocks of the Shopware Migration Assistant plugin (`SwagMigrationAssistant`) and how data flows from a source system into Shopware 6. Each concept has its own detail page in the migration-assistant concept section.

## When to use

Before extending the Migration Assistant: adding a `DataSelection` for plugin data, adding API support via the connector, decorating a converter, or writing a new profile for a third-party shop system. Usage of the plugin itself is not covered.

## Key steps / config

Data flow and components:

- **Profile and connection** — users create connections to source systems; a connection allows repeated migrations from the same source and keeps the mapping. Each connection requires a profile naming the source-system type (e.g. the Shopware 5.5 profile). Developers can write new profiles or extend existing ones.
- **DataSelection and DataSet** — a `DataSet` represents one entity (e.g. a database table); a `DataSelection` is an ordered group of `DataSets`.
- **Migration context** — structure carrying all data needed for the migration.
- **Premapping** — lets the user map source structures that do not match automatically (e.g. custom salutations) to Shopware 6 ones; written to the mapping table (old identifier to new).
- **Gateway and reader** — the connection's gateway defines how to talk to the source; `Reader` objects read the data. For the `shopware55` profile: `api` gateway (HTTP/S) and `local` gateway (direct DB access, both systems on the same server). The `ShopwareApiGateway` requires the Shopware Connector plugin (`SwagMigrationConnector`) in Shopware 5.
- **Converter, mapping, deltas** — `Converter` objects turn reader data into Shopware 6 format and insert mapping entries (see `MappingService`) per connection. Converted data is removed after the migration; mappings persist. A checksum on the mapping lets unchanged source data be skipped.
- **Logging** — errors, especially during conversion, are logged for the user.
- **Error Resolution** — users inspect errors, fix the cause (e.g. create a missing tax), mark the error resolved, and the product is migrated again.
- **Writer** — `Writer` objects write converted data to Shopware 6; error handling is done by the Migration Assistant.
- **Media processing** — a dedicated step after writing; gateway-specific processors fetch files via HTTP (`api`) or the local filesystem (`local`).

Extension points:

- Recommended for plugin data: extend an existing profile with a new `DataSelection`.
- For a different shop/source system: create a new profile.
- Guides cover extending a Shopware migration profile (local gateway), extending the Migration Connector (API support), decorating a converter (premapping, changed behaviour), and creating a new profile.

## Essential identifiers

- `DataSelection`, `DataSet`
- `Reader`, `Converter`, `Writer`
- `MappingService`
- `ShopwareApiGateway`; gateways `api`, `local`; profile `shopware55`
- `SwagMigrationAssistant`, `SwagMigrationConnector`

## Gotchas

- The `local` gateway needs direct database access, so the source shop and Shopware 6 must be on the same server.
- The `api` gateway only works after installing the Shopware Connector plugin in the Shopware 5 source shop.

## Code check (6.7.13.0)
- confirmed `SwagMigrationAssistant` — first-run wizard data-import step references the plugin by name — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:38
- unverified `DataSelection` — SwagMigrationAssistant plugin code not installed; out of scope
- unverified `DataSet` — SwagMigrationAssistant plugin code not installed; out of scope
- unverified `ShopwareApiGateway` — SwagMigrationAssistant plugin code not installed; out of scope
- unverified `MappingService` — SwagMigrationAssistant plugin code not installed; out of scope
- unverified `SwagMigrationConnector` — Shopware 5 plugin, not in vendor/shopware; out of scope
