---
id: platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-custom-service.md
title: Adding Services
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/services-utilities/add-custom-service.html
sourceHash: bff07d5a7a3d8763c57b9add174d7aed12e12316
keywords: ["service", "administration service", "BottleJS", "Shopware.Service", "addServiceProviderMiddleware", "addServiceProviderDecorator", "inject", "dependency injection", "decorator", "middleware", "joke service", "container"]
summary: How to register, inject, and decorate a custom Administration service via BottleJS in Shopware 6.6.
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-components.md
---
## What it is
This guide explains how to add a custom service to the Shopware 6 Administration using BottleJS, and how to inject, register, and decorate it.

## When to use
Use this when a plugin needs a self-contained utility class (e.g. an HTTP wrapper) available anywhere in the Administration via dependency injection.

## Key steps / config
1. Create the service class, e.g. `<administration root>/services/joke.service.js`:
```javascript
export default class JokeService {
    constructor(httpClient) { this.httpClient = httpClient; }
    joke() { return this.httpClient.get('...').then(r => r.data); }
}
```
2. Register it in an init script (e.g. `<administration root>/init/joke-service.init.js`), imported from `main.js`:
```javascript
Shopware.Service().register('joker', (container) => {
    const initContainer = Shopware.Application.getContainer('init');
    return new JokeService(initContainer.httpClient);
});
```
3. Inject it into a component via the `inject` property (array form `inject: ['joker']`, or object form `inject: { jokeService: 'joker' }` to rename and avoid collisions).
4. Add middleware with `Shopware.Application.addServiceProviderMiddleware('joker', (service, next) => { ... next(); })` — runs on every access, can call `next(new Error(...))` to abort.
5. Add a decorator with `Shopware.Application.addServiceProviderDecorator('joker', joker => { ...; return joker; })` — runs once, right after creation, before first access.

## Essential identifiers
- `Shopware.Service().register(name, factory)`
- `Shopware.Application.getContainer('init')`
- `Shopware.Application.addServiceProviderMiddleware(name, fn)`
- `Shopware.Application.addServiceProviderDecorator(name, fn)`
- `Shopware.Component.register(name, definition)` with `inject`

## Gotchas
A service can only be decorated in the window between its creation and its first access — decorators registered after that point have no effect.
