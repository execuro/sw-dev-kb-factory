---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-custom-sorting-product-listing.md
sourceHash: f5707c3a1d0892ea215affa775ae7fa11eeb4223
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/add-listing-filters.html
title: Add Custom Listing Filters
version: "6.7"
versions:
  - "6.7"
keywords: ["ProductListingCollectFilterEvent", "Filter", "FilterCollection", "EventSubscriberInterface", "EqualsFilter", "FilterAggregation", "MaxAggregation", "component_filter_panel_items", "component_filter_panel_item_price", "filter-panel.html.twig", "filter-boolean", "listing filter", "product listing facet", "storefront filter"]
summary: Register a custom product listing filter via ProductListingCollectFilterEvent and render it by extending the Storefront filter-panel.html.twig blocks.
lastBuilt: 2026-10-21
---
## What it is

How to add a custom filter to the Storefront product listing: register filter metadata (name, aggregations, DAL filter, values) in a subscriber on `\Shopware\Core\Content\Product\Events\ProductListingCollectFilterEvent`, then render a filter UI element by extending `filter-panel.html.twig`. Whether and how the filter is applied to the criteria is handled by the core.

## When to use

You need an extra facet in the category/search listing (e.g. a boolean "closeout" filter on `product.isCloseout`) beyond the built-in manufacturer, price, rating, properties and shipping-free filters.

## Key steps / config

1. Create a subscriber (e.g. `<plugin root>/src/Subscriber/ExampleListingSubscriber.php`) implementing `EventSubscriberInterface`, subscribing `ProductListingCollectFilterEvent::class => 'addFilter'`.
2. In the handler, read `$event->getFilters()` (a `FilterCollection`) and `$event->getRequest()`, build a `Shopware\Core\Content\Product\SalesChannel\Listing\Filter`, and `$filters->add($filter)`.
3. `Filter` constructor arguments, in order: `name` (unique string), `filtered` (bool, filter is active), `aggregations` (list of DAL aggregations), `filter` (DAL filter added to the criteria), `values` (added as `currentFilter` to the result), `exclude` (bool, default `true`).

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

4. Render it: extend `@Storefront/storefront/component/listing/filter-panel.html.twig` in `<plugin root>/src/Resources/views/storefront/component/listing/filter-panel.html.twig`:

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

5. Placement: `parent()` first appends after existing filters; `parent()` last prepends. To position relative to one filter, extend that filter's block instead, e.g. `component_filter_panel_item_price`.

Available filter components under `component/listing/filter/`: `filter-boolean`, `filter-multi-select`, `filter-property-select`, `filter-range`, `filter-rating-select` / `filter-rating-select-item`.

## Essential identifiers

- `\Shopware\Core\Content\Product\Events\ProductListingCollectFilterEvent` (`getFilters()`, `getRequest()`)
- `Shopware\Core\Content\Product\SalesChannel\Listing\Filter`, `FilterCollection::add()`
- `EqualsFilter`, `EqualsAnyFilter`, `EntityAggregation`, `FilterAggregation`, `MaxAggregation`
- Template `src/Storefront/Resources/views/storefront/component/listing/filter-panel.html.twig`; blocks `component_filter_panel_items`, `component_filter_panel_item_price`
- `filter-boolean.html.twig` parameters `name`, `displayName`

## Gotchas

- The request parameter read in the subscriber (`isCloseout`) must match the `name` passed to the filter template, as the template uses `name` for the input name.

## Version notes

- Block `component_filter_panel_items` is available from Shopware 6.4.8.0.

## Code check (6.7.15.1)
- confirmed `ProductListingCollectFilterEvent` — event class carrying request and FilterCollection — vendor/shopware/core/Content/Product/Events/ProductListingCollectFilterEvent.php:17
- confirmed `ProductListingCollectFilterEvent::getFilters()` — returns FilterCollection — vendor/shopware/core/Content/Product/Events/ProductListingCollectFilterEvent.php:31
- confirmed `ProductListingCollectFilterEvent::getRequest()` — returns Symfony Request — vendor/shopware/core/Content/Product/Events/ProductListingCollectFilterEvent.php:26
- confirmed `Filter` — listing Filter struct in SalesChannel\Listing namespace — vendor/shopware/core/Content/Product/SalesChannel/Listing/Filter.php:11
- confirmed `Filter::$exclude` — sixth constructor arg, defaults to true — vendor/shopware/core/Content/Product/SalesChannel/Listing/Filter.php:23
- confirmed `FilterCollection::add()` — adds a Filter to the collection — vendor/shopware/core/Content/Product/SalesChannel/Listing/FilterCollection.php:31
- confirmed `ProductListingCollectFilterEvent` — dispatched by AggregationListingProcessor — vendor/shopware/core/Content/Product/SalesChannel/Listing/Processor/AggregationListingProcessor.php:90
- confirmed `component_filter_panel_items` — block in filter-panel template — vendor/shopware/storefront/Resources/views/storefront/component/listing/filter-panel.html.twig:18
- confirmed `component_filter_panel_item_price` — price filter block — vendor/shopware/storefront/Resources/views/storefront/component/listing/filter-panel.html.twig:55
- confirmed `displayName` — filter-boolean template parameter alongside name — vendor/shopware/storefront/Resources/views/storefront/component/listing/filter/filter-boolean.html.twig:4
