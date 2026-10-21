---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/architecture/cart-process.md
sourceHash: 1c6aab500f098d8f7f6452ac5877bf3dd7476cdd
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/architecture/cart-process.html
title: Cart Extension Architecture
version: "6.7"
versions:
  - "6.7"
keywords: ["CartDataCollectorInterface", "CartProcessorInterface", "CartDataCollection", "LineItemFactoryInterface", "LineItemFactoryHandler", "QuantityPriceCalculator", "shopware.cart.processor", "shopware.cart.collector", "cart extension", "cart recalculation", "price calculation", "line item factory", "store api cart routes"]
summary: Mandatory rules for cart plugins - collectors load data once, processors never query, price calculators, line item factories, Store API routes.
lastBuilt: 2026-10-21
---
## What it is

The architectural contract for extending the Shopware cart. The cart is recalculated several times per request to resolve dependencies between line items, so custom cart extensions must stay deterministic and cheap per pass.

## When to use

Before writing a cart collector, cart processor, custom line item type, price adjustment, or a cart-related Store API endpoint in a plugin.

## Key steps / config

Design principles: cart processing is multi-pass and must remain deterministic; data loading is separated from calculation; price logic is centralised and reusable.

1. **Load external data in a collector.** Implement `Shopware\Core\Checkout\Cart\CartDataCollectorInterface` and tag the service `shopware.cart.collector`. Its `collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void` must check whether the data is already present in `CartDataCollection` (class `Shopware\Core\Checkout\Cart\LineItem\CartDataCollection`) and only load and append what is missing, so repeated passes do not repeat queries.
2. **Modify calculated items in a processor.** Implement `Shopware\Core\Checkout\Cart\CartProcessorInterface` and tag the service `shopware.cart.processor` (optionally with a `priority`). `process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void` must never execute database queries — it runs multiple times per request; read everything from `$data`.
3. **Create line items through a factory.** Line item creation goes through a factory in the `Shopware\Core\Checkout\Cart\LineItemFactoryHandler` namespace: implement `LineItemFactoryInterface` (`supports()`, `create()`, `update()`) and tag it `shopware.cart.line_item.factory`; core resolves factories via `LineItemFactoryRegistry`.
4. **Calculate prices with core calculators.** All price calculations use the calculator classes in the `Shopware\Core\Checkout\Cart\Price` namespace (e.g. `QuantityPriceCalculator`, `AbsolutePriceCalculator`, `PercentagePriceCalculator`) instead of custom price arithmetic.
5. **Expose cart functions via Store API.** Cart-related functionality is mapped to Store API routes in the `Shopware\Core\Checkout\Cart\SalesChannel` namespace (e.g. `AbstractCartLoadRoute`, `AbstractCartItemAddRoute`).

```php
class MyCollector implements CartDataCollectorInterface
{
    public function collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void { /* load once, $data->set(...) */ }
}
```

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartDataCollectorInterface::collect()`
- `Shopware\Core\Checkout\Cart\CartProcessorInterface::process()`
- `Shopware\Core\Checkout\Cart\LineItem\CartDataCollection`
- `Shopware\Core\Checkout\Cart\LineItemFactoryHandler\LineItemFactoryInterface`
- `Shopware\Core\Checkout\Cart\Price` (calculator namespace)
- `Shopware\Core\Checkout\Cart\SalesChannel` (Store API route namespace)
- Service tags: `shopware.cart.collector`, `shopware.cart.processor`, `shopware.cart.line_item.factory`

## Gotchas

- A query inside `process()` is executed on every recalculation pass of the request.
- The docs call `Shopware\Core\Checkout\Cart\Price` a class; it is a namespace holding several calculator classes.
- `CartDataCollection` lives in the `...\Cart\LineItem` namespace, not directly in `...\Cart`.

## Code check (6.7.15.1)
- confirmed `CartDataCollectorInterface::collect()` — signature with CartDataCollection, original Cart, context, behavior — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:12
- confirmed `CartProcessorInterface::process()` — receives `$original` and `$toCalculate` carts — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- corrected `CartDataCollection` — docs: implied in `Shopware\Core\Checkout\Cart`; class is in `Shopware\Core\Checkout\Cart\LineItem` — vendor/shopware/core/Checkout/Cart/LineItem/CartDataCollection.php:3
- corrected `LineItemFactoryHandler` — docs: "a LineItemFactoryHandler class"; it is a namespace, contract is `LineItemFactoryInterface` — vendor/shopware/core/Checkout/Cart/LineItemFactoryHandler/LineItemFactoryInterface.php:15
- confirmed `shopware.cart.line_item.factory` — tag collected by the factory registry — vendor/shopware/core/Checkout/DependencyInjection/cart.php:612
- confirmed `shopware.cart.processor` — processor service tag, optional priority — vendor/shopware/core/Checkout/DependencyInjection/cart.php:147
- confirmed `shopware.cart.collector` — collector service tag — vendor/shopware/core/Checkout/DependencyInjection/cart.php:148
- corrected `Shopware\Core\Checkout\Cart\Price` — docs: "stored inside the ... Price class"; it is a namespace — vendor/shopware/core/Checkout/Cart/Price/QuantityPriceCalculator.php:3
- confirmed `QuantityPriceCalculator::calculate()` — core price calculator — vendor/shopware/core/Checkout/Cart/Price/QuantityPriceCalculator.php:25
- confirmed `Shopware\Core\Checkout\Cart\SalesChannel` — namespace of cart Store API routes — vendor/shopware/core/Checkout/Cart/SalesChannel/AbstractCartLoadRoute.php:3
