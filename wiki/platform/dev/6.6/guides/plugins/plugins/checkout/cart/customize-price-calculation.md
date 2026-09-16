---
id: platform/dev/6.6/guides/plugins/plugins/checkout/cart/customize-price-calculation.md
title: Customize price calculation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/cart/customize-price-calculation.html"
sourceHash: bca121a75a0283586f618b6843dc356a755f1386
keywords: ["ProductPriceCalculator", "AbstractProductPriceCalculator", "CustomProductPriceCalculator", "calculate method", "getDecorated", "service decoration", "decorates", "services.xml", "SalesChannelProductEntity", "price calculation", "product price", "plugin"]
summary: "Explains decorating ProductPriceCalculator's calculate method via service decoration to globally adjust product price calculation."
lastBuilt: 2026-09-15
---
## What it is
Guide on globally adjusting product price calculation in Shopware by decorating a core service.

## When to use
When a plugin needs to change how prices are calculated for products as a whole, rather than per-line-item in the cart.

## Key steps / config
1. Prerequisite: a plugin base (Plugin Base Guide) and familiarity with service decoration (Adjusting a service guide).
2. Decorate the service `Shopware\Core\Content\Product\SalesChannel\Price\ProductPriceCalculator`, which implements `AbstractProductPriceCalculator` and exposes a `calculate(iterable $products, SalesChannelContext $context)` method.
3. Create a class, e.g. `CustomProductPriceCalculator`, extending `AbstractProductPriceCalculator`, injecting the inner `AbstractProductPriceCalculator` instance via the constructor.
4. Implement `getDecorated(): AbstractProductPriceCalculator` to return the injected inner instance.
5. Override `calculate()`: iterate the `SalesChannelProductEntity` items, modify each product's price (e.g. `$price->first()->setGross()`/`setNet()`), then call `$this->getDecorated()->calculate($products, $context)` to run the original logic.
6. Register the decorator in `services.xml`:
```xml
<service id="Swag\BasicExample\Service\CustomProductPriceCalculator"
         decorates="Shopware\Core\Content\Product\SalesChannel\Price\ProductPriceCalculator">
    <argument type="service" id="Swag\BasicExample\Service\CustomProductPriceCalculator.inner" />
</service>
```

## Essential identifiers
- `Shopware\Core\Content\Product\SalesChannel\Price\ProductPriceCalculator`
- `Shopware\Core\Content\Product\SalesChannel\Price\AbstractProductPriceCalculator`
- `calculate(iterable $products, SalesChannelContext $context)`
- `getDecorated()`
- `decorates` attribute in `services.xml`

## Gotchas
A product can have more than one price, and the "cheapest price" value may also need adjusting — an example that overwrites every product's price the same way is not production-ready.
