---
id: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md
title: Add Data to Storefront Page
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.html
sourceHash: c9db46ce88b57c89303c452d3ec28784c3001a35
codeCheckedAgainst: "6.7.13.0"
keywords: ["FooterPageletLoadedEvent", "addExtension", "page loaded event", "pagelet extension", "StoreApiResponse", "CountAggregation", "CountResult", "AbstractProductCountRoute", "store-api route", "layout_footer_navigation_columns", "kernel.event_subscriber", "add data to template"]
summary: "Add extra data to a Storefront page/pagelet: subscribe to its Loaded event, fetch via a store-api route, addExtension() it and read it in Twig."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md"]
---
## What it is

The workflow to make additional data available to a Storefront template: listen to the page's or pagelet's `Loaded` event, fetch the data via a store-api route (not the DAL directly), attach it as an extension, and render it in Twig. The example adds the count of active products to the footer pagelet.

## When to use

A template change needs data the page/pagelet struct does not carry. Prerequisites: [listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md), [customizing templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md), [adding a store-api route](platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md).

## Key steps / config

1. Pick the page/pagelet (here `FooterPagelet`) and subscribe to `Shopware\Storefront\Pagelet\Footer\FooterPageletLoadedEvent` in an `EventSubscriberInterface` (`FooterPageletLoadedEvent::class => 'addActiveProductCount'`). Tag the subscriber `kernel.event_subscriber`.
2. In a pagelet event, use a store-api route rather than the DAL. `ProductListRoute` would return far more than needed, so the plugin defines its own:
   - `abstract class AbstractProductCountRoute` with `getDecorated()` and `load(Criteria $criteria, SalesChannelContext $context)`, annotated `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]`.
   - A concrete route class in `Swag\BasicExample\Core\Content\Example\SalesChannel`: `getDecorated()` throws `DecorationPatternException`; `load()` is routed with `path: '/store-api/get-active-product-count'`, `name: 'store-api.product-count.get'`, `methods: ['GET', 'POST']`, `defaults: ['_entity' => 'product']`. It adds `new EqualsFilter('product.active', true)` and `new CountAggregation('productCount', 'product.id')`, then calls `$this->productRepository->aggregate($criteria, $context->getContext())->get('productCount')` — aggregate, not search.
   - `ProductCountRouteResponse extends StoreApiResponse`, constructed with the `CountResult`; the inherited `getObject()` returns it.
   - Services: the route gets `service('product.repository')` and is `->public()`; the subscriber gets the route injected. `routes.php` imports `'../../Core/**/*Route.php', 'attribute'`.
3. In the listener:

```php
$response = $this->productCountRoute->load(new Criteria(), $event->getSalesChannelContext());
$event->getPagelet()->addExtension('product_count', $response->getObject());
```

4. Template `Resources/views/storefront/layout/footer/footer.html.twig`:

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

- `FooterPageletLoadedEvent`, `getPagelet()`, `addExtension()`
- `Shopware\Core\System\SalesChannel\StoreApiResponse`, `getObject()`
- `CountAggregation`, `CountResult` (`getCount()` is `.count` in Twig)
- `DecorationPatternException`, `store-api.product-count.get`
- block `layout_footer_navigation_columns`

## Gotchas

- The source's subscriber imports `Shopware\Core\Content\Product\SalesChannel\ProductCountRoute` — no such core class; import the plugin's own route class from `Swag\BasicExample\Core\Content\Example\SalesChannel`.
- The source's response defines `getProductCount()`; that is plugin code, not a core method — `StoreApiResponse::getObject()` returns the same struct.

## Code check (6.7.13.0)
- absent `Shopware\Core\Content\Product\SalesChannel\ProductCountRoute` — no core class of that name; it is the plugin's own class
- absent `getProductCount` — no such method in core; plugin-defined getter only
- confirmed `FooterPageletLoadedEvent::getPagelet()` — returns FooterPagelet — vendor/shopware/storefront/Pagelet/Footer/FooterPageletLoadedEvent.php:21
- confirmed `ExtendableTrait::addExtension()` — requires a Struct extension — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:21
- confirmed `StoreApiResponse::getObject()` — returns the wrapped Struct — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:30
- confirmed `ProductListRoute` — existing store-api product list route — vendor/shopware/core/Content/Product/SalesChannel/ProductListRoute.php:19
- confirmed `CountResult::getCount()` — int count — vendor/shopware/core/Framework/DataAbstractionLayer/Search/AggregationResult/Metric/CountResult.php:21
- confirmed `DecorationPatternException` — thrown by base-class getDecorated() — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:13
- confirmed `StoreApiRouteScope::ID` — value 'store-api' — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `layout_footer_navigation_columns` — block in core footer template — vendor/shopware/storefront/Resources/views/storefront/layout/footer/footer.html.twig:124
