---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-placeholder.md
title: usePlaceholder()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-placeholder.html
sourceHash: cbc6a076ecbe778217e2c98ae66b065bfd477a6e
codeCheckedAgainst: "6.7.15.1"
keywords: ["usePlaceholder", "placeholder", "shopware:composables", "placeholder mixin", "composable", "translatable field", "translated", "parent language", "fallback", "useTranslateWithFallback", "tWithFallback", "administration", "inherited translation"]
summary: "usePlaceholder() admin composable: translatable-field placeholder with parent-language and fallback resolution; replaces placeholder mixin"
lastBuilt: 2026-10-21
---
## What it is

`usePlaceholder()` is an Administration composable returning one function, `placeholder(entity, field, fallbackSnippet)`, that reads a translatable field off an entity the way the Administration displays it elsewhere — mostly as the `placeholder` attribute of a translatable input. It replaces the `placeholder` mixin.

## When to use

In a Composition API (single-file) admin component that shows a translatable field and needs the inherited value greyed out in a child language instead of an empty input.

## Key steps / config

```ts
import { usePlaceholder } from 'shopware:composables';

const { placeholder } = usePlaceholder();
const { tWithFallback } = useTranslateWithFallback();

const namePlaceholder = computed(() =>
    placeholder(product.value, 'name', tWithFallback('sw-product.detail.placeholderName')),
);
```

Resolution order in the installed code:

1. No entity → the fallback is returned.
2. The field on the entity itself, if it is a non-empty string.
3. The parent language's translation: the entry in `entity.translations` whose id is `${entity.id}-${parentLanguageId}`, where the parent id comes from `Shopware.Context.api.language.parentId`.
4. `entity.translated[field]`, if the key exists and is not `null`.
5. The `fallbackSnippet` you passed.

## Essential identifiers

- `usePlaceholder()` → `{ placeholder }`
- `placeholder(entity: Entity<EntityName>, field: keyof Entity<EntityName>, fallbackSnippet: string): string`
- `useTranslateWithFallback()` / `tWithFallback()` (used in the example to produce the fallback text)
- `placeholder` mixin (the Options API counterpart)

## Gotchas

- The fallback is returned as is — pass translated text, not a snippet key.
- In 6.7.15.1 the composable file is annotated `@private` and `@experimental stableVersion:v6.9.0 feature:ADMIN_MIXIN_COMPOSABLES`; the `shopware:composables` import alias from the docs was not found in the installed Administration source.

## Version notes

The `placeholder` mixin is still registered in 6.7.15.1; the composable duplicates its body and both are kept in sync.

## Code check (6.7.15.1)
- confirmed `usePlaceholder()` — default export returning `{ placeholder }` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-placeholder.ts:19
- confirmed `placeholder()` — signature `(entity, field, fallbackSnippet): string` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-placeholder.ts:26
- confirmed `Shopware.Context.api.language.parentId` — parent language used for the translation lookup — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-placeholder.ts:40
- confirmed `translated` — read after the parent translation, skipped when `null` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-placeholder.ts:61
- confirmed `fallbackSnippet` — returned unchanged as last resort — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-placeholder.ts:71
- confirmed `placeholder` — mixin still registered under this name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/placeholder.mixin.ts:16
- confirmed `tWithFallback()` — returned by `useTranslateWithFallback()` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-translate-with-fallback.ts:30
- unverified `shopware:composables` — import alias not found in the installed Administration src; may come from build tooling outside the checked roots
