---
id: platform/dev/6.7/guides/plugins/apps/app-scripts/cart-manipulation.md
title: Cart Manipulation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-scripts/cart-manipulation.html
sourceHash: 07b516a3c4e753d7bb9b3eedb5f6addbd4457f92
codeCheckedAgainst: "6.7.13.0"
keywords: ["cart hook", "app scripts", "services.cart", "CartFacade", "calculate", "discount", "services.cart.price.create", "products.add", "states", "errors", "take", "payload", "rule builder", "ruleIds", "surcharge"]
summary: App scripts on the cart hook - services.cart API to add products/discounts, price definitions, split items, payload, cart errors, states and rule checks.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/resources/references/app-reference/script-reference/cart-manipulation-script-services-reference.md", "platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md", "platform/dev/6.7/concepts/framework/rule-system/_index.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md"]
---
## What it is

How an app modifies the cart with app scripts registered on the `cart` hook (see [hooks reference](platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md)). Cart scripts act as an additional cart processor and get a fluent `services.cart` API for reading and changing the cart. Available since 6.4.8.0.

## When to use

An app must add products or discounts, split line items, attach line-item metadata, block checkout with errors, or show notices, based on cart contents, app config or matched rules.

## Key steps / config

Scripts live in `Resources/scripts/cart/*.twig` and run on every cart calculation (item added, shipping or payment method changed, ...).

**Recalculation.** Totals are recalculated automatically after the whole script. If later logic needs updated prices, call `{% do services.cart.calculate() %}`; it reruns the full process step.

**Idempotency.** The script runs many times per cart. Guard actions:

```twig
{% if not services.cart.has('my-custom-discount') %}
    {% do services.cart.discount('my-custom-discount', 'percentage', 10, 'A custom discount') %}
{% endif %}
```

or track a vendor-prefixed state: `services.cart.states.has('swag-my-state')` (also `states.add(...)`, `states.remove(...)`).

**Price definitions.** Prices are gross/net per currency. Sources:
- custom field of type `<price name="test_price_field">` in the manifest's `<custom-fields>` ([custom fields](platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md));
- `<input-field type="price">` in `Resources/config/config.xml` ([app configuration](platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md)), read with `services.config.app('myCustomPrice')` — null-check it if it has no default;
- manual definition via the factory:

```twig
{% set price = services.cart.price.create({
    'default': { 'gross': 19.99, 'net': 19.99 },
    'USD': { 'gross': 24.99, 'net': 21.37 },
}) %}
```

**Line items.**
- Add product: `services.cart.products.add(productId)` or `services.cart.products.add(productId, 4)`.
- Absolute discount: `services.cart.discount('my-custom-discount', 'absolute', discountPrice, 'my.custom.discount.label'|trans)` — `discountPrice` from `price.create(...)`.
- Relative discount: `services.cart.discount('my-custom-discount', 'percentage', 10, 'A custom 10% discount')`.
- Remove: `services.cart.remove(id)` (product id or discount key).
- Split: `existingLineItem.take(2, newLineItemId)` returns the split item without adding it; add it with `services.cart.products.add(newLineItem)`.
- Payload: `lineItem.payload.set('custom-payload', myValue)`; read `lineItem.payload['custom-payload']`.

**Errors and notices.** `services.cart.errors.error('my-error-message', 'error-id')` blocks checkout (args: snippet key, optional id, optional parameters array); `errors.warning(...)` and `errors.notice(...)` only inform; `errors.remove('error-id')`.

**Rule-based scripts.** Add a rule picker to the app config and check the context's matched rules ([rule system](platform/dev/6.7/concepts/framework/rule-system/_index.md)):

```xml
<component name="sw-entity-single-select">
    <name>exampleRule</name>
    <entity>rule</entity>
</component>
```

```twig
{% set ruleId = services.config.app('exampleRule') %}
{% if ruleId and ruleId in hook.context.ruleIds %} ... {% endif %}
```

## Essential identifiers

- `cart` hook, `Resources/scripts/cart/`
- `services.cart.calculate()`, `has()`, `remove()`, `discount()`, `items`, `products`, `price`, `states`, `errors`
- `services.cart.price.create()` (currency key `default` or ISO code / currency id)
- `products.add()`, `products.get()`, `take()`, `payload.set()`
- `errors.error()`, `errors.warning()`, `errors.notice()`, `errors.remove()`
- `states.has()`, `states.add()`, `states.remove()`
- `services.config.app()`, `hook.context.ruleIds`
- discount types `percentage`, `absolute`

## Gotchas

- After `calculate()`, collections such as `products()`, `items()`, `price()` are new instances; references held from before are outdated.
- An absolute discount needs a price collection that includes the default currency (`'default'` key); otherwise the discount throws. A percentage discount rejects a price collection. Types other than `percentage`/`absolute` throw.
- Use your vendor prefix in custom state names; they must be unique.
- `services.cart.price` returns the current cart price, which may be stale until `calculate()`; it also exposes `create()`.

## Code check (6.7.13.0)
- confirmed `CartHook::HOOK_NAME` — `cart`, becomes `cart-<source>` if the cart has a source — vendor/shopware/core/Checkout/Cart/Hook/CartHook.php:25
- confirmed `CartFacade::calculate()` — recalculates; also called automatically after the script — vendor/shopware/core/Checkout/Cart/Facade/CartFacade.php:75
- confirmed `DiscountTrait::discount()` — `discount(key, type, float|PriceCollection value, label)` — vendor/shopware/core/Checkout/Cart/Facade/Traits/DiscountTrait.php:36
- confirmed `Defaults::CURRENCY` — absolute discount requires default-currency price — vendor/shopware/core/Checkout/Cart/Facade/Traits/DiscountTrait.php:70
- confirmed `PriceFactoryTrait::create()` — keys are currency id or ISO code — vendor/shopware/core/Checkout/Cart/Facade/Traits/PriceFactoryTrait.php:23
- confirmed `default` — price key `default` mapped to the default currency — vendor/shopware/core/Checkout/Cart/Facade/ScriptPriceStubs.php:131
- confirmed `ProductsFacade::add()` — `add(product, int $quantity = 1)` — vendor/shopware/core/Checkout/Cart/Facade/ProductsFacade.php:80
- confirmed `ItemFacade::take()` — `take(int $quantity, ?string $key = null)` — vendor/shopware/core/Checkout/Cart/Facade/ItemFacade.php:55
- confirmed `ErrorsFacade::error()` — `error(key, ?id, parameters)`; warning/notice same shape — vendor/shopware/core/Checkout/Cart/Facade/ErrorsFacade.php:35
- confirmed `StatesFacade::has()` — variadic state check — vendor/shopware/core/Checkout/Cart/Facade/StatesFacade.php:48
