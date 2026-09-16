---
id: platform/dev/6.6/products/extensions/subscriptions/guides/request-scoping.md
title: Request scoping
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/subscriptions/guides/request-scoping.html
sourceHash: 0a7c560ff470e87f7bc19732e65226e16d178e1f
keywords: ["request scoping", "subscriptionToken", "sw-subscription-plan", "sw-subscription-interval", "subscription cart", "subscription context", "_subscriptionCart", "_subscriptionContext", "headless", "storefront route"]
summary: "How subscription checkout resolves a separate cart/context via a Storefront URL param or headless HTTP headers."
lastBuilt: "2026-09-15"
---
## What it is

Describes how a subscription checkout uses a separate cart and context from normal checkout, resolved either via a Storefront URL parameter or, in headless setups, via HTTP headers.

## Key steps / config

- In Storefront, the route carries a `subscriptionToken` URL parameter, resolved through route defaults such as `_subscriptionCart` and `_subscriptionContext`:
  ```xml
  <route id="frontend.subscription.checkout.cart.page"
         path="/subscription/checkout/cart/{subscriptionToken}"
         methods="GET"
         controller="subscription.storefront.controller.checkout::cartPage">
      <default key="_noStore">true</default>
      <default key="_routeScope"><list><string>storefront</string></list></default>
      <default key="_subscriptionCart">true</default>
      <default key="_subscriptionContext">true</default>
      <default key="_controllerName">checkout</default>
      <default key="_controllerAction">cartpage</default>
      <default key="_templateScopes">subscription</default>
      <option key="seo">false</option>
  </route>
  ```
- In headless usage, set two request headers instead: `sw-subscription-plan` and `sw-subscription-interval`, e.g. when calling `/store-api/subscription/{subscriptionId}/activate`.

## Essential identifiers

- `subscriptionToken` (Storefront URL parameter)
- `sw-subscription-plan`, `sw-subscription-interval` (headless HTTP headers)
- `_subscriptionCart`, `_subscriptionContext` route defaults

## Gotchas

These context definitions live in `Subscription/Resources/app/config/routes/storefront.xml` or `Subscription/Resources/app/config/routes/store-api.xml` — check those files if a subscription route is not resolving the expected context.
