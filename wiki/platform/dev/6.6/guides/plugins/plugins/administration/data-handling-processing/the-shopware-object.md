---
id: platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md
title: The Shopware object
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.html"
sourceHash: f2df7ee5d7a2885d3fd8ce57c4607347da8078e2
keywords: ["Shopware object", "Component.register", "Module.register", "Shopware.Service", "component registry", "module registry", "VueJS components", "TypeScript declarations", "ApiService", "State", "Utils", "createId"]
summary: "Describes the global Shopware object, its Component/Module registries, and other bound properties like State, Service, and Utils."
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-module.md
  - platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-filter.md
  - platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/add-mixins.md
---

## What it is

The global `Shopware` object is the bridge between the Shopware Administration and third-party plugin code. It provides utility functions to interface with the rest of the Administration and is bound to a window object, so it is accessible everywhere and can be inspected via the browser console.

## When to use

Use the `Shopware` object whenever a plugin needs to register administration components or modules, access shared registries (state, services, locales, mixins), or otherwise interact with the Administration instead of reaching into its internals directly. The docs explicitly warn: don't try to access other parts of the Administration directly, always use the `Shopware` object.

## Key steps / config

Inspect the object in the dev-tools console of the Administration:

```javascript
// run this command in the dev-tools of your browser
console.log(Shopware);
```

Register a component via the `Component` registry:

```javascript
const { Component } = Shopware;

Component.register('sw-dashboard-index', {
    template,
});
```

Register a module via the `Module` registry:

```javascript
const { Module } = Shopware;

Module.register('your-module', {});
```

The most commonly used properties bound to `Shopware` are:

| Property | Description |
| --- | --- |
| ApiService | Registry which holds services to fetch data from the api |
| Component | A registry for VueJS `components` |
| Context | A set of contexts for the `app` and the `api` |
| Defaults | A collection of default values |
| Directive | A registry for VueJS `directives` |
| Filter | A registry for VueJS template `filters` |
| Helper | A collection of helpers, e.g. the `DeviceHelper` where you can listen on the `resize` event |
| Locale | A registry for `locales` |
| Mixin | A registry for `mixins` |
| Module | A registry for `modules` |
| Plugin | An interface to add `promise`-based hooks to run when the Administration launches |
| Service | A helper to get quick access to service, e.g. `Shopware.Service('snippetService')` |
| Shortcut | A registry for keyboard shortcuts |
| State | A wrapper for the VueX store to manage state |
| Utils | A collection of utility methods like `createId` |

TypeScript declaration files are also provided within the Administration (available from Shopware Version 6.4.4.0), helping developers understand the arguments required, e.g. when registering a new module or component; the Administration itself remains pure JavaScript.

## Essential identifiers

- `Shopware` (global object)
- `Shopware.Component.register()`
- `Shopware.Module.register()`
- `Shopware.Service()`
- `ApiService`, `Context`, `Defaults`, `Directive`, `Filter`, `Helper`, `Locale`, `Mixin`, `Module`, `Plugin`, `Service`, `Shortcut`, `State`, `Utils`

## Gotchas

Don't try to access other parts of the Administration directly — always go through the `Shopware` object.

## Version notes

TypeScript declarations for the `Shopware` object are available starting from Shopware Version 6.4.4.0.
