---
id: platform/dev/6.7/guides/plugins/plugins/framework/store-api/override-existing-route.md
title: Override Existing Route
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/override-existing-route.html
sourceHash: 40dc4c77d708cd69a7171feb2334bcd6cb7287cc
codeCheckedAgainst: "6.7.15.1"
keywords: ["store-api", "decorate route", "route decorator", "AbstractExampleRoute", "ExampleRouteDecorator", "getDecorated", "StoreApiRouteScope", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", ".inner", "decoration pattern", "override store api", "services.php"]
summary: Override a Store API route by decorating its Abstract route class, delegating to the inner route via getDecorated() and registering with decorate().
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md"]
---
## What it is

How to change the result of an existing Store API route (e.g. add data or headers) by decorating it: a new class extends the route's `Abstract...Route` base class, wraps the original route and calls it. The example decorates `ExampleRoute` from the [Add Store API route](platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md) guide; the plugin follows the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## When to use

You need to extend or alter the response of a Store API route (core or your own) without replacing the route class, so other plugins decorating the same route keep working.

## Key steps / config

1. Create a class extending the abstract route (here `AbstractExampleRoute`), named e.g. `ExampleRouteDecorator`. Core abstract routes declare exactly two abstract members: `getDecorated()` returning the abstract type, and the route method (for the example, `load`).
2. Accept the inner route (typed as the abstract class) in the constructor; `getDecorated()` returns it.
3. In `load()`, call the inner route with the same arguments, then modify the response. Store API responses extend Symfony's `Response`, so `->headers` is available.

```php
#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]
class ExampleRouteDecorator extends AbstractExampleRoute
{
    public function __construct(EntityRepository $exampleRepository, AbstractExampleRoute $exampleRoute) { /* ... */ }
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

4. Register it in `<plugin root>/src/Resources/config/services.php` as a decorator of the original route, passing the inner service:

```php
$services->set(ExampleRouteDecorator::class)
    ->decorate(ExampleRoute::class)
    ->public()
    ->args([service('swag_example.repository'), service('.inner')]);
```

## Essential identifiers

- `Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` (`_routeScope`)
- `Shopware\Core\Framework\Routing\StoreApiRouteScope::ID` (`store-api`)
- `getDecorated()`, `decorate()`, `service('.inner')`
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`
- Example names: `AbstractExampleRoute`, `ExampleRoute`, `ExampleRouteDecorator`, `ExampleRouteResponse`, `store-api.example.search`

## Gotchas

- The source snippet calls `$this->decorated->load()` without arguments and has a missing semicolon; the inner route must be called with the method's arguments (`$criteria`, `$context`), as above.
- The prose says to pass `ExampleRouteDecorator.inner`; the code sample uses `service('.inner')`.
- Core base routes (e.g. `CategoryRoute`) throw `DecorationPatternException` from `getDecorated()` — only decorators return an inner route, so always decorate the `Abstract...Route` type.

## Code check (6.7.15.1)
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — constant value `_routeScope` — vendor/shopware/core/PlatformRequest.php:78
- confirmed `StoreApiRouteScope::ID` — value `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `AbstractCategoryRoute::getDecorated()` — abstract routes require getDecorated() plus the route method — vendor/shopware/core/Content/Category/SalesChannel/AbstractCategoryRoute.php:16
- confirmed `CategoryRoute::getDecorated()` — base route throws DecorationPatternException — vendor/shopware/core/Content/Category/SalesChannel/CategoryRoute.php:52
- confirmed `StoreApiResponse` — extends Symfony Response, so headers can be modified — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:14
- unverified `AbstractExampleRoute` — example plugin class from the add-route guide, not in core
- unverified `.inner` — Symfony DI decoration feature, vendor/symfony out of scope
