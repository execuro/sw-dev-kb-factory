---
id: platform/dev/6.6/guides/plugins/apps/app-scripts/cart-manipulation.md
title: Cart manipulation
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-scripts/cart-manipulation.html
sourceHash: 3e46c0967bb106c101c492592db2845a83a930dd
keywords: ["cart script hook", "services.cart", "cart.calculate", "cart.discount", "cart.products.add", "cart.remove", "cart.states", "cart.errors", "cart.price.create", "line item", "take() method", "rule builder", "cart processor"]
summary: "How app scripts on the cart hook read and mutate the cart: add/remove items, discounts, splitting, errors, and rule-based gating."
lastBuilt: "2026-09-15"
---
## What it is

Explains manipulating the cart from app scripts via the `cart` script hook, where the script acts as another cart processor and gets a `services.cart` fluent API.

## When to use

When an app needs to add/remove line items, apply discounts, attach custom data to line items, or block checkout with errors — reacting whenever the cart is recalculated (item added, shipping/payment method changed, etc.).

## Key steps / config

Recalculate manually after changing price definitions (auto-recalculation only happens after the script finishes):

```twig
{% do services.cart.products.add(productId) %}
{% do services.cart.calculate() %}
```

Guard against multi-run scripts by checking existing state:

```twig
{% if not services.cart.has('my-custom-discount') %}
    {% do services.cart.discount('my-custom-discount', 'percentage', 10, 'A custom discount') %}
{% endif %}
```

or with `services.cart.states.has('swag-my-state')`.

Price definitions via factory: `services.cart.price.create({ 'default': {...}, 'EUR': {...}, 'USD': {...} })`, usable with values hard-coded, from `custom-fields` price fields, or from app-config price fields read via `services.config.app('myCustomPrice')`.

Line items: `services.cart.products.add(productId[, quantity])`, `services.cart.discount(id, type, value, label)` (`type` = `absolute`/`percentage`), `services.cart.remove(id)`. Split with `existingLineItem.take(quantity[, newId])`, then re-add the returned item manually. Attach custom data via `lineItem.payload.set('key', value)`.

Errors/notices: `services.cart.errors.error('snippet.key'[, 'id'[, params]])`, `.remove('id')`, `.notice()`, `.warning()`.

Rule gating: check `hook.context.ruleIds` against a rule id chosen via an `sw-entity-single-select` component of type `rule` in the app config.

## Essential identifiers

- `services.cart.products.add()`, `.remove()`, `.calculate()`, `.discount()`, `.has()`, `.states.has()`, `.price.create()`, `.errors.error()`, `.errors.notice()`, `.errors.warning()`
- `hook.context.ruleIds`
- line item `.take()`, `.payload.set()`

## Gotchas

Calling `calculate()` reruns the whole `process` step and recreates all cart properties (`products()`, `items()`, `price()`), so previously-held variable references become stale. Discount/state names must carry a vendor prefix to stay unique.

## Version notes

Cart app scripts (the `cart` hook) were introduced in Shopware 6.4.8.0 and are not supported in prior versions.
