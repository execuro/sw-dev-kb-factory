---
id: platform/dev/6.6/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.md
title: Remove the asterisk next to every price and replace it with actual text
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.html
sourceHash: aee3bfac3cc5e5adfb5a8dcafea86e10312c2357
keywords: ["ACCESSIBILITY_TWEAKS", "core.listing.allowBuyInListing", "asterisk", "price display", "storefront", "accessibility", "cart summary", "product box", "v6.7.0", "feature flag"]
summary: "ADR removing the * next to storefront prices, replacing it with explicit tax/shipping text, gated by ACCESSIBILITY_TWEAKS until v6.7.0."
lastBuilt: 2026-09-15
---
## What it is

This ADR decides to remove the `*` shown next to every product price in the default Storefront (which referred to a footer note about tax/shipping) because it is redundant, confusing, and an accessibility problem, replacing it with explicit text where actually needed.

## When to use

When touching Storefront price display (cart, cart summary, header widgets, product listing/boxes, product detail buy-widget) and needing to know whether the asterisk or explicit text should be shown.

## Key steps / config

Affected areas and behavior:

| Area | Explanation |
|---|---|
| Shopping cart and order line items | Asterisk removed; info already shown in cart summary. |
| Shopping cart summary | Asterisk removed; info already part of the summary (shipping, taxes). |
| Header cart widget / search suggest box | Asterisk removed; no add-to-cart possible there. |
| Product-box (listing, slider, etc.) | Text shown instead when `core.listing.allowBuyInListing` is enabled. |
| Buy-widget on product detail page | Asterisk removed; info already shown underneath the price. |

The change is activated via the `ACCESSIBILITY_TWEAKS` feature flag and becomes default in `v6.7.0`.

## Essential identifiers

- `ACCESSIBILITY_TWEAKS`
- `core.listing.allowBuyInListing`

## Gotchas

Where the asterisk was actually informative (no other tax/shipping note nearby), it is replaced by explicit text ("Prices incl. VAT plus shipping costs") rather than simply removed, and this is only shown as text on product boxes when `core.listing.allowBuyInListing` is enabled.

## Version notes

The asterisk removal is opt-in behind `ACCESSIBILITY_TWEAKS` until it becomes the default behavior in the next major version, `v6.7.0`.
