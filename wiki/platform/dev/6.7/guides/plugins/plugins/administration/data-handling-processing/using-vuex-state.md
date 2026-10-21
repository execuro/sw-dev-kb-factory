---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-vuex-state.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md
sourceHash: 79d60ffce7f53fb81160a3358304ad7b0bc14951
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/using-vuex-state.html
title: Using Vuex Stores
version: "6.7"
versions:
  - "6.7"
keywords: ["vuex", "Shopware.State", "registerModule", "unregisterModule", "namespaced", "mapVuexState", "mapVuexMutations", "getComponentHelper", "Shopware.Store", "pinia", "state management", "store module"]
summary: Namespaced Vuex store modules in the Administration and their component mapping; Shopware.State is deprecated in 6.7, use Shopware.Store (Pinia).
lastBuilt: 2026-10-21
---
## What it is

The Administration wraps Vuex so plugins can register their own namespaced store modules and map their state/mutations into components. In the installed 6.7 code this Vuex wrapper is deprecated for removal in 6.8; the Pinia-based `Shopware.Store` is the supported store API.

## When to use

You maintain plugin code that keeps component-spanning state in a Vuex module, or you need to know how that maps onto the installed helpers. For new code, use `Shopware.Store` (see Key steps, step 4). Background on the global object: [The Shopware object](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md).

## Key steps / config

1. Define the store module. It must be `namespaced: true` to avoid collisions with other plugins and the core:

```javascript
export default {
    namespaced: true,
    state() {
        return { content: '' };
    },
    mutations: {
        setContent(state, content) { state.content = content; },
    },
};
```

2. Register it under a name (e.g. `swagBasicState`), either at module scope in your `main.js`, or per component in the `beforeCreate` hook and removed again in `beforeUnmount` so no unused store is left behind. The registering API is the deprecated Vuex wrapper — exact calls in Gotchas. Once registered, the module is available everywhere under that name.

3. Map it in a component through the component helper. The installed helper exposes the Vuex helpers under `mapVuex*` names:

```javascript
const { mapVuexState, mapVuexMutations } = Shopware.Component.getComponentHelper();

Shopware.Component.register('swag-basic-state', {
    template,
    computed: { ...mapVuexState('swagBasicState', ['content']) },
    methods: { ...mapVuexMutations('swagBasicState', ['setContent']) },
});
```

The template then shows `content` and calls `setContent(value)` on the field's update event.

4. New code (Pinia): `Shopware.Store.register({ id: 'myStore', state, getters, actions })` (or `register('myStore', () => definition)`), read with `Shopware.Store.get('myStore')`, remove with `Shopware.Store.unregister('myStore')`. In components, the helper's `mapState`/`mapActions` are Pinia's helpers.

## Essential identifiers

- `namespaced: true`
- `Shopware.Component.getComponentHelper()`
- `mapVuexState`, `mapVuexMutations`, `mapVuexGetters`, `mapVuexActions`
- `Shopware.Store.register`, `Shopware.Store.get`, `Shopware.Store.unregister`
- `beforeCreate`, `beforeUnmount`

## Gotchas

- The source registers with `Shopware.State.registerModule('swagBasicState', swagBasicState)`, removes with `Shopware.State.unregisterModule('swagBasicState')` and reads with `Shopware.State.get()`. `Shopware.State` is `@deprecated tag:v6.8.0` ("use Store instead"), and the state factory behind it is deprecated "without replacement".
- The source destructures `mapState`/`mapMutations` from `getComponentHelper()`. In 6.7 `mapState` there is Pinia's helper and there is no `mapMutations` key — use `mapVuexState`/`mapVuexMutations` for Vuex modules.
- The source's template uses `sw-text-field` with `:value`/`@update:value`; `sw-text-field` is deprecated for 6.8 ("use mt-text-field instead").

## Version notes

- 6.7: the Vuex wrapper (`Shopware.State`) and the global `VuexRootState` type are deprecated, slated for removal in 6.8; Pinia via `Shopware.Store` replaces it.

## Code check (6.7.15.1)
- deprecated `Shopware.State` — `@deprecated tag:v6.8.0`, use Store instead — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:182
- deprecated `FullState::registerModule()` — state factory deprecated without replacement — vendor/shopware/administration/Resources/app/administration/src/core/factory/state.factory.ts:54
- deprecated `FullState::unregisterModule()` — same deprecated state factory — vendor/shopware/administration/Resources/app/administration/src/core/factory/state.factory.ts:55
- deprecated `FullState::get()` — same deprecated state factory — vendor/shopware/administration/Resources/app/administration/src/core/factory/state.factory.ts:47
- corrected `mapState` — docs: Vuex mapState from getComponentHelper; installed helper maps Pinia mapState — vendor/shopware/administration/Resources/app/administration/src/app/init/component-helper.init.ts:18
- corrected `mapMutations` — docs: exposed by getComponentHelper; installed key is mapVuexMutations — vendor/shopware/administration/Resources/app/administration/src/app/init/component-helper.init.ts:8
- confirmed `mapVuexState` — registered component helper — vendor/shopware/administration/Resources/app/administration/src/app/init/component-helper.init.ts:20
- confirmed `Store::register` — Pinia store registration by id — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:63
- confirmed `Store::unregister()` — disposes and removes a Pinia store — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:95
- deprecated `sw-text-field` — `@deprecated tag:v6.8.0`, use mt-text-field — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-text-field/index.ts:10
