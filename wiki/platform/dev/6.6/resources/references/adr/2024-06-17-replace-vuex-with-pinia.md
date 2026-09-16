---
id: platform/dev/6.6/resources/references/adr/2024-06-17-replace-vuex-with-pinia.md
title: Replace Vuex with Pinia
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-06-17-replace-vuex-with-pinia.html"
sourceHash: 7716e095530410a2534c5d45fa84beb0d290bd03
keywords: ["Pinia", "Vuex", "Shopware.Store", "Shopware.State", "PiniaRootState", "VuexRootState", "store.init.ts", "state.init.ts", "state.factory.ts", "cms-page.state.ts", "Shopware.Store.register", "Shopware.Store.get", "Shopware.Store.list", "Shopware.Store.unregister"]
summary: "ADR: administration state moves from Vuex to Pinia under `Shopware.Store`; Vuex/`Shopware.State` removed entirely in 6.8."
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record replacing Vuex with Pinia for administration state management, because Vuex 4.1.0 has a getter-reactivity bug and downgrading to 4.0.2 was not viable; Pinia is the documented Vue 3 standard.

## When to use
Relevant when adding or migrating admin state modules, or calling into existing state via `Shopware.State`/`Shopware.Store`.

## Key steps / config
- Pinia state lives under `Shopware.Store`, implemented as a singleton; `init-pre/store.init.ts` injects the Pinia root state into Vue before any store registers.
- Public `Shopware.Store` API: `list(): string[]`, `get(id: keyof PiniaRootState): PiniaStore`, `register(options: DefineStoreOptions): void`, `unregister(id: keyof PiniaRootState): void`.
- Migration steps for a Vuex module: mutations move under `actions`; `state` becomes an arrow function returning an object; `actions`/`getters` access state via `this` instead of the `state` argument; register with `Shopware.Store.register` instead of `Shopware.State.registerModule`.
- Reference implementation: `cms-page.state.ts`.

## Essential identifiers
- `Shopware.Store.register`, `Shopware.Store.get`, `Shopware.Store.list`, `Shopware.Store.unregister`
- `Shopware.State` (deprecated in 6.7, removed in 6.8)
- `src/app/init-pre/store.init.ts`

## Gotchas
In 6.7, calling any `Shopware.State` function logs a DevTools deprecation warning (e.g. `Shopware.State.registerModule is deprecated. Use Shopware.Store.register instead!`), but Vuex remains usable for custom state.

## Version notes
6.7: many core Vuex modules (listed in the source, e.g. `sw-bulk-edit`, `sw-product-detail`, `sw-category-detail`, `sw-extension`, `sw-settings-payment`, `sw-settings-seo`, `sw-settings-shipping`, plus numerous `src/app/state/*` and `src/module/*` stores) transition to Pinia; `Shopware.State` still works but warns.
6.8: `Shopware.State` is removed (use `Shopware.Store`); `src/app/init-pre/state.init.ts` is removed (use `src/app/init-pre/store.init.ts`); `src/core/factory/state.factory.ts` is removed without replacement; `VuexRootState` is removed from `global.types.ty` (use `PiniaRootState`); the `vuex` package is removed.
