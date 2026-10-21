---
id: platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md
title: Upgrading to Pinia
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/pinia.html
sourceHash: 897df2d6d175996a3b6b92d78fac75a798d12fd7
codeCheckedAgainst: "6.7.15.1"
keywords: ["pinia", "vuex", "Shopware.Store", "Shopware.Store.register", "Shopware.Store.get", "Shopware.Store.unregister", "PiniaRootState", "$reset", "createPinia", "setActivePinia", "state management", "admin store migration", "setup store"]
summary: Migrating Administration Vuex modules to Pinia stores in 6.7 via Shopware.Store.register/get/unregister, typing with PiniaRootState, and testing.
lastBuilt: 2026-10-21
---
## What it is

Migration guide for moving Administration state from Vuex modules to Pinia stores. From Shopware 6.7, Pinia replaces Vuex as the Administration state library, and stores are managed through the global `Shopware.Store` API.

## When to use

You maintain a plugin with custom Administration Vuex modules, or code that reads core state, and need to move it to Pinia for 6.7.

## Key steps / config

1. Rewrite the store definition and register it with `Shopware.Store.register`. `state` must be a function returning the initial state, and there is no `mutations` key; `getters` and `actions` stay:

```javascript
const store = Shopware.Store.register('<storeName>', {
    state: () => ({ /* initial state */ }),
    getters: { /* ... */ },
    actions: { /* ... */ },
});
export default store;
```

2. Alternatively, pass a single definition object with an `id` key: `Shopware.Store.register({ id: '<storeName>', state: () => ({}), getters: {}, actions: {} })`.
3. Change state directly inside actions instead of committing mutations, e.g. `updateProductName(newName) { this.productName = newName; }`.
4. Register the store by importing the store file, e.g. `import './state/products.state';`. No separate module-registration call is needed.
5. Read the store with `Shopware.Store.get('<storeName>')`. Remove it with `Shopware.Store.unregister('<storeName>')`. Registering an id that already exists overwrites the earlier store.
6. Optional (recommended): convert the store to TypeScript, export `export type StoreType = ReturnType<typeof store>;`, and add it to the global interface:

```typescript
declare global {
    interface PiniaRootState {
        myStore: StoreType;
    }
}
```

7. Setup-style stores: you can pass a function in place of the options object, e.g. `Shopware.Store.register('myStore', function() { const count = ref(0); /* ... */ return { count, doubled, increment, decrement }; })`. You can also pass an external composable directly, as in `Shopware.Store.register('myStore', useMyComposable)`.
8. Testing: import the store file, get the store with `Shopware.Store.get('myStore')`, and call `store.$reset()` in `beforeEach`. For component tests, create `const pinia = createPinia();`, call `setActivePinia(pinia)` in `beforeEach`, and pass `global: { plugins: [pinia] }` to `mount`.

## Essential identifiers

- `Shopware.Store.register(id, definition)` / `Shopware.Store.register({ id, ... })`
- `Shopware.Store.get(id)`, `Shopware.Store.unregister(id)`
- `PiniaRootState` (global interface used to type store ids)
- `$reset()`, `createPinia`, `setActivePinia` (from `pinia`)

## Gotchas

- A getter cannot use the same name as a state property, because both are exposed at the same level of the store.
- Getters should compute values from state and must not modify it.
- In setup-style stores, Pinia devtools only track the variables and functions that the function returns.
- In the installed code, passing a string id with no second argument, or an object with no string `id`, throws `Invalid arguments registering a Store`.
- `Shopware.Store.get` throws `Store with id "<id>" not found` for an unregistered id.

## Version notes

- The Vuex pattern is `Shopware.State.registerModule('product', productsStore)` and `Shopware.State.get('<storeName>')` with `namespaced: true` and `mutations`. It maps to `Shopware.Store.register` / `Shopware.Store.get`. In 6.7.15.1, `Shopware.State` is marked `@deprecated tag:v6.8.0 - Will be removed, use Store instead.`

## Code check (6.7.15.1)
- confirmed `Store::register()` — accepts `(id, definition)` or `({ id, ... })`, otherwise throws; same id overwrites — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:63
- confirmed `Store::unregister()` — disposes the store and deletes its root state — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:95
- confirmed `Store::get()` — throws if the id is not registered — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:51
- confirmed `PiniaRootState` — keys the internal store map and get/register ids — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:19
- confirmed `createPinia` — the Store singleton creates its root Pinia instance with it — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:27
- confirmed `Store` — exposed globally as `Shopware.Store` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:184
- deprecated `State` — `Shopware.State` deprecated tag:v6.8.0, use Store instead — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:182
- unverified `$reset` — Pinia library API, node_modules out of scope
- unverified `setActivePinia` — Pinia library API, node_modules out of scope
