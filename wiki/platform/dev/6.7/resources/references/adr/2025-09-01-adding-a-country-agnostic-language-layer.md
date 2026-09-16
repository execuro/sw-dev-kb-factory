---
id: platform/dev/6.7/resources/references/adr/2025-09-01-adding-a-country-agnostic-language-layer.md
title: Adding a country-agnostic language layer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-09-01-adding-a-country-agnostic-language-layer.html
sourceHash: 9eb276be49917e4be4c7fa3356e18c5064c2b782
codeCheckedAgainst: "6.7.13.0"
keywords: ["country-agnostic language", "snippet fallback", "translations", "language pack", "crowdin", "en.json", "messages.en.base.json", "en-GB", "en-US", "dialect", "translation:lint-filenames", "CountryAgnosticFileLinter", "SnippetService"]
summary: "ADR: snippet files move to country-agnostic locales (en, de); dialects like en-US become patch files falling back to en; en-GB kept for compatibility."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2025-09-01) adding a country-agnostic language layer (e.g. `en` for both `en-GB` and `en-US`) to Shopware's snippet/translation fallback. Before, each specific locale (e.g. `de-DE`) fell back directly to `en-GB`, so near-identical dialects duplicated ~12,000 snippets (about 99.5% of US English matched British English).

## When to use

- Naming or migrating snippet files in a plugin, app or language pack.
- Understanding why a dialect file (e.g. `en-US`) in core is small and where missing keys resolve from.

## Key steps / config

Decision and consequences as stated by the ADR:

- Dialects are treated as patch files on top of a country-agnostic base. British English is the base dialect and is referred to as `en`.
- Core snippet files are renamed: `en-GB.json` -> `en.json`, `messages.en-GB.base.json` -> `messages.en.base.json`; likewise `de-DE` -> `de`. Language packs follow (e.g. `es-ES` -> `es`).
- New fallback chain: `de-DE`/`de-AT` -> `de` -> `en-GB` -> `en`; `es-ES`/`es-AR` -> `es` -> `en-GB` -> `en`; `en-US` -> `en`. `en` is the final fallback; `en-GB` stays available for compatibility with existing translations.
- System default language and active language handling are unchanged. Plugins and apps need no immediate changes.

Installed code: for a regional locale such as `de-AT`, snippet files load in ascending priority — country-agnostic (`de`), canonical locale (`de-DE`), exact locale (`de-AT`). The console command `translation:lint-filenames` (option `--fix` renames files to agnostic equivalents; `--all`, `--extensions`, `--ignore`) checks that translations have a country-agnostic base file.

## Essential identifiers

- `en.json`, `messages.en.base.json`, `storefront.en.json`
- `translation:lint-filenames`
- `Shopware\Core\System\Snippet\Command\Util\CountryAgnosticFileLinter`
- `Shopware\Core\System\Snippet\SnippetService`

## Gotchas

- Crowdin coverage for dialects like `en-US` shows a lower percentage, since only real differences from `en` are translated.

## Code check (6.7.13.0)
- confirmed `SnippetService::getSnippetFilesByIso()` — loads agnostic, canonical, then exact-locale files — vendor/shopware/core/System/Snippet/SnippetService.php:322
- confirmed `SnippetFileCollection::getSnippetFilesWithLocaleFallback()` — locale fallback lookup — vendor/shopware/core/System/Snippet/Files/SnippetFileCollection.php:130
- confirmed `translation:lint-filenames` — command enforcing country-agnostic base files — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:21
- confirmed `fix` — option renaming files to agnostic names — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:37
- confirmed `CountryAgnosticFileLinter` — linter/fixer service — vendor/shopware/core/System/Snippet/Command/Util/CountryAgnosticFileLinter.php:27
- confirmed `storefront.en.json` — agnostic storefront snippet naming — vendor/shopware/core/System/Snippet/Files/AbstractSnippetFile.php:22
- unverified `messages.en.base.json` — file present in core Framework snippet directory (glob only, no line to cite)
- unverified `en.json` — administration app snippet file present (glob only, no line to cite)
