---
id: platform/dev/6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md
title: When to use plain SQL or the DAL
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.html
sourceHash: c582fa2161f08bbf3f8d69327478de9ee2dbf8ba
keywords: ["DAL", "Data Abstraction Layer", "plain SQL", "entity indexer", "Store API", "admin API", "storefront page loader", "ACL", "entity repository", "theme compiler", "request transformer", "write process"]
summary: "ADR: use the DAL in Store API, admin API, storefront loaders and all writes; use plain SQL only in entity indexers and core components."
lastBuilt: "2026-09-15"
---
## What it is

An architecture decision record settling when Shopware code should use the Data Abstraction Layer (DAL) versus plain SQL.

## When to use

Consult this when implementing a new data-access path and deciding whether to go through the DAL or query the database directly.

## Key steps / config

Use the DAL:

- In the Store API — data selected and returned must be extensible by third-party developers, requests should allow additional data to be loaded, and retrieval/encoding must be secured by ACL.
- In storefront page loaders and controllers — data passed to Twig templates must be extensible by third-party developers.
- On admin API level — same extensibility and ACL requirements as the Store API.
- For all writes — the DAL's validation, event and indexing system is mandatory for data integrity, except for entity indexers.

Use plain SQL:

- In entity indexers — they sit behind the entity repository layer, must re-index all data after a version update with minimal hydration/event overhead, and are not an extension point, so their queries should never be rewritten.
- In core components (theme compiler, request transformer, etc.) — these are not extension points either; deep processes like theme compiling should not depend on plugin entity schemas, since plugins may be in an unstable state during an update.

## Essential identifiers

- Store API, admin API, storefront page loader/controller, entity indexer, theme compiler, request transformer

## Gotchas

Entity indexer and core-component queries should never be rewritten to use the DAL, since they are internal processing paths, not extension points, and third-party data extensions are not expected to apply there.
