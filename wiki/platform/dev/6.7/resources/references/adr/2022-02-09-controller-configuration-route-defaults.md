---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2022-02-09-controller-configuration-route-defaults.md
sourceHash: 3dc1b4937317cdb86e5085a0c884279e3163b4f3
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-02-09-controller-configuration-route-defaults.html
title: Move controller level annotation into Symfony route annotation
version: "6.7"
versions:
  - "6.7"
keywords: ["route defaults", "_loginRequired", "_routeScope", "_acl", "_captcha", "_contextTokenRequired", "PlatformRequest", "ATTRIBUTE_LOGIN_REQUIRED", "ATTRIBUTE_ROUTE_SCOPE", "controller annotation", "route attribute", "KernelEvents::REQUEST", "adr"]
summary: "ADR: controller config (login, ACL, captcha, route scope) moved from custom annotations into Symfony route defaults like _loginRequired."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-02-09, area core). Controllers used to be configured with custom annotations such as `@LoginRequired` (customer must be logged in), `@Acl` (protect the controller with ACL privileges) and `@RouteScope` (scope of the route). Because annotations are bound to the implementing class, every decorator had to copy them and keep them in sync with the target class. The decision moves this configuration into the `defaults` of the Symfony route definition; Symfony passes the defaults into the attribute bag of the `Request`, where Shopware checks them during the HTTP kernel request cycle. The custom annotations were deprecated for removal in 6.5.0.

## When to use

When writing or decorating a Shopware controller or Store API route and you need to require a logged-in customer, an ACL privilege, a captcha, a context token or a route scope; or when migrating pre-6.5 code that still uses the old annotations.

## Key steps / config

Mapping from old annotation to route default key:

- `@Captcha` -> `_captcha`
- `@LoginRequired` -> `_loginRequired`
- `@Acl` -> `_acl`
- `@ContextTokenRequired` -> `_contextTokenRequired`
- `@RouteScope` -> `_routeScope`

The ADR shows the docblock form, `defaults={"_loginRequired"=true}` added to `@Route("/store-api/product", name="store-api.product.search", methods={"GET", "POST"})`. The installed 6.7 core writes the same keys through PHP attributes and the `PlatformRequest` constants:

```php
#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]
class ChangePasswordRoute
{
    #[Route(
        path: '/store-api/account/change-password',
        name: 'store-api.account.change-password',
        defaults: [PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED => true],
        methods: [Request::METHOD_POST]
    )]
    public function change(/* ... */) { /* ... */ }
}
```

The route scope is typically set once at class level; per-action keys such as `_loginRequired` sit on the method route.

## Essential identifiers

- Route default keys: `_captcha`, `_loginRequired`, `_acl`, `_contextTokenRequired`, `_routeScope`
- `Shopware\Core\PlatformRequest` constants: `ATTRIBUTE_ACL`, `ATTRIBUTE_CAPTCHA`, `ATTRIBUTE_ROUTE_SCOPE`, `ATTRIBUTE_CONTEXT_TOKEN_REQUIRED`, `ATTRIBUTE_LOGIN_REQUIRED`
- Symfony events for code before/after a controller: `KernelEvents::REQUEST`, `KernelEvents::RESPONSE`

## Gotchas

- Since the configuration now lives in route defaults rather than in class annotations, decorators no longer need to copy it.
- Extensions can still decorate a controller if it has an abstract class, or use `KernelEvents::REQUEST` / `KernelEvents::RESPONSE` to run code before or after the actual controller.

## Version notes

- The custom controller annotations were deprecated for removal in 6.5.0; route defaults are the only form in 6.7.

## Code check (6.7.15.1)
- confirmed `PlatformRequest::ATTRIBUTE_ACL` — value `_acl` — vendor/shopware/core/PlatformRequest.php:76
- confirmed `PlatformRequest::ATTRIBUTE_CAPTCHA` — value `_captcha` — vendor/shopware/core/PlatformRequest.php:77
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:78
- confirmed `PlatformRequest::ATTRIBUTE_CONTEXT_TOKEN_REQUIRED` — value `_contextTokenRequired` — vendor/shopware/core/PlatformRequest.php:83
- confirmed `PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED` — value `_loginRequired` — vendor/shopware/core/PlatformRequest.php:84
- confirmed `ATTRIBUTE_LOGIN_REQUIRED` — set in route `defaults` of a Store API route — vendor/shopware/core/Checkout/Customer/SalesChannel/ChangePasswordRoute.php:63
- confirmed `ATTRIBUTE_ROUTE_SCOPE` — class-level route default with `StoreApiRouteScope::ID` — vendor/shopware/core/Checkout/Customer/SalesChannel/AddWishlistProductRoute.php:29
- confirmed `ATTRIBUTE_ROUTE_SCOPE` — read from the request attribute bag at runtime — vendor/shopware/core/Framework/Routing/RouteScopeListener.php:111
- unverified `KernelEvents::REQUEST` — Symfony HttpKernel, out of scope
