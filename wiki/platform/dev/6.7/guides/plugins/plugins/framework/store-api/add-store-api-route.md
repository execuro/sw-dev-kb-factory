---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md
sourceHash: 94273eed6534d6401682c14d3a3a0b2d6b5b15df
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/add-store-api-route.html
title: Add Store API Route
version: "6.7"
versions:
  - "6.7"
keywords: ["store api route", "custom endpoint", "StoreApiRouteScope", "AbstractExampleRoute", "StoreApiResponse", "DecorationPatternException", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "routes.php", "debug:router", "Resources/Schema/StoreApi", "openapi schema", "stoplight", "StorefrontController", "XmlHttpRequest", "_entity"]
summary: Plugin Store API endpoint - abstract route class, store-api route scope, StoreApiResponse, routes.php import, OpenAPI schema file, Storefront wrapper.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md", "platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md"]
---
## What it is

How a plugin adds a Store API endpoint (example `ExampleRoute` searching `swag_example` under `/store-api/example`), registers and discovers it, documents it in OpenAPI, and optionally wraps it for the Storefront.

## When to use

You need a custom sales-channel API endpoint backed by a plugin entity. The abstract-class pattern follows [Adjusting a service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).

## Key steps / config

1. Abstract class `AbstractExampleRoute` declaring `getDecorated(): AbstractExampleRoute` and `load(Criteria $criteria, SalesChannelContext $context): ExampleRouteResponse`.
2. Route class:
   ```php
   #[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]
   class ExampleRoute extends AbstractExampleRoute
   {
       public function getDecorated(): AbstractExampleRoute { throw new DecorationPatternException(self::class); }

       #[Route(path: '/store-api/example', name: 'store-api.example.search', methods: ['GET','POST'], defaults: ['_entity' => 'swag_example'])]
       public function load(Criteria $criteria, SalesChannelContext $context): ExampleRouteResponse { /* repository search */ }
   }
   ```
3. Service: `$services->set(ExampleRoute::class)->args([service('swag_example.repository')]);`
4. `ExampleRouteResponse extends Shopware\Core\System\SalesChannel\StoreApiResponse`; pass the `EntitySearchResult` to the parent constructor (`$object`), add `getExamples()` returning `$this->object->getEntities()`.
5. Discovery in `<plugin root>/src/Resources/config/routes.php`: `$routes->import('../../Core/**/*Route.php', 'attribute');`
6. Verify: `./bin/console debug:router store-api.example.search`
7. OpenAPI: JSON file in `<plugin root>/src/Resources/Schema/StoreApi/` (Admin API: `AdminApi`); inspect at `/store-api/_info/stoplightio.html`. Skeleton: `{"openapi": "3.0.0", "info": [], "paths": {"/example": {"post": {"tags", "summary", "operationId", "requestBody" ($ref `#/components/schemas/Criteria`), "responses" {"200"}, "security": [{"ApiKey": []}]}}}}`.
8. Storefront (optional): `ExampleController extends StorefrontController`, scope `StorefrontRouteScope::ID`, injects `AbstractExampleRoute`, route `path: '/example', name: 'frontend.example.search'`, defaults `['XmlHttpRequest' => 'true', '_entity' => 'swag_example']`, returns `$this->route->load($criteria, $context)`. Register with `->call('setContainer', [service('service_container')])` and add `$routes->import('../../Storefront/**/*Controller.php', 'attribute');`. Call from a [JS plugin](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md) with `fetch('/example', { method: 'POST' })`.

## Essential identifiers

- `StoreApiRouteScope::ID`, `StorefrontRouteScope::ID`, `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`
- `StoreApiResponse`, `DecorationPatternException`, `StorefrontController`
- `store-api.example.search`, `frontend.example.search`

## Gotchas

- Fields need the `ApiAware` flag in the definition to be exposed.
- `_entity` is required: the `Criteria` argument resolver throws when it is missing.
- A service-registered route is no endpoint until `routes.php` imports it; `debug:router` proves discovery only, not that requests succeed.

## Code check (6.7.13.0)
- confirmed `StoreApiRouteScope::ID` — value `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:77
- confirmed `StoreApiResponse::$object` — set via constructor, typed `Struct` — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:22
- confirmed `DecorationPatternException` — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:13
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `StorefrontController` — abstract Storefront controller base — vendor/shopware/storefront/Controller/StorefrontController.php:40
- confirmed `/Resources/Schema/` — bundle schema dir with `AdminApi`/`StoreApi` subfolder — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/BundleSchemaPathCollection.php:34
- confirmed `/store-api/_info/stoplightio.html` — Store API Stoplight route — vendor/shopware/core/System/SalesChannel/SalesChannel/StoreApiInfoController.php:70
- confirmed `_entity` — required for Criteria resolution — vendor/shopware/core/Framework/Routing/Annotation/CriteriaValueResolver.php:41
- confirmed `XmlHttpRequest` — route attribute checked for XHR requests — vendor/shopware/storefront/Framework/Routing/StorefrontSubscriber.php:245
