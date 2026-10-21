---
id: platform/dev/6.7/resources/references/adr/2022-03-17-new-nested-line-items.md
title: New templates for line items and nested line items
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-17-new-nested-line-items.html
sourceHash: cb4a64e193e1eb69579d7eccabcff413ac126faa
codeCheckedAgainst: "6.7.15.1"
keywords: ["line-item.html.twig", "component/line-item", "checkout-item.html.twig", "offcanvas-item.html.twig", "displayMode", "component_line_item_type_include", "nested line items", "line item template", "cart item", "storefront twig", "children-wrapper.html.twig", "adr"]
summary: "ADR: Storefront line items render via one recursive base template component/line-item/line-item.html.twig plus per-type templates."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-03-17, area: storefront) that replaces more than ten separate line item templates (cart, confirm, finish, offcanvas, account order, order history, checkout aside, plus their `-children` variants) with a single base template, `Resources/views/storefront/component/line-item/line-item.html.twig`, used for every line item in every shop area.

## When to use

- You customise how line items (products, discounts, containers, custom app/extension types) appear in cart, offcanvas, checkout confirm/finish or the account order pages.
- You migrate a theme or plugin that extended one of the old item templates.

## Key steps / config

Problems the ADR addresses: templates copied chunks from each other or extended each other inconsistently; templates were named `checkout-item` while their markup and CSS used `cart-item`; nested line items needed extra templates and were shown only as text bullet points; large files with many if/else branches per type.

Decision, as implemented in 6.7.15.1:

1. One base template `@Storefront/storefront/component/line-item/line-item.html.twig`. In its `component_line_item_type_include` block it dispatches by `lineItem.type` to `type/product.html.twig`, `type/discount.html.twig`, `type/container.html.twig`, or `type/generic.html.twig` (any other type).
2. Naming is `line-item` everywhere, because a line item is not always inside a cart.
3. Nested line items: `element/children-wrapper.html.twig` loops over `lineItem.children` and includes `line-item.html.twig` again for each child, so nesting is recursive with no separate children templates.
4. Appearance per area is switched by variables passed on include, for example the offcanvas cart:

```twig
{% sw_include '@Storefront/storefront/component/line-item/line-item.html.twig' with {
    displayMode: 'offcanvas',
    redirectTo: 'frontend.cart.offcanvas'
} %}
```

5. Reusable parts (image, label, quantity, remove, unit/total/tax price, delivery date, downloads, variant characteristics) live under `component/line-item/element/`.

To customise rendering, extend the base template or the matching `type/` or `element/` template instead of the removed page-level item templates.

## Essential identifiers

- `Resources/views/storefront/component/line-item/line-item.html.twig`
- `component/line-item/type/{product,discount,container,generic}.html.twig`
- `component/line-item/element/children-wrapper.html.twig`
- Twig blocks `component_line_item`, `component_line_item_type_include`
- Include variable `displayMode` (e.g. `'offcanvas'`)

## Gotchas

- Offcanvas line items now look the same as the mobile layout of line items in the regular cart.
- Extensions that extended any of these templates must switch to the base template: `page/checkout/checkout-item.html.twig`, `page/checkout/checkout-item-children.html.twig`, `page/checkout/confirm/confirm-item.html.twig`, `page/checkout/finish/finish-item.html.twig`, `component/checkout/offcanvas-item.html.twig`, `component/checkout/offcanvas-item-children.html.twig`, `page/account/order/line-item.html.twig`, `page/account/order-history/order-detail-list-item.html.twig`, `page/account/order-history/order-detail-list-item-children.html.twig`, `page/checkout/checkout-aside-item.html.twig`, `page/checkout/checkout-aside-item-children.html.twig` (all under `Resources/views/storefront/`). None of them exists in 6.7.15.1.

## Code check (6.7.15.1)
- confirmed `line-item.html.twig` — base template dispatching to per-type templates — vendor/shopware/storefront/Resources/views/storefront/component/line-item/line-item.html.twig:10
- confirmed `type/generic.html.twig` — fallback for unknown line item types — vendor/shopware/storefront/Resources/views/storefront/component/line-item/line-item.html.twig:18
- confirmed `lineItem.children` — children wrapper re-includes the base template recursively — vendor/shopware/storefront/Resources/views/storefront/component/line-item/element/children-wrapper.html.twig:56
- confirmed `displayMode` — offcanvas cart passes `'offcanvas'` to the base template — vendor/shopware/storefront/Resources/views/storefront/component/checkout/offcanvas-cart.html.twig:62
- confirmed `sw_include` — account order page uses the base template — vendor/shopware/storefront/Resources/views/storefront/page/account/order/index.html.twig:96
- confirmed `sw_include` — order history detail list uses the base template — vendor/shopware/storefront/Resources/views/storefront/page/account/order-history/order-detail-list.html.twig:6
- absent `checkout-item.html.twig` — old template no longer shipped
- absent `offcanvas-item.html.twig` — old template no longer shipped
- absent `order-detail-list-item.html.twig` — old template no longer shipped
