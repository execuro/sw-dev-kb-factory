---
id: platform/dev/6.7/resources/references/adr/2024-06-17-replace-vuex-with-pinia.md
title: Replace Vuex with Pinia
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-06-17-replace-vuex-with-pinia.html
sourceHash: 7716e095530410a2534c5d45fa84beb0d290bd03
codeCheckedAgainst: "6.7.13.0"
keywords: ["pinia", "vuex", "Shopware.Store", "Shopware.State", "Shopware.Store.register", "Shopware.Store.get", "PiniaRootState", "VuexRootState", "store.init.ts", "cms-page.store.ts", "state management", "admin store", "registerModule"]
summary: "ADR 2024-06-17: admin state moves from Vuex to Pinia; Shopware.Store list/get/register/unregister, Shopware.State deprecated in 6.7 and removed in 6.8."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2024-06-17, area admin) to replace Vuex with Pinia in the Shopware Administration, triggered by a getter-reactivity bug in Vuex `4.1.0` that could not be fixed by downgrading to `4.0.2`. It defines the `Shopware.Store` API, migration rules and the removal schedule.

## When to use

When writing or migrating Administration state in a plugin: registering a new store, reading a core store, or converting an existing Vuex module to Pinia.

## Key steps / config

`Shopware.Store` is a singleton (`src/app/store/index.ts`) whose private constructor creates the Pinia root; `src/app/init-pre/store.init.ts` injects it into Vue before the first store is registered. Public API in 6.7.13:

```typescript
public list(): string[];
public get<Id extends keyof PiniaRootState>(id: Id): PiniaRootState[Id];
public register(options: DefineStoreOptions) /* or (id, () => options) */;
public unregister(id: keyof PiniaRootState): void;
```

`register` returns the Pinia store definition (as `defineStore` does); `get` throws if the id is not registered.

Converting a module to a store:

1. No `mutations` in Pinia — move every mutation into `actions` (or modify state directly on the store from `Shopware.Store.get`).
2. `state` must be an arrow function: `state: () => ({})`.
3. `actions` and `getters` no longer receive `state`; use `this` (typed).
4. Register with `Shopware.Store.register`:

```typescript
Shopware.Store.register({
    id: 'example',
    state: () => ({ id: '' }),
    getters: { idStart() { /* uses this.id */ } },
    actions: { async asyncFoo(id) { this.id = id; } },
});
```

Rest of the API comes from Pinia: `store.$subscribe(...)`, direct action calls `store.someAction(...)`.

Best practices: write stores in TypeScript; export a type for the store; reuse the exported type's state for the state definition. Reference implementation: `src/module/sw-cms/store/cms-page.store.ts` (exports `CmsPageStore`, registered in `PiniaRootState` as `cmsPage`).

## Essential identifiers

- `Shopware.Store` — `list`, `get`, `register`, `unregister`
- `PiniaRootState`
- `src/app/init-pre/store.init.ts`
- `src/module/sw-cms/store/cms-page.store.ts`, `CmsPageStore`
- `DefineStoreOptions` (from `pinia`)

## Gotchas

- Mapping from the deprecated Vuex API: `Shopware.State.subscribe` becomes `store.$subscribe`; `Shopware.State.commit` and `Shopware.State.dispatch` become action calls; `Shopware.State.registerModule` becomes `Shopware.Store.register`.
- The ADR's getter example `idStart: () => this.id...` uses an arrow function, where `this` is not bound to the store; use a regular method.
- The ADR names `cms-page.state.ts` as the reference; the installed file is `cms-page.store.ts`.
- In 6.7 all `Shopware.State` functions log deprecation warnings in DevTools; plugins can still use Vuex for their own states.

## Version notes

- 6.7: core Vuex states (e.g. `src/app/state/*.store.*`, module states for sw-product, sw-category, sw-order, sw-flow, sw-promotion-v2) transitioned to Pinia; Vuex still usable for own states.
- 6.8: removal of `Shopware.State` (use `Shopware.Store`), `src/app/init-pre/state.init.ts` (use `store.init.ts`), `src/core/factory/state.factory.ts` (no replacement), interface `VuexRootState` (use `PiniaRootState`), and the `vuex` package.

## Code check (6.7.13.0)
- confirmed `Store::list()` — returns registered store ids — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:44
- corrected `Store::get()` — docs: returns PiniaStore; code: returns PiniaRootState[Id], throws if missing — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:51
- corrected `Store::register()` — docs: returns void; code: accepts options or (id, definition fn) and returns defineStore result — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:63
- confirmed `Store::unregister()` — disposes and removes store — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:95
- deprecated `StateFactory` — backs Shopware.State, deprecated tag:v6.8.0, use Store — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:169
- deprecated `initState` — state.init.ts deprecated tag:v6.8.0, use store.init.ts — vendor/shopware/administration/Resources/app/administration/src/app/init-pre/state.init.ts:12
- deprecated `State` — state.factory.ts class, deprecated tag:v6.8.0 without replacement — vendor/shopware/administration/Resources/app/administration/src/core/factory/state.factory.ts:8
- deprecated `VuexRootState` — deprecated tag:v6.8.0, use PiniaRootState — vendor/shopware/administration/Resources/app/administration/src/global.types.ts:390
- corrected `cmsPageStore` — docs: reference cms-page.state.ts; code: cms-page.store.ts registers the store — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/store/cms-page.store.ts:20
- confirmed `PiniaRootState` — global interface listing store types — vendor/shopware/administration/Resources/app/administration/src/global.types.ts:394
