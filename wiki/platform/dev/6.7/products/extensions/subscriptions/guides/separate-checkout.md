---
id: platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md
title: Separate checkout
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/guides/separate-checkout.html
sourceHash: 601d27bdddf9e2944f41d97fb68222ce39ec6c1e
codeCheckedAgainst: "6.7.15.1"
keywords: ["subscription.cart.collector", "subscription.cart.processor", "subscription-plan-option", "sw-subscription-plan", "sw-subscription-interval", "subscriptionToken", "SubscriptionEventRegistry", "frontend.subscription.checkout.cart.page", "_templateScopes", "CheckoutOrderPlacedCriteriaEvent", "subscription event prefix", "separate subscription checkout", "express checkout"]
summary: "Separate subscription checkout: isolated cart/context per product, subscription. cart tags and event prefix, plan headers, subscription template scope."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/extensions/subscriptions/concept.md", "platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md", "platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md"]
---
## What it is

The separate subscription checkout of the Subscriptions extension: an isolated, express-style checkout with a dedicated cart that contains **only** the subscription product. Checkout starts right away, no other products can be added, and the main cart and original sales channel context stay untouched. See the [concept](platform/dev/6.7/products/extensions/subscriptions/concept.md).

## When to use

When an extension must read subscription data, manipulate the subscription cart, react to subscription checkout events, or change Storefront pages during a separate subscription checkout.

## Key steps / config

**Retrieving information** — the subscription cart and subscription context replace the main cart/context; subscription data sits in the context's `subscription` extension (`mainToken`, `subscriptionToken`, `managed`, `plan`, `interval`). The order placed has a `subscriptionId` / `subscription` extension plus `initialSubscriptions` (as a [mixed order](platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md)); subsequent orders only carry `subscriptionId` / `subscription`. Cart line items carry `payload.subscriptionPlan` / `payload.subscriptionInterval` (since 6.7.4.0).

**Manipulating the cart** — the subscription cart calculator only runs collectors/processors tagged `subscription.cart.collector` / `subscription.cart.processor`. Distinguish separate from mixed calculation via `salesChannelContext.extensions.subscription.isManaged`. Example: `Shopware\Commercial\Subscription\Checkout\Cart\Discount\SubscriptionDiscountProcessor` (also supports mixed carts).

**Adding subscription line items**

- Store API / forms: send `subscription-plan-option` and `subscription-plan-option-<subscription-plan-id>-interval` next to `lineItems`, e.g. `POST /store-api/subscription/checkout/cart/line-item` (the only subscription request that needs no subscription headers).
- Backend: set `lineItem.payload.subscriptionPlan` and `lineItem.payload.subscriptionInterval` with `setPayloadValue()`, using a composite `<product>-<plan>-<interval>` ID and type `LineItem::PRODUCT_LINE_ITEM_TYPE`; plan/interval come from `$salesChannelContext->getExtension('subscription')->getPlan()` / `getInterval()`.

**Events** — most events in the subscription checkout are prefixed `subscription.` and are otherwise identical; subscribe to the prefixed name. Known prefixed events: `Subscription/Framework/Event/SubscriptionEventRegistry.php`.

```php
public static function getSubscribedEvents(): array
{
    return ['subscription.' . CheckoutOrderPlacedCriteriaEvent::class => 'onOrderPlacedCriteria'];
}
```

**Request scoping** — Storefront resolves the URL parameter `subscriptionToken`; headless needs headers `sw-subscription-plan` and `sw-subscription-interval`. Route definitions: `Subscription/Resources/config/routes/storefront.php`, `Subscription/Resources/config/routes/store-api.php`.

```php
$routes->add('frontend.subscription.checkout.cart.page', '/subscription/checkout/cart/{subscriptionToken}')
    ->controller('subscription.storefront.controller.checkout::cartPage')
    ->defaults(['_noStore' => 'true', '_routeScope' => ['storefront'],
        '_subscriptionCart' => 'true', '_subscriptionContext' => 'true',
        '_controllerName' => 'checkout', '_controllerAction' => 'cartpage',
        '_templateScopes' => 'subscription']);
```

**Storefront** — add template scope `subscription` to the templates (and sub-templates) of at least `frontend.checkout.cart.page`, `frontend.checkout.confirm.page`, `frontend.checkout.register.page`, `frontend.account.edit-order.page`, `frontend.account.login.page`, `frontend.account.register.page` (e.g. `@Storefront/storefront/page/checkout/confirm/index.html.twig`). See [template scoping](platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md).

## Essential identifiers

- `subscription.cart.collector`, `subscription.cart.processor`
- `subscription-plan-option`, `subscription-plan-option-<subscription-plan-id>-interval`
- `sw-subscription-plan`, `sw-subscription-interval`, `subscriptionToken`
- `/store-api/subscription/checkout/cart/line-item`, `frontend.subscription.checkout.cart.page`
- `SubscriptionEventRegistry`, `subscription.` event prefix

## Gotchas

- A customer leaving the subscription checkout can only return via browser history or by starting a new checkout with the product.
- Normal (unprefixed) event listeners do not fire for the subscription checkout; register the `subscription.`-prefixed name.

## Code check (6.7.15.1)
- confirmed `CheckoutOrderPlacedCriteriaEvent` — core event class — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedCriteriaEvent.php:16
- confirmed `_templateScopes` — `TemplateScopeDetector::SCOPES_ATTRIBUTE`, string or array accepted — vendor/shopware/core/Framework/Adapter/Twig/TemplateScopeDetector.php:14
- confirmed `_noStore` — `PlatformRequest::ATTRIBUTE_NO_STORE` — vendor/shopware/core/PlatformRequest.php:81
- confirmed `_routeScope` — `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — vendor/shopware/core/PlatformRequest.php:78
- confirmed `LineItem::PRODUCT_LINE_ITEM_TYPE` — value `product` — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:24
- confirmed `LineItem::setPayloadValue()` — payload setter used for plan/interval — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:254
- confirmed `frontend.checkout.confirm.page` — core Storefront route the scope applies to — vendor/shopware/storefront/Controller/CheckoutController.php:122
- unverified `SubscriptionEventRegistry` — commercial Subscriptions extension, out of scope
- unverified `sw-subscription-plan` — header handled by commercial extension, not found in core/storefront
- unverified `subscription.cart.processor` — commercial extension tag, out of scope
