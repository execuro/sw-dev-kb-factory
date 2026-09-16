---
id: platform/dev/6.6/concepts/api/store-api.md
title: Store API
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/api/store-api.html
sourceHash: e14254524078566de4bc6677c129b68fe9c1f25e
keywords: ["Store API", "storefront api", "JSON API", "HTTP", "headless commerce", "custom frontend", "SPA", "native app", "Shopware Core", "extensibility", "custom routes", "Composable Frontends"]
summary: "The Store API is the customer-facing interface for building custom frontends like SPAs or native apps against the Shopware Core over JSON/HTTP."
lastBuilt: 2026-09-15
---
## What it is
The Store API models every interaction between the store and a customer. It acts as a normalized layer, or interface, for communication between customer-facing applications and the Shopware Core. Because it exposes a JSON API over HTTP, it can be consumed by any client capable of speaking JSON over HTTP, regardless of the technology used to build that client.

## When to use
Use the Store API to build custom frontends such as single-page applications (SPAs), native apps, or simple catalog apps that need to read from or interact with a Shopware store without going through the bundled Storefront component. Whenever additional logic is added to Shopware, the corresponding service's method is exposed through a dedicated HTTP route, so the same logic that powers the Storefront is available to any Store API consumer, keeping the two in sync and avoiding duplicated business logic. This also lets core functionality be built into the Storefront without breaking support for external API consumers.

## Key steps / config
Extensibility is handled through plugins:
- Plugins can add custom routes to the Store API (as well as to any other routes).
- Plugins can register custom services.

Shopware does not force developers to provide API coverage for every plugin functionality. However, if a plugin is meant to support headless applications, it should expose its functionality through dedicated routes so headless consumers can reach it.

## Essential identifiers
- `Store API`
- Shopware Core
- Composable Frontends (a project built on top of the Store API)

## Gotchas
Plugin authors are not required to expose Store API routes for their features; omitting them means headless/API-only consumers cannot use that functionality unless dedicated routes are added.
