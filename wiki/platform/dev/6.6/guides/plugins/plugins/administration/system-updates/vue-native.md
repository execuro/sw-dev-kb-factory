---
id: platform/dev/6.6/guides/plugins/plugins/administration/system-updates/vue-native.md
title: Native Vue
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/system-updates/vue-native.html
sourceHash: 99f2594b45119e9e79d0e31adaee49916693a749
keywords: ["Vue Native", "Options API", "Composition API", "Twig.Js", "native blocks", "Single File Components", "SFC", "Vuex to Pinia", "Shopware.Component.override", "Shopware.Component.createExtendableSetup", "override.vue", "Shopware.Store"]
summary: Roadmap for moving Administration from Options API/Twig.Js/Vuex to Composition API/native blocks/Pinia across Shopware 6.7-6.9.
lastBuilt: 2026-09-15
---
## What it is
This roadmap page describes Shopware's multi-version plan to move the Administration from the Options API, Twig.Js templates, and Vuex, toward the Composition API, native Vue blocks, and Pinia respectively.

## When to use
Use when planning a plugin's long-term Administration component strategy across Shopware 6.7, 6.8, and 6.9.

## Key steps / config
Component registration today: `Shopware.Component.register('sw-component', { template, ... })`; overrides via `Shopware.Component.override(...)`.
Upgrade paths (version → status):

| Version | Options API | Composition API |
|---|---|---|
| 6.7 | Standard | Experimental |
| 6.8 | Still supported for extensions | Standard for Core |
| 6.9 | Removed completely | Standard |

| Version | Twig.Js | Native blocks |
|---|---|---|
| 6.7 | Standard | Experimental |
| 6.8 | Still supported for extensions | Standard for Core |
| 6.9 | Removed completely | Standard |

| Version | Vuex | Pinia |
|---|---|---|
| 6.7 | Still supported for extensions | Standard for Core |
| 6.8 | Removed completely | Standard |

From 6.8, core components move to single-file `*.vue` files; extension overrides must use the `*.override.vue` naming convention, auto-loaded from the main entry file. From 6.9, `Shopware.Component.register` can no longer register new components.

## Essential identifiers
- `Shopware.Component.register()`, `Shopware.Component.override()`, `Shopware.Component.extend()`
- `Shopware.Component.createExtendableSetup` (has built-in TypeScript support)
- `Shopware.State` / `Shopware.Store`
- `*.override.vue` file naming pattern

## Gotchas
Overwriting a Core component requires the Composition API/native block approach even while extensions may still register new components with the Options API; apps are unaffected by these changes, only plugins.

## Version notes
6.7: Options API/Twig.Js/Vuex remain standard, Composition API/native blocks experimental, Vuex still supported for extensions. 6.8: Composition API/native blocks/Pinia become standard for Core; Options API/Twig.Js still work for extensions; Vuex removed completely. 6.9: Options API and Twig.Js removed completely; extensions using Twig.Js templates stop working.
