---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/language-agnostic-testing.md
title: Language Agnostic Testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/language-agnostic-testing.html
sourceHash: 7bcd4c00e60515c5310871e45405691eda006b96
codeCheckedAgainst: "6.7.13.0"
keywords: ["translate()", "Translate", "LanguageHelper", "BUNDLED_RESOURCES", "baseNamespaces", "TranslationKey", "TranslateFn", "mergeTests", "LANG", "@shopware-ag/acceptance-test-suite", "translation keys", "localized e2e tests", "i18n", "locale"]
summary: "ATS language-agnostic Playwright tests - translate() and Translate fixture, area:module:section.key keys, LANG switching, custom translation fixtures."
lastBuilt: 2026-09-15
---
## What it is

Language agnostic testing in `@shopware-ag/acceptance-test-suite` (ATS): tests and page objects use translation keys instead of hard-coded UI strings and adapt to the locale selected via environment variables.

## When to use

Writing acceptance tests or page objects that must pass for more than one Administration/Storefront language, or adding project-specific translations on top of the ATS bundled ones.

## Key steps / config

1. In page objects, use `translate()` (from `services/LanguageHelper`) inside constructors: `page.getByRole('button', { name: translate('administration:category:actions.createCategory') })`.
2. In tests, request the `Translate` fixture: `const saveText = Translate('administration:category:general.save');`.
3. Switch language with an env var: `LANG=de-DE npx playwright test` (English `en` is the default).
4. Keys follow `area:module:section.key`; translations live in JSON per language and area, e.g. `locales/en/administration/category.json`:

```json
{ "general": { "save": "Save", "cancel": "Cancel" },
  "actions": { "createCategory": "Create category" } }
```

5. Custom project translations:
   - `npm install @shopware-ag/acceptance-test-suite @playwright/test` and `npm install -D @types/node`.
   - `locales/index.ts` imports JSON files `with { type: 'json' }` and exports `LOCALE_RESOURCES` (keys like `'administration/common'` per `en`/`de`) and `enNamespaces` (nested `administration.common`).
   - `fixtures/CustomTranslation.ts`: import `test as base`, `LanguageHelper`, `TranslationKey`, `TranslateFn`, `BUNDLED_RESOURCES`, `baseNamespaces`; merge `BUNDLED_RESOURCES` with `LOCALE_RESOURCES` and `baseNamespaces` with `enNamespaces`; `base.extend` a `Translate` fixture that derives the language from `process.env.lang || process.env.LANGUAGE || process.env.LANG || 'en'`, falls back to `en` if unsupported, calls `await LanguageHelper.createInstance(language, MERGED_RESOURCES)` and `use()`s a function wrapping `languageHelper.translate(key, options)`.
   - `types/TranslationTypes.ts`: `TranslationKey<typeof enNamespaces>` and `TranslateFn<CustomTranslationKey>` for type-safe keys.
   - Main fixture file (`test.ts`/`index.ts`): `export const test = mergeTests(ShopwareTestSuite, CustomTranslation);`.
6. In `playwright.config.ts`, map language to browser locale (e.g. `{ de: 'de-DE', en: 'en-US', fr: 'fr-FR' }`), set `use.locale`, and for non-`en` pass `--lang=<locale>` and `--accept-lang=<locale>,<lang>;q=0.9,en;q=0.8` via `launchOptions.args`.

## Essential identifiers

- `translate()`, `Translate` fixture
- `LanguageHelper`, `LanguageHelper.createInstance`, `BUNDLED_RESOURCES`, `baseNamespaces`, `TranslationKey`, `TranslateFn`, `mergeTests`
- `LOCALE_RESOURCES`, `enNamespaces` (project-defined)
- Env vars `LANG`, `LANGUAGE`, `lang`
- `locales/<lang>/<area>/<module>.json`, `locales/index.ts`

## Gotchas

- Supported translation resources: `en`, `de`. Browser UI locales: `en`, `de`, `fr`, `es`, `it`, `nl`, `pt`.
- Key not found: verify the key exists in both EN and DE files, is imported in `locales/index.ts`, and the namespace structure is correct.
- Tests failing after changing `LANG`: call `translate()` inside constructors/functions, not at module level.
- JSON import errors: always use the `with { type: 'json' }` import attribute.
- Browser locale mismatch: check the locale mapping and browser args in `playwright.config.ts`.

## Code check (6.7.13.0)
- confirmed `sw-category` — core Administration category snippets use this namespace (en), separate from ATS `administration:category:*` keys — vendor/shopware/administration/Resources/app/administration/src/module/sw-category/snippet/en.json:2
- confirmed `sw-category` — German core snippet file with the same namespace — vendor/shopware/administration/Resources/app/administration/src/module/sw-category/snippet/de.json:2
- unverified `translate()` — ATS npm package, outside vendor/shopware
- unverified `LanguageHelper` — ATS npm package, outside vendor/shopware
- unverified `BUNDLED_RESOURCES` — ATS npm package, outside vendor/shopware
- unverified `baseNamespaces` — ATS npm package, outside vendor/shopware
- unverified `TranslationKey` — ATS npm package, outside vendor/shopware
- unverified `TranslateFn` — ATS npm package, outside vendor/shopware
- unverified `mergeTests` — Playwright test runner API, outside vendor/shopware
- unverified `LANG` — environment variable read by ATS/Playwright config, not Shopware code
