---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/extending-services.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md
sourceHash: c274aa1f8472f565d9ecc444e84a172f9a7e8376
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/extending-services.html
title: Extending Services
version: "6.7"
versions:
  - "6.7"
keywords: ["addServiceProviderDecorator", "addServiceProviderMiddleware", "resetProviders", "Shopware.Application.$container", "BottleJS", "bottle", "service decorator", "service middleware", "decorate admin service", "extend administration service", "acl", "dependency injection"]
summary: Extend existing Administration services with BottleJS decorators or middleware via Shopware.Application, after resetting the providers.
lastBuilt: 2026-10-21
---
## What it is

How to extend a Shopware-provided Administration service with BottleJS decorators and middleware. The Administration uses BottleJS as its service container; `Shopware.Application.$container` is the `Bottle` instance. Creating your own services is covered in [Add custom service](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md).

## When to use

You need to modify or wrap a core service (e.g. `acl`) from a plugin, after it was already instantiated during the Administration boot process.

## Key steps / config

1. Reset the provider so the next access re-instantiates it. Without arguments all providers are reset; passing names resets only those:

```javascript
Shopware.Application.$container.resetProviders(['acl']);
```

2. **Decorator** — runs once, after the service is created and before its first access. Return the service (or a replacement object):

```javascript
Shopware.Application.addServiceProviderDecorator('acl', (aclService) => {
  aclService.foo = 'bar';
  return aclService;
});
```

3. **Middleware** — runs every time the service is accessed from the container; receives the service instance and a `next` function:

```javascript
Shopware.Application.addServiceProviderMiddleware('acl', (service, next) => {
    console.log('ACL service gets called');
    next();
});
```

Both methods also accept a single function instead of a name; the installed code then registers it for the whole `service` container rather than one named service. Named registrations are stored as `service.<name>` in Bottle.

## Essential identifiers

- `Shopware.Application.$container` (Bottle instance)
- `Shopware.Application.$container.resetProviders(names?)`
- `Shopware.Application.addServiceProviderDecorator(nameOrDecorator, decorator?)`
- `Shopware.Application.addServiceProviderMiddleware(nameOrMiddleware, middleware?)`

## Gotchas

- Reset the providers before adding a decorator or middleware: core services are already instantiated in the boot process, so a decorator/middleware added afterwards does not affect them otherwise.

## Code check (6.7.15.1)
- confirmed `ApplicationBootstrapper::$container` — public `Bottle` property holding the container — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:42
- confirmed `ApplicationBootstrapper::addServiceProviderDecorator()` — registers on `service` container, by name or for all — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:282
- confirmed `ApplicationBootstrapper::_addDecorator()` — name form maps to `service.<name>` — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:136
- confirmed `ApplicationBootstrapper::addServiceProviderMiddleware()` — middleware gets `(service, next)` — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:223
- confirmed `ApplicationBootstrapper::_addMiddleware()` — name form maps to `service.<name>` — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:114
- confirmed `acl` — core service registered via `addServiceProvider('acl', ...)` — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:121
- confirmed `resetProviders` — used on `Shopware.Application.$container` in core specs — vendor/shopware/administration/Resources/app/administration/src/app/init-post/language.init.spec.js:9
- unverified `Bottle::resetProviders()` — implementation lives in the bottlejs package, out of scope
