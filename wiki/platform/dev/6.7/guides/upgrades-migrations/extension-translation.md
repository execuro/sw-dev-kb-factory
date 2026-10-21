---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/upgrades-migrations/extension-translation.md
relatedPages:
  - platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md
sourceHash: bea03c100eba67391b2d59b0e1d65fa276f812aa
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/extension-translation.html
title: Migrating Extensions
version: "6.7"
versions:
  - "6.7"
keywords: ["translation:lint-filenames", "translation:validate", "cache:clear", "country-independent snippet layer", "language base layer", "snippet fallback", "messages.en.base.json", "snippet file renaming", "extension translations", "en-GB fallback", "dialect locales", "translation migration"]
summary: Migrating extension snippet files to the 6.7.3 country-independent base layer (messages.en.json) manually or via translation:lint-filenames --fix.
lastBuilt: 2026-10-21
---
## What it is

Guide for moving extension snippet files to the country-independent snippet layer introduced in Shopware 6.7.3. Language variants such as `en-GB`, `en-US`, `en-CA` can share one base layer `en`, so duplicate translations are removed from the country-specific files.

## When to use

You maintain a plugin/app/theme with snippet files named per country locale (`messages.en-GB.base.json`, `messages.de-DE.base.json`, ...) and target Shopware 6.7.3 or later.

## Key steps / config

Resolution order for a requested key (per the docs):

1. Country-specific layer (e.g. `en-GB`, `de-DE`, `es-AR`) — highest priority
2. Language base layer (e.g. `en`, `de`, `es`) — new in 6.7.3
3. British English `en-GB` — legacy fallback
4. `en` — last resort

**Automatic migration** (6.7.3+):

- `bin/console translation:lint-filenames` — lists translation files and reports every country-specific file lacking a country-agnostic counterpart (e.g. `messages.de-DE.json` requires `messages.de.json`); exits with failure if any are missing.
- `bin/console translation:lint-filenames --fix` — renames files to their agnostic names; if several country-specific candidates exist for one agnostic file, it asks which one to rename.
- Further options in the installed code: `--all` (include the `custom` directory), `--extensions` (comma-separated extension names), `--ignore` (comma-separated paths), `--dir` (limit to one directory).

**Manual migration:**

1. Rename country files to the language base layer:
   ```
   messages.en-GB.base.json ⇒ messages.en.base.json
   messages.de-DE.base.json ⇒ messages.de.base.json
   messages.fr-FR.base.json ⇒ messages.fr.base.json
   ```
2. Re-create empty files under the former country-specific names (`messages.en-GB.base.json`, `messages.de-DE.base.json`, ...).
3. Remove translations duplicated in other country files, keeping only country-specific terms — e.g. `messages.en-US.base.json`, `messages.en-IN.base.json` (dialects of en-GB on the `en` base), `messages.de-AT.base.json`, `messages.de-CH.base.json` (on `de`), `messages.pt-BR.base.json` (dialect of pt-PT on `pt`).

**Testing:** switching to a locale with an empty snippet file should still show all strings; a country-specific locale should show everything with only its country-specific terms replaced.

Details on choosing a fallback language: [Fallback Languages](platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md).

## Essential identifiers

- `bin/console translation:lint-filenames` (`--fix`, `--all`, `--extensions`, `--ignore`, `--dir`)
- `bin/console translation:validate`
- `bin/console cache:clear`
- File pattern `messages.<lang>.base.json` (base layer) vs `messages.<lang>-<COUNTRY>.base.json`

## Gotchas

- Keep the country-specific files during the transition so older Shopware versions without base-layer support still find translations.
- Translations missing after restructuring: run `bin/console cache:clear`, then validate snippets. The docs name the validation command `snippet:validate`, which does not exist; the installed command is `translation:validate` (alias `snippets:validate`, slated for removal in 6.8.0).

## Version notes

- 6.7.3: base language layer and `translation:lint-filenames` introduced.

## Code check (6.7.15.1)
- confirmed `translation:lint-filenames` — console command checking/renaming to country-agnostic files — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:22
- confirmed `fix` — `--fix` option renames to agnostic filenames — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:37
- confirmed `extensions` — option restricting the lint to named extensions — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:51
- confirmed `getAgnosticFilename()` — builds the agnostic target filename — vendor/shopware/core/System/Snippet/Struct/TranslationFile.php:25
- corrected `translation:validate` — docs: `snippet:validate` — vendor/shopware/core/System/Snippet/Command/ValidateSnippetsCommand.php:26
- confirmed `cache:clear` — invoked as a console command by core — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:166
- unverified `fallback resolution order` — runtime snippet fallback chain not traced in this check
