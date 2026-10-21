---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-inline-snippet.md
title: useInlineSnippet()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-inline-snippet.html
sourceHash: 0d5ca3efbd6a073922eac51deb168804679ee61f
codeCheckedAgainst: "6.7.15.1"
keywords: ["useInlineSnippet", "getInlineSnippet", "sw-inline-snippet mixin", "inline snippet", "locale object", "fallback locale", "translated label", "config field label", "shopware:composables", "composable", "administration translation"]
summary: "useInlineSnippet(): resolves a locale-keyed inline snippet object via current locale, then fallback locale, then first non-empty entry."
lastBuilt: 2026-10-21
---
## What it is

`useInlineSnippet()` is the Administration composable that resolves an inline snippet: an object keyed by locale, the way a configuration field stores a label a merchant translated themselves. It replaces the `sw-inline-snippet` mixin.

## When to use

When a Composition API component displays a merchant-translated label or text stored as `{ '<locale>': '<text>' }`, for example a config field label.

## Key steps / config

```ts
import { useInlineSnippet } from 'shopware:composables';

function useInlineSnippet(): {
    getInlineSnippet: (value: { [locale: string]: string }) => string | { [locale: string]: string };
};
```

```ts
const { getInlineSnippet } = useInlineSnippet();

// { 'de-DE': 'Marge', 'en-GB': 'Margin' } -> 'Margin' in an English Administration
const label = computed(() => getInlineSnippet(props.element.config.label.value));
```

Resolution order: the current locale, then the fallback locale, then the first entry that is not empty. A value that is not an object comes back unchanged, so a plain string passes through.

## Essential identifiers

- `useInlineSnippet`
- `getInlineSnippet`

## Gotchas

- An empty value returns an empty string (per the installed code, not stated in the docs).

## Code check (6.7.15.1)
- confirmed `useInlineSnippet` — default export, `@experimental stableVersion:v6.9.0` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-inline-snippet.ts:18
- confirmed `getInlineSnippet` — the only returned helper — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-inline-snippet.ts:21
- confirmed `currentLocale` — tried first, read from the `session` store — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-inline-snippet.ts:26
- confirmed `fallbackLocale` — tried second, from `Shopware.Context.app` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-inline-snippet.ts:32
- confirmed `Object.keys(value).find` — first non-empty entry as last resort — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-inline-snippet.ts:39
- confirmed `isEmpty` — empty input returns an empty string — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-inline-snippet.ts:22
- confirmed `sw-inline-snippet` — the mixin this composable replaces — vendor/shopware/administration/Resources/app/administration/src/app/mixin/sw-inline-snippet.mixin.ts:13
- unverified `shopware:composables` — virtual module defined by the build tooling, outside the checked vendor roots
