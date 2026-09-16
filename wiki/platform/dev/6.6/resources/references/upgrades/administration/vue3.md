---
id: platform/dev/6.6/resources/references/upgrades/administration/vue3.md
sourceHash: 37a92b4fb089cea8b1222c7ded8ebe3d4f348b80
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/upgrades/administration/vue3.html
title: Vue 3 upgrade
version: "6.6"
versions: ["6.6"]
docType: developer
keywords: ["vue 3 upgrade", "vue2 eol", "administration vue3", "sw-field", "this.$parent", "this.$tc", "Shopware.Snippet.tc", "v-model breaking changes", "watch:admin", "eslint vue3", "vuex reactivity", "AsyncComponentWrapper", "package.json administration"]
summary: "Guide for migrating Shopware plugin administration code from Vue.js 2 to Vue 3, adopted in Shopware 6.6, with FAQ and known issues."
lastBuilt: 2026-09-15
---
## What it is

Upgrade guide explaining that the Shopware administration moves from Vue.js `2` (EOL December 31st 2023) to Vue.js `3` starting with Shopware `6.6`, and what plugin authors with custom administration code need to change.

## When to use

Use this guide when a plugin contains custom administration (Administration UI) code and needs to be made compatible with Shopware `6.6` and later, which ships Vue 3. App-based extensions are not affected.

## Key steps / config

Prerequisites: latest Shopware `trunk` or an official release candidate, plugin installed and activated, and a running administration watcher (`composer run watch:admin`).

- Align plugin npm dependencies with the [administration package.json](https://github.com/shopware/shopware/blob/trunk/src/Administration/Resources/app/administration/package.json).
- Check templates: replace all `sw-field` usages with the corresponding components (see the [6.5.x index.js reference](https://github.com/shopware/shopware/blob/6.5.x/src/Administration/Resources/app/administration/src/app/component/form/sw-field/index.js#L16)), check `v-model` usages, event listeners, deprecated slot syntax, `router-view` transition combinations, `key` attributes, and filter usages.
- Check code: search for `this.$` usages, which indicate Vue's internal API and are likely to break — except `this.$tc`.
- A separate plugin Store version is required per major administration line (e.g. `1.x` for Shopware `6.5.x`, `2.0` for `6.6` and newer); no single version covers both.
- Enabling the Vue 3 rule set of `eslint` can help automate parts of the migration.

## Essential identifiers

`sw-field`, `this.$parent`, `this.$tc`, `this.$slots`, `Shopware.Snippet.tc`, `composer run watch:admin`, `AsyncComponentWrapper`, `v-model`.

## Gotchas

- Lifecycle hooks like `@hook:mounted` may fire multiple times for asynchronously loaded components, because Vue 3 emits the hook for both the `AsyncComponentWrapper` and the underlying component.
- Checking `this.$slots` for a property is no longer sufficient to detect a slot's existence; verify the `slotName` contains an actual `v-node` instead.
- `this.$parent` is unreliable because Vue 3 wraps async components in `AsyncWrapperComponent`; a call that worked as `this.$parent` in Vue 2 may need `this.$parent.$parent` in Vue 3. Prefer services or event communication over `this.$parent`.
- Prop default functions no longer have access to the component's `this` scope — `this.$tc` in a default function must be replaced with `Shopware.Snippet.tc`.
- Mutating props, tolerated silently in Vue 2, now fails with hard errors in Vue 3.
- Form fields in the administration no longer carry the previous IDs used in tests; add a unique `name` attribute to fix failing tests.
- Vuex stores can lose reactivity if a getter alters state data.
- Vue dev tools can cause significant performance issues on large Vue 3 applications.

## Version notes

Vue.js 2 reaches end of life on December 31st 2023. Shopware adopts Vue.js 3 in the administration starting with version `6.6`; a plugin targeting both `6.5` and `6.6` needs two separate Store versions.
