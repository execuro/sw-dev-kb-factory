---
id: platform/dev/6.6/guides/plugins/plugins/storefront/use-nested-line-items.md
title: Use nested line items
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/use-nested-line-items.html
sourceHash: 0972118e711864d439d9cf43c3df842e4b416c8a
keywords: ["nested line items", "setRemovable", "isChangeable", "cart", "removable line item", "changeable line item", "offcanvas cart", "seoUrl", "custom product configuration"]
summary: How to make nested cart line items removable or changeable by overriding Storefront cart Twig blocks.
lastBuilt: 2026-09-15
---

## What it is

Explains how to make nested line items in the Storefront cart removable and changeable, using the Custom Product plugin's handling as the example.

## When to use

When a plugin adds nested line items to the cart and needs to let the customer remove or change them.

## Key steps / config

Make a nested line item removable by calling `setRemovable(true)` and wrapping the remove control in a form with a custom action:

```twig
{% block page_checkout_item_remove_icon %}
    {% do nestedLineItem.setRemovable(true) %}
    <form action="{{ path('/mycontroller/nested/remove', { 'id': nestedLineItem.id }) }}" method="post">
        {{ parent() }}
    </form>
{% endblock %}
```

Make the root line item's change button link to an edit action by setting `isChangeable` and wrapping the button block content in an anchor built from `seoUrl(...)`:

```twig
{% block component_offcanvas_item_children_header_content_change_button %}
    {% set isChangeable = true %}
    {% set seo = seoUrl('frontend.detail.page', { 'productId': ..., 'swagCustomizedProductsConfigurationEdit': ... }) %}
    <a href="{{ seo }}" class="order-item-product-name" title="{{ label }}">
        {{ parent() }}
    </a>
{% endblock %}
```

## Essential identifiers

- `nestedLineItem.setRemovable(true)`
- `isChangeable` Twig variable
- Blocks: `page_checkout_item_remove_icon`, `component_offcanvas_item_children_header_content_change_button`
- `seoUrl('frontend.detail.page', {...})`

## Gotchas

- There is no default handling for nested line items since they can be implemented in various ways; remove/change handling must be implemented by the plugin itself.
