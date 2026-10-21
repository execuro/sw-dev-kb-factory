---
id: platform/dev/6.7/resources/references/app-reference/script-reference/product-script-services-reference.md
title: Product script services reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/product-script-services-reference.html
sourceHash: 94c03d2ec7673eac69b13d35a55e99a2ffd120b0
codeCheckedAgainst: "6.7.15.1"
keywords: ["CheapestPriceFacade", "PriceCollectionFacade", "ProductProxy", "calculatedCheapestPrice", "calculatedPrice", "calculatedPrices", "PriceFacade", "PriceCollection", "SalesChannelProductEntity", "product pricing", "quantity prices", "graduated prices", "cheapest price", "app scripts"]
summary: Script facades for product pricing in app scripts - ProductProxy, CheapestPriceFacade and PriceCollectionFacade with change/reset/discount/plus/minus methods.
lastBuilt: 2026-10-21
---
## What it is

Reference for the product-related facades used in app scripts that manipulate product prices: `Shopware\Core\Content\Product\Hook\Pricing\ProductProxy` (wrapper around `SalesChannelProductEntity`), `Shopware\Core\Content\Product\Hook\Pricing\CheapestPriceFacade` (wrapper around the cheapest price) and `Shopware\Core\Content\Product\Hook\Pricing\PriceCollectionFacade` (wrapper around the quantity/graduated price collection).

## When to use

When an app script (product pricing hook) needs to overwrite, discount or surcharge a product's calculated price, its cheapest price, or its graduated quantity prices before the storefront displays them.

## Key steps / config

### `ProductProxy`

- `__get(name)` gives access to every property of `SalesChannelProductEntity`.
- `calculatedPrice` returns a `Shopware\Core\Checkout\Cart\Facade\PriceFacade` (or `null`).
- `calculatedCheapestPrice` returns the cheapest price wrapped in a facade (or `null`).
- `calculatedPrices` returns a `PriceCollectionFacade` if the product has graduated prices, otherwise `null`.

### `CheapestPriceFacade`

Extends `PriceFacade`, so it carries the price methods below, plus:

- `change(price, range = false)` — overwrites the cheapest price of the current price scope; `price` may be a `PriceFacade`, `PriceCollection`, `CalculatedPrice` or `null` (null = original single price of the product). `range` toggles the `hasRange` attribute. The price is recalculated via the quantity price calculator (quantity, tax rule, cash rounding).
- `reset()` — resets the cheapest price to the product's original price.

Price methods (on `calculatedPrice` / `calculatedCheapestPrice`):

| Method | Effect / return |
|---|---|
| `create(array price)` | new `Shopware\Core\Framework\DataAbstractionLayer\Pricing\PriceCollection`, keyed by currency id or ISO code (`default` for default currency) |
| `plus(PriceCollection)` / `minus(PriceCollection)` | adds/subtracts a unit price, then recalculates total |
| `discount(float)` / `surcharge(float)` | percentage applied to unit and total price |
| `getTotal()`, `getUnit()` | `float` |
| `getQuantity()` | `int` |
| `getTaxes()` / `getRules()` | `CalculatedTaxCollection` / `TaxRuleCollection` |

```twig
{% set price = services.price.create({ 'default': { 'gross': 15, 'net': 15 } }) %}
{% do variant.calculatedCheapestPrice.change(price) %}
{% do product.calculatedPrice.discount(10) %}
{% do product.calculatedPrice.plus(price) %}
```

### `PriceCollectionFacade`

- `change(array changes)` — complete overwrite of the quantity prices; each entry has `to` (upper quantity, `null` for the last tier) and `price`.
- `count()` — number of prices in the collection.
- `reset()` — resets the whole collection.

```twig
{% do product.calculatedPrices.change([
    { to: 20, price: services.price.create({ 'default': { 'gross': 15, 'net': 15} }) },
    { to: null, price: services.price.create({ 'default': { 'gross': 5, 'net': 5} }) },
]) %}
```

## Essential identifiers

- `Shopware\Core\Content\Product\Hook\Pricing\ProductProxy`
- `Shopware\Core\Content\Product\Hook\Pricing\CheapestPriceFacade`
- `Shopware\Core\Content\Product\Hook\Pricing\PriceCollectionFacade`
- `Shopware\Core\Checkout\Cart\Facade\PriceFacade`
- `Shopware\Core\Framework\DataAbstractionLayer\Pricing\PriceCollection`
- `services.price.create()`

## Gotchas

- `discount()` forces the value negative via `abs(value) * -1`; `surcharge()` forces it positive via `abs(value)` (the source text says "negative" for surcharge, but the formula is `abs(value)`).
- `plus()`/`minus()` interpret the given price as a unit price; the total is recalculated from it.
- The source's `reset()` example for the cheapest price actually shows a `change(price)` call, and its `__get()` example is a fragment of the `change()` example; rely on the method descriptions instead.

## Code check (6.7.15.1)
- confirmed `CheapestPriceFacade::change()` — `change(PriceFacade|PriceCollection|CalculatedPrice|null $price, bool $range = false)` — vendor/shopware/core/Content/Product/Hook/Pricing/CheapestPriceFacade.php:63
- confirmed `CheapestPriceFacade::reset()` — resets to original price — vendor/shopware/core/Content/Product/Hook/Pricing/CheapestPriceFacade.php:47
- confirmed `CheapestPriceFacade` — `extends PriceFacade` — vendor/shopware/core/Content/Product/Hook/Pricing/CheapestPriceFacade.php:23
- confirmed `PriceFacade::discount()` — `discount(float $value)` with `abs()` — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:174
- confirmed `PriceFacade::surcharge()` — `surcharge(float $value)` — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:200
- confirmed `PriceFacade::plus()` — takes `PriceCollection` — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:131
- confirmed `PriceFactoryTrait::create()` — `create(array $price): PriceCollection`, used by `PriceFacade` — vendor/shopware/core/Checkout/Cart/Facade/Traits/PriceFactoryTrait.php:23
- confirmed `PriceCollectionFacade::change()` — `change(array $changes)` — vendor/shopware/core/Content/Product/Hook/Pricing/PriceCollectionFacade.php:52
- confirmed `ProductProxy::calculatedPrices()` — returns `?PriceCollectionFacade` — vendor/shopware/core/Content/Product/Hook/Pricing/ProductProxy.php:113
- confirmed `ProductProxy::__get()` — `__get(string $name): mixed` — vendor/shopware/core/Content/Product/Hook/Pricing/ProductProxy.php:40
