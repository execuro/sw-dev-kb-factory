---
id: platform/dev/6.6/guides/plugins/plugins/administration/system-updates/pinia.md
title: Upgrading to Pinia
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/system-updates/pinia.html
sourceHash: 9e45a5d6a5f6fc3b49ab82aa7a98414c7b985e0d
keywords: ["Pinia", "Vuex", "Shopware.Store.register", "Shopware.Store.unregister", "Shopware.Store.get", "Shopware.State.get", "Shopware.State.registerModule", "state management", "composables", "PiniaRootState", "$reset"]
summary: How to migrate Administration Vuex stores to Pinia using Shopware.Store.register/get/unregister ahead of Shopware 6.7.
lastBuilt: 2026-09-15
---
## What it is
This page documents replacing Vuex with Pinia as the Administration state management library, planned for Shopware 6.7.

## When to use
Use when converting an existing Vuex store to Pinia, or writing a new store, in a plugin targeting Shopware 6.7.

## Key steps / config
Register a Pinia store, replacing the Vuex module object:
```javascript
const store = Shopware.Store.register('<storeName>', {
    state: () => ({ /* Initial state */ }),
    getters: { /* ... */ },
    actions: { /* ... */ },
});
export default store;
```
Alternative form with an `id` in the definition object: `Shopware.Store.register({ id: '<storeName>', state: () => ({}), getters: {}, actions: {} })`.
Unregister: `Shopware.Store.unregister('<storeName>')`.
Access: `Shopware.Store.get('<storeName>')` replaces `Shopware.State.get('<storeName>')`.
To register a store from a component/index file, simply import the store file (replaces `Shopware.State.registerModule('product', productsStore)`).
Testing: import the store, then `store.$reset()` in `beforeEach`.

## Essential identifiers
- `Shopware.Store.register()`, `Shopware.Store.unregister()`, `Shopware.Store.get()`
- `Shopware.State.get()`, `Shopware.State.registerModule()` (Vuex equivalents being replaced)
- `PiniaRootState` (TypeScript interface for typed store augmentation)

## Gotchas
- Pinia `state` must be a function returning the initial state, not a static object.
- Vuex `mutations` are removed — modify state directly inside `actions`.
- A getter cannot share a name with a state property, since both are exposed at the same level.
- Registering a store with an existing name overwrites it.

## Version notes
This migration targets Shopware 6.7, where Pinia replaces Vuex for state management.
