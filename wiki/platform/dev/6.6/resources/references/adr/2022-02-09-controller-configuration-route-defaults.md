---
id: platform/dev/6.6/resources/references/adr/2022-02-09-controller-configuration-route-defaults.md
title: Move controller level annotation into Symfony route annotation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-02-09-controller-configuration-route-defaults.html
sourceHash: 3dc1b4937317cdb86e5085a0c884279e3163b4f3
keywords: ["@Route defaults", "@LoginRequired", "@Acl", "@RouteScope", "@Captcha", "@ContextTokenRequired", "_loginRequired", "_acl", "_routeScope", "_captcha", "_contextTokenRequired", "KernelEvents::REQUEST", "controller annotations"]
summary: ADR replacing custom controller annotations (@LoginRequired, @Acl, @RouteScope, ...) with keys in Symfony's @Route defaults, e.g. _loginRequired.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record replacing Shopware's custom controller-level annotations with entries in the `defaults` of Symfony's `@Route` annotation, so decorators no longer need to copy and keep annotations in sync with the class they wrap.

## When to use
Relevant when reading or writing a controller action that previously relied on `@LoginRequired`, `@Acl`, `@RouteScope`, `@Captcha` or `@ContextTokenRequired`, or when decorating such a controller.

## Key steps / config
Before:

```php
@LoginRequired
@Route("/store-api/product", name="store-api.product.search", methods={"GET", "POST"})
public function myAction()
```

After:

```php
@Route("/store-api/product", name="store-api.product.search", methods={"GET", "POST"}, defaults={"_loginRequired"=true})
public function myAction()
```

Symfony passes `defaults` into the Request object's attribute bag, checked during the request cycle of the HTTP kernel. Annotation-to-default mapping:
- `@Captcha` -> `_captcha`
- `@LoginRequired` -> `_loginRequired`
- `@Acl` -> `_acl`
- `@ContextTokenRequired` -> `_contextTokenRequired`
- `@RouteScope` -> `_routeScope`

Extensions can still decorate the controller if it has an abstract class, or use `KernelEvents::REQUEST`/`KernelEvents::RESPONSE` to run code before or after the controller.

## Essential identifiers
- `@Route` `defaults` keys: `_loginRequired`, `_acl`, `_routeScope`, `_captcha`, `_contextTokenRequired`
- `KernelEvents::REQUEST`, `KernelEvents::RESPONSE`

## Gotchas
- The custom annotations (`@LoginRequired`, `@Acl`, `@RouteScope`, `@Captcha`, `@ContextTokenRequired`) are deprecated for removal in 6.5.0.

## Version notes
The old custom controller annotations are deprecated for removal in 6.5.0.
