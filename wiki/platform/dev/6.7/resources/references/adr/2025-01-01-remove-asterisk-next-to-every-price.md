---
id: platform/dev/6.7/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.md
title: Remove the asterisk next to every price and replace it with actual text
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.html
sourceHash: aee3bfac3cc5e5adfb5a8dcafea86e10312c2357
codeCheckedAgainst: "6.7.13.0"
keywords: ["ACCESSIBILITY_TWEAKS", "core.listing.allowBuyInListing", "price asterisk", "tax information", "shipping costs", "prices incl. vat", "product box", "storefront prices", "accessibility", "screen reader", "component_product_box_price_tax_info", "adr"]
summary: "ADR: Storefront drops the asterisk after prices; product boxes show 'Prices incl. VAT plus shipping costs' text when core.listing.allowBuyInListing is on."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2025-01-01, area framework/storefront): the asterisk `*` after every Storefront price, which referred to the footer tax/shipping note, is removed; where the information is really needed it is replaced by the text "Prices incl. VAT plus shipping costs".

## When to use

Read this when a theme or plugin template still renders or expects the price asterisk, or when you wonder why product boxes show a tax/shipping text link.

## Key steps / config

Reasons given: the footer note is often outside the viewport, the asterisk is redundant or confusing (PDP already shows tax info under the price; cart summary contains it; clashes with required-field asterisks in forms; suggests the price may change), and screen readers read "50 euros star" without context.

Affected areas:

| Area | Result |
|---|---|
| Cart and order line items | Asterisk removed; info in cart summary |
| Cart summary | Asterisk removed; shipping/taxes already listed |
| Header cart widget | Asterisk removed |
| Header search suggest | No info needed (no add to cart) |
| Product box (listing, slider) | Info shown as text when `core.listing.allowBuyInListing` is enabled |
| PDP buy widget | Info already shown under the price |

In the installed Storefront, `component/product/card/price-unit.html.twig` wraps block `component_product_box_price_tax_info` in `{% if config('core.listing.allowBuyInListing') %}`; it renders a button that opens the shipping/payment info CMS page in an AJAX modal.

## Essential identifiers

- `core.listing.allowBuyInListing` — system config (bool, "Display buy buttons in listings") that controls the product-box tax/shipping text
- `component_product_box_price_tax_info` — Storefront Twig block rendering that text

## Gotchas

- Product-box tax text appears only when `core.listing.allowBuyInListing` is on; with it off no text replaces the asterisk.
- Custom templates overriding price blocks may still print the asterisk and need adjusting.

## Version notes

The ADR says the change is activated via feature flag `ACCESSIBILITY_TWEAKS` and becomes default with v6.7.0. In 6.7.13.0 the flag is still declared in `feature.yaml` (default true, major, toggleable) but no Storefront template reads it — the behaviour is unconditional. Technical changelog: `2025-01-16-remove-the-asterisk-next-to-every-price.md`.

## Code check (6.7.13.0)
- unread `ACCESSIBILITY_TWEAKS` — declared as major feature flag (default true) but not read by Storefront views — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:24
- confirmed `core.listing.allowBuyInListing` — gates the product-box tax info block — vendor/shopware/storefront/Resources/views/storefront/component/product/card/price-unit.html.twig:153
- confirmed `component_product_box_price_tax_info` — block rendering the tax/shipping text link — vendor/shopware/storefront/Resources/views/storefront/component/product/card/price-unit.html.twig:154
- confirmed `allowBuyInListing` — bool system config input field in listing settings — vendor/shopware/core/System/Resources/config/listing.xml:9
- confirmed `core.listing.allowBuyInListing` — also gates buy button in product card actions — vendor/shopware/storefront/Resources/views/storefront/component/product/card/action.html.twig:9
