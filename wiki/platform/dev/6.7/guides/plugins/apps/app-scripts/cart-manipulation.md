---
id: platform/dev/6.7/guides/plugins/apps/app-scripts/cart-manipulation.md
title: Cart Manipulation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-scripts/cart-manipulation.html
sourceHash: 07b516a3c4e753d7bb9b3eedb5f6addbd4457f92
codeCheckedAgainst: "6.7.15.1"
keywords: ["cart manipulation", "cart hook", "app scripts", "services.cart", "services.cart.discount", "services.cart.products.add", "services.cart.calculate", "services.cart.price.create", "services.cart.errors", "services.cart.states", "take", "line item payload", "cart processor", "rule builder", "discount"]
summary: Modify the cart from app scripts on the cart hook - add/remove/split line items, discounts, price definitions, payload, states, errors, rule checks.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/resources/references/app-reference/script-reference/cart-manipulation-script-services-reference.md
  - platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md
  - platform/dev/6.7/concepts/commerce/checkout-concept/cart.md
  - platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md
---
## What it is

How an app modifies the cart with app scripts registered on the `cart` hook. These scripts act as an additional cart processor in the [cart concept](platform/dev/6.7/concepts/commerce/checkout-concept/cart.md) and get a `cart` service (`services.cart`) with a fluent API for reading and changing the cart. App scripts require Shopware 6.4.8.0+.

## When to use

When an app needs to add products or discounts, split or annotate line items, block checkout with errors, or apply changes only when a Rule Builder rule matches. Scripts live in `Resources/scripts/cart/*.twig` and run on every cart calculation (item added, shipping/payment method changed, …). Full service list: [cart manipulation script services reference](platform/dev/6.7/resources/references/app-reference/script-reference/cart-manipulation-script-services-reference.md).

## Key steps / config

**Recalculate when needed.** Totals are only recalculated automatically after the whole script finished. If later logic needs updated prices:

```twig
{% do services.cart.products.add(productId) %}
{% do services.cart.calculate() %}
```

`calculate()` reruns the full `process` step.

**Be idempotent.** The script runs many times per cart. Guard actions with `services.cart.has('my-custom-discount')`, or track a vendor-prefixed custom state via `services.cart.states.has('swag-my-state')` (states facade also offers `add` / `remove`) to perform and revert actions.

**Price definitions** (gross/net per currency):
- Manual: `services.cart.price.create({ 'default': { 'gross': 19.99, 'net': 19.99 }, 'EUR': {…}, 'USD': {…} })`
- From app config: `services.cart.price.create(services.config.app('myCustomPrice'))` — null-check it when the config field has no default.
- Price fields can be declared as a `<price name="…">` field in a `<custom-field-set>` of the manifest, or as `<input-field type="price">` in `Resources/config/config.xml`.

**Line items:**
- Add product: `services.cart.products.add(productId)` or `services.cart.products.add(productId, 4)`.
- Absolute discount: `services.cart.discount('my-custom-discount', 'absolute', discountPrice, 'my.custom.discount.label'|trans)` — `discountPrice` from `price.create`.
- Relative discount: `services.cart.discount('my-custom-discount', 'percentage', 10, 'A custom 10% discount')`.
- Arguments: id/key, type, value, label (hard-coded string or `|trans` snippet).
- Remove: `services.cart.remove(id)` — product id or discount id.
- Split: `existingLineItem.take(2, newLineItemId)` on an item from `services.cart.products.get(productId)`; returns the split item, which must be added explicitly with `services.cart.products.add(newLineItem)`.
- Payload: `services.cart.get(lineItemId).payload.set('custom-payload', myValue)`; read with `lineItem.payload['custom-payload']`.

**Errors and notifications:** `services.cart.errors.error('my-error-message', 'error-id')` blocks checkout (args: snippet key, optional id, optional parameters array); `services.cart.errors.remove('error-id')` removes it. `warning(...)` and `notice(...)` use the same signature but do not block checkout.

**Rule-based scripts:** add an `sw-entity-single-select` component with `<entity>rule</entity>` to the app config, then:

```twig
{% set ruleId = services.config.app('exampleRule') %}
{% if ruleId and ruleId in hook.context.ruleIds %}
    {# perform action #}
{% else %}
    {# revert action #}
{% endif %}
```

## Essential identifiers

- Hook `cart`; script path `Resources/scripts/cart/`
- `services.cart.calculate()`, `has()`, `get()`, `remove()`, `discount()`
- `services.cart.products.add()` / `products.get()`, `items.count`
- `services.cart.price.create()`
- `services.cart.states.has()` / `add()` / `remove()`
- `services.cart.errors.error()` / `warning()` / `notice()` / `remove()`
- Line item `take()`, `payload.set()`
- `hook.context.ruleIds`, `services.config.app()`

## Gotchas

- After `calculate()`, properties such as `products()`, `items()`, `price()` are recreated; references held in variables from before are stale.
- `take()` does not add the new line item to the cart.
- State names must be unique — always vendor-prefix them.
- Discounts and other actions must check for prior execution because the script reruns on every recalculation.

## Version notes

- App scripts (and the `cart` hook) exist since Shopware 6.4.8.0.

## Code check (6.7.15.1)
- confirmed `CartHook::HOOK_NAME` — cart — vendor/shopware/core/Checkout/Cart/Hook/CartHook.php:25
- confirmed `CartFacade::calculate()` — manual recalculation — vendor/shopware/core/Checkout/Cart/Facade/CartFacade.php:75
- confirmed `CartFacade::states()` — states facade — vendor/shopware/core/Checkout/Cart/Facade/CartFacade.php:113
- confirmed `ProductsFacade::add()` — product id or item, quantity default 1 — vendor/shopware/core/Checkout/Cart/Facade/ProductsFacade.php:80
- confirmed `DiscountTrait::discount()` — key, type, value (float or PriceCollection), label — vendor/shopware/core/Checkout/Cart/Facade/Traits/DiscountTrait.php:36
- confirmed `PriceFactoryTrait::create()` — price.create, used by CartPriceFacade — vendor/shopware/core/Checkout/Cart/Facade/Traits/PriceFactoryTrait.php:23
- confirmed `ItemFacade::take()` — quantity, optional key; returns split item — vendor/shopware/core/Checkout/Cart/Facade/ItemFacade.php:55
- confirmed `ItemFacade::getPayload()` — returns ArrayFacade with set() — vendor/shopware/core/Checkout/Cart/Facade/ItemFacade.php:122
- confirmed `ErrorsFacade::error()` — key, optional id, optional parameters — vendor/shopware/core/Checkout/Cart/Facade/ErrorsFacade.php:35
- confirmed `ErrorsFacade::notice()` — same signature, non-blocking — vendor/shopware/core/Checkout/Cart/Facade/ErrorsFacade.php:67
