---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md
title: Adding Services
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/add-custom-service.html
sourceHash: bff07d5a7a3d8763c57b9add174d7aed12e12316
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware.Service().register", "Shopware.Application.getContainer", "addServiceProviderMiddleware", "addServiceProviderDecorator", "inject", "httpClient", "BottleJS", "administration service", "dependency injection", "service container", "decorate service", "middleware"]
summary: "Register a custom Administration service with Shopware.Service().register, inject it into components, and add BottleJS middleware or decorators."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md"]
---
## What it is

How to add a service to the Shopware 6 Administration's injection container (built on BottleJS), inject it into Vue components, and attach middleware or decorators to it.

## When to use

A plugin needs reusable Administration logic (e.g. a class that calls an external or Admin API via the HTTP client) that components should receive by injection instead of importing it.

## Key steps / config

1. Write the service class, e.g. `<administration root>/services/joke.service.js`, taking dependencies through its constructor:

```javascript
export default class JokeService {
    constructor(httpClient) { this.httpClient = httpClient; }
    joke() { return this.httpClient.get('...').then(response => response.data); }
}
```

2. Register it in an init script (e.g. `<administration root>/init/joke-service.init.js`) that is imported in the plugin's `main.js`. The provider callback returns the instance; the HTTP client comes from the `init` container:

```javascript
import JokeService from '../services/joke.service'

Shopware.Service().register('joker', (container) => {
    const initContainer = Shopware.Application.getContainer('init');
    return new JokeService(initContainer.httpClient);
});
```

3. Inject it into a component via `inject: ['joker']` (then `this.joker`), or rename it with an object to avoid clashes with data/computed properties: `inject: { jokeService: 'joker' }`.

4. Middleware (runs on service access) — register with `Shopware.Application.addServiceProviderMiddleware('joker', (service, next) => { ... })`. Call `next()` to continue, or `next(new Error('...'))` to fail, e.g. when a service `isActive` flag is false.

5. Decorator (runs once in the provider phase) — `Shopware.Application.addServiceProviderDecorator('joker', joker => { ...; return joker; })`. Wrap a method to alter its return value, e.g. keep the original `joker.joke`, replace it with a function that calls `decoratedMethod.call(joker)` and adds a `funny` property.

`Shopware.Service()` also exposes `registerMiddleware` and `registerDecorator`, which forward to the same `Shopware.Application` methods.

## Essential identifiers

- `Shopware.Service().register(name, provider)`
- `Shopware.Application.getContainer('init')` / `httpClient`
- `Shopware.Application.addServiceProviderMiddleware`
- `Shopware.Application.addServiceProviderDecorator`
- `Shopware.Component.register` with `inject`

## Gotchas

- A decorator can only affect a service between its creation and its first access; decorate before anything reads the service. For services Shopware already instantiated during boot, see the Extending Services guide (providers must be reset first).
- The service file and init script are only loaded if the init script is imported from `main.js`.

## Code check (6.7.13.0)
- confirmed `Shopware.Service` — exported service factory — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:208
- confirmed `register` — Service().register forwards to Application.addServiceProvider — vendor/shopware/administration/Resources/app/administration/src/core/factory/service.factory.ts:29
- confirmed `registerDecorator` — Service() forwards to addServiceProviderDecorator — vendor/shopware/administration/Resources/app/administration/src/core/factory/service.factory.ts:31
- confirmed `ApplicationBootstrapper::addServiceProvider()` — provider receives the service container — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:169
- confirmed `ApplicationBootstrapper::getContainer()` — returns named container such as `init` — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:66
- confirmed `httpClient` — registered in the init container — vendor/shopware/administration/Resources/app/administration/src/app/init/index.ts:53
- confirmed `ApplicationBootstrapper::addServiceProviderMiddleware()` — (service, next) signature for a named service — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:222
- confirmed `ApplicationBootstrapper::addServiceProviderDecorator()` — decorator for a named service — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:281
- confirmed `Component.register` — global Component.register exists — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:130
- unverified `BottleJS` — library lives in node_modules, out of scope
