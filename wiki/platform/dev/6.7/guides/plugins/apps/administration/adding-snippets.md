---
id: platform/dev/6.7/guides/plugins/apps/administration/adding-snippets.md
title: Adding Translations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/adding-snippets.html
sourceHash: d1551db9a32f2b5b413240d53cc2586d1968c965
codeCheckedAgainst: "6.7.13.0"
keywords: ["Resources/app/administration/snippet", "de.json", "en.json", "en-US.json", "snippets", "translations", "administration snippets", "app snippets", "locale files", "dialect patch", "i18n"]
summary: Apps add Administration translations as locale JSON files in Resources/app/administration/snippet; same as plugins but existing keys cannot be overridden.
lastBuilt: 2026-09-15
---
## What it is

How an app ships Administration snippets (translations). It works like adding snippets in a plugin; the differences are the file location and that apps may not override existing snippet keys.

## When to use

Your app contributes Administration UI texts (e.g. labels of app-provided components or modules) that must be translated.

## Key steps / config

1. Create the directory `<app root>/Resources/app/administration/snippet`.
2. Add one JSON file per supported language, named by locale: `de.json`, `en.json`.
3. Optionally add dialect patch files such as `en-US.json` for country-specific translations on top of the base language file.
4. Structure keys the same way as plugin Administration snippets; fallback language selection is described in the Fallback Languages concept guide.

## Essential identifiers

- `Resources/app/administration/snippet`
- Locale file names `de.json`, `en.json`, dialect patches like `en-US.json`

## Gotchas

- Apps cannot override snippet keys that already exist; only new keys are accepted.

## Code check (6.7.13.0)
- confirmed `/_admin/snippets` — Administration fetches snippets per locale and extends the locale registry — vendor/shopware/administration/Resources/app/administration/src/core/service/api/snippet.api.service.ts:43
- confirmed `app_administration_snippet` — app Administration snippet table listed in core usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1749
- unverified `Resources/app/administration/snippet` — app snippet import and no-override check live in administration bundle PHP, outside checked roots
