---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2024-10-02-vue-2-options-api-to-vue-3-composition-api-conversion-codemod.md
sourceHash: 7e11c7edc68f665422c48e915ef37e85b61d2cff
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-10-02-vue-2-options-api-to-vue-3-composition-api-conversion-codemod.html
title: Vue 2 Options API to Vue 3 Composition API Conversion Codemod
version: "6.7"
versions:
  - "6.7"
keywords: ["codemod", "eslint rule", "options api", "composition api", "setup()", "ref", "reactive", "computed", "watch", "onMounted", "defineEmits", "useStore", "vue 3 migration", "administration"]
summary: "ADR: an ESLint-rule codemod converts Administration Vue 2 Options API components to Vue 3 Composition API; lists what it converts and what stays manual."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2024-10-02, area frontend development) to build a codemod, implemented as an ESLint rule, that automatically converts Vue components written with the Vue 2 Options API into the Vue 3 Composition API. The motivation is better code organisation, TypeScript support and reuse of component logic, while avoiding slow, error-prone manual conversion of many components.

## When to use

You are migrating Administration (or plugin) components from the Options API to the Composition API and want to know what the automated conversion does, where it falls short, and which parts still need manual work. It can be run per file or per component, so adoption can be gradual.

## Key steps / config

What the codemod does, per the ADR:

1. Identifies Vue component definitions in the codebase.
2. Converts Options API features:
   - `data` properties to `ref` or `reactive`;
   - `computed` properties to `computed()` functions, including writable computed properties;
   - `methods` to plain functions inside `setup()`;
   - lifecycle hooks to Composition API equivalents (e.g. `mounted` to `onMounted`), including Vue 2-specific hooks to their Vue 3 equivalents;
   - `watch` properties to `watch()` functions;
   - `props` and `inject`;
   - `this` references to direct references to reactive variables;
   - reactive object reassignments via `Object.assign`;
   - `ref` access rewritten to `.value`.
3. Generates a `setup()` function containing the converted code.
4. Adds the needed imports (e.g. `ref`, `reactive`, `computed`, `watch`).

Being an ESLint rule, it plugs into the existing ESLint workflow.

## Essential identifiers

- `setup()`, `ref()`, `reactive()`, `computed()`, `watch()`, `onMounted`
- Manual targets: `defineEmits`, `useStore`, `shallowRef`, `shallowReactive`

## Gotchas

Not handled, or only partly handled, by the codemod:

- Templates are not updated: template bindings, event handlers, `ref` usage and `$refs` must be adjusted manually.
- Complex nested `data` structures may need manual optimisation.
- Vuex `mapState`, `mapGetters`, `mapActions` are not converted; switch to `useStore` by hand.
- Mixins are not converted; refactor them into composables.
- Plugins/third-party libraries relying on the Options API, and plugin usage via `this` (e.g. `$tc`, `$t`), need manual updates.
- TypeScript annotations for props, computed properties and methods in `setup()` must be added manually.
- Spread operators in computed properties are detected but not converted; a TODO comment is inserted.
- Render functions and JSX components need manual conversion.
- `shallowRef`/`shallowReactive` optimisations are not applied.
- Reactive object reassignment spread over multiple lines is not always handled correctly.
- `$emit` may need converting to `defineEmits` plus the `emit` function.
- Review lifecycle-hook error handling and consider extracting reusable composables afterwards.

## Code check (6.7.15.1)
- unverified `codemod ESLint rule` — the rule lives outside the checked Administration `src` root (no match there)
- confirmed `wrapComponentConfig` — Administration components are defined through Shopware.Component.wrapComponentConfig — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:72
- confirmed `setup` — Composition API setup() used by Administration components — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:85
- confirmed `computed` — imported from vue in a Composition API component — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:6
- confirmed `ref` — imported from vue in a Composition API component — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:10
- confirmed `watch` — imported from vue in a Composition API component — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:11
