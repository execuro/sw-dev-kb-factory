---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/_index.md
title: "Data Handling / DataAbstractionLayer"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/"
sourceHash: "5b1d9f17fa95dbf5ea470e2eeed36333b9fb1c9a"
keywords: ["data handling", "Data Abstraction Layer", "DAL", "custom complex data", "reading data", "writing data", "database events", "entity repository", "Criteria", "plugin data"]
summary: "Landing page for the Data Handling / Data Abstraction Layer (DAL) guides: adding, reading, and writing entity data, and listening to DAL events."
lastBuilt: "2026-09-15"
---
## What it is

This is the landing page for the "Data Handling / DataAbstractionLayer" section of the plugin
guides. The Data Abstraction Layer (DAL) is Shopware's data access layer; the source describes
it as a topic that can feel overwhelming at first but becomes fairly easy once you know where
to start.

## When to use

Use this page as the entry point when a plugin needs to read, write, or extend entity data
through the DAL, or needs to react to changes in that data.

## Key steps / config

The source points to the following starting topics, in this order:

- Adding custom complex data — creating a new entity and its definition.
- Reading data — fetching entity data from the database, including filtering, associations,
  and aggregations, via a generated `entity_name.repository` service and a `Criteria` object.
- Writing data — persisting entity data back to the database.
- Listening to events of the DAL — reacting to database events raised by the DAL.

## Essential identifiers

- Data Abstraction Layer (DAL) — Shopware's data access layer, used instead of a traditional
  ORM.
- `entity_name.repository` — the naming pattern for the generated repository service per
  entity (for example `product.repository`).
- `Criteria` — the object used to filter, sort, limit, and aggregate DAL search results.
