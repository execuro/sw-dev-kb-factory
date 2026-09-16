---
docType: developer
id: platform/dev/6.6/guides/plugins/plugins/framework/store-api/override-existing-route.md
sourceHash: 70f46b3d68f6f16da6b18169e7fa8888b3db83e9
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/store-api/override-existing-route.html
title: Override existing route
version: "6.6"
versions:
  - "6.6"
keywords: ["override route", "decorate route", "ExampleRouteDecorator", "decorates", "decoration-priority", "AbstractExampleRoute", "inner service", "store api decoration"]
summary: "How to decorate an existing Store API route class to add extra data to its response via the decorator pattern."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/framework/store-api/add-store-api-route.md"]
---
## What it is
This guide explains how to override an existing Store API route to add additional data to its response, using Shopware's decoration pattern.

## When to use
When a plugin needs to modify or enrich the response of a Store API route defined elsewhere (its own or core), without replacing the original class.

## Key steps / config
1. Create a class extending the route's abstract base (e.g. `AbstractExampleRoute`), named e.g. `ExampleRouteDecorator`, with the `#[Route(defaults: ['_routeScope' => ['store-api']])]` attribute.
2. Its constructor accepts the original `AbstractExampleRoute` instance; `getDecorated()` must return that decorated instance.
3. In `load()`, call the decorated route first, then add custom data/headers before returning:
```php
#[Route(path: '/store-api/example', name: 'store-api.example.search', methods: ['GET', 'POST'], defaults: ['_entity' => 'category'])]
public function load(Criteria $criteria, SalesChannelContext $context): ExampleRouteResponse
{
    $exampleResponse = $this->decorated->load(); // must be called
    $exampleResponse->headers->add(['cache-control' => "max-age=10000"]);
    return $exampleResponse;
}
```
4. Register the decorator in `services.xml` with `decorates` pointing at the original route id and `public="true"`, with the second constructor argument referencing the `.inner` service:
```xml
<service id="Swag\BasicExample\...\ExampleRouteDecorator" decorates="Swag\BasicExample\...\ExampleRoute" public="true">
    <argument type="service" id="swag_example.repository"/>
    <argument type="service" id="Swag\BasicExample\...\ExampleRouteDecorator.inner"/>
</service>
```

## Essential identifiers
- `decorates`, `decoration-priority`, `<Service>.inner`
- `AbstractExampleRoute::getDecorated()`

## Gotchas
- The decorator's constructor must accept an `AbstractExampleRoute` instance, and `getDecorated()` must return it — omitting this breaks the decoration chain.
- The decorated route's original `load()` must be called before adding custom data, or the base behavior is lost.
