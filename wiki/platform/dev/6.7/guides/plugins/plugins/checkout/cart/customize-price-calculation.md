---
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/customize-price-calculation.md
title: Customize Price Calculation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/customize-price-calculation.html
sourceHash: 9cc6670ecc931a4c105acbc561e2f43a07fc49d9
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractProductPriceCalculator", "ProductPriceCalculator", "SalesChannelProductEntity", "getDecorated", "calculate", "decorate", ".inner", "service decoration", "product price calculation", "custom product price", "getCheapestPrice", "price override"]
summary: Globally change product price calculation by decorating ProductPriceCalculator with an AbstractProductPriceCalculator subclass.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md"]
---
## What it is

How to adjust the calculation of product prices for the whole shop by decorating the single service `Shopware\Core\Content\Product\SalesChannel\Price\ProductPriceCalculator` and overriding its `calculate` method.

## When to use

You want to change how sales channel product prices are calculated globally. For cart-level price reductions or surcharges, see [adding cart discounts](platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md) instead. Decoration basics: [adjusting a service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).

## Key steps / config

1. Create a decorator extending `Shopware\Core\Content\Product\SalesChannel\Price\AbstractProductPriceCalculator`; take the inner calculator in the constructor, return it from `getDecorated()`, and call it from `calculate()`:

```php
class CustomProductPriceCalculator extends AbstractProductPriceCalculator
{
    public function __construct(private AbstractProductPriceCalculator $productPriceCalculator) {}

    public function getDecorated(): AbstractProductPriceCalculator
    {
        return $this->productPriceCalculator;
    }

    public function calculate(iterable $products, SalesChannelContext $context): void
    {
        /** @var SalesChannelProductEntity $product */
        foreach ($products as $product) {
            $product->getPrice()->first()->setGross(100); // example only
        }
        $this->getDecorated()->calculate($products, $context);
    }
}
```

2. Register the decoration in `services.php`:

```php
$services->set(CustomProductPriceCalculator::class)
    ->decorate(ProductPriceCalculator::class)
    ->args([service('.inner')]);
```

## Essential identifiers

- `Shopware\Core\Content\Product\SalesChannel\Price\AbstractProductPriceCalculator` (`getDecorated`, `calculate`)
- `Shopware\Core\Content\Product\SalesChannel\Price\ProductPriceCalculator` (service id = class name)
- `Shopware\Core\Content\Product\SalesChannel\SalesChannelProductEntity`
- `service('.inner')`

## Gotchas

- Without registering the decorator in the service container it has no effect.
- The example sets every product to the same price; narrow down which products you change.
- A product can have more than one price, and the cheapest price (`getCheapestPrice`) may also need adjusting.
- `ProductPriceCalculator::getDecorated()` itself throws `DecorationPatternException` — do not call `getDecorated()` on the core service, only on your inner instance.

## Code check (6.7.15.1)
- confirmed `AbstractProductPriceCalculator::getDecorated()` — abstract — vendor/shopware/core/Content/Product/SalesChannel/Price/AbstractProductPriceCalculator.php:18
- confirmed `AbstractProductPriceCalculator::calculate()` — abstract, `(iterable $products, SalesChannelContext $context): void` — vendor/shopware/core/Content/Product/SalesChannel/Price/AbstractProductPriceCalculator.php:23
- confirmed `ProductPriceCalculator` — extends `AbstractProductPriceCalculator` — vendor/shopware/core/Content/Product/SalesChannel/Price/ProductPriceCalculator.php:29
- confirmed `ProductPriceCalculator::getDecorated()` — throws `DecorationPatternException` — vendor/shopware/core/Content/Product/SalesChannel/Price/ProductPriceCalculator.php:47
- confirmed `ProductPriceCalculator::calculate()` — core implementation to decorate — vendor/shopware/core/Content/Product/SalesChannel/Price/ProductPriceCalculator.php:53
- confirmed `ProductPriceCalculator` — service registered under its class name — vendor/shopware/core/Content/DependencyInjection/product.php:483
- unverified `.inner` — Symfony decoration convention, vendor/symfony out of scope
