---
id: platform/dev/6.7/guides/plugins/plugins/framework/store-api/_index.md
title: Store API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/
sourceHash: 7e7aae99c4a18cbece52c7395c805dc56903b0e2
codeCheckedAgainst: "6.7.13.0"
keywords: ["store api", "store-api route", "StoreApiResponse", "StoreApiRouteScope::ID", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "_routeScope", "custom endpoint", "route decoration", "sales channel api", "storefront controller", "page loader", "conventions"]
summary: Store API plugin conventions - service routes with the store-api route scope attribute returning one StoreApiResponse; storefront calls routes.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md", "platform/dev/6.7/guides/plugins/plugins/framework/store-api/override-existing-route.md"]
---
## What it is

The section overview for adding custom Store API endpoints or extending existing ones in plugins. Store API routes are service-based and follow strict architectural conventions for consistency, cacheability and extensibility.

## When to use

Before writing or decorating a Store API route, or when deciding where storefront business logic belongs. How-tos: [adding routes](platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md) and [overriding existing routes](platform/dev/6.7/guides/plugins/plugins/framework/store-api/override-existing-route.md).

## Key steps / config

Routes:

- Do not implement the Sales Channel API (deprecated as of 6.4).
- Define Store API controllers as services and use named routes internally.
- Each route class or API method requires the attribute:
  `#[Route(defaults: [\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [\Shopware\Core\Framework\Routing\StoreApiRouteScope::ID]])]`
- Response decorators must extend `StoreApiResponse`.

Route design:

- One route = one focused functionality.
- A route must return a `StoreApiResponse` (`Shopware\Core\System\SalesChannel\StoreApiResponse`), which is converted to JSON; the response contains only one object.
- Routes may be decorated to extend behaviour.

Storefront integration:

- Storefront controllers must not access repositories directly; they call Store API routes.
- Page loaders and controllers may call multiple routes.
- Business logic belongs in Store API routes, not in controllers.

## Essential identifiers

- `\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` (value `_routeScope`)
- `\Shopware\Core\Framework\Routing\StoreApiRouteScope::ID` (value `store-api`)
- `Shopware\Core\System\SalesChannel\StoreApiResponse`

## Version notes

- The Sales Channel API is deprecated as of 6.4; use Store API routes instead.

## Code check (6.7.13.0)
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:77
- confirmed `StoreApiRouteScope::ID` — value `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `StoreApiResponse` — extends Symfony `Response` — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:14
