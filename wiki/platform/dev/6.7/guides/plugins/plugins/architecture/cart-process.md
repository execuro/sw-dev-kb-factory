---
id: platform/dev/6.7/guides/plugins/plugins/architecture/cart-process.md
title: Cart Extension Architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/architecture/cart-process.html
sourceHash: 1c6aab500f098d8f7f6452ac5877bf3dd7476cdd
codeCheckedAgainst: "6.7.13.0"
keywords: ["cart extension rules", "CartDataCollectorInterface", "CartProcessorInterface", "CartDataCollection", "LineItemFactoryInterface", "QuantityPriceCalculator", "price calculator", "cart recalculation", "no queries in process", "cart collector", "cart processor", "store api cart routes"]
summary: "Cart extension rules: load data once in collectors, no DB queries in processors, line item factories, core price calculators, Store API routes."
lastBuilt: 2026-09-15
---
## What it is

The architectural contract for plugins extending the cart. The cart is recalculated several times per request to resolve dependencies between line items, so extensions must be deterministic and must keep data loading separate from calculation.

## When to use

Writing a cart data collector, cart processor, custom line item type or price adjustment in a plugin, or reviewing one for performance problems.

## Key steps / config

Design principles: cart processing is multi-pass and must stay deterministic; data loading is separated from calculation; price logic is centralized and reusable.

1. **Load external data in a collector.** Implement `Shopware\Core\Checkout\Cart\CartDataCollectorInterface::collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void`. Check whether the data is already present in `CartDataCollection` (`Shopware\Core\Checkout\Cart\LineItem\CartDataCollection`) and only query what is missing, then append it there. Register with the `shopware.cart.collector` tag.
2. **Modify calculated items in a processor.** Implement `Shopware\Core\Checkout\Cart\CartProcessorInterface::process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void`. Read only from `$data`; never run database queries here. Register with the `shopware.cart.processor` tag.
3. **Create line items via a factory.** Implement `Shopware\Core\Checkout\Cart\LineItemFactoryHandler\LineItemFactoryInterface` (`supports()`, `create()`, `update()`), tagged `shopware.cart.line_item.factory`; the core collects these in `LineItemFactoryRegistry`.
4. **Calculate prices with core calculators** from the `Shopware\Core\Checkout\Cart\Price` namespace, e.g. `QuantityPriceCalculator`, `PercentagePriceCalculator`, `AbsolutePriceCalculator`.
5. **Expose cart functions over Store API routes** in the `Shopware\Core\Checkout\Cart\SalesChannel` namespace (e.g. `CartItemAddRoute`, `CartLoadRoute`).

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartDataCollectorInterface::collect()`
- `Shopware\Core\Checkout\Cart\CartProcessorInterface::process()`
- `Shopware\Core\Checkout\Cart\LineItem\CartDataCollection`
- `Shopware\Core\Checkout\Cart\LineItemFactoryHandler\LineItemFactoryInterface`
- `shopware.cart.collector`, `shopware.cart.processor`, `shopware.cart.line_item.factory`
- `Shopware\Core\Checkout\Cart\Price\QuantityPriceCalculator`
- `Shopware\Core\Checkout\Cart\SalesChannel`

## Gotchas

- `process()` runs on every recalculation pass; a query inside it multiplies database load per request.
- The docs call `Shopware\Core\Checkout\Cart\Price` a class and `LineItemFactoryHandler` a class; both are namespaces in 6.7. The docs also name `CartDataCollection` without its namespace — it lives under `Cart\LineItem`, not `Cart`.

## Code check (6.7.13.0)
- confirmed `CartDataCollectorInterface::collect()` — collector contract — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:12
- confirmed `CartProcessorInterface::process()` — processor contract — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- confirmed `CartDataCollection` — located in Cart\LineItem namespace — vendor/shopware/core/Checkout/Cart/LineItem/CartDataCollection.php:12
- confirmed `MAX_ITERATION` — cart recalculated up to 7 times while rules/cart change — vendor/shopware/core/Checkout/Cart/CartRuleLoader.php:34
- corrected `LineItemFactoryInterface` — docs: a LineItemFactoryHandler class — vendor/shopware/core/Checkout/Cart/LineItemFactoryHandler/LineItemFactoryInterface.php:15
- confirmed `shopware.cart.line_item.factory` — tag collected for the factory registry — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:429
- confirmed `shopware.cart.collector` — tagged iterator of collectors — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:342
- confirmed `shopware.cart.processor` — tagged iterator of processors — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:341
- corrected `QuantityPriceCalculator` — docs: calculators stored inside a Price class; Price is a namespace — vendor/shopware/core/Checkout/Cart/Price/QuantityPriceCalculator.php:14
- confirmed `CartItemAddRoute` — Store API cart route in Cart\SalesChannel — vendor/shopware/core/Checkout/Cart/SalesChannel/CartItemAddRoute.php:26
