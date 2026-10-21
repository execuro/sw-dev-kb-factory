---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
  - platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md
  - platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md
  - platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md
sourceHash: a7e60f7bb1ce6fe1b8940d3d0e5d39f7e86766b4
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.html
title: The Shopware Object
version: "6.7"
versions:
  - "6.7"
keywords: ["Shopware", "Shopware.Component", "Shopware.Module", "Component.register", "Module.register", "Shopware.Service", "Shopware.Store", "Shopware.Utils", "Shopware.Mixin", "Shopware.Context", "global object", "window.Shopware", "typescript declarations", "administration api"]
summary: "The global window Shopware object in the Administration: Component and Module registries plus ApiService, Mixin, Filter, Service, Store, Utils and others."
lastBuilt: 2026-10-21
---
## What it is

The global `Shopware` object is the bridge between the Administration and plugin (third-party) code. It is bound to `window`, so it is reachable everywhere and can be inspected in the browser console with `console.log(Shopware);`. It exposes registries and helpers for interfacing with the rest of the Administration.

## When to use

Whenever plugin Administration code registers components, modules, mixins, filters, directives, services or stores, or needs utilities and context. The source warns: never access other parts of the Administration directly; always go through the `Shopware` object.

## Key steps / config

Register a component via the component registry:

```javascript
const { Component } = Shopware;

Component.register('sw-dashboard-index', {
    template,
});
```

Register a module (an encapsulated unit of routes and pages, e.g. customers, orders, settings):

```javascript
const { Module } = Shopware;

Module.register('your-module', {});
```

Overview of commonly used properties in 6.7.15.1:

| Property | Purpose |
|---|---|
| `ApiService` | Registry of services that fetch data from the API |
| `Component` | Vue component registry (`register`, `extend`, `override`, ...) |
| `Context` | Contexts for the `app` and the `api` |
| `Defaults` | Default values (e.g. `systemLanguageId`, `versionId`) |
| `Directive` | Vue directive registry |
| `Filter` | Template filter registry |
| `Helper` | Helpers, e.g. `DeviceHelper` (listen on the `resize` event) |
| `Locale` | Locale registry |
| `Mixin` | Mixin registry (`register`, `getByName`) |
| `Module` | Module registry |
| `Plugin` | Promise-based boot hooks (`addBootPromise`) run when the Administration launches |
| `Service` | Quick service access, e.g. `Shopware.Service('snippetService')` |
| `Shortcut` | Keyboard shortcut registry |
| `Store` | Pinia-based state store (`Shopware.Store.register`/`get`) |
| `Utils` | Utility methods such as `createId` |
| `Data` | Data-handling classes, e.g. `Criteria` |

See [adding a custom component](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md), [adding a custom module](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md), [adding filters](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md), [adding mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md) and [using utils](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-utils.md).

## Essential identifiers

- `Shopware` (global, `window`)
- `Shopware.Component.register`, `Shopware.Module.register`
- `Shopware.ApiService`, `Shopware.Context`, `Shopware.Defaults`, `Shopware.Directive`, `Shopware.Filter`, `Shopware.Helper`, `Shopware.Locale`, `Shopware.Mixin`, `Shopware.Plugin`, `Shopware.Service`, `Shopware.Shortcut`, `Shopware.Store`, `Shopware.Utils`

## Gotchas

- The docs list `State` as "a wrapper for the VueX store". In 6.7 `Shopware.State` is deprecated (removal in v6.8.0); use `Shopware.Store` instead.

## Version notes

- TypeScript declaration files for the `Shopware` object ship with the Administration since 6.4.4.0; they flag missing arguments, e.g. when registering a module or component.

## Code check (6.7.15.1)
- confirmed `Shopware.Module` — `register` maps to ModuleFactory.registerModule — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:127
- confirmed `Shopware.Component` — `register`/`extend`/`override` on AsyncComponentFactory — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:134
- deprecated `State` — `@deprecated tag:v6.8.0`, use Store instead — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:182
- confirmed `Store` — Pinia store instance — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:184
- confirmed `Mixin` — `register`/`getByName` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:186
- confirmed `Plugin` — `addBootPromise` boot hooks — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:216
- confirmed `Service` — ServiceFactory — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:221
- confirmed `ApiService` — API service registry — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:233
- confirmed `Defaults` — default ids such as systemLanguageId — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:264
- confirmed `DeviceHelper` — exposed under Helper — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:314
