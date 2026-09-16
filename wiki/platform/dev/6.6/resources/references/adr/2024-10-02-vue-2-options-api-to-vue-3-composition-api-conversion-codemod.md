---
id: platform/dev/6.6/resources/references/adr/2024-10-02-vue-2-options-api-to-vue-3-composition-api-conversion-codemod.md
title: Vue 2 Options API to Vue 3 Composition API Conversion Codemod
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-10-02-vue-2-options-api-to-vue-3-composition-api-conversion-codemod.html
sourceHash: 07468dba6d634dd85dfe9845dc7f47b7dbc81c39
keywords: ["Options API", "Composition API", "Codemod", "ESLint rule", "setup()", "ref", "reactive", "computed", "watch", "mapState", "useStore", "mixins", "defineEmits", "Vue migration"]
summary: "Describes an ESLint-rule Codemod that auto-converts Vue 2 Options API components to Vue 3 Composition API setup() functions."
lastBuilt: 2026-09-15
---
## What it is

This ADR describes an automated Codemod, implemented as an ESLint rule, that converts Vue 2 Options API components to the Vue 3 Composition API in the Administration codebase.

## When to use

When migrating existing Vue 2 Options API components to the Composition API, instead of converting each component by hand.

## Key steps / config

The Codemod, implemented as an ESLint rule:

1. Identifies Vue component definitions in the codebase.
2. Converts Options API features to Composition API equivalents:
   - `data` properties to `ref`/`reactive`
   - `computed` properties to `computed()` functions
   - `methods` to functions inside `setup()`
   - lifecycle hooks to their Composition API equivalents (e.g. `mounted` to `onMounted`)
   - `watch` properties to `watch()` functions
   - `props`/`inject` conversions, and `this` references to direct reactive-variable references
3. Generates a `setup()` function containing the converted code.
4. Adds the necessary imports (`ref`, `reactive`, `computed`, `watch`, etc.).

## Essential identifiers

- `setup()`
- `ref` / `reactive`
- `computed()` / `watch()`
- `onMounted`

## Gotchas

The Codemod does not update templates (`$refs`, event handlers), does not convert Vuex `mapState`/`mapGetters`/`mapActions` to `useStore`, does not refactor mixins into composables, and does not handle render functions/JSX, `shallowRef`/`shallowReactive` optimizations, or `$emit` to `defineEmits` conversion — all of these require manual follow-up.
