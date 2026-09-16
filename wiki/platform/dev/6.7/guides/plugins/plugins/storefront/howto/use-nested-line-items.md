---
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-nested-line-items.md
title: Use Nested Line Items
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/use-nested-line-items.html
sourceHash: d0a8f505cb6936e217c06d4ea702bc78882cf3ff
codeCheckedAgainst: "6.7.13.0"
keywords: ["nested line items", "line item children", "cart", "remove nested item", "change button", "removable", "setRemovable", "isChangeable", "nestingLevel", "children-wrapper.html.twig", "remove.html.twig", "seoUrl", "frontend.detail.page"]
summary: Make nested (child) cart line items removable or changeable in Storefront templates; Shopware provides no default change/remove handling for them.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

Template-level guidance for nested line items (line items with `children`, as used by the Custom Products plugin): how to expose a remove action on a nested item and a change link on its root item in the cart.

## When to use

Your plugin creates container line items with child line items and customers must be able to remove a child or edit the configuration from the cart or offcanvas cart.

## Key steps / config

### Make a nested line item removable

The `removable` property must be set, either in a view (`{% do lineItem.setRemovable(true) %}`) or in your own controller action, and the form needs its own action path. In the installed Storefront the remove button comes from `@Storefront/storefront/component/line-item/element/remove.html.twig`, whose form posts to `formAction` (default `path('frontend.checkout.line-item.delete', { id: lineItem.id })`). Pass your own `formAction` when including it:

```twig
{% sw_include '@Storefront/storefront/component/line-item/element/remove.html.twig' with {
    formAction: path('<your.route>', { id: lineItem.id })
} %}
```

The line item type templates (e.g. `component/line-item/type/product.html.twig`, block `component_line_item_type_product_col_remove`) only include it when `lineItem.removable and nestingLevel < 1`, so for a child item you must override that block (or the matching `_col_remove` block of the `container`/`generic` type) in your plugin.

### Make a nested line item changeable

The change button belongs to the root line item. `component/line-item/element/children-wrapper.html.twig` renders block `component_line_item_children_change_action` only `{% if isChangeable %}`. Set `isChangeable` to `true` before the wrapper is included and wrap the button in a link to your edit action, e.g.:

```twig
{% block component_line_item_children_change_action %}
    {% set seo = seoUrl('frontend.detail.page', {
        'productId': lineItem.children.first.referencedId,
        'swagCustomizedProductsConfigurationEdit': lineItem.extensions.customizedProductConfiguration.id
    }) %}
    <a href="{{ seo }}" class="order-item-product-name" title="{{ label }}">{{ parent() }}</a>
{% endblock %}
```

## Essential identifiers

- `LineItem::setRemovable()` / `removable`
- `@Storefront/storefront/component/line-item/element/remove.html.twig` (variable `formAction`)
- `@Storefront/storefront/component/line-item/element/children-wrapper.html.twig` (variable `isChangeable`, block `component_line_item_children_change_action`)
- Twig function `seoUrl`, route `frontend.detail.page`

## Gotchas

- There is no default handling for changing or removing nested line items; you must implement the controller action yourself.
- The source uses blocks `page_checkout_item_remove_icon` and `component_offcanvas_item_children_header_content_change_button`; neither exists in the installed Storefront — use the `component/line-item/` blocks above.
- `swagCustomizedProductsConfigurationEdit` and the `customizedProductConfiguration` extension belong to the Custom Products plugin, not core.

## Code check (6.7.13.0)
- absent `page_checkout_item_remove_icon` — block not found in installed code
- absent `component_offcanvas_item_children_header_content_change_button` — block not found in installed code
- confirmed `LineItem::setRemovable()` — setter exists — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:436
- confirmed `LineItem::getReferencedId()` — getter exists — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:148
- confirmed `formAction` — remove form action, defaults to line-item delete route — vendor/shopware/storefront/Resources/views/storefront/component/line-item/element/remove.html.twig:7
- confirmed `nestingLevel` — remove button only rendered when nestingLevel < 1 — vendor/shopware/storefront/Resources/views/storefront/component/line-item/type/product.html.twig:150
- confirmed `isChangeable` — gates the change button — vendor/shopware/storefront/Resources/views/storefront/component/line-item/element/children-wrapper.html.twig:18
- confirmed `component_line_item_children_change_action` — change button block — vendor/shopware/storefront/Resources/views/storefront/component/line-item/element/children-wrapper.html.twig:19
- confirmed `seoUrl` — Twig function registered — vendor/shopware/core/Framework/Adapter/Twig/Extension/SeoUrlFunctionExtension.php:29
- confirmed `frontend.detail.page` — product detail route — vendor/shopware/storefront/Controller/ProductController.php:57
