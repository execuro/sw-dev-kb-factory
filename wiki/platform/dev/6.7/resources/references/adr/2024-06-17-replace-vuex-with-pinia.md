---
id: platform/dev/6.7/resources/references/adr/2024-06-17-replace-vuex-with-pinia.md
title: Replace Vuex with Pinia
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-06-17-replace-vuex-with-pinia.html
sourceHash: 7716e095530410a2534c5d45fa84beb0d290bd03
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware.Store", "Shopware.Store.register", "Shopware.Store.get", "PiniaRootState", "store.init.ts", "cms-page.store.ts", "Shopware.State", "registerModule", "pinia", "vuex", "admin state management", "store migration", "administration"]
summary: "ADR: administration state moves from Vuex (Shopware.State) to Pinia (Shopware.Store) in 6.7; Vuex removed in 6.8. Store API and module migration steps."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2024-06-17) to replace Vuex with Pinia in the Shopware Administration. Trigger: Vuex `4.1.0` has a bug that breaks getter reactivity, and downgrading to `4.0.2` was not possible because that version has other bugs that make modules fail. Pinia is the documented standard for Vue 3, so all admin state moves to Pinia stores, exposed under `Shopware.Store`.

## When to use

- Writing or porting an admin plugin's state for 6.7+.
- Accessing a core admin store (formerly a Vuex module) from a plugin.
- Planning the 6.8 upgrade, where Vuex is removed entirely.

## Key steps / config

`Shopware.Store` is a singleton; its private constructor creates the Pinia root state, which `src/app/init-pre/store.init.ts` installs into the Vue app (`app.use(Store.instance._rootState)`) before the first store registers. Public API:

```typescript
list(): string[];
get<Id extends keyof PiniaRootState>(id: Id): PiniaRootState[Id];
register(options: DefineStoreOptions): StoreDefinition; // also (id, () => options)
unregister(id: keyof PiniaRootState): void;
```

Converting a module into a Pinia store:

1. No mutations in Pinia — move every mutation into `actions` (or modify state directly after `Shopware.Store.get`).
2. `state` is an arrow function returning an object: `state: () => ({})`.
3. `actions` and `getters` no longer take a `state` argument; they use `this`, with type support.
4. Register with `Shopware.Store.register`.

```typescript
Shopware.Store.register({
    id: 'example',
    state: () => ({ id: '' }),
    getters: { idStart() { /* this.id ... */ } },
    actions: { async asyncFoo(id) { this.id = id; } },
});
```

Former Vuex calls map to Pinia: subscribe becomes `store.$subscribe(...)`; commit and dispatch become direct action calls (`store.someAction(...)`).

Best practices: write every Pinia store in TypeScript; export a type for it (the reference store is `src/module/sw-cms/store/cms-page.store.ts`, exporting `CmsPageStore`); reuse that type's state for the state definition; add the store to the `PiniaRootState` interface.

## Essential identifiers

- `Shopware.Store` (`src/app/store/index.ts`), `Shopware.Store.register`, `Shopware.Store.get`, `Shopware.Store.list`, `Shopware.Store.unregister`
- `PiniaRootState` (`global.types.ts`)
- `src/app/init-pre/store.init.ts`
- `src/module/sw-cms/store/cms-page.store.ts` (`CmsPageStore`, id `cmsPage`)

## Gotchas

- The ADR's Pinia getter example uses an arrow function with `this` (`idStart: () => this.id...`); an arrow function does not bind `this`, so write getters as regular functions or take `state` as the argument.
- `Shopware.Store.get` throws `Store with id "..." not found` when the id was never registered.
- The ADR names `cms-page.state.ts` as reference; in 6.7.15.1 the file is `cms-page.store.ts` under `src/module/sw-cms/store/`.

## Version notes

- **6.7**: all core Vuex modules (bulk edit, product/category detail, notification, session, system, admin menu, order, flow, promotion, and others listed in the ADR) are transitioned to Pinia. `Shopware.State` stays available for your own states, but its functions emit DevTools deprecation warnings (example: `Shopware.State.registerModule is deprecated. Use Shopware.Store.register instead!`).
- **6.8**: everything Vuex-related goes: `Shopware.State` (use `Shopware.Store`), `src/app/init-pre/state.init.ts` (use `store.init.ts`), `src/core/factory/state.factory.ts` (no replacement), interface `VuexRootState` (use `PiniaRootState`), and the `vuex` package.

## Code check (6.7.15.1)
- confirmed `Store` — singleton class behind `Shopware.Store`, private constructor creates the Pinia root — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:16
- confirmed `Store::list()` — returns registered store ids — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:44
- corrected `Store::get()` — docs: returns `PiniaStore`; code returns `PiniaRootState[Id]` and throws if unknown — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:51
- corrected `Store::register` — docs: `register(options): void`; code also accepts `(id, () => options)` and returns the store definition — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:63
- confirmed `Store::unregister()` — disposes and removes the store — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:95
- confirmed `initStore` — store.init.ts installs `Store.instance._rootState` into the Vue app — vendor/shopware/administration/Resources/app/administration/src/app/init-pre/store.init.ts:29
- confirmed `PiniaRootState` — global interface of registered stores — vendor/shopware/administration/Resources/app/administration/src/global.types.ts:408
- corrected `cmsPageStore` — docs: reference file `cms-page.state.ts`; installed reference is `cms-page.store.ts`, id `cmsPage` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/store/cms-page.store.ts:37
- deprecated `VuexRootState` — tag:v6.8.0, use PiniaRootState — vendor/shopware/administration/Resources/app/administration/src/global.types.ts:404
- unverified `Shopware.State.registerModule is deprecated` — warning text not found outside spec files in the installed admin source
