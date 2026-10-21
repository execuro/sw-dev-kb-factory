---
id: platform/dev/6.7/guides/plugins/plugins/framework/store-api/_index.md
title: Store API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/
sourceHash: 7e7aae99c4a18cbece52c7395c805dc56903b0e2
codeCheckedAgainst: "6.7.15.1"
keywords: ["store api", "StoreApiResponse", "StoreApiRouteScope::ID", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "store-api", "_routeScope", "custom endpoint", "route decoration", "sales channel api", "storefront controller", "named routes"]
summary: Conventions for plugin Store API routes - services in the store-api scope returning one StoreApiResponse, called by Storefront controllers.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md", "platform/dev/6.7/guides/plugins/plugins/framework/store-api/override-existing-route.md"]
---
## What it is

Section overview for adding custom Store API endpoints or extending existing ones from a plugin. Store API routes are service-based and follow fixed conventions so they stay consistent, cacheable and extensible.

## When to use

Before writing or changing a Store API route in a plugin, or when deciding where Storefront business logic belongs. Follow-ups: [Add Store API route](platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md) and [Override existing route](platform/dev/6.7/guides/plugins/plugins/framework/store-api/override-existing-route.md).

## Key steps / config

Routes:

- Do not implement the Sales Channel API (deprecated as of 6.4).
- Define Store API controllers as services and use named routes internally.
- Each route class or API method needs the attribute
  `#[Route(defaults: [\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [\Shopware\Core\Framework\Routing\StoreApiRouteScope::ID]])]`
  (resolves to `_routeScope` => `['store-api']`).
- Response decorators must extend `StoreApiResponse`.

Route design:

- One route = one focused functionality.
- A route returns a `StoreApiResponse` (converted to JSON) containing exactly one object.
- Routes may be decorated to extend behavior.

Storefront integration:

- Storefront controllers must not access repositories directly; they call Store API routes.
- Page loaders and controllers may call several routes.
- Business logic belongs in Store API routes, not in controllers.

## Essential identifiers

- `Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`
- `Shopware\Core\Framework\Routing\StoreApiRouteScope::ID`
- `Shopware\Core\System\SalesChannel\StoreApiResponse`

## Code check (6.7.15.1)
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:78
- confirmed `StoreApiRouteScope::ID` — value `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `StoreApiResponse` — extends Symfony `Response`, constructor takes one `Struct $object` — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:14
