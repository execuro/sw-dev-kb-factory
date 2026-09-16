---
id: platform/dev/6.7/guides/upgrades-migrations/extension-translation.md
title: Migrating Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/extension-translation.html
sourceHash: bea03c100eba67391b2d59b0e1d65fa276f812aa
codeCheckedAgainst: "6.7.13.0"
keywords: ["translation:lint-filenames", "translation:validate", "snippet files", "country-independent snippet layer", "language base layer", "fallback language", "messages.en.base.json", "en-GB", "extension translations", "snippet migration", "--fix", "cache:clear"]
summary: "Migrating extension snippet files to the country-agnostic language base layer (6.7.3+), manually or via translation:lint-filenames."
lastBuilt: 2026-09-15
---
## What it is

Guide for moving extension snippet files to the country-independent snippet layer introduced in Shopware 6.7.3. A base language file (e.g. `en`) is shared by country variants (`en-GB`, `en-US`, `en-CA`), which removes duplicate translations.

## When to use

- An extension ships snippet files named per country (`messages.de-DE.base.json`) and should adopt the language base layer.
- Translations go missing after restructuring snippet files.

## Key steps / config

Resolution order described by the docs:

1. Country-specific layer (`en-GB`, `de-DE`, `es-AR`) – highest priority
2. Language base layer (`en`, `de`, `es`) – new fallback
3. `en-GB` – legacy fallback
4. `en` – last resort

**Automatic migration** (6.7.3+):

```bash
bin/console translation:lint-filenames        # check file names
bin/console translation:lint-filenames --fix  # rename to agnostic names
```

`--all` also includes the `custom` directory (then the `--extensions` option is ignored). If several country files map to one agnostic file, `--fix` requires a manual choice.

**Manual migration:**

1. Rename country files to language files:
   ```
   messages.en-GB.base.json => messages.en.base.json
   messages.de-DE.base.json => messages.de.base.json
   messages.fr-FR.base.json => messages.fr.base.json
   ```
2. Re-create empty files under the former country-specific names (`messages.en-GB.base.json`, ...).
3. Remove duplicates from dialect files such as `messages.en-US.base.json`, `messages.en-IN.base.json` (en base), `messages.de-AT.base.json`, `messages.de-CH.base.json` (de base), `messages.pt-BR.base.json` (pt base).

**Testing:** switching to a locale with an empty snippet set must still show all strings; a country locale shows all strings with only its country-specific terms replaced.

**Troubleshooting** missing translations:

```bash
bin/console cache:clear
bin/console translation:validate
```

## Essential identifiers

- `bin/console translation:lint-filenames` (`--fix`, `--all`, `--extensions`)
- `bin/console translation:validate`
- `messages.<language>.base.json`, `messages.<language>-<COUNTRY>.base.json`

## Gotchas

- Keep the country-specific files during transition for compatibility with Shopware versions without the base layer.
- The docs name the validation command `snippet:validate`; the installed command is `translation:validate`, with the alias `snippets:validate` deprecated for removal in 6.8.

## Version notes

- Base language layer and `translation:lint-filenames` ship with Shopware 6.7.3.

## Code check (6.7.13.0)
- confirmed `translation:lint-filenames` — command ensures a country-agnostic base translation file exists — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:21
- confirmed `--fix` — renames filenames to their agnostic equivalents — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:37
- confirmed `--all` — includes the custom directory, ignores the extensions option — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:44
- confirmed `--extensions` — option exists on the lint command — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:51
- corrected `translation:validate` — docs: `bin/console snippet:validate` — vendor/shopware/core/System/Snippet/Command/ValidateSnippetsCommand.php:26
- deprecated `snippets:validate` — alias to be removed in v6.8.0 — vendor/shopware/core/System/Snippet/Command/ValidateSnippetsCommand.php:21
- confirmed `SnippetFileCollection::getSnippetFilesWithLocaleFallback()` — region locales load canonical-language files before their own — vendor/shopware/core/System/Snippet/Files/SnippetFileCollection.php:130
- unverified `cache:clear` — Symfony framework command, vendor/symfony out of scope
