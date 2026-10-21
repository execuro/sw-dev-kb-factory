---
id: platform/dev/6.7/resources/references/adr/2021-08-10-storefront-coding-standards.md
title: Storefront coding standards
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-08-10-storefront-coding-standards.html
sourceHash: 0fb181c6a6ee3d32fd42d17913a69e9df565d384
codeCheckedAgainst: "6.7.15.1"
keywords: ["StorefrontController", "StorefrontRouteScope", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "createActionResponse", "renderStorefront", "XmlHttpRequest", "_loginRequired", "_httpCache", "PageLoader", "PageletLoader", "route attribute", "storefront controller rules", "store-api route", "coding standards"]
summary: "ADR 2021-08-10: Storefront controller rules - Route attribute schema, StorefrontController base, route scope, PageLoaders and store-api routes, no DAL."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area: storefront, 2021-08-10) that writes down the coding standards for Storefront controllers, their route attributes, write operations and the Page/Pagelet loader pattern, as a baseline for further evolving the Storefront concept.

## When to use

When writing or reviewing a Storefront controller in a plugin or in core: which route attribute keys to use, what the controller may depend on, and how page data must be loaded.

## Key steps / config

Route attribute schema:

```php
#[Route(path: '/example/endpoint/{id}', name: 'frontend.example.endpoint', options: ['seo' => false], defaults: ['id' => null, 'XmlHttpRequest' => true, '_loginRequired' => true, '_httpCache' => true], methods: ['GET', 'POST', 'DELETE'])]
```

- `path` — route path; parameters in `{}`.
- `name` — unique, starts with `frontend.`.
- `options` — special cases; `seo` (true|false) is the only option named.
- `defaults` — default values for path/query parameters (e.g. `id`) plus preconfigured ones: `XmlHttpRequest` (ajax route, does not return `renderStorefront`), `_loginRequired` (logged-in customer required, otherwise a "permission denied" redirect), `_httpCache` (cache the route in the HTTP cache).
- `methods` — `GET` returns data or an HTML page, `POST` sends data, `DELETE` deletes data (the controller section also lists `PATCH`).

Controller rules:

- Class attribute: `#[Route(defaults: [\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [\Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID]])]`.
- Extend `\Shopware\Storefront\Controller\StorefrontController`; register as a **public** service (otherwise routes can be removed from the container).
- Inject dependencies through the constructor, defined in the DI container and assigned to private properties; only the container comes via `setContainer`.
- Every action has a return type hint, a concise name and a single purpose; report errors to the user via Symfony flash bags.
- No business logic and no direct repository/DAL use: every functionality goes through a store-api route service, so it is also available via API.
- Page-rendering `GET` routes call a PageLoader, which collects data via the Store API (optionally via PageletLoaders for sub-content) and always returns a Page object. Pages identical for all customers set `_httpCache=true`.
- Write operations call the corresponding store-api route and build their response with `createActionResponse` to allow different forwards and redirects.

## Essential identifiers

- `\Shopware\Storefront\Controller\StorefrontController` (`renderStorefront`, `createActionResponse`)
- `\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` (`_routeScope`)
- `\Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID` (`storefront`)
- Route defaults `XmlHttpRequest`, `_loginRequired`, `_httpCache`; option `seo`
- PageLoader / PageletLoader, Page / Pagelet objects

## Gotchas

- The ADR's parameter list misspells two defaults as `_loginRrequired` and `__httpCache`; the real keys are `_loginRequired` and `_httpCache` (as in its own example).
- Consequences: controller dependencies for page routes move into Loaders (create the `Loader` and `Page` if missing); direct DAL dependencies in the Storefront move to Store API routes; other disallowed dependencies need individual alternatives.

## Code check (6.7.15.1)
- confirmed `StorefrontController` — abstract base class extending AbstractController — vendor/shopware/storefront/Controller/StorefrontController.php:41
- confirmed `StorefrontController::renderStorefront()` — protected render helper — vendor/shopware/storefront/Controller/StorefrontController.php:68
- confirmed `StorefrontController::createActionResponse()` — protected, handles `redirectTo` forwarding — vendor/shopware/storefront/Controller/StorefrontController.php:126
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:78
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- corrected `_loginRequired` — docs: `_loginRrequired` in the parameter list — vendor/shopware/core/PlatformRequest.php:84
- corrected `_httpCache` — docs: `__httpCache` in the parameter list — vendor/shopware/core/PlatformRequest.php:82
- confirmed `XmlHttpRequest` — used as a route default in core controllers — vendor/shopware/storefront/Controller/CaptchaController.php:36
- confirmed `seo` — route option `['seo' => false]` in core controllers — vendor/shopware/storefront/Controller/WishlistController.php:60
- unverified `setContainer` — inherited from Symfony AbstractController, vendor/symfony out of scope
