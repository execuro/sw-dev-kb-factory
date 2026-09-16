---
id: platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md
title: Upgrading to Pinia
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/pinia.html
sourceHash: 897df2d6d175996a3b6b92d78fac75a798d12fd7
codeCheckedAgainst: "6.7.13.0"
keywords: ["pinia", "vuex", "state management", "store", "Shopware.Store.register", "Shopware.Store.get", "Shopware.Store.unregister", "PiniaRootState", "Shopware.State", "$reset", "setActivePinia", "createPinia", "administration upgrade", "composable store"]
summary: Migrating Administration Vuex modules to Pinia in Shopware 6.7 via Shopware.Store.register/get/unregister, PiniaRootState typing and store tests.
lastBuilt: 2026-09-15
---
## What it is

Guide for migrating Administration state from Vuex to Pinia, which Shopware 6.7 uses as the Administration state management library. It covers store registration, the structural differences (state function, no mutations), TypeScript typing, composable stores, access and testing.

## When to use

- A plugin registers or reads Administration stores and is being upgraded to Shopware 6.7.
- You write a new Administration store or a test for a store/component that uses one.

## Key steps / config

1. Register the store with `Shopware.Store.register`, either `(id, definition)` or a definition object carrying `id`:

```javascript
const store = Shopware.Store.register('<storeName>', {
    state: () => ({ /* initial state */ }),
    getters: { /* ... */ },
    actions: { /* ... */ },
});
export default store;
// alternative: Shopware.Store.register({ id: '<storeName>', state: () => ({}), getters: {}, actions: {} });
```

2. Register it from a component or index file by importing the store file: `import './state/products.state';`
3. `state` must be a function returning the initial state; drop `mutations` and modify state directly in actions (`this.productName = newName`).
4. Getters must not share a name with a state property (both are exposed on the same level) and should only compute, not modify.
5. Registering an existing id overwrites it; remove a store with `Shopware.Store.unregister('<storeName>')`.
6. Access: `Shopware.Store.get('<storeName>')` (the installed code throws `Store with id "..." not found` for unknown ids).
7. TypeScript: `export type StoreType = ReturnType<typeof store>;`, then `declare global { interface PiniaRootState { myStore: StoreType; } }`.
8. Composable stores: pass a setup function (or an external composable such as `useMyComposable`) as the second argument to `Shopware.Store.register('myStore', useMyComposable)`; only returned refs/functions are tracked in devtools.
9. Testing: import the store file, then call `store.$reset()` in `beforeEach`. For components, `createPinia()` from `pinia`, call `setActivePinia(pinia)` in `beforeEach`, and mount with `global: { plugins: [pinia] }`.

## Essential identifiers

- `Shopware.Store.register`, `Shopware.Store.get`, `Shopware.Store.unregister`
- `PiniaRootState` (global interface)
- `$reset()`, `createPinia`, `setActivePinia` (from `pinia`)

## Gotchas

- Before (Vuex): modules were registered with `Shopware.State.registerModule('product', productsStore)` and read with `Shopware.State.get('<storeName>')`, with a `namespaced: true` object holding `state`, `mutations`, `getters`, `actions`. In the installed code `Shopware.State` is marked `@deprecated tag:v6.8.0 - Will be removed, use Store instead.`
- The installed `register` throws `Invalid arguments registering a Store` when neither a string id plus definition nor a definition object with a string `id` is passed.

## Version notes

- 6.7: Pinia replaces Vuex for the Administration; `Shopware.State` and `VuexRootState` remain but are deprecated for removal in 6.8.0.

## Code check (6.7.13.0)
- confirmed `Store::register()` — accepts string id plus definition or object with `id` — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:63
- confirmed `Store::get()` — throws when id is not registered — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:51
- confirmed `Store::unregister()` — disposes store and deletes its root state — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:95
- confirmed `Shopware.Store` — `public Store = Store.instance` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:171
- deprecated `Shopware.State` — `@deprecated tag:v6.8.0 - Will be removed, use Store instead.` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:169
- confirmed `PiniaRootState` — global interface declaration — vendor/shopware/administration/Resources/app/administration/src/global.types.ts:394
- deprecated `VuexRootState` — `@deprecated tag:v6.8.0` — vendor/shopware/administration/Resources/app/administration/src/global.types.ts:390
- unverified `setActivePinia` — pinia package export, outside vendor/shopware roots
- unverified `$reset()` — pinia store API, outside vendor/shopware roots
