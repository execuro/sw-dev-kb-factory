---
id: platform/dev/6.6/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md
title: Disable Vue compat mode per component level
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.html"
sourceHash: "80fc3bbfff24f8eb1cb1c5166e66028962bdabdb"
keywords: ["Vue compat mode", "DISABLE_VUE_COMPAT", "compatConfig", "Shopware.compatConfig", "Shopware.Component.register", "Vue 3 migration", "Vue 2 to Vue 3", "administration migration", "feature flag", "per-component migration"]
summary: "ADR letting administration components opt out of Vue 2 compat mode individually via the `DISABLE_VUE_COMPAT` flag and `compatConfig`."
lastBuilt: "2026-09-15"
---
## What it is
This ADR documents disabling Vue 3's Vue-2 compatibility mode on a per-component basis in the administration, instead of migrating the whole administration off compat mode in one step.

## When to use
Relevant when migrating an administration Vue component from Vue 2 compat mode to native Vue 3 behaviour, or when investigating why some components still run under compat mode while others do not.

## Key steps / config
- Vue 3's compatibility mode (enabled by default) eases the Vue 2 to Vue 3 migration and was kept on in the administration so plugin migration and administration migration could happen as two separate majors rather than one.
- Migrating every component at once was judged too large a task and risky to administration stability, so the ADR instead disables compat mode per component.
- Activation requires the `DISABLE_VUE_COMPAT` feature flag to be enabled; once active, a component opts out of compat mode by setting its `compatConfig` option to `Shopware.compatConfig`:

```javascript
Shopware.Component.register('your-component', {
    compatConfig: Shopware.compatConfig,
})
```

- `Shopware.compatConfig` is a custom configuration that disables all compatibility features when the feature flag is active.
- A tracking tool scans all components for the exact syntax `compatConfig: Shopware.compatConfig,` to build a migration-progress list; any other syntax (e.g. `compatConfig: false,`) is not recognized and not tracked.

## Essential identifiers
- `DISABLE_VUE_COMPAT` feature flag
- `Shopware.compatConfig`
- `compatConfig` component option

## Gotchas
Only the exact tracked syntax `compatConfig: Shopware.compatConfig,` is picked up by the migration-progress tool — an equivalent but differently written `compatConfig` value (e.g. `compatConfig: false,`) will not register as migrated even if functionally correct.
