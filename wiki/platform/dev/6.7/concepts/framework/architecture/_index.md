---
id: platform/dev/6.7/concepts/framework/architecture/_index.md
title: Architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/architecture/
sourceHash: de4d2b0b2455c12f6e3f0b8d24b8e58c3a98fa7e
codeCheckedAgainst: "6.7.15.1"
keywords: ["architecture", "shopware architecture", "core", "storefront", "administration", "api-first", "headless", "symfony", "data abstraction layer", "dal", "store api", "plugin system", "message queue", "scheduled tasks"]
summary: Shopware 6.7 architecture overview - Core, Storefront and Administration domains on a Symfony, API-first base with DAL, plugins and queues.
lastBuilt: 2026-10-21
---
## What it is

Overview of Shopware's architecture. Shopware is modular and API-first, built on Symfony plus modern frontend technologies. Concerns are separated into clearly defined layers so that storefront experiences, administrative tooling and core business logic can evolve independently while sharing one backend foundation.

The system has three primary domains:

- **Core** - the backend foundation: business logic, data abstraction, APIs and extension mechanisms.
- **Storefront** - the customer-facing presentation layer that renders sales channels and talks to the Store API.
- **Administration** - the management interface merchants and operators use to configure, manage and operate the platform.

The three are unified through a shared API layer and a consistent plugin system, so features can be extended without being tightly coupled to a presentation layer.

## When to use

As the starting point for understanding where a piece of functionality lives (Core vs. Storefront vs. Administration) before reading the individual architecture concept pages, or when deciding at which layer an extension should hook in.

## Key steps / config

Architectural principles the platform follows:

- **API-first design** - all functionality is exposed via APIs, enabling headless and composable commerce.
- **Separation of concerns** - storefront and admin frontends are decoupled from backend logic.
- **Extensibility** - plugins integrate through events, services and extension points instead of modifying core code.
- **Asynchronous processing** - background work such as indexing, messaging and integrations runs through message queues and workers.
- **Domain-driven structure** - business logic is organised around commerce domains, not UI features.

What the Core provides:

- Data Abstraction Layer (DAL) for database interaction
- Business services and domain logic
- Sales Channel and Store APIs
- Plugin and event system
- Messaging and scheduled task infrastructure

The Storefront and Administration consume these Core services rather than duplicating logic, which keeps behaviour consistent across channels.

## Essential identifiers

- Core, Storefront, Administration
- Data Abstraction Layer (DAL), Store API, plugin system, message queue, scheduled tasks

## Code check (6.7.15.1)
- confirmed `Kernel` — Shopware kernel extends the Symfony HttpKernel — vendor/shopware/core/Kernel.php:37
- confirmed `EntityDefinition` — DAL base class for entity definitions — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:33
- confirmed `EntityRepository` — DAL repository for database access — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:37
- confirmed `SalesChannelRepository` — sales-channel-aware DAL repository — vendor/shopware/core/System/SalesChannel/Entity/SalesChannelRepository.php:36
- confirmed `StoreApiRouteScope` — route scope for Store API routes — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:13
- confirmed `ApiRouteScope` — route scope for the Admin API — vendor/shopware/core/Framework/Routing/ApiRouteScope.php:13
- confirmed `Plugin` — plugin base class, a Symfony Bundle — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `ScheduledTask` — scheduled task base, an async message — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTask.php:10
