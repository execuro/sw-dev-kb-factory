---
id: platform/dev/6.7/resources/references/adr/2022-02-09-controller-configuration-route-defaults.md
title: Move controller level annotation into Symfony route annotation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-02-09-controller-configuration-route-defaults.html
sourceHash: 3dc1b4937317cdb86e5085a0c884279e3163b4f3
codeCheckedAgainst: "6.7.13.0"
keywords: ["_loginRequired", "_routeScope", "_acl", "_captcha", "_contextTokenRequired", "PlatformRequest", "route defaults", "#[Route]", "controller annotations", "LoginRequired", "RouteScope", "request attributes", "adr"]
summary: "ADR: controller config (_loginRequired, _routeScope, _acl, _captcha, _contextTokenRequired) moves from custom annotations into Symfony route defaults."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record: controller-level configuration that used to be expressed as custom annotations (login required, ACL privileges, route scope, captcha, context token) is instead declared in the `defaults` of the Symfony route. Symfony copies route defaults into the request's attribute bag, where Shopware reads them during the HTTP kernel request cycle.

## When to use

- Writing or reviewing a Shopware controller or Store API route and configuring scope, login, ACL, captcha or context token requirements.
- Migrating legacy controller code that still uses the custom annotations.
- Decorating a controller: because configuration now lives on the route, decorators no longer need to copy class annotations.

## Key steps / config

Declare the configuration as route defaults. In the installed 6.7 code this is the PHP `#[Route]` attribute (`Symfony\Component\Routing\Attribute\Route`) with `PlatformRequest` constants as keys, both on the class and on the action method:

```php
#[Route(defaults: [
    PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID],
    PlatformRequest::ATTRIBUTE_CONTEXT_TOKEN_REQUIRED => true,
])]
class MyRoute
{
    #[Route(path: '/store-api/product', name: 'store-api.product.search',
        defaults: [PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED => true],
        methods: ['GET', 'POST'])]
    public function myAction() { /* ... */ }
}
```

Default keys (`Shopware\Core\PlatformRequest` constants):

| Former annotation purpose | Default key | Constant |
|---|---|---|
| Captcha | `_captcha` | `ATTRIBUTE_CAPTCHA` |
| Login required | `_loginRequired` | `ATTRIBUTE_LOGIN_REQUIRED` |
| ACL privileges | `_acl` | `ATTRIBUTE_ACL` |
| Context token required | `_contextTokenRequired` | `ATTRIBUTE_CONTEXT_TOKEN_REQUIRED` |
| Route scope | `_routeScope` | `ATTRIBUTE_ROUTE_SCOPE` |

Route scope ids: `StoreApiRouteScope::ID` (`store-api`), `ApiRouteScope::ID` (`api`).

To run code before or after a controller, extensions can decorate the controller if it has an abstract class, or subscribe to `KernelEvents::REQUEST` / `KernelEvents::RESPONSE`.

## Essential identifiers

- `Shopware\Core\PlatformRequest` — `ATTRIBUTE_LOGIN_REQUIRED`, `ATTRIBUTE_ROUTE_SCOPE`, `ATTRIBUTE_ACL`, `ATTRIBUTE_CAPTCHA`, `ATTRIBUTE_CONTEXT_TOKEN_REQUIRED`
- Request attributes `_loginRequired`, `_routeScope`, `_acl`, `_captcha`, `_contextTokenRequired`
- `StoreApiRouteScope::ID`, `ApiRouteScope::ID`
- `KernelEvents::REQUEST`, `KernelEvents::RESPONSE`

## Gotchas

- `Shopware\Core\Framework\Routing\RouteScope` still exists but is the `default` route scope class, not the old annotation.
- A related key `_loginRequiredAllowGuest` (`ATTRIBUTE_LOGIN_REQUIRED_ALLOW_GUEST`) exists next to `_loginRequired` in the installed code.

## Version notes

The ADR (2022) replaced the custom annotations `@Captcha`, `@LoginRequired`, `@Acl`, `@ContextTokenRequired` and `@RouteScope` and deprecated them for removal in 6.5.0. Its examples use the docblock form `@Route(..., defaults={"_loginRequired"=true})`; current code uses PHP attributes as shown above.

## Code check (6.7.13.0)
- confirmed `PlatformRequest::ATTRIBUTE_ACL` — value '_acl' — vendor/shopware/core/PlatformRequest.php:75
- confirmed `PlatformRequest::ATTRIBUTE_CAPTCHA` — value '_captcha' — vendor/shopware/core/PlatformRequest.php:76
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value '_routeScope' — vendor/shopware/core/PlatformRequest.php:77
- confirmed `PlatformRequest::ATTRIBUTE_CONTEXT_TOKEN_REQUIRED` — value '_contextTokenRequired' — vendor/shopware/core/PlatformRequest.php:81
- confirmed `PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED` — value '_loginRequired' — vendor/shopware/core/PlatformRequest.php:82
- confirmed `PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED_ALLOW_GUEST` — value '_loginRequiredAllowGuest' — vendor/shopware/core/PlatformRequest.php:83
- corrected `defaults` — docs: @Route docblock annotation defaults={...}; code: #[Route(defaults: [...])] PHP attribute — vendor/shopware/core/Checkout/Customer/SalesChannel/ChangePasswordRoute.php:63
- confirmed `StoreApiRouteScope::ID` — value 'store-api' — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `RouteScope::ID` — default route scope class, value 'default' — vendor/shopware/core/Framework/Routing/RouteScope.php:11
- confirmed `ATTRIBUTE_LOGIN_REQUIRED` — read from request attributes during context resolution — vendor/shopware/core/Framework/Routing/SalesChannelRequestContextResolver.php:97
