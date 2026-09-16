---
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-vuex-state.md
title: Using Vuex Stores
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/using-vuex-state.html
sourceHash: e4b78f0cff930e18479771f5339e7b9e868c38a7
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware.Store", "Shopware.State", "registerModule", "unregisterModule", "getComponentHelper", "mapState", "mapVuexState", "vuex", "pinia", "administration state", "namespaced store", "store module"]
summary: "Admin state in 6.7: register Pinia stores via Shopware.Store.register/get/unregister; Vuex Shopware.State is deprecated (removed in 6.8)."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md"]
---
## What it is

The guide describes keeping complex Administration state in a store registered through the global Shopware object. The docs show the Vuex API; the installed 6.7.13.0 Administration keeps Vuex only as a deprecated layer and uses Pinia through `Shopware.Store` for its own stores.

## When to use

A plugin component or module needs shared state (e.g. a value edited in one component and displayed in another) that should be available under a name everywhere in the Administration, regardless of where it was registered.

## Key steps / config

1. Define and register the store. `Shopware.Store.register` accepts either `(id, () => definition)` or one definition object with an `id` string; it returns the Pinia `useStore` function.

```js
Shopware.Store.register({
    id: 'swagBasicState',
    state() {
        return { content: '' };
    },
    actions: {
        setContent(content) { this.content = content; },
    },
});
```

2. Register it globally from the plugin's `main.js` (module scope), or inside a component lifecycle hook (component scope). A component-scoped store should be removed again with `Shopware.Store.unregister('swagBasicState')` in `beforeUnmount`, so no unused store is left behind. `unregister` is a no-op for an unknown id.
3. Read the store with `Shopware.Store.get('swagBasicState')` — it throws `Store with id "…" not found` if the id is not registered.
4. Map state/actions into a component through the component helper:

```js
const { mapState, mapActions } = Shopware.Component.getComponentHelper();
// computed:
...mapState(() => Shopware.Store.get('swagBasicState'), ['content']),
// methods:
...mapActions(() => Shopware.Store.get('swagBasicState'), ['setContent']),
```

5. Use `content` and `setContent(value)` in the component template, e.g. bound to a text field's value and update event.

## Essential identifiers

- `Shopware.Store.register`, `Shopware.Store.get`, `Shopware.Store.unregister`, `Shopware.Store.list`
- `Shopware.Component.getComponentHelper()` — exposes Pinia `mapState`, `mapActions`
- `Shopware.Component.register('swag-basic-state', …)`

## Gotchas

- `Shopware.State` (Vuex) is `@deprecated tag:v6.8.0`; its `registerModule`, `unregisterModule` and `get` still exist in 6.7, and a Vuex store passed to `registerModule` must be `namespaced: true`, as the docs require.
- `mapState` from `getComponentHelper()` is **Pinia's** `mapState`, not Vuex's. The Vuex helpers are exposed as `mapVuexState`, `mapVuexMutations`, `mapVuexGetters`, `mapVuexActions`. There is no `mapMutations` key — the docs' `mapState('swagBasicState', …)` / `mapMutations(…)` pairing does not match the installed helper.
- The docs use the Vue 2 hook `beforeDestroy`; the Vue 3 Administration's own components use `beforeUnmount`.
- The template example uses `sw-text-field`, which is `@deprecated tag:v6.8.0` in favour of `mt-text-field`.

## Version notes

- 6.7: Vuex (`Shopware.State`, `src/app/init-pre/state.init.ts`) is deprecated for removal in 6.8.0; `Shopware.Store` (Pinia) is the replacement.

## Code check (6.7.13.0)
- deprecated `Shopware.State` — Vuex state wrapper, file marked deprecated tag:v6.8.0 — vendor/shopware/administration/Resources/app/administration/src/app/init-pre/state.init.ts:13
- deprecated `registerModule` — Vuex-only, part of deprecated State — vendor/shopware/administration/Resources/app/administration/src/app/init-pre/state.init.ts:48
- deprecated `unregisterModule` — Vuex-only, part of deprecated State — vendor/shopware/administration/Resources/app/administration/src/app/init-pre/state.init.ts:51
- confirmed `Store::register()` — Pinia registration by id or definition object — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:63
- confirmed `Store::get()` — throws when id is unknown — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:51
- confirmed `Store::unregister()` — disposes and removes the store — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:95
- confirmed `getComponentHelper` — on Shopware.Component — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:137
- corrected `mapState` — docs: Vuex mapState with namespace string; code: Pinia mapState — vendor/shopware/administration/Resources/app/administration/src/app/init/component-helper.init.ts:12
- corrected `mapVuexMutations` — docs: `mapMutations` from the component helper — vendor/shopware/administration/Resources/app/administration/src/app/init/component-helper.init.ts:21
- deprecated `sw-text-field` — replaced by mt-text-field — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-text-field/index.ts:8
