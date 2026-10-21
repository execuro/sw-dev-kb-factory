---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/injecting-services.md
sourceHash: f6e2d58a6280c66976fa95d3c70cc28d8133fefd
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/injecting-services.html
title: Injecting Services
version: "6.7"
versions:
  - "6.7"
keywords: ["inject", "repositoryFactory", "Shopware.Component.register", "BottleJS", "administration service", "dependency injection", "use service in component", "vue inject", "repositoryFactory.create", "product repository"]
summary: Use an Administration service in a Vue component by listing its name in the component's inject property, e.g. repositoryFactory.
lastBuilt: 2026-10-21
---
## What it is

How to use an existing service inside a Shopware 6 Administration component. Services are small self-contained utility classes managed by a BottleJS container — for example `repositoryFactory`, which provides repositories to talk to the API.

## When to use

A component registered by your plugin needs a service (repositories, ACL, login, your own API service) without importing it directly.

## Key steps / config

List the service names in the component's `inject` property; each injected service is then available under its name on the component instance (`this.<serviceName>`):

```javascript
Shopware.Component.register('swag-basic-example', {
    inject: ['repositoryFactory'],

    created() {
        this.productRepository = this.repositoryFactory.create('product');
    }
});
```

## Essential identifiers

- `inject: [...]` (component option)
- `repositoryFactory` / `this.repositoryFactory.create('<entity>')`
- `Shopware.Component.register`

## Version notes

The source links the repository factory at the 6.3 path `core/data-new/repository-factory.data.js`; in 6.7 the class lives in `core/data/repository-factory.data.ts`.

## Code check (6.7.15.1)
- confirmed `repositoryFactory` — registered as service provider during init — vendor/shopware/administration/Resources/app/administration/src/app/init/repository.init.ts:63
- confirmed `RepositoryFactory` — class in core/data, not core/data-new — vendor/shopware/administration/Resources/app/administration/src/core/data/repository-factory.data.ts:13
- confirmed `RepositoryFactory::create()` — takes the entity name — vendor/shopware/administration/Resources/app/administration/src/core/data/repository-factory.data.ts:42
- confirmed `ApplicationBootstrapper::addServiceProvider()` — services live in the `service.<name>` Bottle container — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:170
