---
id: platform/dev/6.7/guides/plugins/apps/administration/adding-snippets.md
title: Adding Translations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/adding-snippets.html
sourceHash: d1551db9a32f2b5b413240d53cc2586d1968c965
codeCheckedAgainst: "6.7.15.1"
keywords: ["snippet", "translations", "app snippets", "Resources/app/administration/snippet", "en.json", "de.json", "en-US.json", "administration i18n", "fallback language", "dialect patch file", "snippet keys"]
summary: Apps add Administration snippets as per-locale JSON files in Resources/app/administration/snippet; existing snippet keys cannot be overridden.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md"]
---
## What it is

Administration translations (snippets) for apps work like those for plugins; only the file location differs, and apps may not override existing snippet keys.

## When to use

An app shows text in the Administration and needs it translated per language.

## Key steps / config

1. Create the directory `<app root>/Resources/app/administration/snippet`.
2. Add one JSON file per supported language, named by locale, e.g. `de.json`, `en.json`.
3. Optionally add dialect patch files such as `en-US.json` for country-specific translations.

For choosing a fallback language and structuring snippet files see [Fallback language selection](platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md). Everything else follows the plugin snippet guide.

## Essential identifiers

- `<app root>/Resources/app/administration/snippet`
- Locale file names `de.json`, `en.json`, dialect patch `en-US.json`

## Gotchas

- Apps may only add new snippet keys; overriding existing keys is not allowed.
- The app path has no `src/` segment, unlike the plugin layout (`src/Resources/app/administration/src/snippet/`).

## Code check (6.7.15.1)
- confirmed `src/Resources/app/administration/src/snippet/en.json` — plugin scaffold location, contrasting with the app path — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/Generator/AdminModuleGenerator.php:80
- unverified `Resources/app/administration/snippet` — app snippet loading lives in the Administration PHP bundle, outside the checked package roots
- unverified `override` — the no-override rule for app snippet keys is enforced outside the checked package roots
