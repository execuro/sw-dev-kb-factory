---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/_index.md
sourceHash: 9bdd7b359d9ffb90ac41adfba20dfbe795d7c588
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/
title: Storefront Controllers
version: "6.7"
versions:
  - "6.7"
keywords: ["StorefrontController", "StorefrontRouteScope::ID", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "_routeScope", "createActionResponse", "_httpCache", "frontend route prefix", "page loader", "store api route", "storefront controller rules", "controller guidelines", "flash bag"]
summary: "Storefront controller rules: extend StorefrontController, storefront route scope, frontend. names, no business logic, delegate to Store API."
lastBuilt: 2026-10-21
---
## What it is

The guideline set for Storefront controllers: classes that define HTTP endpoints in the storefront scope, coordinate page rendering, and delegate business logic to Store API routes or page loaders.

## When to use

When writing or reviewing a Storefront controller in a plugin or in Core, to check structure, responsibilities, data loading, write handling and caching against Shopware's conventions.

## Key steps / config

Structure:

- Extend `\Shopware\Storefront\Controller\StorefrontController`.
- Define the storefront route scope on the class:
  `#[Route(defaults: [\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [\Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID]])]`
- Every action has its own `#[Route]` attribute with an explicit HTTP method (GET, POST, DELETE, PATCH) and a declared return type; keep function names concise.
- Route names use the `frontend` prefix unless explicitly configured otherwise.
- Inject dependencies through the constructor, define them in the DI service definition, and assign them to private properties.

Responsibilities:

- One controller = one entry point; one route = one purpose.
- No business logic in controllers — it belongs in Store API routes. No direct repository access.

Data loading and writes:

- Read operations delegate to Store API routes or page loaders; full pages use a page loader class, which may call several Store API routes.
- Write operations call the corresponding Store API route; use `createActionResponse()` for redirects or forwards.

Caching and extras:

- Pages with identical data for all users use the `_httpCache` attribute.
- Report errors via Symfony flash bags.
- Storefront functionality should also be available through the Store API.

## Essential identifiers

- `\Shopware\Storefront\Controller\StorefrontController`
- `\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` (value `_routeScope`)
- `\Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID` (value `storefront`)
- `createActionResponse()`
- `_httpCache`

## Gotchas

- In the installed Storefront router, a route name counts as a storefront route if it starts with `frontend.`, `widgets.` or `payment.`, or is listed in the `storefront.router.allowed_routes` parameter — that is the "unless explicitly configured otherwise" escape hatch.
- `createActionResponse()` reads the `redirectTo`/`redirectParameters` and `forwardTo`/`forwardParameters` request parameters; an empty `redirectTo` redirects to `frontend.home.page`.

## Code check (6.7.15.1)
- confirmed `StorefrontController` — abstract base extending Symfony AbstractController — vendor/shopware/storefront/Controller/StorefrontController.php:41
- confirmed `StorefrontController::createActionResponse()` — handles redirectTo/forwardTo — vendor/shopware/storefront/Controller/StorefrontController.php:126
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:78
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — value `_httpCache` — vendor/shopware/core/PlatformRequest.php:82
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `frontend.` — storefront route-name prefix (also `widgets.`, `payment.`) — vendor/shopware/storefront/Framework/Routing/Router.php:204
- confirmed `allowed_routes` — storefront.router config node for non-prefixed names — vendor/shopware/storefront/DependencyInjection/Configuration.php:43
