---
id: platform/dev/6.7/concepts/commerce/checkout-concept/cart.md
title: Cart
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/cart.html
sourceHash: f3b49be662662d5aa3e0b3fa2fbe2ad72fd0795c
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware\\Core\\Checkout\\Cart\\Cart", "CartDataCollectorInterface", "CartProcessorInterface", "ProductCartProcessor", "PromotionCollector", "DeliveryProcessor", "Processor", "CartService", "shopware.cart.collector", "shopware.cart.processor", "line item", "cart calculation", "basket", "enrichment", "cart persister"]
summary: Shopware cart concept - Cart struct, line items, state, collect/process pipeline, collector and processor tags and priorities, storage and CartService.
lastBuilt: 2026-09-15
---
## What it is

Concept page for the Shopware 6 shopping cart, part of the checkout bundle: the `\Shopware\Core\Checkout\Cart\Cart` struct, its states, the multi-stage calculation (enrich, process, validate, persist), and the services that control it.

## When to use

Read before extending cart calculation (custom collectors/processors, discounts, surcharges), debugging cart recalculation, or deciding where cart data lives.

## Key steps / config

**Cart struct** (`\Shopware\Core\Checkout\Cart\Cart`): one cart, identified only by a token; no hard relations to customer or sales channel, so multiple carts per user/channel are possible. It contains:

- Line items: order positions (shippable good, download, bundle). Flags such as *stackable* (quantity changeable) and *removable* control handling. Promotions, discounts and surcharges are line items too; line items can nest children.
- Transactions (payment handler + amount), deliveries (date, method, target location, line items shipped together), errors (block ordering), tax, and price (line items incl. tax, delivery costs, discounts, surcharges).

**States:** Empty (default shipping/payment) → Dirty (line item added, prices invalid) → Calculated (can be ordered or has errors); modifying line items/shipping/payment makes it Dirty again.

**Calculation** is run by `\Shopware\Core\Checkout\Cart\Processor::process()`:

1. Enrich: every service tagged `shopware.cart.collector` (type `\Shopware\Core\Checkout\Cart\CartDataCollectorInterface`) runs `collect()` into the shared `CartDataCollection`. Line items may be added empty and only get prices/data here.
2. Process: every service tagged `shopware.cart.processor` (`CartProcessorInterface::process()`) fills the new cart step by step; the amount is recalculated after each processor.
3. Validate: validators tagged `shopware.cart.validator` add errors; transactions are built.
4. Rules: `CartRuleLoader` re-runs the calculation while rule matches change the cart (e.g. a free item added, then a percentage discount), capped by `MAX_ITERATION = 7`.

Default collectors in tag-priority order (higher runs first):

| Service ID | Priority | Task |
|---|---|---|
| `Shopware\Core\Content\Product\Cart\ProductCartProcessor` | 5000 | enrich referenced products |
| `Shopware\Core\Checkout\Promotion\Cart\PromotionCollector` | 4900 | add/remove/validate promotions |
| `Shopware\Core\Checkout\Cart\Delivery\DeliveryProcessor` | -5000 | deliveries and shipping costs |

**Storage:** the cart is not a DAL entity; it is written and read as a whole via `AbstractCartPersister` (`CartPersister`).

**Control:** `\Shopware\Core\Checkout\Cart\SalesChannel\CartService` is the facade that creates, modifies and recalculates the cart.

## Essential identifiers

- `\Shopware\Core\Checkout\Cart\Cart`, `\Shopware\Core\Checkout\Cart\LineItem\LineItem`
- `\Shopware\Core\Checkout\Cart\CartDataCollectorInterface`, `\Shopware\Core\Checkout\Cart\CartProcessorInterface`
- `\Shopware\Core\Checkout\Cart\Processor`, `\Shopware\Core\Checkout\Cart\CartRuleLoader`
- `\Shopware\Core\Checkout\Cart\SalesChannel\CartService`
- Tags: `shopware.cart.collector`, `shopware.cart.processor`, `shopware.cart.validator`

## Gotchas

- The docs table lists `Shopware\Core\Checkout\Promotion\Cart\CartPromotionsCollector` and `Shopware\Core\Checkout\Shipping\Cart\ShippingMethodPriceCollector`; neither exists in 6.7. Use `PromotionCollector` and `DeliveryProcessor` instead.
- A line item's price is null until the cart is calculated.
- If the original cart has no line items, collectors and processors are skipped entirely.

## Code check (6.7.13.0)
- absent `Shopware\Core\Checkout\Promotion\Cart\CartPromotionsCollector` — not in installed code; promotions are collected by `PromotionCollector`
- absent `Shopware\Core\Checkout\Shipping\Cart\ShippingMethodPriceCollector` — not in installed code; shipping handled by `DeliveryProcessor`
- corrected `Shopware\Core\Checkout\Promotion\Cart\PromotionCollector` — docs: CartPromotionsCollector; real collector, tag priority 4900 — vendor/shopware/core/Checkout/DependencyInjection/promotion.xml:75
- confirmed `Shopware\Core\Content\Product\Cart\ProductCartProcessor` — collector and processor, priority 5000 — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:346
- corrected `Shopware\Core\Checkout\Cart\Delivery\DeliveryProcessor` — docs: ShippingMethodPriceCollector; collector and processor, priority -5000 — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:306
- confirmed `CartDataCollectorInterface::collect()` — enrichment contract — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:12
- confirmed `Processor::process()` — runs collectors then processors — vendor/shopware/core/Checkout/Cart/Processor.php:32
- confirmed `CartRuleLoader::MAX_ITERATION` — rule revalidation loop limit 7 — vendor/shopware/core/Checkout/Cart/CartRuleLoader.php:34
- confirmed `Shopware\Core\Checkout\Cart\SalesChannel\CartService` — cart facade — vendor/shopware/core/Checkout/Cart/SalesChannel/CartService.php:24
- confirmed `AbstractCartPersister` — whole-cart storage abstraction — vendor/shopware/core/Checkout/Cart/AbstractCartPersister.php:12
