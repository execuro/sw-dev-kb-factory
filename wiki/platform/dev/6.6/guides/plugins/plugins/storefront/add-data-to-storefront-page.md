---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-data-to-storefront-page.md
title: Add data to storefront page
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-data-to-storefront-page.html
sourceHash: f20e6095f83f46358951e127ab6f66863e589d5e
keywords: ["FooterPagelet", "FooterPageletLoadedEvent", "page loaded event", "addExtension", "store-api route", "AbstractProductCountRoute", "StoreApiResponse", "kernel.event_subscriber", "pagelet extension", "CountAggregation"]
summary: How to subscribe to a page/pagelet loaded event, fetch data via a store-api route, and expose it to the Storefront template.
lastBuilt: 2026-09-15
---
## What it is

Shows how to add extra data (a count of active products) to a Storefront page/pagelet by subscribing to its `Loaded` event, fetching the data via a store-api route, and rendering it in the template.

## When to use

When a template needs data not currently present on the page/pagelet object.

## Key steps / config

1. Subscribe to the pagelet's loaded event, e.g. `FooterPageletLoadedEvent`:

```php
class AddDataToPage implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [FooterPageletLoadedEvent::class => 'addActiveProductCount'];
    }
}
```

Register with tag `kernel.event_subscriber` in `services.xml`.

2. Add a store-api route (`AbstractProductCountRoute` / `ProductCountRoute extends AbstractProductCountRoute`) using `Criteria`, `CountAggregation`, `EqualsFilter`, and a `ProductCountRouteResponse extends StoreApiResponse`. Route path: `/store-api/get-active-product-count`, name `store-api.product-count.get`.

3. In the subscriber, call the route and attach the result to the pagelet:

```php
$productCountResponse = $this->productCountRoute->load(new Criteria(), $event->getSalesChannelContext());
$event->getPagelet()->addExtension('product_count', $productCountResponse->getProductCount());
```

4. Read it in the template via `page.footer.extensions.product_count.count`, overriding block `layout_footer_navigation_columns` with `{% sw_extends '@Storefront/storefront/layout/footer/footer.html.twig' %}`.

## Essential identifiers

- `FooterPageletLoadedEvent`
- `AbstractProductCountRoute`
- `ProductCountRoute`
- `ProductCountRouteResponse`
- `store-api.product-count.get`
- `addExtension()`

## Gotchas

Because subscribers run inside a Pagelet event, do not call the DAL directly — use (or create) a store-api route instead; use `aggregate()` rather than `search()` when only aggregated data is needed, to avoid fetching the whole product dataset.
