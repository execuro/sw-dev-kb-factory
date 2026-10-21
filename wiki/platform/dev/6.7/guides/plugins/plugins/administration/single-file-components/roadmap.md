---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/roadmap.md
title: Roadmap
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/roadmap.html
sourceHash: 018c2309d38aa9ee3295874885010c7b1f6dbd02
codeCheckedAgainst: "6.7.15.1"
keywords: ["single file component", "sfc roadmap", "experimental", "swDefinePublic", "swDefineOverride", "useSwPreviousState", "useSwProps", "useSwContext", "sw-block", "mixin to composable", "useListing", "useTranslateWithFallback", "[Admin SFC]"]
summary: Status of the experimental Admin SFC extension system - timeline to stable in 6.9, supported macros/blocks/tooling, and mixins with composable counterparts.
lastBuilt: 2026-10-21
---
## What it is

Status page for the Administration's Single File Component (SFC) extension system: what is experimental, the planned timeline, which Vue macros and block features work in base vs. override files, tooling status, and which mixins have a composable replacement.

## When to use

Before writing an SFC extension, to judge API stability and check whether a needed macro, feature or mixin replacement is available.

## Key steps / config

**Experimental status**: no feature flag, nothing to opt into — a `.vue` file in a plugin is compiled by the extension build. The API may change at any time without deprecation until it is declared stable.

**Macros**

| Macro | Base | Override |
|---|---|---|
| `defineProps()`, `withDefaults()` | yes | use `useSwProps()` |
| `defineEmits()`, `defineSlots()`, `defineOptions()` | yes | use `useSwContext()` |
| `defineExpose()` | no — generated from `swDefinePublic()` | no |
| `defineModel()` | no | no |

**Blocks**: `<sw-block name="...">` declares an extension point, `<sw-block extends="...">` contributes, `<sw-block-parent />` renders previous chain content; several plugins may extend the same block.

**Reaching the overridden component**: `useSwPreviousState()`, `useSwProps()`, `useSwContext()`; replace a binding with `swDefineOverride()`. Previous state is read-only; props are always declared by the base component and cannot be overridden.

**Twig interop**: `.vue` override of a Twig/Options API component and Twig override of a converted component both work "in most cases".

**Tooling**: type checking/editor support, build-time validation, and importing stores/utilities/mixins/DAL helpers through `shopware:*` are supported; testing SFC extensions and a conversion codemod are not yet.

**Mixin → composable** (available): `cms-element` → `useCmsElement()`, `cms-state` → `useCmsState()`, `listing` → `useListing()`, `media-grid-listener` → `useMediaGridListener()`, `media-sidebar-modal-mixin` → `useMediaSidebarModal()`, `notification` → `useNotification()`, `notification-translation` → `useNotificationTranslation()`, `placeholder` → `usePlaceholder()`, `position` → `usePosition()`, `rule-between-operator` → `useRuleBetweenOperator()`, `ruleContainer` → `useRuleContainer()`, `salutation` → `useSalutation()`, `sw-inline-snippet` → `useInlineSnippet()`, `translate-with-fallback` → `useTranslateWithFallback()`, `user-settings` → `useUserSettings()`, `validation` → `useValidation()`, `video-cover` → `useVideoCover()`.

Still being worked on: `cart-notification`, `discard-detail-page-changes`, `generic-condition`, `remove-api-error`, `sw-extension-error`, `sw-form-field`. Until then, a component needing them stays on the Options API.

## Essential identifiers

- `swDefinePublic()`, `swDefineOverride()`, `useSwPreviousState()`, `useSwProps()`, `useSwContext()`
- `sw-block`, `sw-block-parent`, `shopware:*` virtual modules
- Feedback: https://github.com/shopware/shopware/discussions/21162; defects as issues on https://github.com/shopware/shopware/issues titled with `[Admin SFC]`

## Gotchas

- An SFC extension written today may need changes with every Shopware update until the API is stable.
- A Single File Component cannot use a mixin.
- The Twig shims are experimental too; their removal will be announced on the roadmap.

## Version notes

| When | What |
|---|---|
| 6.7.16 | Extension system available, experimental (docs: "available since Shopware 6.7.16.0") |
| 6.8 | `@private` Administration components converted, run in production |
| 6.9 | Planned stable API; first public components converted |
| Later | Remaining components; shims stay for a while |

## Code check (6.7.15.1)
- confirmed `overrideComponentSetup` — runtime registration for override setup already in 6.7.15.1 — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:507
- confirmed `attachOverrides` — base-component footer entry point present — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:559
- confirmed `useCmsElement` — composable replacing the `cms-element` mixin — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-element.ts:37
- confirmed `useListing` — composable replacing the `listing` mixin — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-listing.ts:111
- confirmed `useNotification` — composable replacing the `notification` mixin — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification.ts:20
- confirmed `useTranslateWithFallback` — marked @private, returns `tWithFallback` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-translate-with-fallback.ts:23
- confirmed `useValidation` — composable replacing the `validation` mixin — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-validation.ts:35
- confirmed `useRuleContainer` — composable replacing the `ruleContainer` mixin — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-container.ts:58
- confirmed `useVideoCover` — composable replacing the `video-cover` mixin — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-video-cover.ts:41
- unverified `shopware:*` — virtual modules are build aliases, not present in the checked src root
