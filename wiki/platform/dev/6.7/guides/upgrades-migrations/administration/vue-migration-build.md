---
id: platform/dev/6.7/guides/upgrades-migrations/administration/vue-migration-build.md
title: Removing Vue Migration Build
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vue-migration-build.html
sourceHash: 94a887bd3fdd1ca91544aa8f8b7820045b7a68b6
codeCheckedAgainst: "6.7.13.0"
keywords: ["vue migration build", "vue compat", "vue 3", "vue 2", "$listeners", "$attrs", "$scopedSlots", "$slots", "$children", "$refs", "$on", "$set", "$delete", "administration upgrade", "plugin migration"]
summary: "Shopware 6.7 removed the Vue migration build; admin plugins must use pure Vue 3 APIs instead of $listeners, $scopedSlots, $children, $on, $set."
lastBuilt: 2026-09-15
---
## What it is

Upgrade note for Shopware 6.7: the Vue migration build, which made most Vue 2 public APIs behave as before on top of Vue 3, was removed from the Administration. All plugins must be fully migrated to Vue 3. The page lists the most common changes seen in the Shopware codebase; the official Vue 3 migration guide is the complete reference.

## When to use

- An Administration plugin written against Vue 2 APIs (or relying on the compat layer before 6.7) is being upgraded to 6.7.
- Errors in a plugin component around `$listeners`, `$scopedSlots`, `$children`, `$on`/`$off`/`$once`, `$set`/`$delete`.

## Key steps / config

| Vue 2 (removed) | Vue 3 replacement |
|---|---|
| `$listeners` | listeners are included in `$attrs` |
| `this.$scopedSlots.header` | `this.$slots.header()` — `$slots` unifies all slots as functions |
| `this.$children.childrenMethod()` | template ref: `<sw-child ref="childrenRef" />`, then `this.$refs.childrenRef.childrenMethod()` |
| `$on`, `$off`, `$once` | no replacement; `$emit` still triggers handlers declared by the parent; or provide/inject a registration pattern |
| `this.$set(this.myObject, 'key', 'value')` / `this.$delete(this.myObject, 'key')` | `this.myObject.key = 'value'` / `delete this.myObject.key` (Proxy-based reactivity) |

Events API replacement example (parent provides the handlers):

```js
inject: ['registerDoSomething', 'unregisterDoSomething'],

created() {
  this.registerDoSomething(this.eventHandler);
},

beforeDestroy() {
  this.unregisterDoSomething(this.eventHandler);
}
```

Before, the child used `this.$parent.$on('doSomething', this.eventHandler)` and `this.$parent.$off('doSomething', this.eventHandler)`.

## Gotchas

- The list is not exhaustive; always consult the official Vue 3 migration guide for breaking changes and deprecations.
- There is no general recipe for the Events API removal — adjust per use case.
- The installed core still contains a few Vue 2-era leftovers (template comments about `$listeners`, `compatConfig` keys on some state-machine components); they do not mean the migration build is available.

## Version notes

- Before 6.7: the Vue migration build eased the Vue 2 → Vue 3 transition for plugins.
- 6.7: migration build removed entirely; the Administration app is created with Vue 3 `createApp`.

## Code check (6.7.13.0)
- confirmed `createApp` — Administration app created with `createApp` imported from `vue` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:14
- confirmed `compatConfig` — leftover option still present on a state-machine list page — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-state-machine/page/sw-settings-state-machine-list/index.js:13
- unverified `$listeners` — Vue framework API, outside vendor/shopware roots
- unverified `$scopedSlots` — Vue framework API, outside vendor/shopware roots
- unverified `$children` — Vue framework API, outside vendor/shopware roots
- unverified `$set` — Vue framework API, outside vendor/shopware roots
