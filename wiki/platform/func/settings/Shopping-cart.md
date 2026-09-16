---
id: platform/func/settings/Shopping-cart.md
title: Shopping Cart
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/Shopping-cart"
sourceHash: 57f41565a1b09c5fc98723bd58c69cf3d7a4fc423e6d158b2d3017125c0c8326
revision:
  current: true
  range: "6.7.1.0 - 6.7.13.1"
  swMin: "6.7.1.0"
  swMax: "6.7.13.1"
keywords: ["shopping cart settings", "cart configuration", "maximum quantity", "delivery time", "refunds", "payment token", "rate limiter", "wishlist", "checkout settings", "AI-generated checkout message", "shipping costs", "sales channel override"]
summary: Documents Shopware's shopping cart and checkout settings, including cart limits, payment token timeout, wishlist and AI checkout message.
lastBuilt: 2026-09-15
---
## What it is

Settings for basic cart and product-detail-page behaviour, found under **Settings > General > Shopping cart**; values can be set globally or overridden per sales channel.

## When to use

Used to tune cart limits, checkout confirmation behaviour, refund availability, API rate limiting, and optional wishlist/AI checkout-message features.

## Key steps / config

**Cart** section:
- **Maximum quantity** — dropdown limit on the product page/cart (a per-product max order quantity can also be set individually)
- **Show delivery time in cart** — displays the product's delivery time in the cart
- **Enable refunds** — lets customers cancel orders from their account
- **Time in minutes for a customer to finalize a transaction** — payment token validity; blank field defaults (code-based) to 60 minutes; expiry auto-cancels the transaction
- **Maximum addable products to cart per minute through API** — rate limiter against brute-force abuse
- **Show subtotal column** — toggles the totals column in cart/checkout
- **Order confirm page: tax column instead of unit price** — shows VAT instead of unit price at checkout

**Checkout** section: **Show comment field on checkout confirm page**, **Automatically log out guest customers after order completion**, **Show legal guarantee notice on checkout page** (EU-harmonised warranty notice).

**AI-generated Checkout message** (Shopware Rise plan and above): configurable **Tone of voice** (Neutral, Excited, Humorous), **Character count** target, and an **Availability rule** (Rule Builder) restricting which customers/orders receive it; an **AI Copilot Preview** lets merchants test settings on selected products.

**Wishlist**: **Activate wishlist** lets customers save products temporarily, accessed via the heart icon near the account menu.

## Essential identifiers

- **Settings > General > Shopping cart**
- **Time in minutes for a customer to finalize a transaction** (default 60 minutes)
- **Maximum addable products to cart per minute through API**

## Gotchas

The payment-token timeout field is blank by default but still enforces a 60-minute limit in code; if the token expires before the customer finishes, the transaction is cancelled and must be restarted.

## Version notes

The AI-generated checkout message feature requires the Shopware Rise plan or above.
