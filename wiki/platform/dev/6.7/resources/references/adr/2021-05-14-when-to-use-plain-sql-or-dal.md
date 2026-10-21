---
id: platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md
title: When to use plain SQL or the DAL
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.html
sourceHash: c582fa2161f08bbf3f8d69327478de9ee2dbf8ba
codeCheckedAgainst: "6.7.15.1"
keywords: ["plain sql", "dal", "data abstraction layer", "EntityRepository", "EntityIndexer", "entity indexer", "doctrine connection", "store api", "admin api", "storefront page loader", "acl", "adr"]
summary: "ADR: use the DAL in Store API, Admin API, storefront loaders and all writes; use plain SQL in entity indexers and core components."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2021-05-14, area core) on when Shopware code reads/writes through the Data Abstraction Layer (repositories) and when it uses plain SQL on the database connection directly.

## When to use

- When deciding whether a plugin service, route or indexer should use an entity repository or a raw database query.
- When reviewing code that bypasses the DAL.

## Key steps / config

Use the **DAL** in these layers:

- **Store API** — returned data must be extensible by third-party developers, requests must allow loading additional data, and data retrieval and encoding must be secured by ACL.
- **Storefront page loaders and controllers** — data handed to Twig templates must be extensible; templates are customised by many developers, so only providing a minimal subset of the data is not an option.
- **Admin API** — same reasons as the Store API: extensibility, loading additional data, ACL.
- **Writing data** — the DAL's validation, event and indexing system runs on writes, so all writes must go through the DAL to keep data integrity. Entity indexers are the exception.

Use **plain SQL** (the database connection) in these layers:

- **Entity indexers** — they sit behind the repository layer, must be able to re-index all data after an update with as little hydration and event overhead as possible, and are not an extension point; their queries are internal and should never be rewritten.
- **Core components** such as the theme compiler or request transformer — the loaded data is for processing only, not for third parties to extend. Deep processes like theme compiling must not be affected by plugin entity schemas, since plugins may be in an unstable state during an update.

## Essential identifiers

- `EntityRepository` (`Shopware\Core\Framework\DataAbstractionLayer`) — DAL access
- `EntityIndexer` (`Shopware\Core\Framework\DataAbstractionLayer\Indexing`) — base class for indexers that work on the connection
- Doctrine DBAL `Connection` — plain SQL access, as injected into indexers such as `ProductIndexer`
- `ThemeCompiler`, `RequestTransformer` — examples of core components

## Gotchas

- The ADR's Admin API bullet mentions "requests against the Store API"; in context it means Admin API requests.
- Writing with plain SQL outside indexers skips DAL validation, events and indexing.

## Code check (6.7.15.1)
- confirmed `EntityRepository` — DAL repository class — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:37
- confirmed `EntityIndexer` — abstract indexer base class — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9
- confirmed `EntityIndexer::update()` — reacts to DAL written events — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:29
- confirmed `ProductIndexer` — extends EntityIndexer — vendor/shopware/core/Content/Product/DataAbstractionLayer/ProductIndexer.php:34
- confirmed `Connection` — ProductIndexer injects the DBAL connection directly — vendor/shopware/core/Content/Product/DataAbstractionLayer/ProductIndexer.php:61
- confirmed `ThemeCompiler` — storefront theme compiler class — vendor/shopware/storefront/Theme/ThemeCompiler.php:33
- confirmed `RequestTransformer` — core request transformer class — vendor/shopware/core/Framework/Routing/RequestTransformer.php:9
