---
id: platform/dev/6.7/resources/references/adr/2023-02-01-app-script-product-pricing.md
title: App script product pricing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-02-01-app-script-product-pricing.html
sourceHash: a58a74df536ed3a7352d89e093c00a209393701e
codeCheckedAgainst: "6.7.13.0"
keywords: ["product-pricing", "ProductPricingHook", "app script", "price manipulation", "calculatedPrice", "calculatedPrices", "calculatedCheapestPrice", "PriceFacade", "CheapestPriceFacade", "PriceCollectionFacade", "PriceFactory", "graduated prices", "discount", "surcharge"]
summary: "ADR: product-pricing app script hook lets apps reset or change product prices via calculatedPrice/calculatedPrices/calculatedCheapestPrice facades."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record introducing direct price manipulation from app scripts: a `product-pricing` hook for store product prices, and price facades on cart line items. Previously, scripts could only add discount or price line items to the cart, not change an item's price (business case example: "get a sample of the product for free").

## When to use

When an app script must override, reduce, raise, or re-graduate a product's calculated price in the store or a product line item's price in the cart.

## Key steps / config

1. Register a script for the `product-pricing` hook (`Shopware\Core\Content\Product\Hook\Pricing\ProductPricingHook`). It exposes `hook.products` (product proxies) and, among its services, the price factory.
2. Build price objects with the price factory service `services.price.create({...})`, keyed by `default` or a currency (ISO code or ID), each with `gross`/`net`.
3. Manipulate the per-product price objects:

```twig
{% foreach hook.products as product %}
    {% set price = services.price.create({ 'default': { 'gross': 20, 'net': 20 }, 'EUR': { 'gross': 10, 'net': 10 } }) %}
    {% do product.calculatedPrice.change(price) %}   {# also plus(price), minus(price), discount(10), surcharge(10) #}
    {% do product.calculatedPrices.reset %}
    {% do product.calculatedPrices.change([
        { to: 20, price: services.price.create({ 'default': { 'gross': 15, 'net': 15 } }) },
        { to: null, price: services.price.create({ 'default': { 'gross': 5, 'net': 5 } }) },
    ]) %}
    {% do product.calculatedCheapestPrice.change(price) %}   {# also reset, plus, minus, discount, surcharge #}
{% endforeach %}
```

4. Inside a cart script, fetch a line item and change its price: `{% set product = services.cart.get('my-product-id') %}` then `{% do product.price.change(price) %}`, `product.price.discount(10)`, `product.price.surcharge(10)`.

## Essential identifiers

- `product-pricing` (hook name), `ProductPricingHook`
- `PriceFacade::change()`, `plus()`, `minus()`, `discount()`, `surcharge()`
- `PriceCollectionFacade::reset()`, `PriceCollectionFacade::change()` (graduated prices)
- `CheapestPriceFacade::reset()`, `CheapestPriceFacade::change()`
- `PriceFactory::create()` (script service `price`)
- `services.cart.get()` returning an item whose `price` is a `PriceFacade`

## Gotchas

- The ADR writes `services.prices.create(...)`; the installed factory registers the script service as `price`.
- `calculatedPrices.change([...])` requires one entry with `to: null` (the open-ended tier); without it the facade throws an invalid price definition exception.
- The ADR notes the default price (`calculatedPrice`) must not be reset, only changed; `reset` exists for `calculatedPrices` and `calculatedCheapestPrice`.
- `discount()`/`surcharge()` take a percentage; `plus()`/`minus()` take a price collection interpreted as a unit price.
- `CheapestPriceFacade::change()` also accepts `null` (original product price) and a second `range` flag.

## Version notes

- `ProductPricingHook` is annotated `@since 6.5.1.0`.

## Code check (6.7.13.0)
- confirmed `ProductPricingHook::HOOK_NAME` — value `product-pricing` — vendor/shopware/core/Content/Product/Hook/Pricing/ProductPricingHook.php:26
- corrected `PriceFactoryFactory::getName()` — docs: service `services.prices`; code returns `price` — vendor/shopware/core/Checkout/Cart/Facade/PriceFactoryFactory.php:25
- confirmed `PriceFactory::create()` — builds a PriceCollection from a currency-keyed array — vendor/shopware/core/Checkout/Cart/Facade/PriceFactory.php:33
- confirmed `ProductProxy::__get()` — exposes calculatedPrice/calculatedPrices/calculatedCheapestPrice as facades — vendor/shopware/core/Content/Product/Hook/Pricing/ProductProxy.php:40
- confirmed `PriceFacade::change()` — takes a PriceCollection — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:109
- confirmed `PriceFacade::plus()` — adds to unit price — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:131
- confirmed `PriceFacade::minus()` — subtracts from unit price — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:153
- confirmed `PriceFacade::discount()` — percentage value; `surcharge()` follows at line 200 — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:174
- confirmed `PriceCollectionFacade::change()` — throws when no `to: null` entry — vendor/shopware/core/Content/Product/Hook/Pricing/PriceCollectionFacade.php:52
- confirmed `CheapestPriceFacade::reset()` — resets to original price via change(null) — vendor/shopware/core/Content/Product/Hook/Pricing/CheapestPriceFacade.php:47
