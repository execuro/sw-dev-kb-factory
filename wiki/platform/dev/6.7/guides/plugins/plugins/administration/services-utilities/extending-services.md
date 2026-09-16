---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/extending-services.md
title: Extending Services
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/extending-services.html
sourceHash: c274aa1f8472f565d9ecc444e84a172f9a7e8376
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware.Application.$container.resetProviders", "resetProviders", "addServiceProviderDecorator", "addServiceProviderMiddleware", "$container", "acl", "BottleJS", "decorate service", "service middleware", "extend administration service", "override core service"]
summary: "Extend Shopware-provided Administration services: call $container.resetProviders, then addServiceProviderDecorator or addServiceProviderMiddleware."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md"]
---
## What it is

How to extend a service Shopware itself provides in the Administration with BottleJS decorators and middleware. The Administration's service container is a BottleJS instance, exposed as `Shopware.Application.$container`. Creating your own services: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md.

## When to use

A plugin must change or observe a core Administration service (example: `acl`) that was already instantiated during the Shopware boot process.

## Key steps / config

1. Reset the provider so the next reference re-instantiates the service. Without arguments all providers are reset; pass `names` to reset only those:

```javascript
Shopware.Application.$container.resetProviders(['acl']);
```

2a. Decorator — runs once in the provider phase, after creation and before first access; must return the service (or a replacement object):

```javascript
Shopware.Application.addServiceProviderDecorator('acl', (aclService) => {
  aclService.foo = 'bar';
  return aclService;
});
```

2b. Middleware — runs every time the service is accessed from the container; receives the service instance and `next`:

```javascript
Shopware.Application.addServiceProviderMiddleware('acl', (service, next) => {
    console.log('ACL service gets called');
    next();
});
```

Both methods register on the `service` container (`service.<name>`) when given a name; given only a function, they apply to every service provider.

## Essential identifiers

- `Shopware.Application.$container.resetProviders(names)`
- `Shopware.Application.addServiceProviderDecorator(name, decorator)`
- `Shopware.Application.addServiceProviderMiddleware(name, middleware)`
- `acl` (example core service)

## Gotchas

- Reset providers before adding a decorator or middleware to a Shopware-provided service; otherwise the already-instantiated service is not affected.
- A decorator must return the service object; middleware must call `next()`.

## Code check (6.7.13.0)
- confirmed `ApplicationBootstrapper::$container` — public Bottle instance — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:41
- unverified `resetProviders` — BottleJS method, library in node_modules is out of scope; no Shopware wrapper found
- confirmed `ApplicationBootstrapper::addServiceProviderDecorator()` — registers decorator on service container — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:281
- confirmed `ApplicationBootstrapper::_addDecorator()` — named decorator bound to `service.<name>` — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:135
- confirmed `ApplicationBootstrapper::addServiceProviderMiddleware()` — (service, next) middleware — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:222
- confirmed `ApplicationBootstrapper::_addMiddleware()` — named middleware bound to `service.<name>` — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:113
- confirmed `acl` — service provider registered in core boot — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:119
