---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/framework/store-api/override-existing-route.md
sourceHash: 40dc4c77d708cd69a7171feb2334bcd6cb7287cc
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/override-existing-route.html
title: Override Existing Route
version: "6.7"
versions:
  - "6.7"
keywords: ["override store api route", "decorate route", "decorator pattern", "ExampleRouteDecorator", "AbstractExampleRoute", "getDecorated", "decorate", ".inner", "StoreApiRouteScope", "DecorationPatternException", "services.php", "extend store api response"]
summary: Override a Store API route by decorating its abstract route class - getDecorated() returns the inner route, service registered with decorate() and .inner.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to override (decorate) an existing Store API route to change or enrich its response, using the `AbstractExampleRoute` / `ExampleRoute` pair from [Add Store API Route](platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md). Core Store API routes follow the same pattern (e.g. `AbstractProductListingRoute` with `getDecorated()` and `load()`).

## When to use

You want to add data, headers, or custom logic to a Store API route you do not own, without replacing its controller. Built on the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## Key steps / config

1. Create a class extending the route's abstract class; accept the decorated route in the constructor and return it from `getDecorated()`; call the decorated `load()` with the same arguments inside your `load()`:
   ```php
   #[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]
   class ExampleRouteDecorator extends AbstractExampleRoute
   {
       public function __construct(EntityRepository $exampleRepository, private AbstractExampleRoute $decorated) { /* ... */ }

       public function getDecorated(): AbstractExampleRoute { return $this->decorated; }

       #[Route(path: '/store-api/example', name: 'store-api.example.search', methods: ['GET', 'POST'], defaults: ['_entity' => 'category'])]
       public function load(Criteria $criteria, SalesChannelContext $context): ExampleRouteResponse
       {
           $response = $this->decorated->load($criteria, $context);
           $response->headers->add(['cache-control' => 'max-age=10000']);
           return $response;
       }
   }
   ```
2. Register it in `<plugin root>/src/Resources/config/services.php`, after `ExampleRoute`, decorating it and passing the inner service as second argument:
   ```php
   $services->set(ExampleRouteDecorator::class)
       ->decorate(ExampleRoute::class)
       ->public()
       ->args([service('swag_example.repository'), service('.inner')]);
   ```

## Essential identifiers

- `ExampleRouteDecorator`, `AbstractExampleRoute`, `ExampleRoute`
- `getDecorated()`, `load()`
- `->decorate(...)`, `service('.inner')`
- `StoreApiRouteScope::ID`, `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`

## Gotchas

- The source snippet calls `$this->decorated->load()` without arguments and misses a semicolon; the abstract signature requires `load(Criteria $criteria, SalesChannelContext $context)`, so pass both through.
- Only the undecorated base route throws `DecorationPatternException` from `getDecorated()`; a decorator must return the inner instance.
- The prose mentions `ExampleRouteDecorator.inner` as the inner service id, while the PHP config uses the `.inner` shortcut; core XML service files use the `<decorator id>.inner` form.

## Code check (6.7.13.0)
- confirmed `AbstractProductListingRoute::getDecorated()` — core route abstract with the same decoration pattern — vendor/shopware/core/Content/Product/SalesChannel/Listing/AbstractProductListingRoute.php:16
- confirmed `AbstractProductListingRoute::load()` — abstract load on core route — vendor/shopware/core/Content/Product/SalesChannel/Listing/AbstractProductListingRoute.php:18
- confirmed `DecorationPatternException` — thrown by undecorated core route — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingRoute.php:49
- confirmed `StoreApiRouteScope::ID` — value `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:77
- confirmed `.inner` — core decorators reference `<id>.inner` services — vendor/shopware/core/Content/DependencyInjection/flow.xml:17
- unverified `->decorate()` — Symfony DI configurator API, vendor/symfony out of scope
