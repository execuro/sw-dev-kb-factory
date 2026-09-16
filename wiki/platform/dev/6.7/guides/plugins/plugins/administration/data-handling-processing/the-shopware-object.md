---
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md
title: The Shopware Object
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.html
sourceHash: a7e60f7bb1ce6fe1b8940d3d0e5d39f7e86766b4
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware", "global Shopware object", "window.Shopware", "Component.register", "Module.register", "Shopware.Service", "Shopware.Store", "Shopware.Mixin", "Shopware.Utils", "Shopware.Context", "admin plugin api", "typescript declarations", "ShopwareClass"]
summary: The global window.Shopware object in the Administration - registries for components, modules, mixins, filters, services, store, context and utils.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md", "platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-utils.md"]
---
## What it is

The global `Shopware` object is the bridge between the Administration and plugin code. It is bound to `window` (so it can be inspected with `console.log(Shopware)` in the browser dev tools) and exposes registries and helpers for interfacing with the rest of the Administration.

## When to use

Whenever plugin code needs to register or reach Administration functionality - components, modules, mixins, filters, services, shared data stores, utilities. The source's rule: never access other parts of the Administration directly, always go through the `Shopware` object.

## Key steps / config

Register a component (see [add a custom component](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md)):

```javascript
const { Component } = Shopware;
Component.register('sw-dashboard-index', { template });
```

Register a module - an encapsulated unit of routes and pages implementing a whole feature (see [add a custom module](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md)):

```javascript
const { Module } = Shopware;
Module.register('your-module', {});
```

Commonly used properties (as present on the object in 6.7.13.0):

| Property | Purpose |
|---|---|
| `ApiService` | Registry of services fetching data from the API |
| `Component` | Registry for Vue components (`register`, `extend`, `override`, ...) |
| `Context` | Contexts for the `app` and the `api` (e.g. `Shopware.Context.api`) |
| `Defaults` | Default values (e.g. `systemLanguageId`, `versionId`) |
| `Directive` | Registry for Vue directives |
| `Filter` | Registry for template filters |
| `Helper` | Helpers such as `DeviceHelper` (listen to `resize`) |
| `Locale` | Registry for locales |
| `Mixin` | Registry for mixins (`register`, `getByName`) |
| `Module` | Registry for modules |
| `Plugin` | Promise-based boot hooks (`addBootPromise`) |
| `Service` | Quick service access, e.g. `Shopware.Service('snippetService')` |
| `Shortcut` | Registry for keyboard shortcuts |
| `Store` | Registry for shared data stores |
| `Utils` | Utility methods such as `createId` |

Further guides: [adding filters](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md), [adding mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md), [using utils](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-utils.md).

## Essential identifiers

- `Shopware` (global, `window.Shopware`)
- `Shopware.Component.register`, `Shopware.Module.register`
- `Shopware.Service`, `Shopware.ApiService`, `Shopware.Mixin`, `Shopware.Filter`, `Shopware.Directive`
- `Shopware.Context`, `Shopware.Defaults`, `Shopware.Helper`, `Shopware.Locale`, `Shopware.Plugin`, `Shopware.Shortcut`, `Shopware.Store`, `Shopware.Utils`

## Gotchas

- The source's table lists `State` as a VueX store wrapper. In 6.7.13.0 `Shopware.State` is deprecated (removal in 6.8.0); use `Shopware.Store` instead.
- The installed object also exposes members the source does not list, e.g. `Application`, `Data`, `Template`, `EntityDefinition`, `Feature`, `Snippet`.
- `Context` is a getter computed on access, not a static object.

## Version notes

TypeScript declaration files for the `Shopware` object are shipped with the Administration since Shopware 6.4.4.0; they help editors flag missing arguments when registering modules or components.

## Code check (6.7.13.0)
- confirmed `window.Shopware` — global assigned to the Shopware instance — vendor/shopware/administration/Resources/app/administration/src/index.ts:9
- confirmed `ShopwareClass::$Component` — registry with `register`/`extend`/`override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:129
- confirmed `ShopwareClass::$Module` — registry with `register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:122
- deprecated `ShopwareClass::$State` — docs: VueX wrapper; tagged deprecated v6.8.0, use Store — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:169
- confirmed `ShopwareClass::$Store` — store registry replacing the deprecated wrapper — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:171
- confirmed `ShopwareClass::$Service` — ServiceFactory accessor — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:208
- confirmed `ShopwareClass::$ApiService` — API service registry — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:220
- confirmed `ShopwareClass::$Defaults` — default ids such as systemLanguageId — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:251
- confirmed `DeviceHelper` — exposed under Helper — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:301
- confirmed `ShopwareClass::Context` — getter returning useContext() — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:312
