---
id: platform/dev/6.7/resources/references/adr/2020-11-20-add-login-required-annotation.md
title: Add the login required annotation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-11-20-add-login-required-annotation.html
sourceHash: b1b5df6bb9eaa391485ccabf9d8f01dbcb545735
codeCheckedAgainst: "6.7.13.0"
keywords: ["LoginRequired", "_loginRequired", "_loginRequiredAllowGuest", "PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED", "PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED_ALLOW_GUEST", "CustomerNotLoggedInException", "store-api", "storefront route", "login required", "guest customer", "route defaults", "SalesChannelContext"]
summary: "ADR on login-required routes; in 6.7 set route defaults _loginRequired / _loginRequiredAllowGuest (PlatformRequest constants) instead of @LoginRequired."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-11-20) that introduced a declarative way to mark Store API and Storefront routes as requiring a logged-in customer, validated against the `SalesChannelContext`, with an option to also admit guest customers. The ADR describes it as a docblock annotation; the installed 6.7 code expresses the same rule as route defaults.

## When to use

When a Store API or Storefront controller action must only be reachable by a logged-in customer (optionally including guests), or when an action argument of type `CustomerEntity` should be resolved from the context.

## Key steps / config

Set the flags in the `defaults` of the Symfony `#[Route]` attribute, using the constants on `Shopware\Core\PlatformRequest`:

```php
#[Route(
    path: '/store-api/account/logout',
    name: 'store-api.account.logout',
    defaults: [
        PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED => true,             // '_loginRequired'
        PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED_ALLOW_GUEST => true, // '_loginRequiredAllowGuest'
    ],
    methods: ['POST']
)]
```

Behaviour in `SalesChannelRequestContextResolver::validateLogin()`:

- `_loginRequired` not truthy: no check, the route is accessible without login.
- `_loginRequired` true and no customer in the `SalesChannelContext`: throws via `RoutingException::customerNotLoggedIn()` (a `CustomerNotLoggedInRoutingException`, HTTP 403).
- `_loginRequired` true, customer is a guest, `_loginRequiredAllowGuest` not true: same exception.
- `_loginRequiredAllowGuest` true: guests are admitted.

Storefront example: `frontend.account.edit-order.page` (`/account/order/edit/{orderId}`) sets both flags to true.

## Essential identifiers

- `Shopware\Core\PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED` (`_loginRequired`)
- `Shopware\Core\PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED_ALLOW_GUEST` (`_loginRequiredAllowGuest`)
- `Shopware\Core\Framework\Routing\SalesChannelRequestContextResolver`
- `Shopware\Core\Framework\Routing\Exception\CustomerNotLoggedInRoutingException`
- `Shopware\Core\Checkout\Customer\CustomerValueResolver`

## Gotchas

- A controller argument typed `CustomerEntity` is resolved by `CustomerValueResolver` only when `_loginRequired` is exactly `true`; otherwise it throws a "missing route annotation `LoginRequired`" error.
- Routes without the flag accept requests without a login — omitting it is an access-control decision.

## Version notes

- The ADR's `@LoginRequired` / `@LoginRequired(allowGuest=true)` docblock annotations, `@Since` and `@Route` docblocks, and versioned paths like `/store-api/v{version}/...` are gone in 6.7; routes use PHP attributes, route defaults and unversioned `/store-api/...` paths.
- The ADR names `CustomerNotLoggedInException`; the routing check now throws `CustomerNotLoggedInRoutingException`.

## Code check (6.7.13.0)
- confirmed `PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED` — value `_loginRequired` — vendor/shopware/core/PlatformRequest.php:82
- confirmed `PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED_ALLOW_GUEST` — value `_loginRequiredAllowGuest` — vendor/shopware/core/PlatformRequest.php:83
- corrected `LoginRequired` — docs: `@LoginRequired` docblock annotation; code checks the `_loginRequired` route attribute — vendor/shopware/core/Checkout/Customer/CustomerValueResolver.php:29
- confirmed `SalesChannelRequestContextResolver::validateLogin()` — throws when no customer, or guest without allow-guest — vendor/shopware/core/Framework/Routing/SalesChannelRequestContextResolver.php:95
- corrected `RoutingException::customerNotLoggedIn()` — docs: throws CustomerNotLoggedInException; returns CustomerNotLoggedInRoutingException, 403 — vendor/shopware/core/Framework/Routing/RoutingException.php:73
- confirmed `CustomerNotLoggedInRoutingException` — extends RoutingException — vendor/shopware/core/Framework/Routing/Exception/CustomerNotLoggedInRoutingException.php:12
- corrected `store-api.account.logout` — docs: path /store-api/v{version}/account/logout; path is /store-api/account/logout — vendor/shopware/core/Checkout/Customer/SalesChannel/LogoutRoute.php:47
- confirmed `frontend.account.edit-order.page` — sets login required and allow guest defaults — vendor/shopware/storefront/Controller/AccountOrderController.php:196
- confirmed `CustomerValueResolver::resolve()` — requires `_loginRequired === true` for CustomerEntity args — vendor/shopware/core/Checkout/Customer/CustomerValueResolver.php:18
