---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/tutorial/build-your-own-component.md
title: 4. Build your own component
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/tutorial/build-your-own-component.html
sourceHash: 6994bac1169e09f43a38db5a1bd0eb715e855376
codeCheckedAgainst: "6.7.15.1"
keywords: ["swag-margin-hint", "base component", "shopware:stores/swProductDetail", "useTranslateWithFallback", "tWithFallback", "_renderedBySfcTemplate", "Shopware.Component.register", "snippet files", "en-GB.json", "cache:clear", "single file component", "vue sfc"]
summary: Admin SFC tutorial ch. 4 - a base .vue component that reads the product from the swProductDetail store, uses snippet files, and is registered by name.
lastBuilt: 2026-10-21
---
## What it is

Chapter 4 of the Administration Single File Component tutorial: the margin calculation and markup move out of the override into a base component `swag-margin-hint` of its own; the override only decides where it is rendered.

## When to use

When building a reusable Administration component as a `.vue` base SFC — reading data from a store, shipping snippets, and optionally registering it so its tag works without an import.

## Key steps / config

1. Create `<plugin root>/src/Resources/app/administration/src/component/swag-margin-hint.vue`. The filename is the component name (`swag-margin-hint/index.vue` is equivalent). Import it directly from the override: `import SwagMarginHint from '../component/swag-margin-hint.vue';`.
2. Read the product from the store, as the core price form does:

```ts
import useSwProductDetailStore from 'shopware:stores/swProductDetail';
const product = computed(() => useSwProductDetailStore().product);
```

   `shopware:stores/*` takes the store's registry key after the slash; the default export is its composable. Siblings: `shopware:composables`, `shopware:utils`, `shopware:data`, `shopware:mixins`. The store works in any block of the product detail page and does not depend on what a core component exposes through `previousState`.
3. Add snippets in `component/snippet/en-GB.json` and `de-DE.json`:

```json
{ "swag-margin": { "hint": { "tooLow": "…", "healthy": "…", "noPurchasePrice": "…", "margin": "… {margin}% …" } } }
```

   Shopware collects every `en-GB.json`, `de-DE.json` etc. under `src/Resources/app/administration/src/` of active plugins on the PHP side and caches them; apply with `shopware-cli project console cache:clear`.
4. Read strings with `$t('swag-margin.hint.tooLow')` in templates (global property, no import), and with `tWithFallback()` from `useTranslateWithFallback()` in the script block.
5. The override shrinks to only placing the component; `useSwPreviousState()` and the arithmetic disappear from it. A `<style scoped>` block in the component adds the spacing.
6. Optional — register by name to use `<swag-margin-hint />` without an import. Move the file into `component/swag-margin-hint/` with an `index.ts`:

```ts
Shopware.Component.register('swag-margin-hint', async () => {
    const component = (await import('./swag-margin-hint.vue')).default;
    return { ...component, _renderedBySfcTemplate: true } as never;
});
```

   then `import './component/swag-margin-hint';` once in `main.ts`. The override's import path becomes `'../component/swag-margin-hint/swag-margin-hint.vue'`.

## Essential identifiers

- `shopware:stores/swProductDetail`, `useSwProductDetailStore`
- `useTranslateWithFallback()`, `tWithFallback`, `$t`
- `Shopware.Component.register`, `_renderedBySfcTemplate`
- Options API equivalent: `Shopware.Component.wrapComponentConfig`, `Shopware.Store.get('swProductDetail')`, `this.$tc`

## Gotchas

- `_renderedBySfcTemplate: true` is needed because a production build moves the render function inside `setup()`, where the component factory does not find it; the flag is an internal factory detail, not a stable API, documented because there is no other way to register a `.vue` base by name.
- The Options API version has no `swDefinePublic` equivalent — everything on `this` was implicitly public.
- `this.$tc()` becomes `tWithFallback()` only because a script setup block has no `this`; snippet files are identical.

## Code check (6.7.15.1)
- confirmed `Shopware.Component.register` — maps to AsyncComponentFactory.register — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
- confirmed `wrapComponentConfig` — exposed on Shopware.Component — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:139
- confirmed `_renderedBySfcTemplate` — suppresses the missing-template warning in the factory — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:527
- confirmed `swProductDetail` — store registry id — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/store.ts:34
- confirmed `Shopware.Store.get('swProductDetail').product` — Options API access used by core views — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/view/sw-product-detail-base/index.js:37
- confirmed `useTranslateWithFallback` — returns `tWithFallback(key)`, marked @private — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-translate-with-fallback.ts:23
- unverified `shopware:stores/swProductDetail` — virtual module is a build alias, not present in the checked src root
- unverified `$tc` — vue-i18n global property, out of scope
