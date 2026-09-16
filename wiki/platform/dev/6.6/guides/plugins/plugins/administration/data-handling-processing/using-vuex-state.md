---
id: platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-vuex-state.md
title: Using Vuex Stores
docType: developer
version: "6.6"
versions: ["6.6"]
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/data-handling-processing/using-vuex-state.html
sourceHash: 8e2d6fcca5ef7e5d21e9729284e90d24a0453d34
keywords: ["Vuex", "namespaced store", "Shopware.State.registerModule", "Shopware.State.unregisterModule", "Shopware.State.get", "mapState", "mapMutations", "beforeCreate", "beforeDestroy", "Administration state", "store module"]
summary: "Vuex stores in the Administration must be namespaced and registered via Shopware.State.registerModule at module or component scope."
lastBuilt: "2026-09-15"
---
## What it is

This guide explains how to use Vuex, the state-management library used by the Shopware 6 Administration, through the interfaces the Administration provides, with the single restriction that all stores must be `namespaced`.

## When to use

Use this when a plugin needs to keep track of complex shared state across the Administration, either scoped to a whole module or to a single component.

## Key steps / config

Define a namespaced store with `state` and `mutations`:

```javascript
// PLUGIN_ROOT/src/Resources/app/administration/app/src/component/store-example/store.js
export default {
    namespaced: true,
    state() { return { content: '' }; },
    mutations: {
        setContent(state, content) { state.content = content; },
    }
};
```

Register it at module scope in `main.js`:

```javascript
// ADMINISTRATION_ROOT/src/main.js
import swagBasicState from './store';
Shopware.State.registerModule('swagBasicState', swagBasicState);
```

Or register it at component scope, in the `beforeCreate` Vue lifecycle hook, and unregister it in `beforeDestroy` so no unused store is left behind:

```javascript
beforeCreate() {
    Shopware.State.registerModule('swagBasicState', swagBasicState);
},
beforeDestroy() {
    Shopware.State.unregisterModule('swagBasicState');
},
```

Once registered (by either scope), the store is available everywhere under its given name. Use it in a component with the native Vuex helpers exposed via `Shopware.Component.getComponentHelper()` (`mapState`, `mapMutations`, `mapGetters`, `mapActions`), or access it directly with `Shopware.State.get()`.

## Essential identifiers

- `Shopware.State.registerModule()` / `Shopware.State.unregisterModule()` — register/unregister a namespaced store module.
- `Shopware.State.get()` — direct access to a namespaced store.
- `namespaced: true` — required on every store used with the Administration's Vuex wrapper.
- `mapState`, `mapMutations`, `mapGetters`, `mapActions` — native Vuex helpers exposed via `Shopware.Component.getComponentHelper()`.

## Gotchas

- Every store must set `namespaced: true` to avoid collisions with other plugins or the Administration itself.
- A component-scope store registered in `beforeCreate` must be unregistered in `beforeDestroy`, or it is left behind after the component is destroyed.
