---
id: platform/dev/6.7/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.md
title: Remove the asterisk next to every price and replace it with actual text
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.html
sourceHash: aee3bfac3cc5e5adfb5a8dcafea86e10312c2357
codeCheckedAgainst: "6.7.15.1"
keywords: ["price asterisk", "tax information", "shipping costs", "core.listing.allowBuyInListing", "ACCESSIBILITY_TWEAKS", "component_product_box_price_tax_info", "price-unit.html.twig", "accessibility", "screen reader", "product box", "storefront prices", "adr"]
summary: "ADR: Storefront drops the * next to prices; product boxes with buy-in-listing show 'Prices incl. VAT plus shipping costs' text instead (6.7 default)."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2025-01-01, area framework) that removes the asterisk `*` displayed next to every product price in the default Storefront (e.g. `€ 50,00 *`). The asterisk pointed at the footer note `* All prices incl. VAT plus shipping costs and possible delivery charges, if not stated otherwise.` Where the information is still needed, it is replaced by the actual text "Prices incl. VAT plus shipping costs".

## When to use

- You maintain a Storefront theme or template override that renders prices and relied on the trailing `*` or the footer reference.
- You need to know why the tax/shipping hint appears inside listing product boxes and not elsewhere.
- You are evaluating accessibility of price output (screen readers read "50 euros star" without context).

## Key steps / config

Reasons given for the change:

- The footer text is often outside the viewport, e.g. when adding products to the cart from the listing.
- The information is redundant: the product detail page already shows the "tax and shipping information" link under the price, and the cart summary already contains shipping and taxes.
- Asterisks on required form fields conflict with price asterisks on the same page.
- The asterisk suggests the price may not be final.
- The plain-text `*` has no relationship to the footer text, so it is not accessible.

Affected areas:

| Area | Result |
|---|---|
| Cart and order line items | Asterisk removed; info shown in cart summary |
| Cart summary | Asterisk removed; shipping/taxes already part of summary |
| Header cart widget | Asterisk removed; no add-to-cart there |
| Header search suggest box | Info not needed; no add-to-cart there |
| Product box (listing, product slider etc.) | Info displayed as text when `core.listing.allowBuyInListing` is enabled |
| Buy widget on product detail page | Info already shown under the price |

In the installed Storefront, the product card template `component/product/card/price-unit.html.twig` wraps the tax/shipping hint in `{% if config('core.listing.allowBuyInListing') %}` and the block `component_product_box_price_tax_info`, rendered as a button that opens the shipping/payment info CMS page (`core.basicInformation.shippingPaymentInfoPage`) in an AJAX modal.

## Essential identifiers

- `core.listing.allowBuyInListing` — system config key that controls whether the text hint appears in product boxes
- `component_product_box_price_tax_info` — Twig block holding the hint in the product card price template

## Gotchas

- The hint in product boxes only appears when `core.listing.allowBuyInListing` is enabled; with buy-in-listing off, product boxes show no tax/shipping text at all.
- Template overrides that re-add `*` after prices would reintroduce the screen-reader and form-asterisk conflicts the ADR describes.
- The ADR names the `ACCESSIBILITY_TWEAKS` feature flag as the opt-in for 6.6; in the installed 6.7 code the flag is still declared but no code reads it.

## Version notes

- Before 6.7.0 the change could be activated with the `ACCESSIBILITY_TWEAKS` feature flag; it is the default behaviour from `v6.7.0`.
- The technical changelog is referenced as `2025-01-16-remove-the-asterisk-next-to-every-price.md`.

## Code check (6.7.15.1)
- unread `ACCESSIBILITY_TWEAKS` — declared in feature.yaml (default true, major) but not read by any code in 6.7 — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:24
- confirmed `core.listing.allowBuyInListing` — gates the tax info hint in the product card price template — vendor/shopware/storefront/Resources/views/storefront/component/product/card/price-unit.html.twig:153
- confirmed `component_product_box_price_tax_info` — Twig block containing the tax/shipping hint — vendor/shopware/storefront/Resources/views/storefront/component/product/card/price-unit.html.twig:154
- confirmed `allowBuyInListing` — system config field in the listing settings — vendor/shopware/core/System/Resources/config/listing.xml:9
