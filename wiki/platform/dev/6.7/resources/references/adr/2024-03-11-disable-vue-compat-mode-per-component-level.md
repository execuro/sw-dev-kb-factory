---
id: platform/dev/6.7/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md
title: Disable Vue compat mode per component level
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.html
sourceHash: 80fc3bbfff24f8eb1cb1c5166e66028962bdabdb
codeCheckedAgainst: "6.7.13.0"
keywords: ["compatConfig", "Shopware.compatConfig", "Shopware.Component.register", "DISABLE_VUE_COMPAT", "vue compat mode", "vue 3 migration", "vue 2", "administration", "feature flag", "component migration", "adr"]
summary: "ADR: migrate Administration components to Vue 3 individually via compatConfig: Shopware.compatConfig instead of dropping compat mode globally."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (administration, 2024-03-11): instead of disabling the Vue 3 compatibility mode for the whole Administration at once, compat mode is disabled per component, so components (core and plugin) can be migrated to Vue 3 incrementally.

## When to use

- Migrating an Administration component (core or plugin) from Vue 2-style code to Vue 3.
- Understanding the `compatConfig: Shopware.compatConfig` line found in component definitions.

## Key steps / config

1. Register the component with the `compatConfig` option set to Shopware's custom configuration, which has all compatibility features disabled:

```javascript
Shopware.Component.register('your-component', {
    compatConfig: Shopware.compatConfig,
})
```

2. Use exactly the syntax `compatConfig: Shopware.compatConfig,` inside the component definition. The migration-tracking tool that lists components still using compat mode recognises only this form.

## Essential identifiers

- `compatConfig` (component option)
- `Shopware.compatConfig`
- `Shopware.Component.register`

## Gotchas

- Any other syntax, e.g. `compatConfig: false,`, is not recognised by the tracking tool and the component is not tracked.
- Per the ADR, the per-component opt-out only takes effect while the `DISABLE_VUE_COMPAT` feature flag is enabled; in the installed code this flag is a major flag defaulting to true and not toggleable, and no Administration source reads it (see Code check).
- The compat mode was kept so plugins could migrate in a later major than the Administration itself.

## Version notes

- The ADR splits the migration across two majors: Administration first, plugins afterwards. In 6.7.13.0 only a few core components still carry `compatConfig: Shopware.compatConfig`.

## Code check (6.7.13.0)
- unread `DISABLE_VUE_COMPAT` — declared in feature.yaml (default true, major, not toggleable), never read in the Administration src — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:20
- confirmed `compatConfig` — component option still used as `compatConfig: Shopware.compatConfig` — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-state-machine/page/sw-settings-state-machine-detail/index.js:13
- unverified `Shopware.compatConfig` — no definition found in the Administration src root; only four sw-settings-state-machine usages
