---
id: platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/injecting-services.md
title: Injecting services
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/services-utilities/injecting-services.html
sourceHash: 1edd111eb18469c20c38fc9d31b1a9fb2952c4a8
keywords: ["inject", "repositoryFactory", "bottleJS", "administration service", "Component.register", "inject property", "service injection", "Vue component", "administration", "product repository", "self-contained utility"]
summary: How to inject an Administration service like repositoryFactory into a Vue component using the inject property in Shopware 6.
lastBuilt: "2026-09-15"
---
## What it is

This short guide explains what an Administration service is and how to use one inside a plugin component. Shopware 6 uses bottleJS to inject services, which are described as small self-contained utility classes — the `repositoryFactory` is given as an example, providing a way to talk to the API.

## When to use

Use this whenever a Vue component in the Administration needs access to a Shopware service, such as fetching data through the repository layer, rather than implementing that logic itself.

## Key steps / config

A service is injected into a Vue component by listing its name in the component's `inject` property when calling `Shopware.Component.register`. Once injected, the service becomes available on the component instance under that same name:

```javascript
Shopware.Component.register('swag-basic-example', {
    inject: ['repositoryFactory'],

    created() {
        this.productRepository = this.repositoryFactory.create('product')
    }
});
```

In the example, `repositoryFactory` is injected and then used in the `created` lifecycle hook to instantiate a repository for the `product` entity, stored on `this.productRepository` for later use inside the component.

## Essential identifiers

- `inject: ['repositoryFactory']` — the component option array used to declare which service(s) to inject.
- `repositoryFactory` — the example service used to create entity repositories, e.g. `this.repositoryFactory.create('product')`.
- `Shopware.Component.register(name, { inject, created() {...} })` — where the injected service is declared and first used.

## Gotchas

An injected service is only available on the component instance after Vue has processed the `inject` option, so it should be accessed from lifecycle hooks such as `created`, not before the component is set up.
