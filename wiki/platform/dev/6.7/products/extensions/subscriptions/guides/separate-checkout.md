---
id: platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md
title: Separate checkout
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/guides/separate-checkout.html
sourceHash: 601d27bdddf9e2944f41d97fb68222ce39ec6c1e
codeCheckedAgainst: "6.7.13.0"
keywords: ["separate subscription checkout", "express checkout", "subscription cart", "subscription context", "subscription.cart.collector", "subscription.cart.processor", "SubscriptionDiscountProcessor", "sw-subscription-plan", "sw-subscription-interval", "subscriptionToken", "subscription-plan-option", "CheckoutOrderPlacedCriteriaEvent", "_templateScopes", "initialSubscriptions", "commercial subscriptions"]
summary: "Subscription express checkout with cart/context: subscription.cart.* tags, subscription.-prefixed events, sw-subscription-* headers, template scopes."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/subscriptions/concept.md", "platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md", "platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md"]
---
## What it is

The separated subscription checkout (Commercial Subscriptions) is an express checkout for one subscription product: it uses a dedicated subscription cart and subscription sales channel context; the main cart and original context stay untouched. Read the [concept](platform/dev/6.7/products/extensions/subscriptions/concept.md) first.

## When to use

When an extension must read subscription data in checkout, hook into subscription cart calculation, add subscription line items, listen to subscription checkout events, or adapt Storefront pages during it.

## Key steps / config

1. **Context data**: the subscription context has a `subscription` extension. Orders from a subscription cart carry `subscriptionId` / `subscription` plus `initialSubscriptions`; follow-up orders only `subscriptionId` / `subscription`.

```json
{ "token": "...", "extensions": { "subscription": {
    "mainToken": "...", "subscriptionToken": "...", "managed": true,
    "plan": {}, "interval": {} } } }
```

2. **Cart calculation**: tag collectors `subscription.cart.collector`, processors `subscription.cart.processor`. Distinguish separate vs. mixed via `salesChannelContext.extensions.subscription.isManaged`. Example: `Shopware\Commercial\Subscription\Checkout\Cart\Discount\SubscriptionDiscountProcessor`.
3. **Add line items**:
   - Store-API / forms: send `subscription-plan-option` and `subscription-plan-option-<subscription-plan-id>-interval` beside `lineItems` (remapped into the payload); endpoint `POST /store-api/subscription/checkout/cart/line-item`.
   - Backend: `new LineItem($id, LineItem::PRODUCT_LINE_ITEM_TYPE, $productId)`, `setPayloadValue('subscriptionPlan', $planId)`, `setPayloadValue('subscriptionInterval', $intervalId)`, `$cart->add($lineItem)`. IDs from `$salesChannelContext->getExtension('subscription')->getPlan()->getId()` / `->getInterval()->getId()`. Use composite ID `<product-id>-<plan-id>-<interval-id>` to avoid merging.
4. **Events**: same as checkout events, prefixed `subscription.`, e.g. `'subscription.' . CheckoutOrderPlacedCriteriaEvent::class`. List: `Subscription/Framework/Event/SubscriptionEventRegistry.php`.
5. **Request scoping**: Storefront resolves URL parameter `subscriptionToken` (route `frontend.subscription.checkout.cart.page` with defaults `_subscriptionCart`, `_subscriptionContext`, `_templateScopes` = `subscription`). Headless sets headers `sw-subscription-plan` and `sw-subscription-interval` (except for adding a line item). See `Subscription/Resources/config/routes/storefront.php` / `store-api.php`.
6. **Templates**: add scope `subscription` to templates of `frontend.checkout.cart.page`, `frontend.checkout.confirm.page`, `frontend.checkout.register.page`, `frontend.account.edit-order.page`, `frontend.account.login.page`, `frontend.account.register.page` — see [template scoping](platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md).

## Essential identifiers

- `subscription.cart.collector`, `subscription.cart.processor`
- `sw-subscription-plan`, `sw-subscription-interval`, `subscriptionToken`
- `LineItem::PRODUCT_LINE_ITEM_TYPE`, `CheckoutOrderPlacedCriteriaEvent`

## Gotchas

- Customers cannot add other products; leaving means returning via browser history or restarting from the product.
- Listeners without the `subscription.` prefix only get main-checkout events.

## Version notes

- Line item `payload` keys `subscriptionPlan` / `subscriptionInterval` exist only since 6.7.4.0.

## Code check (6.7.13.0)
- confirmed `LineItem::PRODUCT_LINE_ITEM_TYPE` — value `'product'` — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:24
- confirmed `LineItem::setPayloadValue()` — takes key, value, optional protected flag — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:259
- confirmed `Cart::add()` — accepts a LineItem — vendor/shopware/core/Checkout/Cart/Cart.php:155
- confirmed `CheckoutOrderPlacedCriteriaEvent` — core event class exists — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedCriteriaEvent.php:13
- confirmed `_templateScopes` — request attribute read for template scopes — vendor/shopware/core/Framework/Adapter/Twig/TemplateScopeDetector.php:15
- confirmed `_noStore` — core route attribute — vendor/shopware/core/PlatformRequest.php:79
- confirmed `frontend.checkout.cart.page` — storefront route name — vendor/shopware/storefront/Controller/CheckoutController.php:76
- confirmed `frontend.checkout.register.page` — storefront route name — vendor/shopware/storefront/Controller/RegisterController.php:158
- confirmed `frontend.account.login.page` — storefront route name — vendor/shopware/storefront/Controller/AuthController.php:77
- unverified `subscription.cart.collector` — Commercial Subscription code not installed under vendor/shopware core/storefront/administration
