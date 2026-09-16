---
id: platform/dev/6.7/resources/references/adr/2022-03-17-new-nested-line-items.md
title: New templates for line items and nested line items
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-17-new-nested-line-items.html
sourceHash: cb4a64e193e1eb69579d7eccabcff413ac126faa
codeCheckedAgainst: "6.7.13.0"
keywords: ["line-item.html.twig", "line item template", "nested line items", "component_line_item", "displayMode", "offcanvas", "cart item", "checkout-item", "container line item", "discount line item", "storefront twig", "adr"]
summary: "ADR: storefront line items render via component/line-item/line-item.html.twig with per-type templates; legacy item templates removed."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2022-03-17, area storefront): the more than ten Storefront templates that rendered line items in different shop areas were replaced by one base template, `Resources/views/storefront/component/line-item/line-item.html.twig`, with a dedicated template per known line item type and recursive rendering of nested line items.

## When to use

When extending or overriding how line items (products, discounts, containers, custom types from apps/extensions) appear in the cart, offcanvas cart, checkout confirm/finish pages or account order views.

## Key steps / config

Problems addressed: copied chunks between independent templates, templates extending each other, inconsistent naming (`checkout-item` templates with `cart-item` markup), extra templates for children, nested items shown only as bullet text, and large if/else templates.

Decision, as installed:
- One base template for all areas, `Resources/views/storefront/component/line-item/line-item.html.twig` (block `component_line_item`). Naming is `line-item` because a line item is not always inside a cart.
- It picks a type template in block `component_line_item_type_include`, comparing `lineItem.type` with `LineItem` constants: `type/product.html.twig`, `type/discount.html.twig`, `type/container.html.twig`, else `type/generic.html.twig`.
- Shared parts live in `component/line-item/element/` (e.g. `image`, `label`, `quantity`, `remove`, `unit-price`, `total-price`, `children-wrapper`).
- Appearance is toggled with include variables, e.g. `displayMode: 'offcanvas'` or `displayMode: 'order'`, plus `showSubtotal`/`showTaxPrice` in the cart.
- Nested line items need no extra template: `element/children-wrapper.html.twig` includes the base template again for each child.

```twig
{% sw_include '@Storefront/storefront/component/line-item/line-item.html.twig' with {
    lineItem: nestedLineItem,
    displayMode: 'offcanvas'
} %}
```

## Essential identifiers

- `@Storefront/storefront/component/line-item/line-item.html.twig`
- blocks `component_line_item`, `component_line_item_type_include`
- `component/line-item/type/{product,discount,container,generic}.html.twig`
- `component/line-item/element/children-wrapper.html.twig`
- `displayMode`

## Gotchas

- Offcanvas line items are unified with the mobile appearance of line items in the regular cart.
- Extensions that extended one of the old item templates must extend the base template `line-item.html.twig` (or its type/element templates) instead.

## Version notes

Templates replaced by the base template (none exist in the installed Storefront): `page/checkout/checkout-item.html.twig`, `page/checkout/checkout-item-children.html.twig`, `page/checkout/confirm/confirm-item.html.twig`, `page/checkout/finish/finish-item.html.twig`, `component/checkout/offcanvas-item.html.twig`, `component/checkout/offcanvas-item-children.html.twig`, `page/account/order/line-item.html.twig`, `page/account/order-history/order-detail-list-item.html.twig`, `page/account/order-history/order-detail-list-item-children.html.twig`, `page/checkout/checkout-aside-item.html.twig`, `page/checkout/checkout-aside-item-children.html.twig` (all under `Resources/views/storefront/`).

## Code check (6.7.13.0)
- confirmed `component_line_item` — root block of the base template — vendor/shopware/storefront/Resources/views/storefront/component/line-item/line-item.html.twig:1
- confirmed `component_line_item_type_include` — selects product/discount/container/generic type template — vendor/shopware/storefront/Resources/views/storefront/component/line-item/line-item.html.twig:10
- confirmed `type/generic.html.twig` — fallback for custom line item types — vendor/shopware/storefront/Resources/views/storefront/component/line-item/line-item.html.twig:18
- confirmed `lineItem.children` — children wrapper includes the base template recursively — vendor/shopware/storefront/Resources/views/storefront/component/line-item/element/children-wrapper.html.twig:54
- confirmed `displayMode` — offcanvas mode passed on checkout address page — vendor/shopware/storefront/Resources/views/storefront/page/checkout/address/index.html.twig:63
- confirmed `displayMode` — order mode on account order history — vendor/shopware/storefront/Resources/views/storefront/page/account/order-history/order-detail-list.html.twig:7
- confirmed `line-item.html.twig` — used by cart page with showSubtotal/showTaxPrice — vendor/shopware/storefront/Resources/views/storefront/page/checkout/cart/index.html.twig:64
