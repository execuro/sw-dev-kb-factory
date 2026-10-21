---
id: platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md
title: Fallback language selection
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/translations/fallback-language-selection.html
sourceHash: 839c215bb876516dca330ec6e9ba2da46a911e43
codeCheckedAgainst: "6.7.15.1"
keywords: ["translation:lint-filenames", "LintTranslationFilesCommand", "translation:validate", "messages.<language>.base.json", "country-agnostic snippets", "fallback language", "defining dialect", "patch file", "snippet file naming", "locale", "agnostic layer", "--fix"]
summary: Country-agnostic snippet layer in 6.7 (de-DE -> de -> en), fallback codes and defining dialects, and the translation:lint-filenames command and its options.
lastBuilt: 2026-10-20
relatedPages:
  - platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md
  - platform/dev/6.7/guides/upgrades-migrations/extension-translation.md
---
## What it is

Shopware 6.7 adds a **country-agnostic snippet layer**: the snippet loader first tries the country-specific locale (e.g. `de-DE`), then the agnostic **fallback language** (e.g. `de`), and finally `en` as universal default. See [Built-in Translation Handling](platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md) for the full loading priority.

## When to use

When structuring snippet files for an extension, or migrating country-specific files (e.g. a copied `en-GB` → `en-US`) to an agnostic base plus small regional patch files.

## Key steps / config

Fallback code = plain language code; defining dialect = the standard variant the fallback derives from:

| Fallback | Defining dialect | Example dialects |
|---|---|---|
| `en` | `en-GB` | `en-US`, `en-CA`, `en-IN` |
| `de` | `de-DE` | `de-AT`, `de-CH` |
| `es` | `es-ES` | `es-AR`, `es-MX` |
| `pt` | `pt-PT` | `pt-BR` |
| `fr` | `fr-FR` | `fr-CA`, `fr-CH` |
| `nl` | `nl-NL` | `nl-BE` |

Lint/migrate file names with `bin/console translation:lint-filenames` (`LintTranslationFilesCommand`). Output tables per domain (Administration, Core/base files, Storefront) list Filename, Path, Domain (`administration` for admin files; `messages` for base files), Locale (BCP 47, ISO 639-1 two-letter language), Language, Script (optional, e.g. `sr-Cyrl-RS`), Region.

Options:
- `--fix` — rename files to agnostic equivalents; prompts when several country-specific candidates exist.
- `--all` — include the `custom` directory (all extensions); ignores `--extensions`.
- `--extensions` — restrict to technical extension names, comma-separated (e.g. `SwagCmsExtensions`).
- `--ignore` — exclude paths relative to `src` or bundle paths, comma-separated.
- `--dir` — limit to one directory; takes precedence over `--ignore`.

Extension guidelines ([Extension Translation Migration](platform/dev/6.7/guides/upgrades-migrations/extension-translation.md)):
- Create a complete base file `messages.<language>.base.json` per supported language.
- Add minimal patch files only when needed; keep fallback files neutral (e.g. neutral Castilian for Spanish).
- Naming: agnostic `storefront.nl.json`, patch `storefront.nl-BE.json`.
- Clear the cache, then run `bin/console translation:validate` and `bin/console translation:lint-filenames`.

## Essential identifiers

`translation:lint-filenames`, `LintTranslationFilesCommand`, `translation:validate`, `messages.<language>.base.json`, `--fix`, `--all`, `--extensions`, `--ignore`, `--dir`

## Gotchas

- Language-defining base files must always use the `messages` domain.
- Avoid regional locales for the base language; handle regions via patch files.

## Version notes

Before 6.7 only country-specific snippet files existed.

## Code check (6.7.15.1)
- confirmed `translation:lint-filenames` — command name of LintTranslationFilesCommand — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:22
- confirmed `--fix` — renames to agnostic equivalents — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:37
- confirmed `--all` — includes custom directory, ignores extensions — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:44
- confirmed `--extensions` — comma-separated extension names — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:51
- confirmed `--ignore` — paths relative to src or bundle paths — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:58
- confirmed `--dir` — limits to one directory — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:65
- confirmed `SnippetPatterns::LOCALE_PATTERN` — ISO 639-1 language, optional script and region — vendor/shopware/core/System/Snippet/SnippetPatterns.php:41
- confirmed `SnippetPatterns::CORE_SNIPPET_FILE_PATTERN` — `<domain>.<locale>[.base].json` — vendor/shopware/core/System/Snippet/SnippetPatterns.php:48
- confirmed `Translator::getFallbackLocale()` — fallback is the language part before the dash — vendor/shopware/core/Framework/Adapter/Translation/Translator.php:367
- confirmed `translation:validate` — command name — vendor/shopware/core/System/Snippet/Command/ValidateSnippetsCommand.php:26
