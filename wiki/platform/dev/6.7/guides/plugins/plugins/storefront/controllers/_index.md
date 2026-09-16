---
id: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/_index.md
title: Storefront Controllers
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/
sourceHash: 9bdd7b359d9ffb90ac41adfba20dfbe795d7c588
codeCheckedAgainst: "6.7.13.0"
keywords: ["StorefrontController", "StorefrontRouteScope::ID", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "_routeScope", "_httpCache", "createActionResponse", "page loader", "frontend route prefix", "storefront controller rules", "store api delegation", "http cache", "flash bag"]
summary: "Storefront controller rules: extend StorefrontController, set storefront route scope, no business logic, delegate to Store API or page loaders."
lastBuilt: 2026-09-15
---
## What it is

The structural and responsibility rules for Storefront controllers: classes that define HTTP endpoints in the storefront scope, coordinate page rendering and delegate business logic to Store API routes or page loaders.

## When to use

When writing or reviewing a Storefront controller (plugin or core) and checking its structure, data loading, write operations and caching against the expected conventions.

## Key steps / config

Structure:
- Extend `\Shopware\Storefront\Controller\StorefrontController`.
- Define the storefront route scope on the class:
  `#[Route(defaults: [\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [\Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID]])]` (`_routeScope` => `storefront`).
- Every action has its own `#[Route]` attribute with an explicit HTTP method (GET, POST, DELETE, PATCH) and a declared return type; keep function names concise.
- Route names use the `frontend` prefix unless configured otherwise. The installed Storefront router treats names starting with `frontend.`, `widgets.` or `payment.`, plus names listed in `storefront.router.allowed_routes`, as storefront routes.
- Inject dependencies via the constructor, define them in the DI service definition, and assign them to private properties.

Responsibilities:
- One controller = one entry point; one route = one purpose.
- No business logic in controllers; it belongs in Store API routes. No direct repository access.

Data loading:
- Read operations delegate to Store API routes or page loaders; routes rendering full pages use a page loader class, which may call several Store API routes.

Write operations:
- Call the corresponding Store API route; use `createActionResponse()` for redirects or forwards.

Caching:
- Pages with identical data for all users set the `_httpCache` route default (`PlatformRequest::ATTRIBUTE_HTTP_CACHE`).

Additional: report errors via Symfony flash bags; storefront functionality should also be available in the Store API.

## Essential identifiers

- `Shopware\Storefront\Controller\StorefrontController`
- `Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`
- `Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID`
- `StorefrontController::createActionResponse()`
- `_httpCache`

## Code check (6.7.13.0)
- confirmed `StorefrontController` — abstract base extending AbstractController — vendor/shopware/storefront/Controller/StorefrontController.php:40
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:77
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `StorefrontController::createActionResponse()` — protected, takes the Request — vendor/shopware/storefront/Controller/StorefrontController.php:125
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — value `_httpCache` — vendor/shopware/core/PlatformRequest.php:80
- confirmed `frontend.` — storefront route prefixes frontend./widgets./payment. plus allowed routes — vendor/shopware/storefront/Framework/Routing/Router.php:204
- unverified `flash bags` — Symfony AbstractController feature, vendor/symfony out of scope
