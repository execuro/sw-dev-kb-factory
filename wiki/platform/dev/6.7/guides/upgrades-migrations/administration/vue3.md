---
id: platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md
title: Vue 3 upgrade
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vue3.html
sourceHash: e175e54146e1f664ce3a288de30ef3f80364d3cf
codeCheckedAgainst: "6.7.13.0"
keywords: ["vue 3", "vue.js 2 eol", "administration upgrade", "sw-field", "this.$parent", "this.$slots", "this.$tc", "Shopware.Snippet.tc", "v-model", "AsyncComponentWrapper", "vuex reactivity", "composer run watch:admin", "plugin migration", "breaking changes"]
summary: "Moving plugin Administration code from Vue 2 to Vue 3 (Shopware 6.6+): template checks, internal API pitfalls, known issues."
lastBuilt: 2026-09-15
---
## What it is

Upgrade guide for plugin-based extensions whose custom Administration code must move from Vue.js 2 (EOL December 31st, 2023) to Vue.js 3, which the Shopware Administration uses from 6.6 onward. It lists an FAQ, a step-by-step check list and known issues.

## When to use

- A plugin with custom Administration JavaScript/templates must be made compatible with Shopware 6.6 or newer.
- App-based extensions are not affected.

## Key steps / config

Prerequisites: latest Shopware `trunk` or a release candidate, the plugin installed and activated, and a running Administration watcher (`composer run watch:admin`).

1. **Dependencies** – align the plugin's `package.json` dependencies with the Administration's `package.json`.
2. **Templates** (any order):
   - Replace every `sw-field` usage with the concrete field component (in 6.7 there is no standalone `sw-field` component; only `sw-form-field-renderer` still translates legacy `componentName: 'sw-field'` configs into a typed field).
   - Check all `v-model` bindings and event listeners against Vue 3 syntax.
   - Check for deprecated slot syntax (enable the eslint Vue 3 rule set).
   - Check `router-view` / transition / keep-alive combinations.
   - Check `key` attributes and remove filter usages.
3. **Code** – search for `this.$`: usage of Vue's internal API is very likely to break, except `this.$tc`.
4. Test thoroughly, manually or automated.

## Essential identifiers

- `sw-field` (legacy field wrapper to replace)
- `this.$tc`, `this.$parent`, `this.$slots`
- `Shopware.Snippet.tc` (translation without component scope)
- `@hook:mounted`
- `composer run watch:admin`

## Gotchas

- **Plugin versioning**: one plugin version cannot support both 6.5 and 6.6; ship e.g. `1.x` for 6.5.x and `2.0` for 6.6+.
- **Lifecycle hooks** like `@hook:mounted` may fire twice for asynchronously loaded components (emitted for `AsyncComponentWrapper` and the inner component).
- **Slots**: checking that `this.$slots` has a key is not enough; verify the slot yields an actual vnode.
- **`this.$parent`**: async wrappers change the tree, so `this.$parent.$parent` may be needed; prefer services or events.
- **Vue DevTools** causes severe performance problems in large Vue 3 apps.
- **Vuex** stores lose reactivity if getters alter state.
- **Form field ids** changed; in tests add a unique `name` attribute to fields.
- **Prop default functions** have no `this`; use `Shopware.Snippet.tc` instead of `this.$tc`.
- **Mutating props** now throws hard errors.

## Version notes

- Vue 2 up to Shopware 6.5; Vue 3 from 6.6. The guide was written for the 6.6 transition; 6.7 Administration continues on Vue 3.

## Code check (6.7.13.0)
- confirmed `Shopware.Snippet` — getter on the global Shopware object exposing the i18n global API — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:264
- confirmed `tc` — `Shopware.Snippet.tc` is mapped to `i18n.global.t` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:274
- confirmed `sw-field` — no `sw-field` component folder remains; the form field renderer only maps legacy `componentName: 'sw-field'` configs by type — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-form-field-renderer/index.js:163
- unverified `composer run watch:admin` — root project composer script, outside the vendor package roots
- unverified `package.json` — Administration package.json lies outside the checked `src` root
- unverified `AsyncComponentWrapper` — Vue runtime internal, outside vendor/shopware scope
