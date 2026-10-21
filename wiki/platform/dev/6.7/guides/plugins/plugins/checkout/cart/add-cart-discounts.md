---
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md
title: Add Cart Discounts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-discounts.html
sourceHash: a138175e85ba3349386b8e98c01d0ddf27526ed9
codeCheckedAgainst: "6.7.15.1"
keywords: ["cart discount", "CartProcessorInterface", "PercentagePriceCalculator", "PercentagePriceDefinition", "LineItemRule", "shopware.cart.processor", "cart processor", "percentage discount", "LineItem", "rebate", "priority 4500", "ExampleProcessor"]
summary: Add a percentage cart discount via a CartProcessorInterface processor using PercentagePriceDefinition, tagged shopware.cart.processor priority 4500.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md"]
---
## What it is

Guide to adding a discount to the cart with the processor pattern: a custom cart processor (example: `ExampleProcessor`) adds a 10 % discount line item for all product line items whose label contains "example".

## When to use

When a plugin must add a calculated discount (or surcharge) line item to the cart that the core can recalculate on its own.

## Key steps / config

1. Create `<plugin root>/src/Core/Checkout/ExampleProcessor.php` implementing `Shopware\Core\Checkout\Cart\CartProcessorInterface`, injecting `Shopware\Core\Checkout\Cart\Price\PercentagePriceCalculator`.
2. In `process()`, filter `$toCalculate->getLineItems()` for `LineItem::PRODUCT_LINE_ITEM_TYPE` items matching your condition; return early if none.
3. Create the discount line item and attach a price definition plus calculated price, then add it to `$toCalculate`:

```php
class ExampleProcessor implements CartProcessorInterface
{
    public function __construct(private PercentagePriceCalculator $calculator) {}

    public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void
    {
        // $products = filtered product line items; return if empty
        $discount = new LineItem('EXAMPLE_DISCOUNT', 'example_discount', null, 1);
        $discount->setLabel('Our example discount!');
        $discount->setGood(false); $discount->setStackable(false); $discount->setRemovable(false);
        $definition = new PercentagePriceDefinition(-10, new LineItemRule(LineItemRule::OPERATOR_EQ, $products->getKeys()));
        $discount->setPriceDefinition($definition);
        $discount->setPrice($this->calculator->calculate($definition->getPercentage(), $products->getPrices(), $context));
        $toCalculate->add($discount);
    }
}
```

4. Register the service in `services.php` with tag `shopware.cart.processor` and priority `4500` - lower than the core `ProductCartProcessor` (`5000`), so it runs after products are processed. See [Add custom service](platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md).

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartProcessorInterface::process()`
- `Shopware\Core\Checkout\Cart\Price\PercentagePriceCalculator::calculate()`
- `Shopware\Core\Checkout\Cart\Price\Struct\PercentagePriceDefinition` - percentage plus optional filter rule
- `Shopware\Core\Checkout\Cart\Rule\LineItemRule` with `LineItemRule::OPERATOR_EQ` / `LineItemRule::OPERATOR_NEQ` and a list of line item identifiers
- `Shopware\Core\Checkout\Cart\LineItem\LineItem`
- tag `shopware.cart.processor`, priority `4500`

## Gotchas

- The price definition is what lets the core recalculate the discount even if the plugin is uninstalled - always set it, not only the price.
- `PercentagePriceDefinition` takes only the percentage and an optional filter `Rule`; the docs' mention of a currency precision argument does not match 6.7.15.1.
- `LineItemRule`'s constructor is marked `@internal` in core.
- Mark the discount non-stackable and non-removable as in the example; `setGood(false)` keeps it from counting as a product.

## Code check (6.7.15.1)
- confirmed `CartProcessorInterface::process()` — signature matches the snippet — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- confirmed `PercentagePriceCalculator::calculate()` — `(float $percentage, PriceCollection $prices, SalesChannelContext $context)` — vendor/shopware/core/Checkout/Cart/Price/PercentagePriceCalculator.php:33
- corrected `PercentagePriceDefinition` — docs: value, currency precision and rules; code: `$percentage` and optional `?Rule $filter` — vendor/shopware/core/Checkout/Cart/Price/Struct/PercentagePriceDefinition.php:23
- confirmed `LineItemRule` — constructor `($operator, ?array $identifiers)`, `@internal` — vendor/shopware/core/Checkout/Cart/Rule/LineItemRule.php:16
- confirmed `Rule::OPERATOR_EQ` — `'='`, inherited by `LineItemRule` — vendor/shopware/core/Framework/Rule/Rule.php:22
- confirmed `Rule::OPERATOR_NEQ` — `'!='` — vendor/shopware/core/Framework/Rule/Rule.php:24
- confirmed `LineItem::PRODUCT_LINE_ITEM_TYPE` — `'product'` — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:24
- confirmed `LineItem::setStackable()` — exists — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:443
- confirmed `shopware.cart.processor` — `ProductCartProcessor` priority 5000, so 4500 runs after it — vendor/shopware/core/Checkout/DependencyInjection/cart.php:527
