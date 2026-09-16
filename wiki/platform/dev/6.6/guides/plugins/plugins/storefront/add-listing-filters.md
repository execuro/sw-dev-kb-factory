---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-listing-filters.md
title: Add custom listing filters
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-listing-filters.html
sourceHash: 43a95bacee78c36e4e7369709172151cd1548e5e
keywords: ["ProductListingCollectFilterEvent", "Filter class", "custom filter", "filter-boolean", "filter-multi-select", "filter-property-select", "filter-range", "filter-rating-select", "component_filter_panel_items", "component_filter_panel_item_price", "EntityAggregation", "FilterAggregation"]
summary: How to register a custom Storefront listing filter via ProductListingCollectFilterEvent and integrate its UI component.
lastBuilt: 2026-09-15
---
## What it is

Explains how to add a custom product listing filter in Shopware's Storefront, both the backend filter definition and the Storefront UI component that renders it.

## When to use

When a plugin needs to expose an additional filter option (e.g. filtering by `isCloseout`) in a product listing.

## Key steps / config

Subscribe to `\Shopware\Core\Content\Product\Events\ProductListingCollectFilterEvent`:

```php
public static function getSubscribedEvents(): array
{
    return [ProductListingCollectFilterEvent::class => 'addFilter'];
}
```

Build a `Filter` with parameters `name`, `filtered`, `aggregations`, `filter`, `values`, `exclude`, then `$event->getFilters()->add($filter)`.

Add the UI in `src/Storefront/Resources/views/storefront/component/listing/filter-panel.html.twig`, extending block `component_filter_panel_items` (available since Shopware 6.4.8.0):

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

To position a filter relative to a specific existing one, extend that filter's own block instead, e.g. `component_filter_panel_item_price`.

## Essential identifiers

- `ProductListingCollectFilterEvent`
- `Filter` class
- `component_filter_panel_items`
- `component_filter_panel_item_price`
- `filter-boolean`, `filter-multi-select`, `filter-property-select`, `filter-range`, `filter-rating-select`

## Gotchas

`component_filter_panel_items` is only available from Shopware version 6.4.8.0. Extending it as shown appends the new filter after existing ones; moving `parent()` to the end of the block places it first instead.
