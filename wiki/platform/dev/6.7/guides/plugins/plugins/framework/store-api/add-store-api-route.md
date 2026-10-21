---
id: platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md
title: Add Store API Route
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/add-store-api-route.html
sourceHash: 94273eed6534d6401682c14d3a3a0b2d6b5b15df
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractExampleRoute", "StoreApiResponse", "StoreApiRouteScope::ID", "DecorationPatternException", "getDecorated", "routes.php", "debug:router", "Resources/Schema/StoreApi", "StorefrontRouteScope::ID", "XmlHttpRequest", "store api route", "custom endpoint", "openapi schema", "stoplight"]
summary: Add a custom Store API endpoint - abstract route plus route class, StoreApiResponse, service and routes.php import, OpenAPI JSON and Storefront wrapper.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md", "platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md"]
---
## What it is

Step-by-step creation of a custom Store API route in a plugin: `ExampleRoute` searching `swag_example` entities at `/store-api/example` (route name `store-api.example.search`), its response class, DI and routing registration, an OpenAPI schema file, and an optional Storefront controller wrapping it.

## When to use

A plugin must expose data or behavior through the Store API (headless clients, Storefront AJAX). The abstract-class pattern follows [Adjusting a service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md) so other plugins can decorate the route. Fields exposed through the API need the `ApiAware` flag in the entity definition.

## Key steps / config

1. Abstract class `AbstractExampleRoute` with `abstract public function getDecorated(): AbstractExampleRoute;` and `abstract public function load(Criteria $criteria, SalesChannelContext $context): ExampleRouteResponse;`.

2. Concrete `ExampleRoute extends AbstractExampleRoute`:

   ```php
   #[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]
   class ExampleRoute extends AbstractExampleRoute
   {
       public function getDecorated(): AbstractExampleRoute { throw new DecorationPatternException(self::class); }

       #[Route(path: '/store-api/example', name: 'store-api.example.search', methods: ['GET','POST'], defaults: ['_entity' => 'swag_example'])]
       public function load(Criteria $criteria, SalesChannelContext $context): ExampleRouteResponse
       { /* return new ExampleRouteResponse($this->exampleRepository->search($criteria, $context->getContext())); */ }
   }
   ```

   `_entity` marks the entity the API returns. Inject `swag_example.repository` via the service definition: `$services->set(ExampleRoute::class)->args([service('swag_example.repository')]);`.

3. `ExampleRouteResponse extends Shopware\Core\System\SalesChannel\StoreApiResponse`; the parent constructor takes the single `$object` (here an `EntitySearchResult`), and a `getExamples()` method returns `$this->object->getEntities()`.

4. `<plugin root>/src/Resources/config/routes.php` imports the route attributes — without this the service exists but is no endpoint:

   ```php
   return static function (RoutingConfigurator $routes): void {
       $routes->import('../../Core/**/*Route.php', 'attribute');
   };
   ```

5. Verify discovery: `./bin/console debug:router store-api.example.search` (shows routing only, not that the service builds or requests succeed).

6. OpenAPI: put a JSON file (e.g. `example.json` with `openapi`, `info`, `paths` → `/example` → `post` → `tags`/`summary`/`operationId`/`requestBody`/`responses`/`security`) in `<plugin root>/src/Resources/Schema/StoreApi/` (`AdminApi` for Admin API). Check it at `/store-api/_info/stoplightio.html`.

7. Storefront access: a controller `ExampleController extends StorefrontController` with `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]`, injecting `AbstractExampleRoute`, and a route `path: '/example', name: 'frontend.example.search'` with `defaults: ['XmlHttpRequest' => 'true', '_entity' => 'swag_example']` that returns `$this->route->load($criteria, $context)`. Register it with `->args([service(ExampleRoute::class)])->call('setContainer', [service('service_container')])` and add `$routes->import('../../Storefront/**/*Controller.php', 'attribute');` to `routes.php`.

8. From a Storefront JS plugin (extending `PluginBaseClass`), POST JSON to `/example`.

## Essential identifiers

- `Shopware\Core\Framework\Routing\StoreApiRouteScope::ID`, `Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`
- `Shopware\Core\System\SalesChannel\StoreApiResponse`
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\EntitySearchResult`
- `Symfony\Component\Routing\Attribute\Route`
- `Shopware\Storefront\Controller\StorefrontController`, `Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID`
- `store-api.example.search`, `frontend.example.search`, `debug:router`

## Gotchas

- `getDecorated()` in the base implementation must throw `DecorationPatternException` since nothing is decorated yet.
- A correctly registered service is not reachable until `routes.php` imports its route attributes.
- `XmlHttpRequest` in the Storefront route defaults is what allows calling the route via AJAX.

## Code check (6.7.15.1)
- confirmed `StoreApiRouteScope::ID` — value `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:78
- confirmed `StoreApiResponse::$object` — constructor-promoted `protected Struct $object` — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:22
- confirmed `DecorationPatternException` — constructor takes the class name — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:15
- confirmed `Resources/Schema/` — bundle schema folder, `AdminApi` or `StoreApi` — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/BundleSchemaPathCollection.php:34
- confirmed `/store-api/_info/stoplightio.html` — Store API Stoplight route — vendor/shopware/core/System/SalesChannel/SalesChannel/StoreApiInfoController.php:70
- confirmed `StorefrontController` — abstract base for Storefront controllers — vendor/shopware/storefront/Controller/StorefrontController.php:41
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- unverified `debug:router` — vendor/symfony, out of scope
