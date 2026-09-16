---
id: platform/dev/6.7/resources/guidelines/code/routing.md
title: Routing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/routing.html
sourceHash: 74261a550d6c61e0c2f84e15b0dc4001a49567e1
codeCheckedAgainst: "6.7.13.0"
keywords: ["routing", "route name", "frontend.", "storefront routes", "#[Route]", "openapi schema", "api schema", "AdminApi", "StoreApi", "Resources/Schema", "route scope", "coding guidelines"]
summary: "Shopware routing guideline: Storefront route names start with frontend; core routes need an OpenAPI schema under ApiDefinition/Generator/Schema."
lastBuilt: 2026-09-15
---
## What it is

A short Shopware coding guideline for routes: naming of Storefront routes, a route annotation requirement, and where API route schemas live. The annotation requirement is outdated for the installed 6.7 code (see Gotchas).

## When to use

When adding a controller route to Shopware core or Storefront, or a plugin route that should appear in the generated Admin/Store API OpenAPI specification.

## Key steps / config

1. **Storefront route names** get the prefix `frontend` in the name, e.g. `frontend.account.home.page`. The Storefront router treats names starting with `frontend.`, `widgets.` or `payment.` as Storefront routes.
2. **Declare routes** with the Symfony `#[Route]` attribute (`Symfony\Component\Routing\Attribute\Route`):
   ```php
   #[Route(
       path: '/account',
       name: 'frontend.account.home.page',
       defaults: [/* ... */],
   )]
   ```
   Core's PHPStan `RouteScopeRule` reports controller methods whose route has no route scope on the method or class.
3. **Core route schema**: each core route has a schema under `src/Core/Framework/Api/ApiDefinition/Generator/Schema` — in the `AdminApi` or `StoreApi` subfolder, as `*.json` files (paths, components, tags) merged into the generated OpenAPI spec.
4. **Bundles/plugins**: the generator also loads `<bundle path>/Resources/Schema/AdminApi` or `Resources/Schema/StoreApi` if the directory exists.

## Essential identifiers

- `frontend.` route name prefix
- `Symfony\Component\Routing\Attribute\Route`
- `src/Core/Framework/Api/ApiDefinition/Generator/Schema` (`AdminApi`, `StoreApi`)
- `Resources/Schema/AdminApi`, `Resources/Schema/StoreApi`
- `RouteScopeRule`

## Gotchas

- The guideline says every route must have the `Shopware\Core\Framework\Routing\Annotation\Since` annotation. That class does not exist in the installed code; 6.7 routes are plain `#[Route]` attributes without it. Do not add it.
- A schema JSON file that is not valid JSON makes schema loading throw `ApiException::invalidSchemaDefinitions`.

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\Routing\Annotation\Since` — not found anywhere in the installed code index; routes use Symfony `#[Route]`
- confirmed `frontend.` — Storefront router recognises names starting with `frontend.`, `widgets.`, `payment.` — vendor/shopware/storefront/Framework/Routing/Router.php:204
- confirmed `frontend.account.home.page` — example Storefront route name in a `#[Route]` attribute — vendor/shopware/storefront/Controller/AccountProfileController.php:51
- confirmed `Generator/Schema/AdminApi` — Admin API static schema path — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/OpenApi3Generator.php:41
- confirmed `Generator/Schema/StoreApi` — Store API static schema path — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/StoreApiGenerator.php:55
- confirmed `Resources/Schema/` — per-bundle schema folder lookup — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/BundleSchemaPathCollection.php:34
- confirmed `ApiException::invalidSchemaDefinitions()` — thrown on invalid schema JSON — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/OpenApiFileLoader.php:47
- confirmed `RouteScopeRule` — reports routes without a route scope — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/RouteScopeRule.php:29
