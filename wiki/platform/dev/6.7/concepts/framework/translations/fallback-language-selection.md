---
id: platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md
title: Fallback language selection
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/translations/fallback-language-selection.html
sourceHash: 839c215bb876516dca330ec6e9ba2da46a911e43
codeCheckedAgainst: "6.7.13.0"
keywords: ["fallback language", "country-agnostic snippets", "LintTranslationFilesCommand", "translation:lint-filenames", "translation:validate", "messages.<language>.base.json", "--fix", "snippet files", "patch file", "defining dialect", "locale", "translations", "snippet migration"]
summary: Shopware 6.7 country-agnostic snippet layer (de-DE -> de -> en), fallback codes per dialect, and translation:lint-filenames options for migrating files.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md", "platform/dev/6.7/guides/upgrades-migrations/extension-translation.md"]
---
## What it is

Shopware 6.7 introduced a **country-agnostic snippet layer**: the snippet loader first tries a country-specific variant (e.g. `de-DE`), then an agnostic **fallback language** file (e.g. `de`), and finally `en` as universal default. The page explains the fallback codes and the `translation:lint-filenames` command used to migrate and validate snippet filenames. Details of the resolution order are in [Built-in Translation Handling](platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md).

## When to use

- Migrating an extension's snippet files from country-specific names (`en-GB`, `de-DE`) to agnostic base files plus small regional patch files.
- Validating snippet filenames in core, `custom/` extensions or a specific directory before release.

## Key steps / config

Fallback code and its defining dialect (the standard locale the fallback content derives from):

| Fallback code | Defining dialect | Example dialects |
|---|---|---|
| `en` | `en-GB` | `en-US`, `en-CA`, `en-IN` |
| `de` | `de-DE` | `de-AT`, `de-CH` |
| `es` | `es-ES` | `es-AR`, `es-MX` |
| `pt` | `pt-PT` | `pt-BR` |
| `fr` | `fr-FR` | `fr-CA`, `fr-CH` |
| `nl` | `nl-NL` | `nl-BE` |

Lint/migrate with `bin/console translation:lint-filenames` (class `Shopware\Core\System\Snippet\Command\LintTranslationFilesCommand`). Without `--fix` it prints one table per domain (Administration, Base = `messages`, Storefront) with columns Filename, Path, Domain, Locale, Language, Script, Region, then an Issues table listing the missing agnostic file.

Options:
- `--fix` — rename files to their agnostic equivalents; if several country-specific candidates map to one agnostic file, you are prompted to pick one.
- `--all` — include the `custom` directory (all extensions); `--extensions` is then ignored.
- `--extensions` — restrict to given technical extension names (comma-separated), e.g. `SwagCmsExtensions`.
- `--ignore` — exclude paths relative to `src` or given bundle paths (comma-separated).
- `--dir` — limit the search to one directory; takes precedence over `--ignore`.

Extension guidelines (see [Extension Translation Migration](platform/dev/6.7/guides/upgrades-migrations/extension-translation.md)):
1. Create a complete base file `messages.<language>.base.json` per supported language.
2. Add patch files only where needed and keep them minimal; avoid country-specific terms in fallback files.
3. Naming: agnostic `storefront.nl.json`, patch `storefront.nl-BE.json`; storefront files of extensions may use their own domain prefix, e.g. `cms-extensions.en.json`.
4. Clear the cache, then run `bin/console translation:validate` and `bin/console translation:lint-filenames`.

## Essential identifiers

- `bin/console translation:lint-filenames`
- `Shopware\Core\System\Snippet\Command\LintTranslationFilesCommand`
- `bin/console translation:validate`
- `messages.<language>.base.json`
- Options `--fix`, `--all`, `--extensions`, `--ignore`, `--dir`

## Gotchas

- Language-defining base files must always use the `messages` domain, e.g. `messages.fr.base.json`.
- Locales follow IETF BCP 47 restricted to ISO 639-1 two-letter language codes; the Script part (e.g. `sr-Cyrl-RS`) is parsed but not otherwise distinguished by Shopware.
- Best practice: do not use a regional locale for the base language; handle regional differences (e.g. `de-AT`) as overrides.
- Without `--fix`, the command exits with failure when any country-specific file lacks a corresponding agnostic file (example: `messages.de-DE.json` requires `messages.de.json`).
- In the code, the canonical dialect for an agnostic language is `en-GB` for `en` and `<lang>-<LANG>` otherwise (e.g. `pt-PT`, `nl-NL`).

## Version notes

- Before 6.7 Shopware shipped only country-specific snippet files, which led to copies such as `en-GB` duplicated to `en-US`. The agnostic layer is new in 6.7.

## Code check (6.7.13.0)
- confirmed `translation:lint-filenames` — command name on LintTranslationFilesCommand — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:21
- confirmed `LintTranslationFilesCommand` — class exists in Snippet\Command namespace — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:26
- confirmed `fix` — VALUE_NONE option, prompts on multiple candidates — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:37
- confirmed `all` — includes custom directory, ignores extensions option — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:44
- confirmed `extensions` — comma-separated extension names — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:51
- confirmed `ignore` — paths relative to src or bundle paths — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:58
- confirmed `dir` — limits search to one directory — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:65
- confirmed `PLATFORM_DOMAIN_LABELS` — domains administration, messages (Base), storefront — vendor/shopware/core/System/Snippet/Command/Util/CountryAgnosticFileLinter.php:29
- confirmed `translation:validate` — command name on ValidateSnippetsCommand — vendor/shopware/core/System/Snippet/Command/ValidateSnippetsCommand.php:26
- confirmed `CANONICAL_LANGUAGE_MAP` — en maps to en-GB, others to lang-LANG — vendor/shopware/core/System/Snippet/Files/SnippetFileCollection.php:19
