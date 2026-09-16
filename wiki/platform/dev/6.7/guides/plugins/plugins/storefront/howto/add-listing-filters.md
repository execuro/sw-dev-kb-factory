---
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md
title: Add Custom Listing Filters
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/add-listing-filters.html
sourceHash: f5707c3a1d0892ea215affa775ae7fa11eeb4223
codeCheckedAgainst: "6.7.13.0"
keywords: ["listing filter", "custom filter", "product filter", "ProductListingCollectFilterEvent", "Filter", "FilterCollection", "EqualsFilter", "FilterAggregation", "MaxAggregation", "EntityAggregation", "filter-panel.html.twig", "component_filter_panel_items", "filter-boolean", "isCloseout"]
summary: Register a Storefront product listing filter via ProductListingCollectFilterEvent and a Filter struct, then render it by extending filter-panel.html.twig.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-custom-sorting-product-listing.md"]
---
## What it is

How to add a custom product listing filter in the Storefront: define the filter metadata in a subscriber to `ProductListingCollectFilterEvent` (the core decides whether and how it is applied), then show it in the filter panel by extending a Twig block.

## When to use

A plugin needs an extra facet in category/search listings, e.g. a boolean filter on `product.isCloseout`.

## Key steps / config

1. Create a subscriber `<plugin root>/src/Subscriber/ExampleListingSubscriber.php` that subscribes to `\Shopware\Core\Content\Product\Events\ProductListingCollectFilterEvent` (`ProductListingCollectFilterEvent::class => 'addFilter'`).
2. In the listener, get `$event->getFilters()` (a `FilterCollection`) and `$event->getRequest()`, build a `Shopware\Core\Content\Product\SalesChannel\Listing\Filter` and `$filters->add($filter)`.

`Filter` constructor arguments, in order: `name` (unique string), `filtered` (bool, `true` when active), `aggregations` (list of DAL aggregations), `filter` (DAL filter added to the criteria), `values` (added as `currentFilter` to the result), `exclude` (bool, defaults to `true`).

```php
$filtered = (bool) $request->get('isCloseout');
$filters->add(new Filter(
    'isCloseout',
    $filtered,
    [new FilterAggregation('active-filter',
        new MaxAggregation('active', 'product.isCloseout'),
        [new EqualsFilter('product.isCloseout', true)])],
    new EqualsFilter('product.isCloseout', true),
    $filtered
));
```

A multi-value example: `new Filter('manufacturer', !empty($ids), [new EntityAggregation('manufacturer', 'product.manufacturerId', 'product_manufacturer')], new EqualsAnyFilter('product.manufacturerId', $ids), $ids)`.

3. Render it: in the plugin create `src/Resources/views/storefront/component/listing/filter-panel.html.twig` and extend block `component_filter_panel_items`:

```twig
{% sw_extends '@Storefront/storefront/component/listing/filter-panel.html.twig' %}
{% block component_filter_panel_items %}
    {{ parent() }}
    {% sw_include '@Storefront/storefront/component/listing/filter/filter-boolean.html.twig' with {
        name: 'isCloseout',
        displayName: 'Closeout'
    } %}
{% endblock %}
```

Filter components under `component/listing/filter/`: `filter-boolean`, `filter-multi-select`, `filter-property-select`, `filter-range`, `filter-rating-select` and `filter-rating-select-item`.

## Essential identifiers

- `Shopware\Core\Content\Product\Events\ProductListingCollectFilterEvent`
- `Shopware\Core\Content\Product\SalesChannel\Listing\Filter`
- `FilterAggregation`, `MaxAggregation`, `EntityAggregation`, `EqualsFilter`, `EqualsAnyFilter`
- `@Storefront/storefront/component/listing/filter-panel.html.twig`
- Blocks `component_filter_panel_items`, `component_filter_panel_item_price`

## Gotchas

- `{{ parent() }}` first places the new filter after the existing ones; move it to the end of the block to place the filter first.
- To position relative to a specific filter, extend that filter's block instead, e.g. `component_filter_panel_item_price` to place it after the price filter.
- The `name` passed to the Twig component should match the filter name and request parameter read in the subscriber (`isCloseout`).

## Version notes

- Block `component_filter_panel_items` is available from Shopware 6.4.8.0.

## Code check (6.7.13.0)
- confirmed `ProductListingCollectFilterEvent` — event class exists — vendor/shopware/core/Content/Product/Events/ProductListingCollectFilterEvent.php:14
- confirmed `ProductListingCollectFilterEvent::getFilters()` — returns FilterCollection — vendor/shopware/core/Content/Product/Events/ProductListingCollectFilterEvent.php:28
- confirmed `ProductListingCollectFilterEvent::getRequest()` — returns Request — vendor/shopware/core/Content/Product/Events/ProductListingCollectFilterEvent.php:23
- confirmed `Filter` — namespace Shopware\Core\Content\Product\SalesChannel\Listing — vendor/shopware/core/Content/Product/SalesChannel/Listing/Filter.php:11
- confirmed `Filter::__construct()` — name, filtered, aggregations, filter, values, exclude = true — vendor/shopware/core/Content/Product/SalesChannel/Listing/Filter.php:17
- confirmed `component_filter_panel_items` — block in filter panel — vendor/shopware/storefront/Resources/views/storefront/component/listing/filter-panel.html.twig:18
- confirmed `component_filter_panel_item_price` — block in filter panel — vendor/shopware/storefront/Resources/views/storefront/component/listing/filter-panel.html.twig:55
- confirmed `displayName` — variable consumed by filter-boolean component — vendor/shopware/storefront/Resources/views/storefront/component/listing/filter/filter-boolean.html.twig:4
- unverified `$request->get()` — Symfony Request API, vendor/symfony out of scope
