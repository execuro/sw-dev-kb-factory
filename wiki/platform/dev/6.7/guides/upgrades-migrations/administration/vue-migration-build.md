---
id: platform/dev/6.7/guides/upgrades-migrations/administration/vue-migration-build.md
title: Removing Vue Migration Build
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vue-migration-build.html
sourceHash: 94a887bd3fdd1ca91544aa8f8b7820045b7a68b6
codeCheckedAgainst: "6.7.15.1"
keywords: ["vue migration build", "@vue/compat", "vue 3", "vue 2", "$listeners", "$attrs", "$scopedSlots", "$slots", "$children", "$refs", "$on", "$set", "inject provide", "compat mode removed"]
summary: Shopware 6.7 removed the Vue migration (compat) build; admin plugins must use pure Vue 3 APIs instead of $listeners, $scopedSlots, $children, $on, $set.
lastBuilt: 2026-10-21
---
## What it is

Before 6.7, the Administration ran on the Vue migration build, which let most Vue 2 public APIs keep working on Vue 3. Shopware 6.7 removed it entirely, so every plugin must be fully migrated to Vue 3. The source lists the most common breaking changes, but the list is not exhaustive; consult the official Vue 3 migration guide.

## When to use

Upgrading an Administration plugin to 6.7 that still relies on Vue 2 behaviour the compat build used to provide.

## Key steps / config

Replace these Vue 2 patterns:

- **Listeners**: event listeners passed to a component are now part of `$attrs`. Forward `$attrs` instead of the removed Vue 2 listeners object.
- **Scoped slots**: `$slots` unifies all slots and exposes them as functions. `this.$scopedSlots.header` becomes `this.$slots.header()`.
- **Child access**: use template refs. `this.$children.childrenMethod()` becomes `<sw-child ref="childrenRef" />` plus `this.$refs.childrenRef.childrenMethod()`.
- **Events API**: `$on`, `$off` and `$once` are removed with no replacement. `$emit` still triggers handlers that a parent attached declaratively. For handler registration, use provide/inject. There is no general recipe. Example of the pattern, where the parent provides the functions:

```js
inject: ['registerDoSomething', 'unregisterDoSomething'],
created() { this.registerDoSomething(this.eventHandler); },
beforeDestroy() { this.unregisterDoSomething(this.eventHandler); }
```

- **Reactive set/delete**: Vue 3's Proxy-based reactivity makes `$set`/`$delete` unnecessary. Use `this.myObject.key = 'value';` and `delete this.myObject.key;`.

## Essential identifiers

- `$attrs`, `$slots`, `$refs`, `$emit`, `inject`/`provide`
- Removed: `$listeners`, `$scopedSlots`, `$children`, `$on`, `$off`, `$once`, `$set`, `$delete`

## Gotchas

- The list covers only the changes most often seen in Shopware's codebase. Check the official Vue 3 migration guide for the rest.
- Replacing `this.$parent.$on(...)` subscriptions needs case-by-case redesign.

## Version notes

- Before 6.7: the Vue 3 Administration ran with the Vue migration build (Vue 2-compatible behaviour).
- 6.7: the migration build is removed, and plugins must use plain Vue 3 APIs.

## Code check (6.7.15.1)
- confirmed `createApp` — the view adapter imports `createApp` from plain `vue`, not the compat build — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:14
- confirmed `Vue` — `Shopware.Vue` exposes the plain Vue module — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:231
- unverified `@vue/compat` — not imported anywhere under administration `src`; package.json is out of scope
- unverified `$scopedSlots` — Vue framework API, node_modules out of scope
- unverified `$listeners` — Vue framework API, node_modules out of scope
