---
id: platform/dev/6.7/resources/references/app-reference/script-reference/product-script-services-reference.md
title: Product script services reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/product-script-services-reference.html
sourceHash: 94c03d2ec7673eac69b13d35a55e99a2ffd120b0
codeCheckedAgainst: "6.7.13.0"
keywords: ["CheapestPriceFacade", "PriceCollectionFacade", "ProductProxy", "PriceFacade", "calculatedCheapestPrice", "calculatedPrice", "calculatedPrices", "product-pricing", "product pricing hook", "graduated prices", "quantity prices", "app scripts price manipulation"]
summary: "App script product pricing facades: CheapestPriceFacade, PriceCollectionFacade, ProductProxy methods to change product, cheapest and graduated prices."
lastBuilt: 2026-09-15
---
## What it is

Reference for the script facades used to manipulate product prices in app scripts: `CheapestPriceFacade` (cheapest price), `PriceCollectionFacade` (graduated/quantity prices) and `ProductProxy` (wrapper around `SalesChannelProductEntity` that exposes prices as facades).

## When to use

Use in a product pricing script (the `product-pricing` hook, `ProductPricingHook`) to overwrite, discount, surcharge or reset a product's calculated price, cheapest price or quantity price graduation.

## Key steps / config

### `Shopware\Core\Content\Product\Hook\Pricing\ProductProxy`

- `__get(name)` — access any property of `SalesChannelProductEntity`.
- `calculatedPrice` — returns `Shopware\Core\Checkout\Cart\Facade\PriceFacade` or `null`.
- `calculatedCheapestPrice` — returns a `PriceFacade` (a `CheapestPriceFacade` instance) or `null`.
- `calculatedPrices` — returns `PriceCollectionFacade` or `null` when no graduated prices exist.

### `Shopware\Core\Content\Product\Hook\Pricing\CheapestPriceFacade` (extends `PriceFacade`)

- `change(PriceFacade|PriceCollection|CalculatedPrice|null price, bool range = false)` — overwrite the cheapest price; recalculated via the quantity price calculator (quantity, tax rule, cash rounding). `null` uses the product's original price; `range` toggles `hasRange`.
- `reset()` — reset to the product's original price (calls `change(null)`).
- Inherited from `PriceFacade`: `create(array price)` → `Shopware\Core\Framework\DataAbstractionLayer\Pricing\PriceCollection` (prices keyed by currency id or ISO code, or `default`); `plus(PriceCollection)` / `minus(PriceCollection)` — unit price added/subtracted, total recalculated; `discount(float)` / `surcharge(float)` — percentage applied to unit and total price; getters `getTotal()`, `getUnit()`, `getQuantity()`, `getTaxes()` (`CalculatedTaxCollection`), `getRules()` (`TaxRuleCollection`).

```twig
{% set price = services.price.create({
    'default': { 'gross': 15, 'net': 15}
}) %}
{% do variant.calculatedCheapestPrice.change(price) %}
{% do product.calculatedPrice.discount(10) %}
{% do product.calculatedPrice.plus(price) %}
```

### `Shopware\Core\Content\Product\Hook\Pricing\PriceCollectionFacade`

- `change(array changes)` — full overwrite of quantity prices; each entry `{ to, price }`, last entry `to: null`.
- `count()` — number of prices; `reset()` — clears the collection. Iterating yields `PriceFacade` objects.

```twig
{% do product.calculatedPrices.change([
    { to: 20, price: services.price.create({ 'default': { 'gross': 15, 'net': 15} }) },
    { to: null, price: services.price.create({ 'default': { 'gross': 5, 'net': 5} }) },
]) %}
```

## Essential identifiers

- `Shopware\Core\Content\Product\Hook\Pricing\CheapestPriceFacade`
- `Shopware\Core\Content\Product\Hook\Pricing\PriceCollectionFacade`
- `Shopware\Core\Content\Product\Hook\Pricing\ProductProxy`
- `Shopware\Core\Checkout\Cart\Facade\PriceFacade`
- `Shopware\Core\Framework\DataAbstractionLayer\Pricing\PriceCollection`
- `SalesChannelProductEntity`

## Gotchas

- `discount()` always subtracts and `surcharge()` always adds: both take `abs(value)` as the percentage, so the argument's sign is ignored. The source text wrongly says surcharge is "ensured to be negative".
- The source's `reset()` example shows a `change(price)` call; the actual method is `reset()` with no arguments.
- `CheapestPriceFacade::change()` throws when the item is not an entity or has no calculated cheapest price.
- `PriceFacade::change()` (base) accepts only `PriceCollection`; the cheapest-price override accepts more types.

## Code check (6.7.13.0)
- confirmed `CheapestPriceFacade::change()` — `PriceFacade|PriceCollection|CalculatedPrice|null $price, bool $range = false` — vendor/shopware/core/Content/Product/Hook/Pricing/CheapestPriceFacade.php:63
- confirmed `CheapestPriceFacade::reset()` — delegates to `change(null)` — vendor/shopware/core/Content/Product/Hook/Pricing/CheapestPriceFacade.php:47
- confirmed `PriceFacade` — base class of `CheapestPriceFacade` — vendor/shopware/core/Content/Product/Hook/Pricing/CheapestPriceFacade.php:23
- confirmed `PriceFactoryTrait::create()` — `create()` inherited via trait used by `PriceFacade` — vendor/shopware/core/Checkout/Cart/Facade/Traits/PriceFactoryTrait.php:23
- confirmed `PriceFacade::discount()` — subtracts the `abs($value)` percentage — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:174
- corrected `PriceFacade::surcharge()` — docs: value ensured negative; code uses `abs($value)` and adds — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:200
- confirmed `PriceFacade::plus()` — `plus(PriceCollection $price)` — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:131
- confirmed `PriceCollectionFacade::change()` — `change(array $changes)` with `{to, price}` entries — vendor/shopware/core/Content/Product/Hook/Pricing/PriceCollectionFacade.php:52
- confirmed `ProductProxy::calculatedPrices()` — returns `?PriceCollectionFacade` — vendor/shopware/core/Content/Product/Hook/Pricing/ProductProxy.php:113
- confirmed `ProductPricingHook::HOOK_NAME` — `product-pricing` — vendor/shopware/core/Content/Product/Hook/Pricing/ProductPricingHook.php:26
