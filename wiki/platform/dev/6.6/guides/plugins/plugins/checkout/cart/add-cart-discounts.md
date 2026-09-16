---
id: platform/dev/6.6/guides/plugins/plugins/checkout/cart/add-cart-discounts.md
title: Add cart discounts
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/cart/add-cart-discounts.html"
sourceHash: fa178d6693c57c1e1fc3329b4d721760deb78e95
keywords: ["ExampleProcessor", "CartProcessorInterface", "PercentagePriceCalculator", "PercentagePriceDefinition", "LineItemRule", "process method", "shopware.cart.processor", "priority 4500", "cart discount", "line item", "services.xml", "cart processor"]
summary: "Shows how to add a percentage cart discount via a custom CartProcessorInterface implementation registered as shopware.cart.processor."
lastBuilt: 2026-09-15
---
## What it is
Guide showing how to add a percentage discount to the cart from a plugin using the cart processor pattern.

## When to use
When a plugin needs to programmatically add a discount line item to the cart, e.g. a percentage-off discount for products matching a condition.

## Key steps / config
1. Have a plugin base (Plugin Base Guide) and be familiar with service registration.
2. Create a class (e.g. `ExampleProcessor`) in `<plugin root>/src/Core/Checkout` implementing `Shopware\Core\Checkout\Cart\CartProcessorInterface`.
3. Inject `Shopware\Core\Checkout\Cart\Price\PercentagePriceCalculator` into the constructor.
4. In `process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior)`, filter line items of type `LineItem::PRODUCT_LINE_ITEM_TYPE` whose label matches your condition (early-return if none found).
5. Create a new `LineItem` for the discount, marking it not stackable and not removable (`setStackable(false)`, `setRemovable(false)`).
6. Build a `PercentagePriceDefinition` with a percentage value and a `LineItemRule` (`LineItemRule::OPERATOR_EQ` or `LineItemRule::OPERATOR_NEQ`, plus the line item identifiers the rule applies to), then call `setPriceDefinition()` on the discount line item.
7. Calculate the price via `PercentagePriceCalculator::calculate($definition->getPercentage(), $products->getPrices(), $context)` and `setPrice()` it on the discount line item.
8. Add the discount to the cart with `$toCalculate->add($discountLineItem)`.
9. Register the processor class in `services.xml` with the tag `shopware.cart.processor` and priority `4500` (runs after the core product processor).

## Essential identifiers
- `Shopware\Core\Checkout\Cart\CartProcessorInterface`
- `Shopware\Core\Checkout\Cart\Price\PercentagePriceCalculator`
- `Shopware\Core\Checkout\Cart\Price\Struct\PercentagePriceDefinition`
- `Shopware\Core\Checkout\Cart\Rule\LineItemRule`
- tag `shopware.cart.processor`, priority `4500`

## Gotchas
The `PercentagePriceDefinition` is required so the cart can recalculate the discount price even if the plugin that provided it is later uninstalled.
