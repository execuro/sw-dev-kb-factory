---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/troubleshooting.md
title: Troubleshooting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/troubleshooting.html
sourceHash: d3960b0fed2df7bf28da064869baae8d46210b7d
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-core-rules/valid-shopware-setup", "swDefinePublic", "swDefineOverride", "useSwPreviousState", "useSwProps", "useSwContext", "sw-block", "sw-block-parent", "_renderedBySfcTemplate", "tWithFallback", "administration:check-extensions", "sfc errors", "override not working", "single file component"]
summary: Fixes for common Admin SFC errors - transform/ESLint validator messages, browser console warnings, silent markup pitfalls, snippets and useI18n.
lastBuilt: 2026-10-21
---
## What it is

A catalogue of the errors the Shopware setup transform raises for `.vue` files in Administration extensions, the runtime warnings in the browser console, and markup patterns that fail silently — each with cause and fix.

## When to use

When an SFC override or base component fails to build, shows nothing, renders `undefined`, or shows a snippet key instead of text.

## Key steps / config

**One validator**: the build and the ESLint rule `sw-core-rules/valid-shopware-setup` run the same code, so messages match in editor, build and `shopware-cli project console administration:check-extensions -- --only=<YourPlugin>`.

**Nothing happens at all** (most common first):
1. Wrong block name — a plain string, never checked; copy it from the component's template.
2. File not named after the component: `sw-product-detail-base.override.vue` overrides `sw-product-detail-base`; name it after the component whose template contains the block.
3. File outside `src/Resources/app/administration/src/` — the build only scans there for `*.override.vue`.
4. Stale bundle — check `shopware-cli project admin-watch` output, or run `shopware-cli project admin-build`.

**File / macro errors (selection)**

| Message starts with | Fix |
|---|---|
| `A Shopware setup component needs a … block.` (missing script setup block) | Every extension `.vue` needs a script setup block; keep Options API as `index.js` + `.html.twig` |
| `An override component needs a … block to register its override.` | Add a script setup block with `swDefineOverride({})` |
| `A Shopware setup block cannot be combined with another … block.` | Move the second script block's code into the setup block or a module |
| `Top-level await is not supported inside Shopware setup blocks.` | Move into a function / `onMounted` |
| `A base Shopware setup component must declare its extension surface…` | Add top-level `swDefinePublic({})` |
| `swDefineOverride() must be called exactly once at the top level…` | Add `swDefineOverride({})` |
| `swDefinePublic() only supports shorthand bindings such as { a, b }.` | No renamed/string/computed keys or spreads; only local bindings |
| `defineProps() is only supported in base Shopware setup blocks.` | In overrides use `useSwProps()` / `useSwContext()` |
| `defineExpose() is not supported inside Shopware setup blocks.` | List bindings in `swDefinePublic()` (base) |
| `useSwPreviousState() is only supported in override Shopware setup blocks.` | Base reads its own props/context |
| `Vue macro defineModel() is not supported inside Shopware setup blocks.` | Declare the prop and `update:` event by hand |

Allowed `lang`: `js`, `jsx`, `ts`, `tsx`. Reserved names: `__swSetup` prefix, top-level `Shopware`, `__swOverride`, `__proto__`, and macro names like `useSwProps`.

**Block errors**: never author `data`/`:data` or `#default` on `sw-block`; `extends` only in overrides, `name` only in bases; no directives/attributes on `sw-block`; override templates may contain only top-level `<sw-block extends="...">`; a named-slot `<template #name>` directly inside `sw-block` is unsupported (put the block inside the slot template). Template writes to override bindings inside block content fail — call a function instead. Two base files resolving to the same name fail the build only.

**Browser console**
- `Override result value not working. Cannot override props.` — `swDefineOverride` returned a prop name; read props with `useSwProps()`.
- `[sw-block] The "name" prop changed from … after mount.` — block names must be static.
- `[TemplateFactory] The block "…" cannot host a native extension point…` — extend a different block (dev build only).
- `[ComponentFactory] The component "…" needs a template to be functional.` — return `{ ...component, _renderedBySfcTemplate: true }` from the `Shopware.Component.register()` callback.

**Snippets**: after changing snippet files of an active plugin run `shopware-cli project console cache:clear`. `useI18n()` from `vue-i18n` is not available to extensions (only `vue` is aliased); use `$t('key')` in templates, `tWithFallback('key')` from `useTranslateWithFallback()` in scripts, `Shopware.Snippet.t('key', { … })` for placeholders.

## Essential identifiers

- `sw-core-rules/valid-shopware-setup`, `administration:check-extensions`
- `swDefinePublic()`, `swDefineOverride()`, `useSwPreviousState()`, `useSwProps()`, `useSwContext()`
- `sw-block`, `sw-block-parent`, `_renderedBySfcTemplate`
- `useTranslateWithFallback()`, `tWithFallback`, `Shopware.Snippet.t`

## Gotchas

- Two top-level `sw-block`s make the component multi-root: caller `class`/directives are dropped and `$el` breaks `v-tooltip`/`v-popover`.
- An `sw-block` between `v-if` and `v-else` breaks the chain; `<sw-block extends>` in `v-for` renders once per item; `<sw-block-parent />` must render unconditionally, exactly once.
- A setup binding named after a component tag (any casing) replaces that component — e.g. a ref named `swSelectResultList`.
- A binding sharing a declared prop's name is stripped and renders `undefined`; `vue/no-dupe-keys` cannot see imported prop types.
- `previousState.<name>` can vanish after an update: converted components expose only `swDefinePublic()` names, and internal state is not covered by backwards compatibility. Read from a store or the DAL instead (e.g. `shopware:stores/swProductDetail`).
- Report defects at https://github.com/shopware/shopware/issues with `[Admin SFC]` in the title.

## Code check (6.7.15.1)
- confirmed `Override result value not working` — warning when an override returns a prop key — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:399
- confirmed `[sw-block] The "name" prop changed` — dev-only watch on `name` — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:137
- confirmed `needs a template to be functional` — skipped when `_renderedBySfcTemplate` is set — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:530
- confirmed `_renderedBySfcTemplate` — optional flag on the component config — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:64
- confirmed `useTranslateWithFallback` — returns `{ tWithFallback }`, @private — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-translate-with-fallback.ts:23
- confirmed `swProductDetail` — store id of the product detail store — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/store.ts:34
- confirmed `useSwPreviousState` — used with `swDefineOverride` in the jest transform fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:4
- unverified `sw-core-rules/valid-shopware-setup` — ESLint rule and validator messages live outside the checked src root
- unverified `[TemplateFactory] The block` — message not found in the administration src root at 6.7.15.1
