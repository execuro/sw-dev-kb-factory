---
id: platform/dev/6.7/resources/references/adr/2020-07-02-implement-sales-channel-context-token-requirement.md
title: Implement sales channel context token requirement for store-api and sales-channel-api
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-07-02-implement-sales-channel-context-token-requirement.html
sourceHash: 94d5f00b521580f5eb03a34b3e678bed08ff94eb
codeCheckedAgainst: "6.7.13.0"
keywords: ["ContextTokenRequired", "_contextTokenRequired", "ATTRIBUTE_CONTEXT_TOKEN_REQUIRED", "PlatformRequest", "sw-context-token", "SalesChannelRequestContextResolver", "context token", "store-api", "sales-channel-api", "route defaults", "sales channel context", "adr"]
summary: "ADR: store-api routes needing a sales channel context token must require it; in 6.7 via route default PlatformRequest::ATTRIBUTE_CONTEXT_TOKEN_REQUIRED."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-07-02): routes of the store-api (and the former sales-channel-api) that depend on a sales channel context token must only be callable when the token is provided, instead of silently getting a freshly generated token with the default sales channel context. Routes declare this requirement explicitly.

## When to use

- You add a Store API route and must decide whether it may run without a context token.
- You are debugging a "missing request parameter" error for the context token header on a Store API call.

Questions from the ADR to decide whether a route requires a token:

- Would automatic generation of the token be a security issue?
- Would automatic generation lead to an abandoned entity (e.g. a cart)?
- Can every possible caller create or know the token beforehand? (An asynchronous payment provider cannot.)

## Key steps / config

In the installed code the requirement is a route default, not an annotation class:

```php
#[Route(
    defaults: [
        PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID],
        PlatformRequest::ATTRIBUTE_CONTEXT_TOKEN_REQUIRED => true,
    ]
)]
```

Behavior in `SalesChannelRequestContextResolver::resolve()` for routes in a sales-channel-context-dependent scope:

1. If the `sw-context-token` header (`PlatformRequest::HEADER_CONTEXT_TOKEN`) is missing and the route default is `true`, a `RoutingException::missingRequestParameter` is thrown for that header.
2. If the header is missing and the default is absent or `false`, a random 32-character token is generated and set on the request.
3. The context is then loaded for that token.

Core examples setting the default to `true`: `ChangePasswordRoute`, `ChangeEmailRoute`, `ChangeCustomerProfileRoute`, `ConvertGuestRoute`, `ChangeLanguageRoute`.

## Essential identifiers

- `Shopware\Core\PlatformRequest::ATTRIBUTE_CONTEXT_TOKEN_REQUIRED`
- `Shopware\Core\PlatformRequest::HEADER_CONTEXT_TOKEN` (`sw-context-token`)
- `Shopware\Core\Framework\Routing\SalesChannelRequestContextResolver`
- `Shopware\Core\Framework\Routing\StoreApiRouteScope` (`store-api`)

## Gotchas

- The annotation class `Shopware\Core\Framework\Routing\Annotation\ContextTokenRequired` named by the ADR no longer exists; use the route default `_contextTokenRequired` instead.
- Without the requirement, a call without a token works but may attach entities (cart, customer) to a new default context rather than the intended one — the risk the ADR's counter-decision accepted.

## Version notes

- The ADR predates the switch from annotations to route attribute defaults. The installed routing code has no `sales-channel-api` scope; only the `store-api` scope applies.

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\Routing\Annotation\ContextTokenRequired` — replaced by the route default `_contextTokenRequired` in `PlatformRequest`
- corrected `ATTRIBUTE_CONTEXT_TOKEN_REQUIRED` — docs: annotation class; code: route default `_contextTokenRequired` — vendor/shopware/core/PlatformRequest.php:81
- confirmed `HEADER_CONTEXT_TOKEN` — header name `sw-context-token` — vendor/shopware/core/PlatformRequest.php:18
- confirmed `contextTokenRequired` — throws missing header when required, else generates a token — vendor/shopware/core/Framework/Routing/SalesChannelRequestContextResolver.php:45
- confirmed `ATTRIBUTE_CONTEXT_TOKEN_REQUIRED` — read with default `false` — vendor/shopware/core/Framework/Routing/SalesChannelRequestContextResolver.php:92
- confirmed `ATTRIBUTE_CONTEXT_TOKEN_REQUIRED` — example route default `true` on `ChangePasswordRoute` — vendor/shopware/core/Checkout/Customer/SalesChannel/ChangePasswordRoute.php:36
- confirmed `StoreApiRouteScope::ID` — value `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
