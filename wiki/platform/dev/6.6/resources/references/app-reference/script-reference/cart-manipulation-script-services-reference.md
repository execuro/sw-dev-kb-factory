---
id: platform/dev/6.6/resources/references/app-reference/script-reference/cart-manipulation-script-services-reference.md
title: Cart manipulation services reference
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/app-reference/script-reference/cart-manipulation-script-services-reference.html
sourceHash: 4c5c259f000b047271360e4e21b2ad0ed28b2c1a
keywords: ["CartFacade", "ItemFacade", "ItemsFacade", "PriceFacade", "DiscountFacade", "ErrorsFacade", "StatesFacade", "ProductsFacade", "ContainerFacade", "cart script", "line-item", "discount", "surcharge"]
summary: "Cart script-service facades (CartFacade, ItemFacade, PriceFacade, etc.) for manipulating line-items, prices, discounts and errors."
lastBuilt: "2026-09-15"
---

## What it is
Reference documentation for the script-service facade classes Shopware exposes to app scripts for manipulating the cart: `services.cart` (`Shopware\Core\Checkout\Cart\Facade\CartFacade`) and its child facades for line-items, prices, discounts, errors, and cart states.

## When to use
Use these facades inside a cart script (a Twig-based app script hooked into cart calculation) when you need to read or modify line-items, add discounts/surcharges, adjust prices, add error/warning/notice messages, or track custom cart states across script runs.

## Key steps / config
- `services.cart.items()` returns an `ItemsFacade` of all line-items; `services.cart.products()` returns a `ProductsFacade` filtered to product line-items.
- `services.cart.calculate()` recalculates the cart; call it after mutations. It is also called automatically after the cart script executes.
- `services.cart.price()` returns a `CartPriceFacade` with `getNet()`, `getTotal()`, `getPosition()`, `getRounded()` (alias for `getTotal()`), `getRaw()`, and `create()` for building a `PriceCollection`.
- `services.cart.discount(key, type, value, label)` / `services.cart.surcharge(key, type, value, label)` create a `DiscountFacade`; `type` is `percentage` or `absolute`, `value` is a `float` or `PriceCollection`.
- `services.cart.errors()` returns an `ErrorsFacade` with `error()`, `warning()`, `notice()`, `resubmittable()`, `has()`, `remove()`, `get()` — each takes a snippet `key`, optional `id`, optional `parameters` array.
- `services.cart.states()` returns a `StatesFacade` with `add()`, `remove()`, `has()`, `get()` to store custom string states on the cart.
- `ItemFacade` (a single line-item) exposes `getPrice()`, `take(quantity, key)`, `getId()`, `getReferencedId()`, `getQuantity()`, `getLabel()`, `getPayload()` (returns an `ArrayFacade`), `getChildren()`, `getType()` (`product`, `discount`, `container`, etc.), and its own `discount()`/`surcharge()`.
- `ContainerFacade` wraps multiple line-items and adds `products()`, `add()`, `getPrice()`.

Example (absolute discount):
```twig
{% do services.cart.products.add(hook.ids.get('p1')) %}
{% set price = services.cart.price.create({'default': {'gross': -19.99, 'net': -19.99}}) %}
{% do services.cart.discount('my-discount', 'absolute', price, 'Fancy discount') %}
```

## Essential identifiers
- `Shopware\Core\Checkout\Cart\Facade\CartFacade` (`services.cart`)
- `Shopware\Core\Checkout\Cart\Facade\ItemFacade`, `ItemsFacade`, `ContainerFacade`, `ProductsFacade`
- `Shopware\Core\Checkout\Cart\Facade\CartPriceFacade`, `PriceFacade`, `PriceFactory` (`services.price`)
- `Shopware\Core\Checkout\Cart\Facade\DiscountFacade`, `ErrorsFacade`, `StatesFacade`

## Gotchas
After calling `calculate()`, all previously held collection references (e.g. from `items()`, `products()`) become outdated because they get new references — reload them after recalculating.
