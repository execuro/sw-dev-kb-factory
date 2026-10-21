---
id: platform/dev/6.7/concepts/commerce/checkout-concept/cart.md
title: Cart
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/cart.html
sourceHash: f3b49be662662d5aa3e0b3fa2fbe2ad72fd0795c
codeCheckedAgainst: "6.7.15.1"
keywords: ["cart", "shopping cart", "Cart", "LineItem", "CartDataCollectorInterface", "CartProcessorInterface", "Processor", "CartService", "ProductCartProcessor", "shopware.cart.collector", "shopware.cart.processor", "cart calculation", "line item", "CartRuleLoader"]
summary: Cart concept in Shopware 6.7 - Cart struct, line items, states, the collect/process/validate calculation pipeline, collector/processor tags and CartService.
lastBuilt: 2026-10-20
---
## What it is

Concept page for the Shopware 6 cart, which lives in the checkout bundle. It covers the cart struct (`\Shopware\Core\Checkout\Cart\Cart`), its states, the multi-stage calculation (enrich, process, validate, persist), rule-driven recalculation, storage and the `CartService` facade.

## When to use

Read this before writing a cart collector/processor, adding custom line item types, or debugging why a cart recalculates or changes during calculation.

## Key steps / config

**Cart struct** – one instance per cart, identified only by a token; no direct relations to other entities, so multiple carts per user/sales channel are possible. It contains:
- line items (order positions; may be nested; flags such as *stackable*, *removable*; promotions, discounts and surcharges are line items too),
- transactions (payment handler + amount),
- deliveries (date, method, target location, shipped line items),
- errors (block ordering), tax, and the total price.

**States** – `Empty` → (add line item) `Dirty` → (calculate) `Calculated` → (modify) `Dirty`, or → order.

**Calculation** in `\Shopware\Core\Checkout\Cart\Processor::process()` (installed code):
1. Every service tagged `shopware.cart.collector` (`CartDataCollectorInterface::collect()`) runs first to enrich/load data, in tag priority order.
2. Every service tagged `shopware.cart.processor` (`CartProcessorInterface::process()`) runs next; the amount is recalculated after each processor.
3. Cart validators (`shopware.cart.validator`) add errors, then transactions are built.

Implementing either interface autoconfigures the tag. Default services and priorities:

| Service | Tags / priority | Task |
|---|---|---|
| `Shopware\Core\Content\Product\Cart\ProductCartProcessor` | collector + processor, 5000 | enrich and price products |
| `Shopware\Core\Checkout\Promotion\Cart\PromotionCollector` | collector, 4900 | collect promotions |
| `Shopware\Core\Checkout\Cart\Delivery\DeliveryProcessor` | collector + processor, -5000 | deliveries and shipping costs |

Line items can be added empty and are enriched during calculation:

```php
$cart->getLineItems()->add($lineItem);
$lineItem->getPrice(); // null until the cart is calculated
```

**Context rules** – after processing, the cart is validated against rules; a rule-driven change (e.g. auto-added gift item, then a discount) triggers another iteration until nothing changes.

**Storage** – the cart is not a DAL entity; it is read and written as a whole by a cart persister (`AbstractCartPersister::load()` / `save()`).

**Control** – `\Shopware\Core\Checkout\Cart\SalesChannel\CartService` creates, modifies, calculates and orders the cart.

## Essential identifiers

- `\Shopware\Core\Checkout\Cart\Cart`, `Shopware\Core\Checkout\Cart\LineItem\LineItem`
- `\Shopware\Core\Checkout\Cart\CartDataCollectorInterface`, `CartProcessorInterface`
- `\Shopware\Core\Checkout\Cart\Processor`
- `shopware.cart.collector`, `shopware.cart.processor`, `shopware.cart.validator`
- `\Shopware\Core\Checkout\Cart\SalesChannel\CartService`
- `AbstractCartPersister`, `CartRuleLoader`

## Gotchas

- The docs' default collector table lists `Shopware\Core\Checkout\Promotion\Cart\CartPromotionsCollector` and `Shopware\Core\Checkout\Shipping\Cart\ShippingMethodPriceCollector`; neither exists in 6.7. Promotions are collected by `PromotionCollector`, shipping costs are handled by `DeliveryProcessor`.
- The rule-revalidation loop is capped: `CartRuleLoader` stops after `MAX_ITERATION` (7) iterations.

## Code check (6.7.15.1)
- absent `Shopware\Core\Checkout\Promotion\Cart\CartPromotionsCollector` — not in the installed code; replaced by PromotionCollector
- absent `Shopware\Core\Checkout\Shipping\Cart\ShippingMethodPriceCollector` — not in the installed code; shipping handled by DeliveryProcessor
- confirmed `Cart` — cart struct — vendor/shopware/core/Checkout/Cart/Cart.php:21
- confirmed `CartDataCollectorInterface::collect()` — collector contract — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:12
- confirmed `Processor::process()` — runs collectors, then processors, validator, transactions — vendor/shopware/core/Checkout/Cart/Processor.php:32
- confirmed `ProductCartProcessor` — collector and processor at priority 5000 — vendor/shopware/core/Checkout/DependencyInjection/cart.php:517
- confirmed `PromotionCollector` — collector at priority 4900 — vendor/shopware/core/Checkout/DependencyInjection/promotion.php:123
- confirmed `DeliveryProcessor` — collector and processor at priority -5000 — vendor/shopware/core/Checkout/DependencyInjection/cart.php:477
- confirmed `CartRuleLoader::MAX_ITERATION` — rule loop capped at 7 iterations — vendor/shopware/core/Checkout/Cart/CartRuleLoader.php:34
- confirmed `CartService` — cart facade — vendor/shopware/core/Checkout/Cart/SalesChannel/CartService.php:24
