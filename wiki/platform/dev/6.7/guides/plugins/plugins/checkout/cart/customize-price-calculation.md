---
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/customize-price-calculation.md
title: Customize Price Calculation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/customize-price-calculation.html
sourceHash: 9cc6670ecc931a4c105acbc561e2f43a07fc49d9
codeCheckedAgainst: "6.7.13.0"
keywords: ["ProductPriceCalculator", "AbstractProductPriceCalculator", "getDecorated", "calculate", "SalesChannelProductEntity", "SalesChannelContext", ".inner", "service decoration", "product price", "price calculation", "custom price", "decorator"]
summary: Decorate ProductPriceCalculator with an AbstractProductPriceCalculator subclass to globally change how product prices are calculated in a plugin.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md"]
---
## What it is

How to globally adjust product price calculation by decorating the single service `Shopware\Core\Content\Product\SalesChannel\Price\ProductPriceCalculator`, whose `calculate` method computes the prices of sales channel products.

## When to use

When all (or a filtered subset of) product prices must be computed differently from the core logic, rather than adding a cart discount or surcharge (see [adding cart discounts](platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md)). Service decoration itself is explained in [adjusting a service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).

## Key steps / config

1. Create a class extending `Shopware\Core\Content\Product\SalesChannel\Price\AbstractProductPriceCalculator`. The base declares two abstract methods you must implement: `getDecorated()` and `calculate()`. Inject the inner calculator and return it from `getDecorated()`.

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
        /* adjust $product->getPrice() per SalesChannelProductEntity ... */
        $this->getDecorated()->calculate($products, $context);
    }
}
```

2. Register the decorator in `<plugin root>/src/Resources/config/services.php`, otherwise it has no effect:

```php
$services->set(CustomProductPriceCalculator::class)
    ->decorate(ProductPriceCalculator::class)
    ->args([service('.inner')]);
```

3. Inside `calculate`, narrow down which products you change — the source example sets every product's first price to gross 100 / net 50 purely as a demonstration.

## Essential identifiers

- `Shopware\Core\Content\Product\SalesChannel\Price\ProductPriceCalculator` (service id = class name)
- `Shopware\Core\Content\Product\SalesChannel\Price\AbstractProductPriceCalculator`
- `AbstractProductPriceCalculator::getDecorated()`, `AbstractProductPriceCalculator::calculate(iterable $products, SalesChannelContext $context): void`
- `Shopware\Core\Content\Product\SalesChannel\SalesChannelProductEntity`
- `service('.inner')`

## Gotchas

- A product can have more than one price; you must consider all of them, and possibly the cheapest price (`getCheapestPrice`) as well.
- Always call `$this->getDecorated()->calculate(...)` so the original calculation still runs.
- The core `ProductPriceCalculator::getDecorated()` throws `DecorationPatternException` — it is the innermost service.
- The base class implements `ResetInterface`; its `reset()` delegates to `getDecorated()->reset()`, so the decorated chain must be valid.
- In 6.7 the core `calculate` publishes `ProductPriceCalculationExtension` via the `ExtensionDispatcher`, and core already decorates the service with `AppScriptProductPriceCalculator`.

## Code check (6.7.13.0)
- confirmed `AbstractProductPriceCalculator` — abstract base implementing ResetInterface — vendor/shopware/core/Content/Product/SalesChannel/Price/AbstractProductPriceCalculator.php:11
- confirmed `AbstractProductPriceCalculator::getDecorated()` — abstract, must be implemented — vendor/shopware/core/Content/Product/SalesChannel/Price/AbstractProductPriceCalculator.php:18
- confirmed `AbstractProductPriceCalculator::calculate()` — abstract, signature `iterable $products, SalesChannelContext $context): void` — vendor/shopware/core/Content/Product/SalesChannel/Price/AbstractProductPriceCalculator.php:23
- confirmed `AbstractProductPriceCalculator::reset()` — concrete, delegates to decorated — vendor/shopware/core/Content/Product/SalesChannel/Price/AbstractProductPriceCalculator.php:13
- confirmed `ProductPriceCalculator` — core class extends the abstract base — vendor/shopware/core/Content/Product/SalesChannel/Price/ProductPriceCalculator.php:29
- confirmed `ProductPriceCalculator::getDecorated()` — throws DecorationPatternException — vendor/shopware/core/Content/Product/SalesChannel/Price/ProductPriceCalculator.php:47
- confirmed `ProductPriceCalculationExtension` — published inside core calculate — vendor/shopware/core/Content/Product/SalesChannel/Price/ProductPriceCalculator.php:57
- confirmed `Shopware\Core\Content\Product\SalesChannel\Price\ProductPriceCalculator` — service id registered by class name — vendor/shopware/core/Content/DependencyInjection/product.xml:304
- confirmed `AppScriptProductPriceCalculator` — core decorator of ProductPriceCalculator — vendor/shopware/core/Content/DependencyInjection/product.xml:312
