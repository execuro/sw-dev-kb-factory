---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/_index.md
sourceHash: 22244dfaeedcbe3c92795742ce583329e658e752
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/
title: API reference
version: "6.7"
versions:
  - "6.7"
keywords: [".override.vue", "swDefinePublic", "swDefineOverride", "useSwPreviousState", "useSwProps", "useSwContext", "useTranslateWithFallback", "sw-block", "sw-block-parent", "shopware:composables", "sfc filename", "override", "vue macros", "single file component"]
summary: "SFC API reference: .vue vs .override.vue filenames, Vue macro support in base and override, build-provided globals, shopware:* imports."
lastBuilt: 2026-10-21
---
## What it is

The overview of everything a Single File Component in an Administration extension can use. It covers the filename rules, the Vue macros that are and are not supported, the names you never import, and the `shopware:*` virtual modules. It groups three sub-references: macros (`swDefinePublic`, `swDefineOverride`), composables (the override composables and the ones the Administration ships), and block components (`sw-block`, `sw-block-parent`).

## When to use

Use this page to look up how to name a `.vue` file, whether a Vue macro works in a base component or an override, or where a helper comes from.

## Key steps / config

**Filenames.** A `.vue` file needs no registration call. Its filename sets the component name and decides whether the file is a base component or an override:

| File | Role |
|---|---|
| `sw-my-component.vue` or `sw-my-component/index.vue` | declares `sw-my-component` |
| `sw-my-component.override.vue` or `sw-my-component/index.override.vue` | overrides `sw-my-component` |

- Two base files that declare the same name fail the build.
- Any number of overrides from any number of plugins may target one component.
- Within one plugin, two overrides of the same component must sit in different directories, e.g. `override/sw-my-component.override.vue` and `override-demo/sw-my-component.override.vue`.

Every `.vue` file in an extension is compiled by the Shopware setup transform. It must have a `script setup` block, and that block must declare its role with `swDefinePublic()` (base) or `swDefineOverride()` (override).

**Vue macros.** Base components compile as ordinary `script setup`, so prop defaults, reactive destructuring and `withDefaults` behave as in Vue 3, except:

| Macro | Base | Override |
|---|---|---|
| `defineProps`, `withDefaults` | yes | use `useSwProps()` |
| `defineEmits`, `defineSlots` | yes | use `useSwContext()` |
| `defineOptions` | yes | no |
| `defineExpose` | no, `swDefinePublic()` generates it | no |
| `defineModel` | no | no |

**What you never import.**
- `swDefinePublic`, `swDefineOverride` are compile-time macros.
- `useSwPreviousState`, `useSwProps`, `useSwContext` are provided by the build in every `.override.vue` file.
- `sw-block`, `sw-block-parent` are globally registered components, resolved by tag name.
- `$t` is available in every template (`$t('key', n)` for plurals). In script code use `useTranslateWithFallback()`, because a plugin cannot import `vue-i18n`.
- `Shopware` is the global object. Read it freely; the name is a reserved binding.

Everything else comes from a `shopware:*` virtual module:

```ts
import { useNotification } from 'shopware:composables';
import useSwProductDetailStore from 'shopware:stores/swProductDetail';
import { Criteria } from 'shopware:data';
import { createId } from 'shopware:utils';
```

## Gotchas

- In base components, a top-level binding must not share a declared prop's name. The extension runtime strips declared prop keys from the returned state, so the binding is deleted and the template renders `undefined`.
- Two overrides of the same component in one plugin cannot share a directory, because the filename names the target. One override per component per plugin is almost always enough.

## Code check (6.7.15.1)
- confirmed `swDefinePublic` — base fixture declares its public bindings — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.vue:22
- confirmed `withDefaults` — used in a base `.vue` fixture with `defineProps` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.vue:8
- confirmed `defineEmits` — used in a base `.vue` fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.vue:16
- confirmed `swDefineOverride` — override fixture declares replacement bindings — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:7
- confirmed `useSwPreviousState` — called without import in `.override.vue` fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:4
- confirmed `sw-block` — globally registered component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:113
- confirmed `sw-block-parent` — globally registered component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:110
- confirmed `useTranslateWithFallback` — composable in the Administration — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-translate-with-fallback.ts:23
- unverified `useSwProps` — injected by the build transform, not present in the scanned source roots
- unverified `shopware:composables` — virtual module resolved by build tooling outside the scanned roots
