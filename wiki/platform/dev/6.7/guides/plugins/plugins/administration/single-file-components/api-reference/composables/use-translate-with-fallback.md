---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-translate-with-fallback.md
sourceHash: dfbf4885b16f4890cf6996db38a4041a1eb79d76
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-translate-with-fallback.html
title: useTranslateWithFallback()
version: "6.7"
versions:
  - "6.7"
keywords: ["useTranslateWithFallback", "tWithFallback", "shopware:composables", "translate-with-fallback", "fallbackLocale", "vue-i18n", "snippet", "translation", "fallback locale", "i18n composable", "script setup"]
summary: useTranslateWithFallback() returns tWithFallback(key), translating a snippet key in the active locale, then the fallback locale, else the key.
lastBuilt: 2026-10-21
---
## What it is

`useTranslateWithFallback()` is a composable that translates a snippet key against the active locale. When the active locale has no entry for the key, it tries the fallback locale instead. Its signature:

```ts
import { useTranslateWithFallback } from 'shopware:composables';

function useTranslateWithFallback(): {
    tWithFallback: (key: string) => string;
};
```

## When to use

Use it when a Single File Component's script code needs to translate a key. A plugin cannot import `vue-i18n`, so the `script setup` block has no `t()` of its own. Templates can still use `$t`.

## Key steps / config

```ts
const { tWithFallback } = useTranslateWithFallback();

const title = computed(() => tWithFallback('swag-margin.detail.title'));
```

## Essential identifiers

- `useTranslateWithFallback` (from `shopware:composables`)
- `tWithFallback(key)`
- `Shopware.Context.app.fallbackLocale`: the locale tried second

## Gotchas

- If a key exists in neither locale, you get the key itself back. An empty key returns an empty string.
- The source says the composable replaces the `translate-with-fallback` mixin. In the installed code the mixin is still registered and is kept in sync with the composable for Options API components.
- The installed composable is marked `@experimental stableVersion:v6.9.0 feature:ADMIN_MIXIN_COMPOSABLES` and `@private`. No such flag exists in the core feature flag list, so it is a stability annotation only.

## Code check (6.7.15.1)
- confirmed `useTranslateWithFallback` — composable returning `{ tWithFallback }` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-translate-with-fallback.ts:23
- confirmed `tWithFallback` — tries active locale, then fallback locale, else returns key — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-translate-with-fallback.ts:30
- confirmed `fallbackLocale` — read from `Shopware.Context.app.fallbackLocale` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-translate-with-fallback.ts:39
- corrected `translate-with-fallback` — docs: composable replaces the mixin; code: mixin still registered, kept in sync — vendor/shopware/administration/Resources/app/administration/src/app/mixin/translate-with-fallback.mixin.ts:20
- unverified `shopware:composables` — virtual module resolved by build tooling outside the scanned roots
