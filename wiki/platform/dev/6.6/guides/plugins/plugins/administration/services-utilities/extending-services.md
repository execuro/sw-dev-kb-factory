---
id: platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/extending-services.md
title: Extending Services
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/services-utilities/extending-services.html
sourceHash: 6987377e390fa083da106ee620b68e7dd7512653
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-custom-service.md
keywords: ["resetProviders", "addServiceProviderDecorator", "addServiceProviderMiddleware", "BottleJS", "service decorator", "service middleware", "Application.$container", "administration service", "extend service", "bottlejs decorators", "bottlejs middleware"]
summary: How to reset BottleJS providers and add decorators or middleware to extend a Shopware-provided Administration service.
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to extend a Shopware-provided Administration service using middleware and decorators. The Administration uses BottleJS to provide its service framework; this guide is about modifying existing Shopware services rather than creating new ones (which is covered by a separate guide on creating custom services).

## When to use

Use this when a plugin needs to hook into or modify the behavior of a service Shopware already provides — for example intercepting calls to the `acl` service — rather than replacing it outright or writing a brand-new service.

## Key steps / config

Because Shopware-provided services are already instantiated during the boot process, they must be reset with `resetProviders` before decorators or middleware can be attached, so the container re-instantiates the provider on next reference:

```javascript
Shopware.Application.$container.resetProviders()
```

Passing a `names` array to `resetProviders` limits the reset to only the named providers.

A decorator is a function that intercepts a service in the provider phase, after it is created but before it is first accessed, and must return the service (or a replacement object) to be used instead:

```javascript
Shopware.Application.$container.resetProviders(['acl']);

Shopware.Application.addServiceProviderDecorator('acl', (aclService) => {
  aclService.foo = 'bar';
  console.log(aclService);
  return aclService;
});
```

Middleware is similar but runs every time the service is accessed from the container, receiving the service instance and a `next` function that must be called to continue:

```javascript
Shopware.Application.$container.resetProviders(['acl']);

Shopware.Application.addServiceProviderMiddleware('acl', (service, next) => {
    console.log('ACL service gets called');
    next();
});
```

In both cases, the providers must be reset first, exactly as with decorators.

## Essential identifiers

- `Shopware.Application.$container.resetProviders([names])` — resets service providers so they are re-instantiated.
- `Shopware.Application.addServiceProviderDecorator(name, fn)` — adds a one-time decorator run when the service is first created.
- `Shopware.Application.addServiceProviderMiddleware(name, fn)` — adds middleware run on every access of the service.

## Gotchas

Decorators and middleware only take effect after `resetProviders` has been called for the relevant service name(s); attaching them without resetting the provider first has no effect because the already-instantiated service instance is unaffected.
