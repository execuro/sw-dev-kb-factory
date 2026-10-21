---
id: platform/func/settings/Shopping-cart.md
title: Shopping Cart
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/Shopping-cart
sourceHash: 16a563b2bff49fe95c83efe5cfc17ed6718953c9edee0dc505e86d7f4b68660d
revision:
  current: true
  range: "6.7.14.0 - 6.7.14.2"
  swMax: "6.7.14.2"
  swMin: "6.7.14.0"
keywords: ["shopping cart settings", "cart settings", "Enable refunds", "maximum quantity", "payment token", "rate limiter", "guest checkout", "wishlist", "checkout message", "automatically combine products into bundles", "warenkorb", "legal guarantee notice"]
summary: Admin settings for cart, checkout, AI checkout message, wishlist and automatic bundle combination, global or per sales channel.
lastBuilt: 2026-10-20
---
## What it is

The shopping cart settings under **Settings > General > Shopping cart** configure cart, product detail page, checkout and wishlist behavior. They apply globally or per sales channel; a sales-channel value overrides the global one.

## When to use

Use it to look up what an individual cart or checkout option does and where it lives in the Administration.

## Key steps / config

Cart:
- **Maximum quantity**: limit of the quantity dropdown on the product detail page and (off-canvas) cart; a product can set its own max. order quantity.
- **Show delivery time in cart**: shows each item's delivery time.
- **Enable refunds**: customers can cancel orders in their account.
- **Time in minutes for a customer to finalize a transaction**: lifetime of the payment token on redirects to payment service providers. The field is blank by default and the code default is 60 minutes; an expired token cancels the transaction.
- **Maximum addable products to cart per minute through API**: a rate limiter against brute-force requests.
- **Show subtotal column**; **Order confirm page: tax column instead of unit price**.

Checkout:
- **Show comment field on checkout confirm page**: comment shown in the account and admin order.
- **Automatically log out guest customers after order completion**.
- **Show legal guarantee notice on checkout page**: EU-harmonised warranty notice.

AI-generated checkout message (from the Shopware Rise plan): **Tone of voice** (Neutral, Excited, Humorous), **Character count** (guideline; product names excluded), **Availability rule** (Rule Builder rules), plus an AI Copilot preview with **Generate preview**.

Wishlist: **Activate wishlist** (heart symbol next to the account menu); shipping costs can be calculated in the cart via a shipping costs link.

Bundles: **Automatically combine products into bundles**. If several bundles are eligible, the highest priority is considered first; products are combined only when a bundle discount applies, partial quantities can be combined, and customers can click **Undo**.

## Gotchas

- Automatic bundle combination requires the Commercial extension and an Evolve or Beyond plan.
- Adding extra information to the VAT line cannot be done manually, only through connected programs.

## Version notes

Documented for Shopware 6.7.14.0 - 6.7.14.2.
