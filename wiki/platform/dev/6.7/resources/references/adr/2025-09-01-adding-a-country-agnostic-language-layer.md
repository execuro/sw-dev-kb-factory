---
id: platform/dev/6.7/resources/references/adr/2025-09-01-adding-a-country-agnostic-language-layer.md
title: Adding a country-agnostic language layer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-09-01-adding-a-country-agnostic-language-layer.html
sourceHash: 9eb276be49917e4be4c7fa3356e18c5064c2b782
codeCheckedAgainst: "6.7.15.1"
keywords: ["country-agnostic language", "snippet fallback", "en.json", "messages.en.base.json", "en-GB", "en-US", "de-DE", "translation:lint-filenames", "CountryAgnosticFileLinter", "dialect", "snippets", "translations", "crowdin"]
summary: "ADR: country-agnostic snippet fallback layer (en, de, es); en-GB.json becomes en.json, dialect files hold only differences."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (area: discovery, 2025-09-01) that adds a country-agnostic language layer to Shopware's snippet system. Previously each specific locale (e.g. `de-DE`, `en-US`) fell back directly to another specific locale, `en-GB`. Now a language-only layer (e.g. `en` for both `en-GB` and `en-US`) sits in between, and dialects become patch files containing only their differences.

## When to use

- Naming snippet files for the core, a plugin or an app in 6.7 and later.
- Understanding why `en-US` or `de-AT` snippet files are small and where missing keys come from.
- Migrating extension snippet files from country-specific to country-agnostic names.

## Key steps / config

Motivation in figures: Shopware has about 12,000 snippets; the US translation was an automated copy of the GB one, with only about 70 differences (roughly 99.5% identical). Duplicating them is maintenance-heavy and pre-translating "English to English" costs money.

Fallback chain after the change:

```text
de-DE, de-AT -> de -> en-GB -> en
es-ES, es-AR -> es -> en-GB -> en
en-US        -> en
en-GB        -> en
```

- British English is the base dialect and is now called `en`, keeping its ~12,000 snippets; `en-US` shrinks to around 70 entries. Every other dialect file is expected to drop from ~12,000 entries to fewer than 100.
- `en-GB` stays available as a fallback for other languages such as `de-DE` and `de`; `en` is the final fallback for everything.
- Core snippet files are renamed to the country-agnostic language: `en-GB.json` -> `en.json`, `messages.en-GB.base.json` -> `messages.en.base.json`, and `de-DE` -> `de` likewise.
- Community translations / the language pack move to country-agnostic locales too (e.g. `es-ES` -> `es`).
- The installed code provides `bin/console translation:lint-filenames` to check that translations have a country-agnostic base file (e.g. `de.json` for `de-DE.json`); `--fix` renames files to their agnostic equivalents, `--all` includes the custom directory, `--extensions` restricts to named extensions.

## Essential identifiers

- Snippet files `en.json`, `de.json`, `messages.en.base.json`
- Locales `en`, `en-GB`, `en-US`, `de`, `de-DE`, `es`
- `translation:lint-filenames` (`Shopware\Core\System\Snippet\Command\LintTranslationFilesCommand`, uses `CountryAgnosticFileLinter`)

## Gotchas

- The system default language and active-language handling are unchanged — only snippet fallback changes.
- Plugins and apps need no immediate changes; the previous file structure keeps working.
- Crowdin will show lower coverage percentages for dialects, which more accurately reflects the real differences between e.g. `en-US` and `en`. The base language is set declaratively; British English is the base and is referred to as `en`.

## Code check (6.7.15.1)
- confirmed `translation:lint-filenames` — ensures a country-agnostic base file per translation — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:22
- confirmed `LintTranslationFilesCommand` — command class — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:26
- confirmed `fix` — option renames files to agnostic equivalents — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:37
- confirmed `extensions` — option restricts linting to named extensions — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:51
- confirmed `CountryAgnosticFileLinter` — linter service — vendor/shopware/core/System/Snippet/Command/Util/CountryAgnosticFileLinter.php:27
- confirmed `en-GB` — still added as fallback locale in snippet lookup — vendor/shopware/core/System/Snippet/SnippetService.php:247
- confirmed `storefront.en.json` — country-agnostic snippet file naming — vendor/shopware/core/System/Snippet/Files/AbstractSnippetFile.php:22
- unverified `messages.en.base.json` — file present under core Framework snippet resources; existence check only, no line citation
