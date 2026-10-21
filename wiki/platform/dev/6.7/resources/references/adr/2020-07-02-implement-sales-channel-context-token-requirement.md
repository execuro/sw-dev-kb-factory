---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2020-07-02-implement-sales-channel-context-token-requirement.md
sourceHash: 94d5f00b521580f5eb03a34b3e678bed08ff94eb
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-07-02-implement-sales-channel-context-token-requirement.html
title: Implement sales channel context token requirement for store-api and sales-channel-api
version: "6.7"
versions:
  - "6.7"
keywords: ["adr", "context token", "sw-context-token", "sales channel context", "store-api", "sales-channel-api", "PlatformRequest::ATTRIBUTE_CONTEXT_TOKEN_REQUIRED", "SalesChannelRequestContextResolver", "route defaults", "token required", "cart", "missing request parameter"]
summary: "ADR 2020-07-02: Store API routes that depend on a sales channel context token must reject calls without one instead of generating a token"
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2020-07-02, area core) about routes of the sales-channel-api and the Store API that depend on a sales channel context token to identify the correct context. It decides that such routes must be marked so they can only be called with a token, distinguishing them from open routes, so they cannot be called accidentally or intentionally without one.

## When to use

When adding or reviewing a Store API route and deciding whether a caller must send an existing context token, or whether Shopware may silently create one for the default sales channel context.

## Key steps / config

The decision: every route that depends on a sales channel context token is only callable with such a token provided. To decide whether a route depends on a token, ask:

- Will the automatic generation of the token be a security issue?
- Will the automatic generation lead to an abandoned entity (e.g. the cart)?
- Can every possible caller create or know the needed token beforehand? (The asynchronous payment provider, for example, cannot.)

Every Store API route has to be checked against these questions. In the installed code the requirement is a route default, not an annotation class. A route that needs the token sets the `PlatformRequest::ATTRIBUTE_CONTEXT_TOKEN_REQUIRED` default in its `#[Route]` attribute:

```php
#[Route(
    defaults: [
        PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID],
        PlatformRequest::ATTRIBUTE_CONTEXT_TOKEN_REQUIRED => true,
    ]
)]
class ChangePasswordRoute extends AbstractChangePasswordRoute
```

`SalesChannelRequestContextResolver::resolve()` checks each sales channel request: if the `sw-context-token` header is missing and the route requires it, it throws `RoutingException::missingRequestParameter()` for that header; otherwise it generates a random 32-character token and continues with a fresh context.

## Essential identifiers

- `PlatformRequest::ATTRIBUTE_CONTEXT_TOKEN_REQUIRED`
- `PlatformRequest::HEADER_CONTEXT_TOKEN` (`sw-context-token`)
- `SalesChannelRequestContextResolver`
- `RoutingException::missingRequestParameter()`
- Example routes: `ChangePasswordRoute`, `ChangeEmailRoute`, `ChangeCustomerProfileRoute`, `ConvertGuestRoute`

## Gotchas

- The ADR tells developers to set the `ContextTokenRequired` annotation (`Shopware\Core\Framework\Routing\Annotation\ContextTokenRequired`). That class does not exist in the installed code; the route default with value `_contextTokenRequired` is what the resolver reads.
- Counter decision considered: leave the routes open. Without a token Shopware generates one with the default sales channel context; no security issue was associated with context-less calls, but an entity such as a cart or customer could accidentally be added to the default context instead of the intended custom one.
- A route can also set the default explicitly to `false` (e.g. `ImitateCustomerRoute`).

## Code check (6.7.15.1)
- absent `Shopware\Core\Framework\Routing\Annotation\ContextTokenRequired` — annotation class not found anywhere in the installed code
- confirmed `PlatformRequest::ATTRIBUTE_CONTEXT_TOKEN_REQUIRED` — route attribute key _contextTokenRequired — vendor/shopware/core/PlatformRequest.php:83
- confirmed `PlatformRequest::HEADER_CONTEXT_TOKEN` — header name sw-context-token — vendor/shopware/core/PlatformRequest.php:18
- confirmed `SalesChannelRequestContextResolver::contextTokenRequired()` — reads the route attribute, default false — vendor/shopware/core/Framework/Routing/SalesChannelRequestContextResolver.php:90
- confirmed `RoutingException::missingRequestParameter()` — thrown when token required but header missing — vendor/shopware/core/Framework/Routing/SalesChannelRequestContextResolver.php:46
- confirmed `Random::getAlphanumericString()` — 32-char token generated when not required — vendor/shopware/core/Framework/Routing/SalesChannelRequestContextResolver.php:49
- confirmed `ChangePasswordRoute` — sets the token-required route default to true — vendor/shopware/core/Checkout/Customer/SalesChannel/ChangePasswordRoute.php:37
- confirmed `ImitateCustomerRoute` — sets the token-required route default to false — vendor/shopware/core/Checkout/Customer/SalesChannel/ImitateCustomerRoute.php:35
