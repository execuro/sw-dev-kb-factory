---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-nested-line-items.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
sourceHash: d0a8f505cb6936e217c06d4ea702bc78882cf3ff
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/use-nested-line-items.html
title: Use Nested Line Items
version: "6.7"
versions:
  - "6.7"
keywords: ["nested line items", "LineItem::setRemovable()", "removable", "isChangeable", "children-wrapper.html.twig", "remove.html.twig", "component_line_item_children_change_action", "formAction", "frontend.detail.page", "child line item", "cart", "custom products"]
summary: Make nested (child) cart line items removable or changeable in the Storefront via template overrides; the remove/change handling itself is plugin code.
lastBuilt: 2026-10-21
---
## What it is

Storefront template guidance for nested line items (children of a root line item, as used by the Custom Products plugin): how to expose a remove action and a change button. Shopware provides no default remove/change handling for nested items, because they can be implemented in many ways.

## When to use

Your plugin adds child line items to a cart line item and customers must be able to remove a child or jump back to edit the configuration from the cart/offcanvas.

## Key steps / config

### Removable

- The line item's `removable` property must be true — set it in your own controller/cart code or in the view via `{% do nestedLineItem.setRemovable(true) %}`.
- Remove buttons come from `@Storefront/storefront/component/line-item/element/remove.html.twig`, which posts to `formAction` (default `path('frontend.checkout.line-item.delete', { id: lineItem.id })`) with `redirectTo` / `redirectParameters` hidden fields. Point `formAction` at your own controller action that removes the nested item.
- In 6.7 the line-item type templates (`type/product.html.twig`, `type/container.html.twig`, `type/generic.html.twig`) include it only when `lineItem.removable and nestingLevel < 1`, so for nested items you must override the remove block (e.g. `component_line_item_type_product_col_remove`) to render it at deeper nesting levels.

### Changeable

- Children are rendered by `@Storefront/storefront/component/line-item/element/children-wrapper.html.twig`; its change button (block `component_line_item_children_change_action`, class `line-item-change-button`) only renders when `isChangeable` is true.
- Make `isChangeable` true for the root line item and wrap the button in a link to your edit target, e.g. a product SEO URL:

```twig
{% block component_line_item_children_change_action %}
    {% set seo = seoUrl('frontend.detail.page', {
        'productId': lineItem.children.first.referencedId
    }) %}
    <a href="{{ seo }}">{{ parent() }}</a>
{% endblock %}
```

The source's example also passes a Custom Products configuration id parameter from `lineItem.extensions.customizedProductConfiguration.id`.

## Essential identifiers

- `LineItem::setRemovable()`, `LineItem::isRemovable()`
- `remove.html.twig` variables `formAction`, `redirectTo`; route `frontend.checkout.line-item.delete`
- `children-wrapper.html.twig`, variable `isChangeable`, block `component_line_item_children_change_action`
- Route `frontend.detail.page`

## Gotchas

- The change and remove logic must be implemented by the plugin; there is no default handling for nested items.
- The source's block names `page_checkout_item_remove_icon` and `component_offcanvas_item_children_header_content_change_button` do not exist in 6.7 templates; use the `component/line-item/` blocks above.
- In 6.7, `component_line_item_children_change_action` sits inside `{% if isChangeable %}`, so setting `isChangeable` inside that block (as the source does in its block) is too late — it must already be true when `children-wrapper.html.twig` reaches that check.

## Code check (6.7.15.1)
- confirmed `LineItem::setRemovable()` — sets removable flag — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:431
- confirmed `LineItem::isRemovable()` — read as lineItem.removable — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:426
- corrected `removable` — docs: removable flag enough; templates also require nestingLevel < 1 — vendor/shopware/storefront/Resources/views/storefront/component/line-item/type/product.html.twig:156
- confirmed `formAction` — remove form target, defaults to frontend.checkout.line-item.delete — vendor/shopware/storefront/Resources/views/storefront/component/line-item/element/remove.html.twig:7
- confirmed `isChangeable` — gates the change button in children wrapper — vendor/shopware/storefront/Resources/views/storefront/component/line-item/element/children-wrapper.html.twig:18
- confirmed `component_line_item_children_change_action` — change button block — vendor/shopware/storefront/Resources/views/storefront/component/line-item/element/children-wrapper.html.twig:19
- confirmed `frontend.detail.page` — product page SEO route name — vendor/shopware/storefront/Framework/Seo/SeoUrlRoute/ProductPageSeoUrlRoute.php:22
- absent `page_checkout_item_remove_icon` — block not found in installed code
- absent `component_offcanvas_item_children_header_content_change_button` — block not found in installed code
