---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-salutation.md
title: useSalutation()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-salutation.html
sourceHash: af7ee6933601d97cf9c16e796a65e8048161161a
codeCheckedAgainst: "6.7.15.1"
keywords: ["useSalutation", "salutation", "salutation filter", "salutation mixin", "SalutationFilterEntityType", "Shopware.Filter.getByName", "customer name", "greeting", "firstName", "lastName", "tWithFallback", "shopware:composables", "composable"]
summary: "useSalutation() admin composable: formats a customer-like entity's salutation via the salutation filter; replaces the salutation mixin"
lastBuilt: 2026-10-21
---
## What it is

`useSalutation()` is an Administration composable that formats the salutation of a customer-like entity — anything carrying a `salutation` association along with `title`, `firstName` and `lastName`. It replaces the `salutation` mixin.

## When to use

In a Composition API admin component that displays a customer (or similar) name with salutation and title, matching what the `salutation` template filter renders.

## Key steps / config

```ts
import { useSalutation } from 'shopware:composables';

const { salutation } = useSalutation();
const { tWithFallback } = useTranslateWithFallback();

const greeting = computed(() => salutation(customer.value, tWithFallback('sw-customer.detail.noSalutation')));
```

- Signature: `salutation(entity: SalutationFilterEntityType, fallbackSnippet?: string): string`; `fallbackSnippet` defaults to `''`.
- Each call resolves the filter with `Shopware.Filter.getByName('salutation')` and returns its result, so it behaves exactly as the filter does in a template.
- `SalutationFilterEntityType` expects `salutation: { id, salutationKey, displayName }`, `title`, `firstName`, `lastName`.

## Essential identifiers

- `useSalutation()` → `{ salutation }`
- `SalutationFilterEntityType`
- `salutation` filter, `salutation` mixin
- `useTranslateWithFallback()` / `tWithFallback()` (for the fallback text)

## Gotchas

- The fallback is returned as is — pass translated text, not a snippet key.
- Unlike the mixin, the composable does not expose the filter itself; only the formatting helper is public.
- In 6.7.15.1 the composable is annotated `@private` and `@experimental stableVersion:v6.9.0 feature:ADMIN_MIXIN_COMPOSABLES`; the `shopware:composables` alias was not found in the installed Administration source.

## Version notes

The `salutation` mixin is still registered in 6.7.15.1 and imports `SalutationFilterEntityType` from the composable file.

## Code check (6.7.15.1)
- confirmed `SalutationFilterEntityType` — salutation association plus `title`/`firstName`/`lastName` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-salutation.ts:8
- confirmed `useSalutation()` — returns `{ salutation }` only — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-salutation.ts:29
- confirmed `fallbackSnippet` — defaults to `''` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-salutation.ts:32
- confirmed `Shopware.Filter.getByName` — `salutation` filter resolved on every call — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-salutation.ts:33
- confirmed `salutation` — mixin still registered under this name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/salutation.mixin.ts:14
- confirmed `tWithFallback()` — returned by `useTranslateWithFallback()` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-translate-with-fallback.ts:30
- unverified `shopware:composables` — import alias not found in the installed Administration src; may come from build tooling outside the checked roots
