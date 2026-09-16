---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/injecting-services.md
title: Injecting Services
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/injecting-services.html
sourceHash: f6e2d58a6280c66976fa95d3c70cc28d8133fefd
codeCheckedAgainst: "6.7.13.0"
keywords: ["inject", "repositoryFactory", "BottleJS", "Shopware.Component.register", "Shopware.Application.addServiceProvider", "Shopware.Service", "administration service", "dependency injection", "DI container", "vue component", "service container"]
summary: How Administration services (BottleJS DI container) are injected into Vue components via the inject property, e.g. repositoryFactory.
lastBuilt: 2026-09-15
---
## What it is

The Shopware 6 Administration uses BottleJS as its dependency injection container. Services are small self-contained utility classes (for example `repositoryFactory`, which provides a way to talk to the API). A component gets a service by listing its name in the `inject` property; the service is then available on the component instance under that name.

## When to use

Whenever an Administration component in a plugin needs a registered service such as `repositoryFactory` or a custom API service, instead of importing the implementation directly.

## Key steps / config

1. Register (or reuse) a component with `Shopware.Component.register`.
2. List the service names in `inject`.
3. Access the service as `this.<serviceName>`.

```javascript
Shopware.Component.register('swag-basic-example', {
    inject: ['repositoryFactory'],
    created() {
        this.productRepository = this.repositoryFactory.create('product');
    },
});
```

Where the injected names come from: services are registered with `Shopware.Application.addServiceProvider('<name>', (container) => ...)`, which adds a factory `service.<name>` to the BottleJS container. The core registers `repositoryFactory` this way. Outside a component, core code resolves the same service with `Shopware.Service('repositoryFactory')`.

## Essential identifiers

- `inject` (component option)
- `repositoryFactory`, `repositoryFactory.create('product')`
- `Shopware.Component.register`
- `Shopware.Application.addServiceProvider`
- `Shopware.Service('<name>')`
- BottleJS

## Gotchas

- The name in `inject` must match the name the service was registered under with `addServiceProvider`; the registration only creates a factory in the container.

## Code check (6.7.13.0)
- confirmed `Bottle` — the Application bootstrapper wraps a BottleJS container — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:2
- confirmed `addServiceProvider` — registers factory `service.<name>` on the container — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:169
- confirmed `addServiceProvider('repositoryFactory'` — core registration of repositoryFactory — vendor/shopware/administration/Resources/app/administration/src/app/init/repository.init.ts:68
- confirmed `Shopware.Service('repositoryFactory')` — service lookup outside components — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:194
- confirmed `AsyncComponentFactory.register` — backs Shopware.Component.register — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:130
