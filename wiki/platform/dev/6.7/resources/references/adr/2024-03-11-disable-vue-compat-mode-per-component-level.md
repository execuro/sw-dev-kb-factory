---
id: platform/dev/6.7/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md
title: Disable Vue compat mode per component level
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.html
sourceHash: 80fc3bbfff24f8eb1cb1c5166e66028962bdabdb
codeCheckedAgainst: "6.7.15.1"
keywords: ["compatConfig", "Shopware.compatConfig", "DISABLE_VUE_COMPAT", "Shopware.Component.register", "vue compat mode", "vue 3 migration", "vue 2 compatibility", "@vue/compat", "feature flag", "administration", "component migration", "plugin migration"]
summary: "ADR: disable Vue 3 compat mode per Administration component via compatConfig: Shopware.compatConfig; 6.7 admin source no longer loads compat."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2024-03-11, area administration). It describes how the Shopware Administration turns off the Vue 3 compatibility mode one component at a time instead of for the whole application at once. Vue 3 ships the compatibility mode to ease migration from Vue 2: it is on by default and lets most Vue 2 features run in a Vue 3 app. Vue recommends it only for the transition period. Shopware kept it on in the Administration so plugins could migrate with fewer breaking changes. This split the migration of the Administration and of plugins across two majors.

## When to use

Read it when you migrate an Administration component or a plugin component away from Vue 2 behaviour, or when you find `compatConfig: Shopware.compatConfig` in existing code and need to know what it meant. Disabling compat mode for the whole Administration in one step would have been a large task and hard to keep stable. Doing it per component lets teams and plugin developers migrate incrementally, without waiting for the whole Administration or for the global removal.

## Key steps / config

The ADR's per-component opt-out is the `compatConfig` option set to the custom configuration exposed as `Shopware.compatConfig`, which has every compatibility feature disabled:

```javascript
Shopware.Component.register('your-component', {
    compatConfig: Shopware.compatConfig,
})
```

In the installed 6.7.15.1 Administration source, nothing defines `Shopware.compatConfig` and nothing imports `@vue/compat`. The option still appears, as `compatConfig: Shopware.compatConfig,`, only in four `sw-settings-state-machine` components (`sw-settings-state-machine-list`, `-detail`, `-state-list`, `-state-detail`). New 6.7 components need no compat setting.

## Essential identifiers

- `compatConfig`: Vue component option
- `Shopware.compatConfig`: Shopware's "all compat features disabled" configuration
- `Shopware.Component.register`

## Gotchas

- The migration tracking tool recognises only the exact syntax `compatConfig: Shopware.compatConfig,` inside the component definition. Other forms, such as `compatConfig: false,`, are not detected and not tracked.
- In the ADR, the per-component switch only takes effect when the `DISABLE_VUE_COMPAT` feature flag is enabled. In 6.7.15.1 that flag is still declared in `feature.yaml` (`default: true`, `major: true`, `toggleable: false`), but no code reads it.

## Version notes

The mechanism belongs to the Vue 2 to Vue 3 transition of the 6.6 major. Teams and plugin developers were told about the new flag and the opt-out syntax so they could migrate over a longer period. In 6.7.15.1 the compat layer is gone from the Administration source, and the remaining `compatConfig` lines are leftovers.

## Code check (6.7.15.1)
- unread `DISABLE_VUE_COMPAT` — declared in feature.yaml (default true, not toggleable), never read in code — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:20
- corrected `Shopware.compatConfig` — docs: exposed by Shopware as a custom compat configuration; no definition in admin src, only leftover usages — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-state-machine/page/sw-settings-state-machine-list/index.js:13
- confirmed `compatConfig` — option still set in a state-machine component — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-state-machine/component/sw-settings-state-machine-state-detail/index.js:13
- unverified `@vue/compat` — not imported anywhere in admin src; package.json outside the checked roots
