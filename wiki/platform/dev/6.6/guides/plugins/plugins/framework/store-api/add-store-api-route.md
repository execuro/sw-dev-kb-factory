---
docType: developer
id: platform/dev/6.6/guides/plugins/plugins/framework/store-api/add-store-api-route.md
sourceHash: ceee65e48e1d2536c5fcd9292a69c4e48e2a2467
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/store-api/add-store-api-route.html
title: Add store API route
version: "6.6"
versions:
  - "6.6"
keywords: ["store api route", "AbstractExampleRoute", "StoreApiResponse", "_routeScope", "store-api", "routes.xml", "ApiAware", "DecorationPatternException", "swagger", "debug:router", "storefront controller", "XmlHttpRequest"]
summary: "How to add a custom Store API route: abstract route, concrete route, response class, routes.xml, and an optional Storefront wrapper."
lastBuilt: "2026-09-15"
---
## What it is
This guide shows how to add a new custom Store API route, using the abstract-class decoration pattern Shopware uses for its own routes.

## When to use
When a plugin needs to expose a new endpoint under `/store-api/...` for searching or returning custom entity data.

## Key steps / config
1. Create an abstract class (`AbstractExampleRoute`) declaring `abstract public function getDecorated(): AbstractExampleRoute;` and `abstract public function load(Criteria $criteria, SalesChannelContext $context): ExampleRouteResponse;`.
2. Create the concrete route class extending it, tagged with the `#[Route(defaults: ['_routeScope' => ['store-api']])]` attribute, and a method-level route:
```php
#[Route(path: '/store-api/example', name: 'store-api.example.search', methods: ['GET','POST'], defaults: ['_entity' => 'swag_example'])]
public function load(Criteria $criteria, SalesChannelContext $context): ExampleRouteResponse
```
   `getDecorated()` must throw `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException` since it has no decoration yet. All fields returned via the API require the `ApiAware` flag in the entity definition.
3. Create a response class extending `Shopware\Core\System\SalesChannel\StoreApiResponse`, exposing a typed `getExamples(): ExampleCollection` accessor over `$this->object`.
4. Register the route service in `services.xml`, injecting the repository (e.g. `swag_example.repository`).
5. Register routes with a `routes.xml` at `<plugin root>/src/Resources/config/`:
```xml
<routes xmlns="http://symfony.com/schema/routing" ...>
    <import resource="../../Core/**/*Route.php" type="attribute" />
</routes>
```
6. Verify registration: `$ ./bin/console debug:router store-api.example.search`.
7. To document the route in Swagger, add a JSON file under `<plugin root>/src/Resources/Schema/StoreApi/` (use `AdminApi` for Admin API endpoints) following the OpenAPI 3.0 format; check it at `/store-api/_info/swagger.html`.
8. To expose the route to the Storefront, add a `Shopware\Storefront\Controller\StorefrontController` subclass with `#[Route(defaults: ['_routeScope' => ['storefront']])]`, and extend `routes.xml` to also `<import resource="../../Storefront/**/*Controller.php" type="attribute" />`. Use `'XmlHttpRequest' => true` in the route defaults to allow AJAX calls from Storefront JS.

## Essential identifiers
- `#[Route(defaults: ['_routeScope' => ['store-api']])]` / `['storefront']`
- `Shopware\Core\System\SalesChannel\StoreApiResponse`
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`
- `ApiAware` flag
- `routes.xml` (`<import resource="..." type="attribute" />`)
- `/store-api/_info/swagger.html`, `bin/console debug:router`

## Gotchas
- Fields must carry the `ApiAware` flag in the definition to be returned through the API.
- `getDecorated()` on the base (non-decorated) route implementation must throw `DecorationPatternException`.
