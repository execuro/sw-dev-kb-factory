---
id: platform/dev/6.7/concepts/framework/translations/_index.md
title: Translations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/translations/
sourceHash: afbccee5ebc60241fd7f5f8133f8996808ef9436
codeCheckedAgainst: "6.7.13.0"
keywords: ["translations", "multilingual", "locales", "snippets", "translated fields", "built-in translation handling", "language pack", "automated translation updates", "fallback language", "extension points", "translation:install", "translation:update"]
summary: "Index of Shopware 6.7 translation topics: translated entity fields, translation downloads, automated updates, fallback languages, extension points."
lastBuilt: 2026-09-15
---
## What it is

The entry page of the Shopware 6 translation concept section. Shopware 6 is a multilingual platform supporting multiple languages and locales; this section explains how translations are managed. The page itself only lists its sub-topics.

## When to use

Start here when you need to find the right page about multilingual behaviour: storing translatable entity data, installing community translations, keeping them updated, choosing a fallback language for snippet files, or hooking into the translation system from an extension.

## Key steps / config

The section consists of these pages (in navigation order):

1. **Plain vs translated entity fields** — which entity fields are stored per language and which are not.
2. **Built-in Translation Handling** — the download system for translations not shipped with Shopware (console commands `translation:install` and `translation:update`, the shipped `translation.yaml`).
3. **Automated translation updates** — the chain from a snippet change to an updated shop, including the daily `translation.update` scheduled task.
4. **Fallback language selection** — choosing a country-agnostic fallback and structuring snippet files.
5. **Extension points** — snippet overrides, storefront snippet extension, translation events, CLI, storage backend and service decoration.

## Essential identifiers

- `translation:install`, `translation:update`, `translation:list`, `translation:validate`, `translation:lint-filenames` (console commands of the built-in system, confirmed in the installed core)
- `translation.update` (scheduled task name)

## Code check (6.7.13.0)
- confirmed `translation:install` — console command registered in core — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:24
- confirmed `translation:update` — console command registered in core — vendor/shopware/core/System/Snippet/Command/UpdateTranslationCommand.php:19
- confirmed `translation:list` — console command registered in core — vendor/shopware/core/System/Snippet/Command/ListTranslationsCommand.php:22
- confirmed `translation:validate` — console command registered in core — vendor/shopware/core/System/Snippet/Command/ValidateSnippetsCommand.php:26
- confirmed `translation:lint-filenames` — console command registered in core — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:21
- confirmed `translation.update` — task name of UpdateTranslationsTask, daily interval — vendor/shopware/core/System/Snippet/ScheduledTask/UpdateTranslationsTask.php:13
