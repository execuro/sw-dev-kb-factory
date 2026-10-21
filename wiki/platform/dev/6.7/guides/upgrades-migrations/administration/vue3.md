---
id: platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md
title: Vue 3 upgrade
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vue3.html
sourceHash: e175e54146e1f664ce3a288de30ef3f80364d3cf
codeCheckedAgainst: "6.7.15.1"
keywords: ["vue 3", "vue 2", "vue upgrade", "composer run watch:admin", "sw-field", "v-model", "this.$parent", "this.$tc", "Shopware.Snippet.tc", "AsyncComponentWrapper", "@hook:mounted", "mutating props", "plugin compatibility", "administration"]
summary: Upgrading admin plugins from Vue 2 to Vue 3 (Shopware 6.6+) - dependencies, template and code checks, known issues.
lastBuilt: 2026-10-21
---
## What it is

The Administration uses Vue.js 3 from Shopware 6.6 onward, because Vue 2 reached end of life on December 31st, 2023. This page explains who is affected, how to upgrade a plugin, and the known Vue 3 issues in the Shopware Administration.

## When to use

Use it when porting a plugin with custom Administration code from Shopware 6.5 (Vue 2) to 6.6+ (Vue 3), or when debugging Vue 3 breakages in such a plugin.

## Key steps / config

Prerequisites: a current Shopware `trunk` or release candidate, your plugin installed and activated, and a running watcher (`composer run watch:admin`).

1. **Dependencies**: align the plugin's `package.json` dependencies with the Administration's `package.json`.
2. **Templates** (in any order):
   - Replace every `sw-field` usage with the matching concrete field component.
   - Check all `v-model` bindings and event listeners against the Vue 3 `v-model` changes.
   - Check for deprecated slot syntax (eslint `vue/no-deprecated-slot-attribute`).
   - Check `router-view` combined with `keep-alive`/`transition`.
   - Check `key` attributes and filter usages, since filters are removed in Vue 3.
3. **Code**: search for `this.$`. Its use signals Vue internal API calls, which are likely to break, except `this.$tc`. Test thoroughly, manually or automatically.
4. Enable the Vue 3 rule set of `eslint` to help automate parts of the migration.

## Essential identifiers

- `composer run watch:admin`
- `this.$tc`, `Shopware.Snippet.tc`
- `this.$parent`, `this.$slots`, `@hook:mounted`, `AsyncComponentWrapper`
- `v-model`, `name` attribute on fields (for tests)

## Gotchas

- **Lifecycle hooks**: `@hook:mounted` can fire multiple times for async components. Vue 3 emits it for the `AsyncComponentWrapper` and for the inner component.
- **Slots**: checking whether `this.$slots` has a property is no longer enough. Verify the slot actually contains a v-node.
- **`this.$parent`**: async wrappers change the tree, so `this.$parent.$parent` may be needed. Prefer services or event communication instead.
- **Vue DevTools** causes severe performance problems in large Vue 3 apps.
- **Vuex reactivity**: stores lose reactivity if a getter alters state data.
- **Form field ids**: fields no longer use the previous id. Add a unique `name` attribute to fix tests that relied on it.
- **Prop defaults**: default functions have no access to `this`, so `this.$tc` is unavailable. Use `Shopware.Snippet.tc`.
- **Mutating props** now fails with hard errors.
- In 6.7.15.1 there is no `sw-field` component under `app/component/form` (only `sw-field-copyable`), so any remaining `sw-field` usage breaks.

## Version notes

- One plugin version cannot support both 6.5 and 6.6. Publish a new major, e.g. `1.x` for `6.5.x` and `2.0` for `6.6`+.
- App-based extensions are not affected. Only plugins with custom Administration code are.
- Support channel named by the source: `#shopware-development` on the Shopware community Discord.

## Code check (6.7.15.1)
- confirmed `Snippet` — `Shopware.Snippet` getter returns i18n global with `tc` mapped to `t` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:277
- confirmed `tc` — `Shopware.Snippet.tc` exists for use in prop defaults — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:287
- confirmed `createApp` — the Administration is mounted with Vue 3 `createApp` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:14
- unverified `sw-field` — no `sw-field` component directory under `app/component/form` in 6.7.15.1, only `sw-field-copyable`
- unverified `AsyncComponentWrapper` — Vue framework internals, node_modules out of scope
- unverified `composer run watch:admin` — composer.json scripts are outside the checked roots
