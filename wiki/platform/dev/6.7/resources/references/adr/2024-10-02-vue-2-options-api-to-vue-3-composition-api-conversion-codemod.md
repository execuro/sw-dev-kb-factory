---
id: platform/dev/6.7/resources/references/adr/2024-10-02-vue-2-options-api-to-vue-3-composition-api-conversion-codemod.md
title: Vue 2 Options API to Vue 3 Composition API Conversion Codemod
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-10-02-vue-2-options-api-to-vue-3-composition-api-conversion-codemod.html
sourceHash: 7e11c7edc68f665422c48e915ef37e85b61d2cff
codeCheckedAgainst: "6.7.13.0"
keywords: ["codemod", "eslint rule", "options api", "composition api", "setup()", "vue 3 migration", "ref", "reactive", "computed()", "watch()", "onMounted", "defineEmits", "mapState", "useStore", "administration"]
summary: "ADR: an ESLint-rule codemod converts Administration Vue 2 Options API components to Vue 3 Composition API setup(); lists what it converts and manual steps."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2024-10-02) to build a codemod, implemented as an ESLint rule, that automatically converts Vue 2 Options API components to the Vue 3 Composition API, so the Administration codebase can be migrated without converting every component by hand.

## When to use

Read this when migrating Administration (or plugin) components from Options API to Composition API and you need to know what the automated conversion handles and what must still be done manually.

## Key steps / config

What the codemod converts:

1. Identifies Vue component definitions.
2. Converts Options API features:
   - `data` properties to `ref` or `reactive`
   - `computed` properties to `computed()` functions, including writable computed properties
   - `methods` to plain functions inside `setup()`
   - lifecycle hooks to Composition API equivalents (e.g. `mounted` to `onMounted`), including Vue 2 specific hooks
   - `watch` properties to `watch()` functions
   - `props` and `inject`
   - `this` references to direct references to reactive variables; `ref` access rewritten to `.value`
   - reactive object reassignments via `Object.assign`
3. Generates a `setup()` function containing the converted code.
4. Adds the needed imports (`ref`, `reactive`, `computed`, `watch`, ...).

The rule can be run per file or per component, allowing gradual adoption.

## Essential identifiers

- `setup()`, `ref`, `reactive`, `computed()`, `watch()`, `onMounted`
- `Object.assign` (reactive reassignment handling)
- `defineEmits` / `emit` (manual replacement for `$emit`)
- `useStore` (manual replacement for Vuex `mapState`, `mapGetters`, `mapActions`)

## Gotchas

Not handled automatically — manual work required:

- Templates are not modified: template bindings, event handlers, `ref` / `$refs` usage.
- Complex nested `data` structures may need manual optimisation.
- Vuex helpers `mapState`, `mapGetters`, `mapActions` are not converted.
- Mixins are not converted; refactor them into composables.
- Plugins/third-party libraries relying on the Options API; `this`-context helpers such as `$tc`, `$t`.
- TypeScript annotations for props, computed and methods in `setup()`.
- Spread operators in computed properties are detected but only get a TODO comment.
- Render functions and JSX components.
- `shallowRef` / `shallowReactive` optimisations are never applied.
- Multi-line reassignment of reactive objects is not always handled correctly.
- `$emit` usage may need conversion to `defineEmits` plus the `emit` function.
- Lifecycle-hook error handling and edge cases need review; converted code may benefit from extracting composables.

## Code check (6.7.13.0)
- unverified `ESLint codemod rule` — ESLint rules/scripts live outside the checked Administration `src` root, out of scope
- confirmed `setup()` — installed Administration components already use Composition API setup via wrapComponentConfig — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:84
- confirmed `Shopware.Component.wrapComponentConfig` — component config wrapper used with setup() — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:71
- confirmed `VuexRootState` — Vuex-based state factory still present in core, so manual Vuex helper migration remains relevant — vendor/shopware/administration/Resources/app/administration/src/core/factory/state.factory.ts:45
- unverified `onMounted` — Vue framework API, not Shopware code
- unverified `defineEmits` — Vue framework API, not Shopware code
