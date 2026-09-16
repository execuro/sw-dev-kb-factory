---
id: platform/dev/6.6/guides/plugins/plugins/administration/system-updates/vue-migration-build.md
title: Removing Vue Migration Build
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/system-updates/vue-migration-build.html
sourceHash: ecdbbe522d67f3752cead72ef12cfa776ad9e914
keywords: ["Vue migration build", "Vue 3 migration", "$listeners", "$scopedSlots", "$children", "$on", "$off", "$once", "$set", "$delete", "Vue 2 to Vue 3", "$attrs", "$slots", "$refs"]
summary: Roadmap notice that Shopware 6.7 removes the Vue migration build, requiring plugins to be fully migrated to Vue 3.
lastBuilt: 2026-09-15
---
## What it is
This page announces that, with Shopware 6.7, the Vue migration build (which let Vue 2-style APIs keep working under Vue 3) will be removed; all plugins must be fully migrated to Vue 3.

## When to use
Relevant when auditing a plugin's Administration code for Vue 2 APIs before upgrading to Shopware 6.7.

## Key steps / config
Common migration changes listed in the source:
- `$listeners` removed — listeners now live in `$attrs`.
- `$scopedSlots` removed — use `$slots.<name>()` instead (e.g. `this.$slots.header()`).
- `$children` removed — use template refs (`this.$refs.childrenRef.childrenMethod()`).
- `$on`, `$off`, `$once` removed with no replacement — use `$emit`, or inject/provide a registration pattern for event handlers.
- `$set`, `$delete` removed — Vue 3's Proxy-based reactivity allows direct assignment/`delete` (`this.myObject.key = 'value'; delete this.myObject.key;`).

## Essential identifiers
- `$listeners`, `$attrs`, `$scopedSlots`, `$slots`, `$children`, `$refs`, `$on`, `$off`, `$once`, `$emit`, `$set`, `$delete`

## Gotchas
There is no general recipe for replacing `$on`/`$off`/`$once` — each use site needs manual adjustment based on its specific case, e.g. via inject/provide.

## Version notes
Prior to Shopware 6.7 the Vue migration build allowed most Vue 2 public APIs to keep working under Vue 3; from 6.7 onward it is removed entirely and plugins must rely on native Vue 3 APIs.
