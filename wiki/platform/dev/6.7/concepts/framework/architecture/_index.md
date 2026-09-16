---
id: platform/dev/6.7/concepts/framework/architecture/_index.md
title: Architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/architecture/
sourceHash: de4d2b0b2455c12f6e3f0b8d24b8e58c3a98fa7e
codeCheckedAgainst: "6.7.13.0"
keywords: ["architecture", "Core", "Storefront", "Administration", "api-first", "headless", "Store API", "Admin API", "DAL", "EntityRepository", "ScheduledTask", "message queue", "plugin system", "separation of concerns"]
summary: Shopware 6 architecture overview - Core, Storefront and Administration domains, API-first design, plugins/events, message queue and scheduled tasks.
lastBuilt: 2026-09-15
---
## What it is

Overview of Shopware's modular, API-first architecture built on Symfony. The platform is split into three domains that share one backend foundation and communicate through a shared API layer and a common plugin system:

- **Core** — backend foundation: business logic, data abstraction, APIs, extension mechanisms.
- **Storefront** — customer-facing presentation layer rendering sales channels and using the Store API.
- **Administration** — management UI for merchants and operators.

## When to use

When you need the mental model of where a feature belongs (Core vs. Storefront vs. Administration) before choosing an extension point, or when explaining how headless/composable setups relate to the default frontends.

## Key steps / config

Architectural principles stated by the source:

1. **API-first** — all functionality is exposed via APIs (headless and composable commerce).
2. **Separation of concerns** — Storefront/Administration are decoupled from backend logic and consume Core services instead of duplicating logic.
3. **Extensibility** — plugins integrate through events, services and extension points, not by modifying core code.
4. **Asynchronous processing** — indexing, messaging and integrations run via message queues and workers.
5. **Domain-driven structure** — business logic is organized around commerce domains, not UI features.

Core components provided by the Core:

- Data Abstraction Layer (DAL) for database access — entry point `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`
- Business services and domain logic
- Sales Channel / Store API (route scope id `store-api`) and Admin API (route scope id `api`)
- Plugin and event system — plugins extend `Shopware\Core\Framework\Plugin`
- Messaging and scheduled task infrastructure — `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTask`
- Entity indexing — `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer`

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`
- `Shopware\Core\Framework\Plugin`
- `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTask`
- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer`
- `store-api` / `api` route scopes
- `Shopware\Storefront\Storefront` (Storefront bundle)

## Code check (6.7.13.0)
- confirmed `Framework` — framework layer is a Symfony bundle in core — vendor/shopware/core/Framework/Framework.php:57
- confirmed `Storefront` — Storefront is its own bundle (also a theme) — vendor/shopware/storefront/Storefront.php:21
- confirmed `EntityRepository` — DAL repository class exists in core — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:36
- confirmed `Plugin` — plugins are Symfony bundles — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `ScheduledTask` — scheduled tasks are async messages — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTask.php:10
- confirmed `EntityIndexer` — base class of the indexer pattern — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9
- confirmed `StoreApiRouteScope::ID` — Store API route scope id `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `ApiRouteScope::ID` — Admin API route scope id `api` — vendor/shopware/core/Framework/Routing/ApiRouteScope.php:15
- unverified `Administration` — bundle class sits outside the administration src root in scope
