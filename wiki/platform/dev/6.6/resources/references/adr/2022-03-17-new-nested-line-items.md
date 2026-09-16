---
id: "platform/dev/6.6/resources/references/adr/2022-03-17-new-nested-line-items.md"
title: "New templates for line items and nested line items"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-17-new-nested-line-items.html"
sourceHash: "cb4a64e193e1eb69579d7eccabcff413ac126faa"
keywords: ["line-item.html.twig", "checkout-item", "cart-item", "nested line items", "offcanvas-item", "line item template", "checkout-item-children", "confirm-item", "order-detail-list-item", "storefront component", "line item refactor"]
summary: "ADR: storefront line item templates are unified into one recursive base template, line-item.html.twig, replacing over ten separate templates."
lastBuilt: "2026-09-15"
---
## What it is

This ADR refactors the storefront's many separate line-item templates — used to render products, discounts, container items, and custom app-defined line item types — into a single recursive base template.

## When to use

Relevant when customizing, extending, or overriding how line items (cart, offcanvas, checkout, order history, confirmation) are rendered in the storefront, especially if a plugin previously extended one of the pre-refactor templates.

## Key steps / config

- Problem addressed: over ten separate templates existed for rendering line items in different areas, some copying code from each other, some extending each other; naming was inconsistent (`checkout-item` template name vs. `cart-item` CSS classes/markup); nested line items needed extra templates and were shown only as plain bulleted text, not as full line items; large templates had many if/else branches to distinguish product/discount/etc.
- Decision: refactor all line item templates into a single base template, `Resources/views/storefront/component/line-item/line-item.html.twig`, used by all shop areas; appearance (e.g. offcanvas) is toggled via configuration variables rather than separate templates.
- Naming is unified to `line-item`, reflecting that a line item is not always inside a shopping cart.
- Nested line items no longer need separate templates — the base template includes itself recursively.
- Each known line item type (product, container, discount) gets its own sub-template for future-proofing and readability.
- All storefront line items in platform now use this base template; the offcanvas appearance is unified with the mobile appearance used in the regular cart.

## Essential identifiers

- `Resources/views/storefront/component/line-item/line-item.html.twig` (new base template)
- Templates that must switch to the base template instead: `Resources/views/storefront/page/checkout/checkout-item.html.twig`, `checkout-item-children.html.twig`, `Resources/views/storefront/page/checkout/confirm/confirm-item.html.twig`, `Resources/views/storefront/page/checkout/finish/finish-item.html.twig`, `Resources/views/storefront/component/checkout/offcanvas-item.html.twig`, `offcanvas-item-children.html.twig`, `Resources/views/storefront/page/account/order/line-item.html.twig`, `Resources/views/storefront/page/account/order-history/order-detail-list-item.html.twig`, `order-detail-list-item-children.html.twig`, `Resources/views/storefront/page/checkout/checkout-aside-item.html.twig`, `checkout-aside-item-children.html.twig`

## Gotchas

Any extension that extends one of the templates listed above must switch to extending the new base template `Resources/views/storefront/component/line-item/line-item.html.twig` instead, or it will not receive the unified rendering/appearance.
