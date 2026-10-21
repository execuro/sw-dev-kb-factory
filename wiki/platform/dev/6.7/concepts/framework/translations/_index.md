---
id: platform/dev/6.7/concepts/framework/translations/_index.md
title: Translations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/translations/
sourceHash: afbccee5ebc60241fd7f5f8133f8996808ef9436
codeCheckedAgainst: "6.7.15.1"
keywords: ["translations", "multilingual", "i18n", "locales", "translated fields", "fallback language", "TranslatedField", "TranslationsAssociationField", "Defaults::LANGUAGE_SYSTEM", "translation:install", "translation:update", "snippets"]
summary: "Overview of Shopware 6 translation concepts: plain vs translated entity fields, built-in handling, automated updates, fallback language, extension points."
lastBuilt: 2026-10-20
---
## What it is

Entry page of the Translations concept section. Shopware 6 is multilingual and supports multiple languages and locales; this section explains how translations are managed. It groups five sub-topics:

- **Plain vs translated entity fields** — which entity fields are stored per language and which are not.
- **Built-in translation handling** — how the platform handles translations itself.
- **Automated translation updates** — keeping installed translations current.
- **Fallback language selection** — which language is used when a translation is missing.
- **Extension points** — where extensions can hook into translation handling.

## When to use

As the starting point when a task involves entity translations, language fallback, or installing/updating translation files, to pick the relevant sub-topic page.

## Essential identifiers

Identifiers present in the installed code for this topic:

- `Shopware\Core\Framework\DataAbstractionLayer\Field\TranslatedField` — a translated entity field
- `Shopware\Core\Framework\DataAbstractionLayer\Field\TranslationsAssociationField` — association to an entity's translation records
- `Shopware\Core\Defaults::LANGUAGE_SYSTEM` — the system default language ID
- Console commands: `translation:install`, `translation:update`, `translation:list`, `translation:download`, `translation:validate`, `translation:lint-filenames`

## Code check (6.7.15.1)
- confirmed `TranslatedField` — DAL field class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TranslatedField.php:11
- confirmed `TranslationsAssociationField` — extends OneToManyAssociationField — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TranslationsAssociationField.php:10
- confirmed `Defaults::LANGUAGE_SYSTEM` — system language ID constant — vendor/shopware/core/Defaults.php:18
- confirmed `translation:install` — console command — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:26
- confirmed `translation:update` — console command — vendor/shopware/core/System/Snippet/Command/UpdateTranslationCommand.php:20
- confirmed `translation:list` — console command — vendor/shopware/core/System/Snippet/Command/ListTranslationsCommand.php:23
- confirmed `translation:validate` — console command — vendor/shopware/core/System/Snippet/Command/ValidateSnippetsCommand.php:26
