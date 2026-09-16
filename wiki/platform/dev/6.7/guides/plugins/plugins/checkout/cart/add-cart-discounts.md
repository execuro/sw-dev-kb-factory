---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md
sourceHash: a138175e85ba3349386b8e98c01d0ddf27526ed9
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-discounts.html
title: Add Cart Discounts
version: "6.7"
versions:
  - "6.7"
keywords: ["cart discount", "CartProcessorInterface", "PercentagePriceCalculator", "PercentagePriceDefinition", "LineItemRule", "LineItem", "shopware.cart.processor", "discount line item", "percentage discount", "cart processor", "price definition", "surcharge"]
summary: Percentage cart discount via a CartProcessorInterface processor with PercentagePriceDefinition, LineItemRule, PercentagePriceCalculator.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md"]
---
## What it is

A guide for adding a discount to the cart from a plugin using the cart processor pattern: a custom processor finds matching product line items (here: products with "example" in their label) and adds a non-removable percentage discount line item to the cart being calculated.

## When to use

When a plugin needs to reduce (or surcharge) the cart total for certain line items by adding a separate discount line item, rather than overwriting item prices. Service registration basics are in [Add custom service](platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md).

## Key steps / config

1. Create `<plugin root>/src/Core/Checkout/ExampleProcessor.php` implementing `Shopware\Core\Checkout\Cart\CartProcessorInterface`; inject `Shopware\Core\Checkout\Cart\Price\PercentagePriceCalculator` via the constructor.
2. In `process()`, filter `$toCalculate->getLineItems()` to items of type `LineItem::PRODUCT_LINE_ITEM_TYPE` that match your condition; return early if none match.
3. Create the discount `LineItem` and configure it:

```php
class ExampleProcessor implements CartProcessorInterface
{
    public function __construct(private PercentagePriceCalculator $calculator) {}

    public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void
    {
        $item = new LineItem('EXAMPLE_DISCOUNT', 'example_discount', null, 1);
        $item->setLabel('Our example discount!');
        $item->setGood(false); $item->setStackable(false); $item->setRemovable(false);
        $definition = new PercentagePriceDefinition(-10, new LineItemRule(LineItemRule::OPERATOR_EQ, $products->getKeys()));
        $item->setPriceDefinition($definition);
        $item->setPrice($this->calculator->calculate($definition->getPercentage(), $products->getPrices(), $context));
        $toCalculate->add($item);
    }
}
```

4. `PercentagePriceDefinition` takes the percentage (`float`) and an optional filter `Rule`. The price definition lets the core recalculate the price even if the plugin is uninstalled.
5. `LineItemRule` takes an operator (`LineItemRule::OPERATOR_EQ` / `LineItemRule::OPERATOR_NEQ`) and the line item identifiers the discount applies to.
6. Register the service with tag `shopware.cart.processor` and priority `4500` in `services.php`, so it runs after the core product processor (priority `5000`).

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartProcessorInterface` (`process`)
- `Shopware\Core\Checkout\Cart\Price\PercentagePriceCalculator`
- `Shopware\Core\Checkout\Cart\Price\Struct\PercentagePriceDefinition`
- `Shopware\Core\Checkout\Cart\Rule\LineItemRule`
- `Shopware\Core\Checkout\Cart\LineItem\LineItem`, `LineItem::PRODUCT_LINE_ITEM_TYPE`
- DI tag `shopware.cart.processor`, priority `4500`

## Gotchas

- Always modify `Cart $toCalculate`, not `$original`.
- Filter by `LineItem::PRODUCT_LINE_ITEM_TYPE` so custom and promotion line items are not discounted.
- The docs describe `PercentagePriceDefinition` as also taking a currency precision; the installed constructor has only percentage and filter rule.
- Processors run in descending priority: core product processor `5000`, promotion processor `4900`, core custom line item processor `4000`. A priority below `5000` is needed for product prices to exist.

## Code check (6.7.13.0)
- confirmed `CartProcessorInterface::process()` — signature (CartDataCollection, Cart $original, Cart $toCalculate, SalesChannelContext, CartBehavior): void — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- confirmed `PercentagePriceCalculator::calculate()` — (float $percentage, PriceCollection $prices, SalesChannelContext) — vendor/shopware/core/Checkout/Cart/Price/PercentagePriceCalculator.php:33
- corrected `PercentagePriceDefinition::__construct()` — docs: value, currency precision and rules; code: percentage and optional `?Rule $filter` — vendor/shopware/core/Checkout/Cart/Price/Struct/PercentagePriceDefinition.php:23
- confirmed `LineItemRule::__construct()` — operator (default `OPERATOR_EQ`) and identifiers array — vendor/shopware/core/Checkout/Cart/Rule/LineItemRule.php:25
- confirmed `OPERATOR_NEQ` — inherited from Rule base class — vendor/shopware/core/Framework/Rule/Rule.php:24
- confirmed `PRODUCT_LINE_ITEM_TYPE` — value `product` — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:24
- confirmed `LineItem::setStackable()` — exists alongside setGood/setRemovable — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:448
- confirmed `shopware.cart.processor` — product processor registered with priority 5000, so 4500 runs after it — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:355
- corrected `shopware.cart.processor` — docs: product processor defined in cart.php; installed core defines it in cart.xml — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:355
- confirmed `LineItemCollection::getPrices()` — returns PriceCollection used by the calculator — vendor/shopware/core/Checkout/Cart/LineItem/LineItemCollection.php:144
