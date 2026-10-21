---
id: platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md
title: Mixed checkout
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/guides/mixed-checkout.html
sourceHash: 7a563d978013d82d5733664ca7dade7c8b542aab
codeCheckedAgainst: "6.7.15.1"
keywords: ["subscriptionManagedCarts", "subscriptionManagedContexts", "initialSubscriptions", "subscription.cart.collector", "subscription.cart.processor", "shopware.cart.collector", "shopware.cart.processor", "mixed-subscription", "subscription.routes.mixed-storefront-scope", "SubscriptionOrderLineItemRestoredEvent", "SubscriptionDiscountProcessor", "mixed cart", "managed subscription cart"]
summary: "Subscriptions mixed cart (6.7.4.0+): managed carts/contexts per plan+interval, payload keys, dual cart tags, mixed-subscription template scope."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/extensions/subscriptions/concept.md", "platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md", "platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md"]
---
## What it is

The Subscriptions mixed cart (since 6.7.4.0): subscription and one-time products in one checkout, with subscription calculation kept isolated. Subscription line items are ordinary product line items in the main cart with plan and interval IDs in their payload. During calculation they are grouped by plan+interval; per group a derived *managed* subscription context and cart are created, calculated via the subscription cart path, persisted, and linked to the main context through the `subscription_cart` table. Read the [concept](platform/dev/6.7/products/extensions/subscriptions/concept.md) first.

## When to use

When your cart collectors/processors, events or Storefront templates must work for subscription products bought together with regular products.

## Key steps / config

**Retrieving information** — cart extension `subscriptionManagedCarts` and context extension `subscriptionManagedContexts` map `<plan-id>-<interval-id>` keys to managed carts/contexts; split the key to get plan and interval IDs. An order placed from a mixed cart has an `initialSubscriptions` extension; later generated orders carry `subscriptionId` / `subscription`.

```json
{ "token": "<main-context-token>",
  "extensions": { "subscriptionManagedContexts": {
    "<plan-id>-<interval-id>": { "token": "<subscription-context-token>",
      "extensions": { "subscription": { "mainToken": "...",
        "subscriptionToken": "...", "managed": true, "plan": {}, "interval": {} } } } } } }
```

**Manipulating the cart** — manipulate the main cart as usual. Collectors/processors that must also run for subscription carts need both tags: `subscription.cart.collector` + `shopware.cart.collector` (or `subscription.cart.processor` + `shopware.cart.processor`). Check the context's `subscription` extension to detect a subscription calculation, and `salesChannelContext.extensions.subscription.isManaged` to tell mixed from separate. Reference: `Shopware\Commercial\Subscription\Checkout\Cart\Discount\SubscriptionDiscountProcessor`.

**Adding subscription line items**

- Store API (`POST /store-api/checkout/cart/line-item`): `lineItem.subscriptionPlan` + `lineItem.subscriptionInterval`; or `lineItem.subscriptionPlan` + `lineItem.subscriptionInterval-<plan-id>` (for HTML forms to `/checkout/line-item/add`); or `lineItem.payload.subscriptionPlan` + `lineItem.payload.subscriptionInterval`. The first two are remapped into the payload.
- Backend: set the payload keys; a composite ID avoids merging with an existing line item of the same product.

```php
$lineItem = new LineItem(sprintf('%s-%s-%s', $productId, $planId, $intervalId), LineItem::PRODUCT_LINE_ITEM_TYPE, $productId);
$lineItem->setPayloadValue('subscriptionPlan', $planId);
$lineItem->setPayloadValue('subscriptionInterval', $intervalId);
$cart->add($lineItem);
```

**Events** — all usual events fire; events during subscription cart calculation are additionally prefixed `subscription.`.

**Storefront** — add template scope `mixed-subscription` to the templates of `frontend.checkout.cart.page`, `frontend.checkout.confirm.page`, `frontend.checkout.register.page`, `frontend.account.edit-order.page`, `frontend.account.login.page`, `frontend.account.register.page`, `frontend.cart.offcanvas` (e.g. `@Storefront/storefront/component/checkout/offcanvas-cart.html.twig`). The list is the container parameter `subscription.routes.mixed-storefront-scope`. In Twig, `context` has `subscriptionManagedContexts`, `page.cart` has `subscriptionManagedCarts`, `page.order` has `initialSubscriptions`. See [template scoping](platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md).

## Essential identifiers

- `subscriptionManagedCarts`, `subscriptionManagedContexts`, `initialSubscriptions`
- `subscription.cart.collector`, `subscription.cart.processor`, `shopware.cart.collector`, `shopware.cart.processor`
- `mixed-subscription`, `subscription.routes.mixed-storefront-scope`
- `SubscriptionOrderLineItemRestoredEvent`

## Gotchas

- Do not add line items **only** to subscription carts — add them to the main cart too. If you must, subscribe to `SubscriptionOrderLineItemRestoredEvent` so the item shows in the after-order process.
- Unlike the [separate checkout](platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md), only the normal `CheckoutOrderPlacedEvent` fires, no `'subscription.' . CheckoutOrderPlacedEvent`: subscription carts are not placed as separate orders.

## Version notes

- Mixed checkout is available since Shopware 6.7.4.0.

## Code check (6.7.15.1)
- confirmed `LineItem::PRODUCT_LINE_ITEM_TYPE` — value `product` — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:24
- confirmed `LineItem::setPayloadValue()` — `(string $key, $value, ?bool $protected = null)` — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:254
- confirmed `Cart::add()` — adds a LineItem — vendor/shopware/core/Checkout/Cart/Cart.php:172
- confirmed `shopware.cart.collector` — core collector tag — vendor/shopware/core/Checkout/DependencyInjection/promotion.php:130
- confirmed `shopware.cart.processor` — core processor tag — vendor/shopware/core/Checkout/DependencyInjection/promotion.php:137
- confirmed `CheckoutOrderPlacedEvent` — core event class — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:32
- confirmed `/store-api/checkout/cart/line-item` — POST route `store-api.checkout.cart.add` — vendor/shopware/core/Checkout/Cart/SalesChannel/CartItemAddRoute.php:49
- confirmed `/checkout/line-item/add` — Storefront route `frontend.checkout.line-item.add` — vendor/shopware/storefront/Controller/CartLineItemController.php:283
- confirmed `frontend.cart.offcanvas` — Storefront route name — vendor/shopware/storefront/Controller/CheckoutController.php:283
- unverified `subscription.cart.collector` — tag of the commercial Subscriptions extension, out of scope
