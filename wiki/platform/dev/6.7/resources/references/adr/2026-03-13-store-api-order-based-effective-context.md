---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2026-03-13-store-api-order-based-effective-context.md
sourceHash: 8cc267e5aaa139af4b62ac0df800b9601f82bc7a
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-03-13-store-api-order-based-effective-context.html
title: Order-based effective Store API context
version: "6.7"
versions:
  - "6.7"
keywords: ["orderId", "SalesChannelContext", "OrderConverter", "OrderRestorer", "_allowOrderRestoration", "PaymentMethodRoute", "CheckoutGatewayRoute", "/store-api/payment-method", "SKIP_CART_PERSISTENCE", "after order payment", "effective context", "headless", "store api"]
summary: "ADR: opted-in read-only Store API routes evaluate payment/shipping availability against an existing order via a request-local effective context and cart."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2026-03-13, area checkout) for "after order" use cases in headless setups: Store API routes such as `PaymentMethodRoute` and `CheckoutGatewayRoute` only see the current `SalesChannelContext`, so a client cannot ask which payment/shipping methods are available for an existing order. The ADR introduces an order-based "effective request state" (context, `Context`, cart) that opted-in routes receive instead of the session state, while the canonical request attributes stay untouched. The storefront already does this for the account order edit page by converting the order to a cart and reassembling a matching context before calling the checkout gateway.

## When to use

- A headless client needs payment/shipping/gateway availability for an existing order (e.g. changing the payment method after checkout).
- You extend `OrderConverter` or order visibility and need to know which code paths restore orders.
- You check whether the installed version already ships this mechanism (6.7.15.1 does not — see Version notes).

## Key steps / config

What the installed code provides today, on which the design builds:

1. Canonical request attributes: `PlatformRequest::ATTRIBUTE_CONTEXT_OBJECT` (`sw-context`) and `PlatformRequest::ATTRIBUTE_SALES_CHANNEL_CONTEXT_OBJECT` (`sw-sales-channel-context`) hold the session state; per the ADR they remain the source of truth for the original request.
2. Order restoration primitives: `OrderConverter::assembleSalesChannelContext(OrderEntity $order, Context $context, array $overrideOptions = [])` and `OrderConverter::convertToCart(OrderEntity $order, Context $context)`. Both mark the result with the `OrderConverter::ORIGINAL_ID` extension (`originalId`), which identifies restored carts and contexts.
3. `CheckoutPermissions::SKIP_CART_PERSISTENCE` keeps a recalculated cart out of storage; it is part of `OrderConverter::ADMIN_EDIT_ORDER_PERMISSIONS`, which additionally allows price overwrites (the ADR's set deliberately leaves those out).
4. Candidate routes: `/store-api/payment-method` (`PaymentMethodRoute`), `/store-api/shipping-method` (`ShippingMethodRoute`), `/store-api/checkout/gateway` (`CheckoutGatewayRoute`).
5. Planned resolver flow (ADR): check route opt-in → `orderId` present (path attribute, then query, then body; no header, because headers are not part of the HTTP cache key) → load the order through the order route (sales channel + customer filter, `OrderCriteriaEvent`, route decorations such as B2B visibility) → assemble context → convert to cart → store as effective request state. Argument value resolvers for `SalesChannelContext`, `Context`, `Cart` and `Criteria` inject the effective object if present, else the canonical one; handler signatures do not change.
6. Error codes the ADR specifies: malformed `orderId` → `CHECKOUT__INVALID_UUID`; no logged-in customer/guest → `CHECKOUT__ORDER_CUSTOMER_NOT_LOGGED_IN`; missing or foreign order → `CHECKOUT__ORDER_ORDER_NOT_FOUND` (existence stays unobservable). Cart errors (blocked payment/shipping methods) are part of the response payload, not failures.

## Essential identifiers

- `PlatformRequest::ATTRIBUTE_CONTEXT_OBJECT`, `PlatformRequest::ATTRIBUTE_SALES_CHANNEL_CONTEXT_OBJECT`
- `OrderConverter::assembleSalesChannelContext()`, `OrderConverter::convertToCart()`, `OrderConverter::ORIGINAL_ID`
- `CheckoutPermissions::SKIP_CART_PERSISTENCE`
- `PaymentMethodRoute`, `ShippingMethodRoute`, `CheckoutGatewayRoute`
- `CHECKOUT__INVALID_UUID`, `CHECKOUT__ORDER_CUSTOMER_NOT_LOGGED_IN`, `CHECKOUT__ORDER_ORDER_NOT_FOUND`

## Gotchas

- Opt-in is per route via the `defaults` of the Symfony `Route` attribute: route default `_allowOrderRestoration` (`PlatformRequest::ATTRIBUTE_ALLOW_ORDER_RESTORATION`). Only read-only routes may opt in — the restoration permission set would be unsafe for writes.
- Effective objects go under `sw-effective-sales-channel-context`, `sw-effective-context`, `sw-effective-cart` (`PlatformRequest::ATTRIBUTE_EFFECTIVE_*`). Never overwrite the canonical attributes: the restored context carries its own token, and the response context token, cache hash and subscribers would otherwise act on the synthetic state. The client's request token stays unchanged.
- Restored state is not recalculated: the context keeps the order's stored rule IDs and the cart is not processed, matching the edit-order page and `POST /store-api/order/payment`.
- Restored carts/contexts are request-local and must never be persisted (DB or Redis). No persister guard is added on `OrderConverter::ORIGINAL_ID`, because the Administration's convert-order-to-cart flow persists such carts on purpose.
- Responses built on an effective state are marked not cacheable.
- On failure with opt-in and an `orderId`, the request fails — never silently fall back to the session context. Restoration failure of a visible order is `CHECKOUT__ORDER_RESTORATION_FAILED` (HTTP 400).
- The ADR calls `SalesChannelContextRestorer::restoreByOrder()` deprecated (it re-matches rules and does not check order visibility); in 6.7.15.1 it carries no deprecation marker yet.

## Version notes

- Not present in 6.7.15.1: the shared `OrderRestorer` (`restore()`, `addRequiredAssociations()`, `OrderRestorer::PERMISSIONS`), `_allowOrderRestoration`, the `sw-effective-*` attributes and `CHECKOUT__ORDER_RESTORATION_FAILED` are not in the installed code. Treat the mechanism as a future change; current headless clients cannot get order-based availability from these routes.
- Once implemented, the storefront edit-order page and `POST /store-api/order/payment` are meant to switch to `OrderRestorer` as well.

## Code check (6.7.15.1)
- absent `ATTRIBUTE_ALLOW_ORDER_RESTORATION` — no such PlatformRequest constant in the installed code
- absent `ATTRIBUTE_EFFECTIVE_` — no effective-state attribute constants in the installed code
- absent `OrderRestorer` — class not found in any code root
- absent `_allowOrderRestoration` — no route declares this default
- absent `CHECKOUT__ORDER_RESTORATION_FAILED` — error code not defined
- confirmed `PlatformRequest::ATTRIBUTE_SALES_CHANNEL_CONTEXT_OBJECT` — value sw-sales-channel-context — vendor/shopware/core/PlatformRequest.php:71
- confirmed `OrderConverter::assembleSalesChannelContext()` — builds context from OrderEntity — vendor/shopware/core/Checkout/Cart/Order/OrderConverter.php:315
- confirmed `OrderConverter::ORIGINAL_ID` — extension added to restored cart — vendor/shopware/core/Checkout/Cart/Order/OrderConverter.php:277
- confirmed `CheckoutPermissions::SKIP_CART_PERSISTENCE` — value skipCartPersistence — vendor/shopware/core/Checkout/CheckoutPermissions.php:16
- corrected `SalesChannelContextRestorer::restoreByOrder()` — docs: deprecated; no deprecation marker in installed code — vendor/shopware/core/System/SalesChannel/Context/SalesChannelContextRestorer.php:48
