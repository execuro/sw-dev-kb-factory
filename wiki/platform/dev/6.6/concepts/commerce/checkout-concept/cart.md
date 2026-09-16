---
id: platform/dev/6.6/concepts/commerce/checkout-concept/cart.md
title: Cart
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/commerce/checkout-concept/cart.html
sourceHash: 9f5e92e46baf61e8f0649bfd2aaf92c00a4b291f
keywords: ["cart", "Cart struct", "line item", "CartDataCollectorInterface", "CartService", "cart enrichment", "cart calculation", "cart state", "token hash", "cart processor", "ProductCartProcessor", "CartPromotionsCollector"]
summary: The shopping cart is a mutable in-memory struct enriched, processed, validated and persisted through collector and processor services.
lastBuilt: "2026-09-15"
---
## What it is

Shopping cart management is a central feature of Shopware 6, living in the checkout bundle. The cart struct is `\Shopware\Core\Checkout\Cart\Cart`; an instance represents one cart, identified only by a token hash, allowing multiple carts per user/sales channel.

## When to use

Relevant when working with anything touching cart state, price calculation, or promotions/discounts modeled as line items.

## Key steps / config

Design goals: **adaptability** (cart adapts to many use cases via services), **performance** (minimal calculations/queries/iterations, clear state management), **abstraction** (few hard dependencies — products, surcharges, discounts are referenced through interfaces line items point to).

The cart contains: line items (order positions, may be stackable/removable, can nest other line items; promotions/discounts/surcharges are also line items), a transaction (payment handler + amount), a delivery (date, method, target location, shipped line items), errors (validation issues blocking ordering), tax, and price.

**Cart states**: `Empty` → `Dirty` (add line item) → `Calculated` (calculate) → order or back to `Dirty` on modification.

**Calculation stages**: Enrich → Process → Validate (repeats until stable) → Persist. Enrichment is controlled transparently via implementations of `\Shopware\Core\Checkout\Cart\CartDataCollectorInterface`, reducing DB calls needed to build the cart's data structure for price calculation and inspection.

Default collectors:

| Service ID | Task |
| :--- | :--- |
| `Shopware\Core\Content\Product\Cart\ProductCartProcessor` | Enrich all referenced products |
| `Shopware\Core\Checkout\Promotion\Cart\CartPromotionsCollector` | Enrich add, remove and validate promotions |
| `Shopware\Core\Checkout\Shipping\Cart\ShippingMethodPriceCollector` | Handle shipping prices |

Processing happens in `\Shopware\Core\Checkout\Cart\Processor`: line item prices are calculated from quantity and tax rate, deliveries are set up and costed, and cart totals are summed (incl./excl. VAT and shipping). After processing, the cart is validated against the rule system, which can trigger revalidation.

## Essential identifiers

- `\Shopware\Core\Checkout\Cart\Cart`
- `\Shopware\Core\Checkout\Cart\CartDataCollectorInterface`
- `\Shopware\Core\Checkout\Cart\Processor`
- `\Shopware\Core\Checkout\Cart\SalesChannel\CartService`

## Gotchas

The cart is not managed through the Data Abstraction Layer — contrary to other entities, it can only be written and retrieved as a whole; its workload is only performed on the whole in-memory object.
