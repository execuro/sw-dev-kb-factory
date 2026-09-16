---
id: platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md
title: Mixed checkout
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/guides/mixed-checkout.html
sourceHash: 7a563d978013d82d5733664ca7dade7c8b542aab
codeCheckedAgainst: "6.7.13.0"
keywords: ["mixed cart", "mixed checkout", "subscriptionManagedCarts", "subscriptionManagedContexts", "initialSubscriptions", "subscription.cart.processor", "subscription.cart.collector", "shopware.cart.processor", "mixed-subscription", "subscription.routes.mixed-storefront-scope", "SubscriptionOrderLineItemRestoredEvent", "managed subscription cart", "subscriptions"]
summary: "Subscriptions mixed cart (6.7.4.0+): managed carts/contexts per plan+interval, payload keys, dual cart tags, mixed-subscription scope."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/subscriptions/concept.md", "platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md", "platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md"]
---
## What it is

How the Subscriptions extension's mixed cart works (since 6.7.4.0): subscription and one-time products in one checkout. Subscription line items are ordinary product line items in the main cart with plan and interval IDs in their payload; during calculation they are grouped by plan+interval, and for each group a *managed* subscription context and cart are derived, calculated via the subscription calculation path, and persisted (linked to the main context by the `subscription_cart` table). See the [concept](platform/dev/6.7/products/extensions/subscriptions/concept.md).

## When to use

Integrating an extension (cart collectors/processors, Storefront templates, events) so that it works with carts containing subscription products.

## Key steps / config

### Reading managed carts and contexts

- Cart extension `subscriptionManagedCarts` and sales channel context extension `subscriptionManagedContexts` map `<plan-id>-<interval-id>` keys to managed carts/contexts. Split the composite key to get plan and interval IDs.
- Orders placed from a mixed cart carry an `initialSubscriptions` extension; later generated orders carry `subscriptionId` / `subscription`.

```json
{ "token": "<main-context-token>",
  "extensions": { "subscriptionManagedContexts": {
    "<plan-id>-<interval-id>": { "token": "<subscription-context-token>",
      "extensions": { "subscription": {
        "mainToken": "...", "subscriptionToken": "...",
        "managed": true, "plan": {}, "interval": {} } } } } } }
```

### Cart collectors / processors

Manipulate the main cart as usual. To also run in subscription cart calculation, tag the service with both `shopware.cart.collector` and `subscription.cart.collector` (or `shopware.cart.processor` and `subscription.cart.processor`). Detect subscription calculation via the context's `subscription` extension; distinguish mixed vs. separate via `salesChannelContext.extensions.subscription.isManaged`. Reference implementation: `Shopware\Commercial\Subscription\Checkout\Cart\Discount\SubscriptionDiscountProcessor`.

### Adding subscription line items

Store API (`POST /store-api/checkout/cart/line-item`) or Storefront form (`/checkout/line-item/add`), per line item:
- `subscriptionPlan` + `subscriptionInterval`, or
- `subscriptionPlan` + `subscriptionInterval-<plan-id>` (HTML forms), or
- `payload.subscriptionPlan` + `payload.subscriptionInterval`.
The first two are remapped into the payload. In backend code set the payload directly:

```php
$lineItem = new LineItem($lineItemId, LineItem::PRODUCT_LINE_ITEM_TYPE, $productId);
$lineItem->setPayloadValue('subscriptionPlan', $planId);
$lineItem->setPayloadValue('subscriptionInterval', $intervalId);
$cart->add($lineItem);
```

Use a composite line item ID (`<product-id>-<plan-id>-<interval-id>`) to avoid merging with an existing line item of the same product.

### Storefront

Add template scope `mixed-subscription` to these pages' templates (and templates they use): `frontend.checkout.cart.page`, `frontend.checkout.confirm.page`, `frontend.checkout.register.page`, `frontend.account.edit-order.page`, `frontend.account.login.page`, `frontend.account.register.page`, `frontend.cart.offcanvas`. The list is the container parameter `subscription.routes.mixed-storefront-scope`. In Twig: `context` has `subscriptionManagedContexts`, `page.cart` has `subscriptionManagedCarts`, `page.order` has `initialSubscriptions`. See [template scoping](platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md).

## Essential identifiers

- `subscriptionManagedCarts`, `subscriptionManagedContexts`, `initialSubscriptions`
- `subscription.cart.collector`, `subscription.cart.processor`, `shopware.cart.collector`, `shopware.cart.processor`
- `mixed-subscription`, `subscription.routes.mixed-storefront-scope`
- `LineItem::PRODUCT_LINE_ITEM_TYPE`, `LineItem::setPayloadValue()`

## Gotchas

- Do not add line items only to subscription carts via subscription collectors/processors; add them to the main cart too. If you must, subscribe to `SubscriptionOrderLineItemRestoredEvent` so the item shows in the after-order process.
- Events during subscription cart calculation are prefixed `subscription.`, but on order placement only the normal `CheckoutOrderPlacedEvent` fires (no `subscription.`-prefixed variant), unlike the [separate checkout](platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md).

## Version notes

- Available since Shopware 6.7.4.0.

## Code check (6.7.13.0)
- confirmed `shopware.cart.processor` — core cart processor tag — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:11
- confirmed `shopware.cart.collector` — core cart collector tag — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:18
- confirmed `LineItem::PRODUCT_LINE_ITEM_TYPE` — value `product` — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:24
- confirmed `LineItem::setPayloadValue()` — signature (key, value, ?protected) — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:259
- confirmed `CheckoutOrderPlacedEvent` — event name `checkout.order.placed` — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:27
- confirmed `/store-api/checkout/cart/line-item` — POST route `store-api.checkout.cart.add` — vendor/shopware/core/Checkout/Cart/SalesChannel/CartItemAddRoute.php:49
- confirmed `/checkout/line-item/add` — Storefront route `frontend.checkout.line-item.add` — vendor/shopware/storefront/Controller/CartLineItemController.php:283
- confirmed `frontend.checkout.cart.page` — renders page/checkout/cart/index.html.twig — vendor/shopware/storefront/Controller/CheckoutController.php:76
- confirmed `frontend.cart.offcanvas` — renders component/checkout/offcanvas-cart.html.twig — vendor/shopware/storefront/Controller/CheckoutController.php:280
- unverified `SubscriptionDiscountProcessor` — Subscriptions extension (tags, extensions, scope parameter) not installed in the checked vendor roots
