---
id: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md
title: Add Data to Storefront Page
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.html
sourceHash: c9db46ce88b57c89303c452d3ec28784c3001a35
codeCheckedAgainst: "6.7.15.1"
keywords: ["FooterPageletLoadedEvent", "FooterPagelet", "addExtension", "kernel.event_subscriber", "StoreApiResponse", "CountAggregation", "CountResult", "layout_footer_navigation_columns", "pagelet loaded event", "page extension", "storefront page data", "store-api route", "footer template"]
summary: Add custom data to a Storefront page/pagelet by subscribing to its Loaded event, fetching via a store-api route and calling addExtension()
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md", "platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md"]
---
## What it is

Pages and pagelets are the objects handed to Storefront templates. To show data they do not carry, subscribe to the page's or pagelet's `Loaded` event, load the data, and attach it to the page object as an extension. The guide's example adds the count of active products to the footer pagelet.

## When to use

You are changing a Storefront template and need data that is not yet available on the page/pagelet object (prerequisites: [plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md), [event subscribers](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md), [template customization](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md), [reading data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md)).

## Key steps / config

1. Pick the page/pagelet to extend. Every page/pagelet fires a `...LoadedEvent`; for the footer it is `Shopware\Storefront\Pagelet\Footer\FooterPageletLoadedEvent` (its `getPagelet()` returns `FooterPagelet`).
2. Create an `EventSubscriberInterface` subscriber mapping `FooterPageletLoadedEvent::class` to a handler method, and register it with the `kernel.event_subscriber` tag.
3. Do not call the DAL directly inside a pagelet event — use a store-api route. `ProductListRoute` exists but returns far more than a count, so the guide builds its own route (see [adding store-api routes](platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md)), all in the plugin namespace `Swag\BasicExample\Core\Content\Example\SalesChannel`:
   - an abstract route class with `getDecorated()` and `load(Criteria $criteria, SalesChannelContext $context)`, scoped `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]`;
   - a concrete route whose `getDecorated()` throws `DecorationPatternException`, with `#[Route(path: '/store-api/get-active-product-count', name: 'store-api.product-count.get', methods: ['GET', 'POST'], defaults: ['_entity' => 'product'])]`; `load()` adds `EqualsFilter('product.active', true)` and `CountAggregation('productCount', 'product.id')`, then calls `aggregate()` (not `search()`) on `product.repository` and reads `->get('productCount')` (a `CountResult`);
   - a response class extending `Shopware\Core\System\SalesChannel\StoreApiResponse` that wraps the `CountResult` and exposes it through a getter returning `$this->object`.
4. Register the route with `->public()->args([service('product.repository')])`, import route attributes in `src/Resources/config/routes.php` via `$routes->import('../../Core/**/*Route.php', 'attribute')`, and inject the route into the subscriber.
5. In the handler, call the route's `load(new Criteria(), $event->getSalesChannelContext())` and attach the result: `$event->getPagelet()->addExtension('product_count', <CountResult>)`.
6. Override the footer template and read the extension:

```twig
{% sw_extends '@Storefront/storefront/layout/footer/footer.html.twig' %}
{% block layout_footer_navigation_columns %}
    {{ parent() }}
    {% if footer.extensions.product_count %}
        ... {{ footer.extensions.product_count.count }} ...
    {% endif %}
{% endblock %}
```

## Essential identifiers

- `Shopware\Storefront\Pagelet\Footer\FooterPageletLoadedEvent`, `FooterPagelet`
- `addExtension('product_count', ...)`, template path `footer.extensions.product_count.count`
- `Shopware\Core\System\SalesChannel\StoreApiResponse`, `CountAggregation`, `CountResult::getCount()`
- `DecorationPatternException`, `StoreApiRouteScope::ID`, `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`
- twig block `layout_footer_navigation_columns`, `kernel.event_subscriber`

## Gotchas

- The guide's final subscriber imports `Shopware\Core\Content\Product\SalesChannel\ProductCountRoute`; no such core class exists. `ProductCountRoute`, `AbstractProductCountRoute` and `ProductCountRouteResponse` are the plugin's own classes in `Swag\BasicExample\Core\Content\Example\SalesChannel` — import them from there.
- `getProductCount()` is a method the plugin's response class defines itself, not a core API.
- The prose shows `addExtension('product_count', $productCountResult)`, while the code passes the response getter's result; either way the extension value must be the `CountResult` so `.count` resolves in Twig.

## Code check (6.7.15.1)
- absent `Shopware\Core\Content\Product\SalesChannel\ProductCountRoute` — no core class; it is plugin code in the guide's own namespace
- absent `getProductCount` — not in core; defined by the plugin's response class
- confirmed `FooterPageletLoadedEvent` — extends `PageletLoadedEvent` — vendor/shopware/storefront/Pagelet/Footer/FooterPageletLoadedEvent.php:14
- confirmed `FooterPageletLoadedEvent::getPagelet()` — returns `FooterPagelet` — vendor/shopware/storefront/Pagelet/Footer/FooterPageletLoadedEvent.php:24
- confirmed `StoreApiResponse` — constructor takes `protected Struct $object` — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:14
- confirmed `CountResult::getCount()` — backs the `.count` access in Twig — vendor/shopware/core/Framework/DataAbstractionLayer/Search/AggregationResult/Metric/CountResult.php:21
- confirmed `CountAggregation` — metric aggregation class — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Metric/CountAggregation.php:12
- confirmed `DecorationPatternException` — thrown from base-class `getDecorated()` — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:13
- confirmed `StoreApiRouteScope::ID` — value `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `layout_footer_navigation_columns` — block exists in footer template — vendor/shopware/storefront/Resources/views/storefront/layout/footer/footer.html.twig:156
