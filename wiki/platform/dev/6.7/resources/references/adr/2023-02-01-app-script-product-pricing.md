---
id: platform/dev/6.7/resources/references/adr/2023-02-01-app-script-product-pricing.md
title: App script product pricing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-02-01-app-script-product-pricing.html
sourceHash: a58a74df536ed3a7352d89e093c00a209393701e
codeCheckedAgainst: "6.7.15.1"
keywords: ["product-pricing", "ProductPricingHook", "PriceFacade", "CheapestPriceFacade", "PriceCollectionFacade", "services.price.create", "calculatedPrice", "calculatedCheapestPrice", "calculatedPrices", "app scripts", "price manipulation", "graduated prices", "cart line item price", "adr"]
summary: "ADR: app scripts set product prices directly in the product-pricing hook and on cart items via price facades (change, plus, minus, discount)."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-02-01) that lets app scripts manipulate product prices directly, both in the store (product listing/detail pricing) and in the cart. Before, the cart hook could only add discounts or new price line items; business cases such as "get a sample of the product for free" need a direct price change.

## When to use

- An app needs to set, add to, subtract from, discount or surcharge a product's calculated price, its graduated prices or its cheapest price.
- An app needs to change the price of a product line item already in the cart.

## Key steps / config

Product pricing runs in the `product-pricing` hook (`Shopware\Core\Content\Product\Hook\Pricing\ProductPricingHook`). `hook.products` yields product proxies whose `calculatedPrice`, `calculatedPrices` and `calculatedCheapestPrice` are wrapped in price facades. Prices are built with `services.price.create(...)`, keyed by `default` or a currency ISO code, each with `gross`/`net`.

```twig
{% foreach hook.products as product %}
    {% set price = services.price.create({
       'default': { 'gross': 20, 'net': 20 },
       'EUR': { 'gross': 10, 'net': 10 }
    }) %}
    {% do product.calculatedPrice.change(price) %}
    {% do product.calculatedPrices.change([
        { to: 20, price: services.price.create({ 'default': { 'gross': 15, 'net': 15 } }) },
        { to: null, price: services.price.create({ 'default': { 'gross': 5, 'net': 5 } }) }
    ]) %}
    {% do product.calculatedCheapestPrice.discount(10) %}
{% endforeach %}
```

Available operations:

- `calculatedPrice` / `calculatedCheapestPrice` (a `PriceFacade`; the cheapest one a `CheapestPriceFacade`): `change(price)`, `plus(price)`, `minus(price)`, `discount(percent)`, `surcharge(percent)`.
- `calculatedCheapestPrice.reset` — resets the cheapest price to the product's original price.
- `calculatedPrices` (a `PriceCollectionFacade`): `reset` clears graduated prices; `change([...])` replaces them with entries of `to` (quantity upper bound, `null` for open end) and `price`.

Cart manipulation uses the same price facade on a line item:

```twig
{% set product = services.cart.get('my-product-id') %}
{% set price = services.price.create({ 'default': { 'gross': 20, 'net': 20 } }) %}
{% do product.price.change(price) %}
{% do product.price.discount(10) %}
```

## Essential identifiers

- `product-pricing` — hook name (`ProductPricingHook::HOOK_NAME`)
- `Shopware\Core\Content\Product\Hook\Pricing\ProductPricingHook`
- `Shopware\Core\Checkout\Cart\Facade\PriceFacade` — `change()`, `plus()`, `minus()`, `discount()`, `surcharge()`
- `Shopware\Core\Content\Product\Hook\Pricing\CheapestPriceFacade` — `reset()`, `change()`
- `Shopware\Core\Content\Product\Hook\Pricing\PriceCollectionFacade` — `reset()`, `change()`
- `services.price.create()` — `PriceFactory::create()`
- `services.cart.get()` — returns an item facade with `price`

## Gotchas

- The ADR writes `services.prices.create(...)`; the installed price factory service is registered as `price`, so the call is `services.price.create(...)`.
- The default single price (`calculatedPrice`) has no reset — the ADR notes resetting it would leave the product without a valid price. Only `calculatedPrices` and `calculatedCheapestPrice` can be reset.
- After changing graduated prices, the ADR notes the "from/to" values are fixed up after the hook runs.
- Product proxies are read-only: setting or unsetting a property on `product` throws.

## Version notes

- `ProductPricingHook` is marked `@since 6.5.1.0`.

## Code check (6.7.15.1)
- confirmed `product-pricing` — HOOK_NAME of ProductPricingHook — vendor/shopware/core/Content/Product/Hook/Pricing/ProductPricingHook.php:26
- confirmed `getProducts` — backs hook.products — vendor/shopware/core/Content/Product/Hook/Pricing/ProductPricingHook.php:43
- corrected `price` — docs: services.prices; factory service name is 'price' — vendor/shopware/core/Checkout/Cart/Facade/PriceFactoryFactory.php:27
- confirmed `PriceFactory::create()` — builds a PriceCollection from the price map — vendor/shopware/core/Checkout/Cart/Facade/PriceFactory.php:33
- confirmed `PriceFacade::change()` — overwrite with a PriceCollection — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:109
- confirmed `PriceFacade::plus()` — add a PriceCollection — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:131
- confirmed `PriceFacade::discount()` — percentage discount; minus/surcharge alongside — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:174
- confirmed `CheapestPriceFacade::reset()` — resets to original price — vendor/shopware/core/Content/Product/Hook/Pricing/CheapestPriceFacade.php:47
- confirmed `PriceCollectionFacade::change()` — replaces graduated prices — vendor/shopware/core/Content/Product/Hook/Pricing/PriceCollectionFacade.php:52
- confirmed `ItemFacade::getPrice()` — backs product.price on cart items — vendor/shopware/core/Checkout/Cart/Facade/ItemFacade.php:35
