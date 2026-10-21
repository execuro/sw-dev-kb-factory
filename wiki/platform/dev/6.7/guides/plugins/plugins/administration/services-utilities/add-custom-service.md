---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md
title: Adding Services
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/add-custom-service.html
sourceHash: bff07d5a7a3d8763c57b9add174d7aed12e12316
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware.Service().register", "Shopware.Application.getContainer", "addServiceProviderMiddleware", "addServiceProviderDecorator", "httpClient", "inject", "BottleJS", "administration service", "dependency injection", "service decorator", "service middleware", "custom service"]
summary: Register a custom Administration service in the BottleJS container, inject it into components, and add service middleware or decorators.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
  - platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md
---
## What it is

How a plugin adds its own service to the Administration's dependency injection container, which is built on BottleJS, and how to inject it into Vue components, guard it with a middleware, or alter it with a decorator.

## When to use

You have reusable Administration logic (for example an HTTP-backed API wrapper) that components should receive via `inject` instead of importing it directly.

## Key steps / config

1. Write the service class, e.g. `<administration root>/services/joke.service.js`, taking the HTTP client in its constructor:
   ```javascript
   export default class JokeService {
       constructor(httpClient) { this.httpClient = httpClient; }
       joke() { return this.httpClient.get('https://v2.jokeapi.dev/joke/Programming').then(r => r.data); }
   }
   ```
2. Register it in an init script (e.g. `<administration root>/init/joke-service.init.js`) imported from the plugin's `main.js`:
   ```javascript
   import JokeService from '../services/joke.service'
   Shopware.Service().register('joker', (container) => {
       const initContainer = Shopware.Application.getContainer('init');
       return new JokeService(initContainer.httpClient);
   });
   ```
3. Inject it in a component: `inject: ['joker']`, then use `this.joker`. To avoid name clashes with data/computed properties, rename it with an object: `inject: { jokeService: 'joker' }`.
4. Middleware: `Shopware.Application.addServiceProviderMiddleware('joker', (service, next) => { ... next(); })` — call `next(new Error(...))` to reject, e.g. when a `service.isActive` flag is false.
5. Decorator: `Shopware.Application.addServiceProviderDecorator('joker', joker => { ...; return joker; })` — wrap a method (keep the original, call it via `.call(joker)`) and return the service.

`Shopware.Service()` also exposes `registerMiddleware` and `registerDecorator`, which forward to the two `Application` methods above.

## Essential identifiers

- `Shopware.Service().register(name, provider)` (forwards to `Shopware.Application.addServiceProvider`)
- `Shopware.Application.getContainer('init')` → `httpClient`
- `Shopware.Application.addServiceProviderMiddleware(name, (service, next) => …)`
- `Shopware.Application.addServiceProviderDecorator(name, (service) => …)`
- Component option `inject` (array or object form)

## Gotchas

- Decorators intercept a service in the provider phase: a service can only be decorated between its creation and its first access. Register decorators early (from `main.js`).
- A decorator must return the (modified) service.
- Next steps: [Add a custom component](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md), [Customize components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md).

## Code check (6.7.15.1)
- confirmed `Shopware.Service().register` — forwards to Application.addServiceProvider — vendor/shopware/administration/Resources/app/administration/src/core/factory/service.factory.ts:29
- confirmed `addServiceProvider` — registers a factory as `service.<name>` in the container — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:166
- confirmed `addServiceProviderMiddleware` — accepts a service name plus `(service, next)` middleware — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:223
- confirmed `addServiceProviderDecorator` — accepts a service name plus decorator — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:282
- confirmed `registerMiddleware` — Service() alias for addServiceProviderMiddleware — vendor/shopware/administration/Resources/app/administration/src/core/factory/service.factory.ts:30
- confirmed `registerDecorator` — Service() alias for addServiceProviderDecorator — vendor/shopware/administration/Resources/app/administration/src/core/factory/service.factory.ts:31
- confirmed `getContainer('init')` — core code reads the init container this way — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:407
- confirmed `httpClient` — registered as an init container entry — vendor/shopware/administration/Resources/app/administration/src/app/init/index.ts:54
- unverified `BottleJS` — decorator timing (provider phase) is library behaviour outside the vendor/shopware roots
