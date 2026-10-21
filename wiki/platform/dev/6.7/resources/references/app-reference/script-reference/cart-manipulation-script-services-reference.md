---
id: platform/dev/6.7/resources/references/app-reference/script-reference/cart-manipulation-script-services-reference.md
title: Cart Manipulation script services reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/cart-manipulation-script-services-reference.html
sourceHash: 3af77edf4675bf6c096053126c083b79f1a1d7a3
codeCheckedAgainst: "6.7.15.1"
keywords: ["services.cart", "services.price", "CartFacade", "ItemFacade", "ItemsFacade", "ProductsFacade", "PriceFacade", "CartPriceFacade", "ErrorsFacade", "StatesFacade", "DiscountFacade", "ContainerFacade", "cart script", "discount", "surcharge"]
summary: Methods of the services.cart and services.price app script facades - line items, products, discounts, surcharges, prices, cart errors and states.
lastBuilt: 2026-10-21
---
## What it is

Reference of the script services for cart manipulation in app scripts: `services.cart` (`Shopware\Core\Checkout\Cart\Facade\CartFacade`), `services.price` (`Shopware\Core\Checkout\Cart\Facade\PriceFactory`) and the facade objects they return. Type hint in script Twig files with `{# @var services \Shopware\Core\Framework\Script\ServiceStubs #}`.

## When to use

In cart-aware script hooks when adding/removing line items, splitting quantities, creating discounts or surcharges, overwriting prices, or adding cart errors and states.

## Key steps / config

### `services.cart` — `CartFacade`

- `items()` → `ItemsFacade`; `products()` → `ProductsFacade` (product line items only).
- `get(id)`, `has(id|ItemFacade)`, `remove(id|ItemFacade)`, `count()` — on direct line items only (children not counted).
- `discount(key, type, value, label)` / `surcharge(key, type, value, label)` → `DiscountFacade`. `type` is `percentage` (float value) or `absolute` (`PriceCollection` value).
- `price()` → `CartPriceFacade`; `errors()` → `ErrorsFacade`; `states()` → `StatesFacade`.
- `calculate()` — recalculates the whole cart; all collections get new references afterwards. Called automatically after the cart script ran.

```twig
{% do services.cart.products.add(hook.ids.get('p1')) %}
{% if services.cart.has('my-discount') %}{% return %}{% endif %}
{% set price = services.cart.price.create({
    'default': { 'gross': -19.99, 'net': -19.99}
}) %}
{% do services.cart.discount('my-discount', 'absolute', price, 'Fancy discount') %}
{% do services.cart.surcharge('my-surcharge', 'percentage', -10, 'Fancy discount') %}
```

### Price objects

- `CartPriceFacade`: `create(price)` → `PriceCollection`; `getTotal()` (rounded, what the customer pays), `getRounded()` (alias), `getRaw()` (before rounding), `getNet()`, `getPosition()` (line items only, no shipping).
- `PriceFacade` (line-item price): `getTotal()`, `getUnit()`, `getQuantity()`, `getTaxes()` → `CalculatedTaxCollection`, `getRules()` → `TaxRuleCollection`, `create(price)`; `change(PriceCollection)` overwrites the price, `plus(PriceCollection)` / `minus(PriceCollection)` add/subtract a unit price, `discount(float)` / `surcharge(float)` apply a percentage. All recalculate via the quantity price calculator (quantity, tax rules, cash rounding).
- `services.price.create(prices)` (`PriceFactory`) → `Shopware\Core\Framework\DataAbstractionLayer\Pricing\PriceCollection`, indexed by currency id or ISO code (`'default'` for the default currency).

### Line items

- `ItemFacade`: `getId()`, `getReferencedId()`, `getQuantity()`, `getLabel()`, `getPayload()` → `ArrayFacade`, `getPrice()` → `PriceFacade|null`, `getChildren()` → `ItemsFacade`, `getType()` (`product`, `discount`, `container`, ...), `take(quantity, key = null)` → split-off `ItemFacade|null`.
- `ItemsFacade`: `add(ItemFacade)`, `get()`, `has()`, `remove()`, `count()`.
- `ProductsFacade`: `add(product, quantity = 1)` (product id, `LineItem` or `ItemFacade`), `create(productId, quantity = 1)` (not added automatically), `get(productId)`, `has()`, `remove()`, `count()`.
- `ContainerFacade` (extends `ItemFacade`): `add(ItemFacade)`, `products()`, `get()`, `has()`, `remove()`, `count()`, `discount()`, `surcharge()`.
- `DiscountFacade`: `getId()`, `getLabel()` — independent of the added line item.

### Errors and states

- `ErrorsFacade`: `error(key, id = null, parameters = [])` blocks checkout; `warning(...)` and `notice(...)` are displayed without blocking; `resubmittable(...)` blocks but lets the customer resubmit; `has(id)`, `get(id)` → `Shopware\Core\Checkout\Cart\Error\Error|null`, `remove(id)`. `key` is a snippet key; `id` defaults to `key`.
- `StatesFacade`: `add(...states)`, `has(...states)` (true if any present), `get()` → array, `remove(state)`.

## Essential identifiers

- `services.cart`, `services.price`
- `Shopware\Core\Checkout\Cart\Facade\CartFacade`, `...\ItemFacade`, `...\ItemsFacade`, `...\ProductsFacade`, `...\ContainerFacade`, `...\DiscountFacade`, `...\PriceFacade`, `...\CartPriceFacade`, `...\PriceFactory`, `...\ErrorsFacade`, `...\StatesFacade`

## Gotchas

- `price()` may be outdated after changes in the same script; call `calculate()` first. References held before `calculate()` are stale afterwards.
- Percentage cart discounts are always negated (`abs(value) * -1`); a `PriceCollection` with `percentage` throws, `absolute` without a `PriceCollection` throws, and any other type is rejected.
- `PriceFacade::surcharge()` adds the absolute percentage value; the docs' "ensured to be negative" wording is wrong.
- The source examples for `notice()` and `warning()` are swapped (each calls the other method).

## Code check (6.7.15.1)
- confirmed `CartFacadeHookFactory::getName()` — service name `cart` — vendor/shopware/core/Checkout/Cart/Facade/CartFacadeHookFactory.php:41
- confirmed `CartFacadeHookFactory::after()` — calls `calculate()` after the script — vendor/shopware/core/Checkout/Cart/Facade/CartFacadeHookFactory.php:36
- confirmed `DiscountTrait::discount()` — key, type, float|PriceCollection value, label — vendor/shopware/core/Checkout/Cart/Facade/Traits/DiscountTrait.php:36
- confirmed `PercentagePriceDefinition` — percentage value negated via abs() * -1 — vendor/shopware/core/Checkout/Cart/Facade/Traits/DiscountTrait.php:62
- corrected `PriceFacade::surcharge()` — docs: value ensured to be negative; code adds abs(value) — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:200
- confirmed `PriceFacade::discount()` — subtracts abs(value) percent — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:174
- confirmed `ItemFacade::take()` — quantity, optional key — vendor/shopware/core/Checkout/Cart/Facade/ItemFacade.php:55
- confirmed `ProductsFacade::add()` — string|LineItem|ItemFacade, quantity default 1 — vendor/shopware/core/Checkout/Cart/Facade/ProductsFacade.php:80
- confirmed `ErrorsFacade::resubmittable()` — key, id, parameters — vendor/shopware/core/Checkout/Cart/Facade/ErrorsFacade.php:80
- confirmed `StatesFacade::has()` — variadic states — vendor/shopware/core/Checkout/Cart/Facade/StatesFacade.php:48
