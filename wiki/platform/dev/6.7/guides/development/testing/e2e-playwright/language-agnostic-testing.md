---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/language-agnostic-testing.md
title: Language Agnostic Testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/language-agnostic-testing.html
sourceHash: 7bcd4c00e60515c5310871e45405691eda006b96
codeCheckedAgainst: "6.7.15.1"
keywords: ["@shopware-ag/acceptance-test-suite", "translate()", "Translate fixture", "LanguageHelper", "BUNDLED_RESOURCES", "TranslationKey", "TranslateFn", "mergeTests", "LANG", "playwright.config.ts", "translation keys", "localized acceptance tests", "i18n e2e tests", "locale switching"]
summary: Acceptance Test Suite translation keys, translate()/Translate fixture, LANG env switching, locale files and custom translation fixtures for Playwright tests.
lastBuilt: 2026-10-21
---
## What it is

Language agnostic testing in `@shopware-ag/acceptance-test-suite` (ATS) lets Playwright acceptance tests use translation keys instead of hard-coded UI strings; the locale is picked from environment variables, so one test runs against German or English UIs.

## When to use

- Writing ATS page objects or tests whose locators match visible text.
- Running the suite against a non-English shop language.
- Adding project-specific translations on top of the bundled ATS resources.

## Key steps / config

1. Page objects: `import { translate } from '../../services/LanguageHelper';` and call it inside the constructor, e.g. `page.getByRole('button', { name: translate('administration:category:actions.createCategory') })`.
2. Tests: use the `Translate` fixture — `async ({ AdminPage, Translate }) => { const saveText = Translate('administration:category:general.save'); ... }`.
3. Keys follow `area:module:section.key` (e.g. `storefront:account:fields.firstName`, `storefront:checkout:payment.invoice`).
4. Locale files per language and area, e.g. `locales/en/administration/category.json`, `locales/de/storefront/account.json`:
   ```json
   { "general": { "save": "...", "cancel": "..." }, "actions": { "createCategory": "..." } }
   ```
5. Switch language: `LANG=de-DE npm run test` / `LANG=en-GB npm run test` (default), or `LANG=de-DE npx playwright test`.

### Custom translations in your own project

- Install `npm install @shopware-ag/acceptance-test-suite @playwright/test` and `npm install -D @types/node`.
- `fixtures/CustomTranslation.ts`: import `test as base`, `LanguageHelper`, `TranslationKey`, `TranslateFn`, `BUNDLED_RESOURCES`, `baseNamespaces`; merge `BUNDLED_RESOURCES.en/de` with your `LOCALE_RESOURCES` and `baseNamespaces` with your `enNamespaces`; define `Translate` via `base.extend`. Language = `process.env.lang || process.env.LANGUAGE || process.env.LANG || 'en'`, split on `/[_.-]/`, lowercased, falling back to `en`; instance via `await LanguageHelper.createInstance(language, MERGED_RESOURCES)`.
- `locales/index.ts`: import JSON files `with { type: 'json' }`, export `LOCALE_RESOURCES` (keys like `'administration/common'`) and `enNamespaces`.
- `types/TranslationTypes.ts`: `export type CustomTranslationKey = TranslationKey<typeof enNamespaces>;` for compile-time key checks.
- Root `test.ts`: `export const test = mergeTests(ShopwareTestSuite, CustomTranslation);`.
- `playwright.config.ts`: map language to browser locale (`{ de: 'de-DE', en: 'en-US', fr: 'fr-FR' }`), set `use.locale`, and for non-`en` pass `--lang=` / `--accept-lang=` in `launchOptions.args`.

## Essential identifiers

- `@shopware-ag/acceptance-test-suite`, `translate()`, `Translate`, `LanguageHelper`
- `BUNDLED_RESOURCES`, `baseNamespaces`, `TranslationKey`, `TranslateFn`, `mergeTests`
- `LANG`, `LANGUAGE`, `locales/index.ts`, `playwright.config.ts`

## Gotchas

- Translation resources exist only for `en` and `de`; browser UI locales: `en`, `de`, `fr`, `es`, `it`, `nl`, `pt`.
- Key not found: check both EN/DE files, the import in `locales/index.ts`, and namespace structure.
- Failures after changing `LANG`: call `translate()` inside constructors/functions, never at module level.
- JSON import errors: always use `with { type: 'json' }`.
- ATS keys are the suite's own locale files, not Administration snippet keys (the Administration's "Create category" is `sw-category.general.buttonCreate`).

## Code check (6.7.15.1)
- unverified `@shopware-ag/acceptance-test-suite` — external npm package, outside the vendor/shopware roots
- unverified `LanguageHelper.createInstance` — ATS API, out of scope
- unverified `BUNDLED_RESOURCES` — ATS export, out of scope
- confirmed `buttonCreate` — Administration English "Create category" snippet — vendor/shopware/administration/Resources/app/administration/src/module/sw-category/snippet/en.json:9
- confirmed `buttonCreate` — German "Kategorie erstellen" counterpart — vendor/shopware/administration/Resources/app/administration/src/module/sw-category/snippet/de.json:9
- confirmed `locale` — Administration global en snippet file carries a locale block — vendor/shopware/administration/Resources/app/administration/src/app/snippet/en.json:1434
