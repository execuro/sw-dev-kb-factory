---
id: platform/dev/6.7/resources/guidelines/code/routing.md
title: Routing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/routing.html
sourceHash: 74261a550d6c61e0c2f84e15b0dc4001a49567e1
codeCheckedAgainst: "6.7.15.1"
keywords: ["routing", "route name", "frontend", "storefront routes", "route scope", "_routeScope", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "openapi schema", "api definition", "Generator/Schema", "coding guidelines", "RouteScopeRule"]
summary: Platform routing rules - Storefront route names start with frontend, core routes need an OpenAPI schema under Generator/Schema, routes need a route scope.
lastBuilt: 2026-10-21
---
## What it is

A short coding guideline for routes in the Shopware platform: how Storefront routes are named and where core routes document their API schema. The docs also require a version annotation on every route, which no longer exists in the installed code (see Gotchas).

## When to use

When adding or reviewing a controller route in the platform — a Storefront page/widget route or a core API route (Admin API / Store API).

## Key steps / config

1. Storefront route names always start with the prefix `frontend` (e.g. `frontend.home.page`, `frontend.account.home.page`).
2. Each core route has an OpenAPI schema defined under `src/Core/Framework/Api/ApiDefinition/Generator/Schema` — in the installed code split into `Schema/AdminApi` (read by `OpenApi3Generator`) and `Schema/StoreApi` (read by `StoreApiGenerator`), each with `paths/` and `components/` JSON files. Bundles can contribute their own schemas under `Resources/Schema/<api folder>`.
3. Every controller method with a `#[Route]` must have a route scope, either on the method or on the class, via `defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [...]]` (key value `_routeScope`); the PHPStan rule `RouteScopeRule` reports methods without one.

```php
#[Route(
    path: '/store-api/category/{navigationId}',
    name: 'store-api.category.detail',
    methods: [Request::METHOD_GET, Request::METHOD_POST],
)]
```

## Essential identifiers

- Route name prefix `frontend.` (Storefront); `widgets.` is the other Storefront prefix
- `src/Core/Framework/Api/ApiDefinition/Generator/Schema` (`AdminApi`, `StoreApi`)
- `Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` (`_routeScope`)
- `Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\RouteScopeRule`

## Gotchas

- The docs say every route must carry the `Shopware\Core\Framework\Routing\Annotation\Since` annotation. That class does not exist anywhere in the installed 6.7 code; routes are declared with Symfony's `#[Route]` attribute and no version annotation is required or available.
- Core code outside allowed namespaces must not reference Storefront route names: `StorefrontRouteUsageRule` flags string literals starting with `frontend.` or `widgets.`.

## Code check (6.7.15.1)
- absent `Shopware\Core\Framework\Routing\Annotation\Since` — not present in the installed code; no replacement annotation is required
- confirmed `frontend.home.page` — Storefront route name with `frontend` prefix — vendor/shopware/storefront/Controller/NavigationController.php:51
- confirmed `frontend.account.home.page` — Storefront route name with `frontend` prefix — vendor/shopware/storefront/Controller/AccountProfileController.php:51
- confirmed `StorefrontRouteUsageRule::NOT_ALLOWED_STOREFRONT_ROUTE_PREFIXES` — `frontend.` and `widgets.` — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/StorefrontRouteUsageRule.php:29
- confirmed `Generator/Schema/AdminApi` — Admin API schema path used by OpenApi3Generator — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/OpenApi3Generator.php:42
- confirmed `Generator/Schema/StoreApi` — Store API schema path used by StoreApiGenerator — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/StoreApiGenerator.php:56
- confirmed `/Resources/Schema/` — per-bundle schema folder — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/BundleSchemaPathCollection.php:34
- confirmed `RouteScopeRule` — errors when a route method has no route scope — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/RouteScopeRule.php:29
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:78
