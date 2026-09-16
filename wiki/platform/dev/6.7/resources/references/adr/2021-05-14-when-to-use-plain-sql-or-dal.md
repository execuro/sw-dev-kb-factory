---
id: platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md
title: When to use plain SQL or the DAL
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.html
sourceHash: c582fa2161f08bbf3f8d69327478de9ee2dbf8ba
codeCheckedAgainst: "6.7.13.0"
keywords: ["dal", "data abstraction layer", "plain sql", "EntityRepository", "EntityIndexer", "dbal connection", "store api", "admin api", "storefront page loader", "entity indexer", "ThemeCompiler", "RequestTransformer", "acl", "adr"]
summary: "ADR: use the DAL for Store API, Admin API, storefront loaders and all writes; plain SQL only in entity indexers and core components (theme compiler)."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (core area) that defines in which application layers Shopware code uses the Data Abstraction Layer (DAL, entity repositories) and where it works with plain SQL on the database connection.

## When to use

- Deciding whether a new service, controller, page loader or indexer should read/write through a repository or through the database connection.
- Reviewing code that bypasses the DAL for writes or returns hand-queried data to an API or template.

## Key steps / config

Use the DAL (`Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`) in:

- **Store API** — returned data must be extensible by third-party developers, requests must always allow additional data to be loaded, and data retrieval/encoding must be secured by ACL.
- **Storefront page loaders and controllers** — data passed to Twig templates must be extensible; templates are customised by many developers, so a minimal subset of data is not enough.
- **Admin API** — same reasons as the Store API: extensibility, loading additional data, ACL.
- **All writes** — the DAL write process runs validation, events and indexing, so writes must go exclusively through the DAL (repository `create`, `update`, `upsert`, `delete`) to ensure data integrity. Entity indexers are the exception.

Use plain SQL (database connection) in:

- **Entity indexers** (subclasses of `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer`) — they sit behind the repository layer, must re-index all data after a version update with as little hydration and event overhead as possible, and are not an extension point; their queries are internal and should never be rewritten.
- **Core components** such as the theme compiler and request transformer — they load data for pure processing, not for third-party extension. Deep processes like theme compiling must not be affected by plugin entity schemas, because plugins are optional and may be in an unstable state during an update.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`
- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer`
- `Shopware\Storefront\Theme\ThemeCompiler`
- `Shopware\Core\Framework\Routing\RequestTransformer`, `Shopware\Storefront\Framework\Routing\RequestTransformer`

## Gotchas

- Writing via plain SQL outside indexers skips the DAL validation, event and indexing system the ADR relies on for data integrity.
- Indexers work with the connection directly; going through repositories there adds the hydration and event overhead the ADR wants to avoid.

## Code check (6.7.13.0)
- confirmed `EntityRepository` — DAL repository class — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:36
- confirmed `EntityRepository::upsert()` — DAL write entry point returning EntityWrittenContainerEvent — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:113
- confirmed `EntityIndexer` — abstract indexer base class — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9
- confirmed `EntityIndexer::update()` — reacts to DAL written events, handle() processes the messages — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:29
- confirmed `ProductIndexer::$connection` — core indexer injects the DBAL connection directly — vendor/shopware/core/Content/Product/DataAbstractionLayer/ProductIndexer.php:61
- confirmed `ThemeCompiler` — core theme compiler component — vendor/shopware/storefront/Theme/ThemeCompiler.php:33
- confirmed `RequestTransformer` — storefront request transformer (core one also exists) — vendor/shopware/storefront/Framework/Routing/RequestTransformer.php:17
