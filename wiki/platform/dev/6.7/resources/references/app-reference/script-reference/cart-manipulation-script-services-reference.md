---
id: platform/dev/6.7/resources/references/app-reference/script-reference/cart-manipulation-script-services-reference.md
title: Cart Manipulation script services reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/cart-manipulation-script-services-reference.html
sourceHash: 3af77edf4675bf6c096053126c083b79f1a1d7a3
codeCheckedAgainst: "6.7.13.0"
keywords: ["services.cart", "services.price", "CartFacade", "ItemFacade", "ProductsFacade", "PriceFacade", "ErrorsFacade", "StatesFacade", "ContainerFacade", "CartPriceFacade", "cart script", "discount", "surcharge", "line item", "app scripts"]
summary: "App script cart services: services.cart (CartFacade) and services.price with item, product, price, error, state and container facades, methods and arguments."
lastBuilt: 2026-09-15
---
## What it is

Reference for the Twig app-script services that manipulate the cart: `services.cart` (`Shopware\Core\Checkout\Cart\Facade\CartFacade`), `services.price` (`Shopware\Core\Checkout\Cart\Facade\PriceFactory`) and the facades they return (same namespace).

## When to use

When writing a cart-manipulation app script: adding/removing products, discounts, surcharges, price overrides, cart errors or cart states.

## Key steps / config

**`services.cart` (`CartFacade`)**
- `items()` → `ItemsFacade`; `products()` → `ProductsFacade`; `price()` → `CartPriceFacade`; `errors()` → `ErrorsFacade`; `states()` → `StatesFacade`.
- `calculate()` recalculates the cart; it runs automatically after the script.
- `count()`, `get(id)`, `has(id|ItemFacade)`, `remove(id|ItemFacade)`.
- `discount(key, type, value, label)` / `surcharge(key, type, value, label)` → `DiscountFacade`. `type` is `percentage` (float) or `absolute` (a `PriceCollection` that must contain the default currency).

```twig
{% set price = services.cart.price.create({ 'default': { 'gross': -19.99, 'net': -19.99 } }) %}
{% do services.cart.discount('my-discount', 'absolute', price, 'Fancy discount') %}
{% do services.cart.surcharge('my-surcharge', 'percentage', 10, 'Fancy surcharge') %}
{% set split = services.cart.products.get(hook.ids.get('p1')).take(2, 'new-key') %}
```

**`CartPriceFacade`**: `create(price)` → `Shopware\Core\Framework\DataAbstractionLayer\Pricing\PriceCollection`; `getNet()`, `getTotal()` (rounded), `getRounded()` (alias), `getRaw()` (before rounding), `getPosition()` (line items, no shipping).

**`ItemsFacade`**: `add(ItemFacade)`, `count()`, `get(id)`, `has(id)`, `remove(id)`.

**`ProductsFacade`**: `add(string|LineItem|ItemFacade product, int quantity = 1)`, `create(productId, quantity = 1)` (not added automatically), `get(productId)`, `has()`, `count()`, `remove()`.

**`ItemFacade`**: `getId()`, `getType()`, `getLabel()`, `getQuantity()`, `getReferencedId()`, `getPayload()` (`ArrayFacade`), `getPrice()` (`PriceFacade` or null), `getChildren()` (`ItemsFacade`), `take(quantity, key = null)` splits off a new line item.

**`ContainerFacade`**: container line item with `add(ItemFacade)`, `products()`, the `ItemFacade` getters, `discount()`, `surcharge()`, `take()` and `count/get/has/remove`.

**`DiscountFacade`**: `getId()`, `getLabel()`.

**`PriceFacade`**: `getTotal()`, `getUnit()`, `getQuantity()`, `getTaxes()`, `getRules()`; `change()`, `plus()`, `minus()` take a `PriceCollection`; `discount(float)` / `surcharge(float)` apply a percentage to unit and total price.

**`services.price` (`PriceFactory`)**: `create(prices)` → `PriceCollection`, keyed by currency id or iso code (`default` = default currency).

**`ErrorsFacade`**: `error(key, id = null, parameters = [])` blocks checkout; `warning()` / `notice()` display without blocking; `resubmittable()` blocks the order but allows resubmitting; `get(id)`, `has(id)`, `remove(id)`. `key` is a snippet key.

**`StatesFacade`**: `add(...states)`, `has(...states)` (true if any present), `get()`, `remove(state)`.

## Essential identifiers

- `services.cart`, `services.price`
- `Shopware\Core\Checkout\Cart\Facade\CartFacade`, `ItemFacade`, `ItemsFacade`, `ProductsFacade`, `PriceFacade`, `PriceFactory`, `ErrorsFacade`, `StatesFacade`, `ContainerFacade`, `DiscountFacade`, `CartPriceFacade`
- `Shopware\Core\Framework\Script\ServiceStubs` (type hint for `services`)

## Gotchas

- After `calculate()` all collections get new references; `price()` is stale until recalculated.
- `PriceFacade::surcharge()`: the source says the value is "ensured to be negative via `abs(value)`"; the installed code adds the absolute percentage (positive surcharge).
- Cart discounts are forced negative (`abs(value) * -1`); a `percentage` discount given a `PriceCollection` throws.
- The source's `warning()` example calls `notice()` and vice versa.
- `resubmittable()` is documented as type `error`; the installed code uses `Error::LEVEL_NOTICE`.
- The installed `CartFacade` also has an `@internal` `container(id, label)` factory not listed in the source.

## Code check (6.7.13.0)
- confirmed `CartFacadeHookFactory::getName()` — service name `cart` — vendor/shopware/core/Checkout/Cart/Facade/CartFacadeHookFactory.php:43
- confirmed `PriceFactoryFactory::getName()` — service name `price` — vendor/shopware/core/Checkout/Cart/Facade/PriceFactoryFactory.php:27
- confirmed `CartFacade::calculate()` — recalculates with hooks disabled — vendor/shopware/core/Checkout/Cart/Facade/CartFacade.php:75
- confirmed `DiscountTrait::discount()` — percentage or absolute, default currency required — vendor/shopware/core/Checkout/Cart/Facade/Traits/DiscountTrait.php:36
- confirmed `ProductsFacade::add()` — string|LineItem|ItemFacade, quantity 1 — vendor/shopware/core/Checkout/Cart/Facade/ProductsFacade.php:80
- confirmed `PriceFacade::discount()` — subtracts abs percentage — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:174
- corrected `PriceFacade::surcharge()` — docs: value ensured negative via abs(value); code adds abs percentage — vendor/shopware/core/Checkout/Cart/Facade/PriceFacade.php:200
- corrected `ErrorsFacade::resubmittable()` — docs: adds error of type error; code uses Error::LEVEL_NOTICE — vendor/shopware/core/Checkout/Cart/Facade/ErrorsFacade.php:80
- confirmed `StatesFacade::add()` — variadic string states — vendor/shopware/core/Checkout/Cart/Facade/StatesFacade.php:26
- confirmed `ContainerFactoryTrait::container()` — @internal, not on the docs page — vendor/shopware/core/Checkout/Cart/Facade/Traits/ContainerFactoryTrait.php:33
