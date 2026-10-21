---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/apps/app-base-guide.md
  - platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md
  - platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md
sourceHash: ff809840760370b8557f846e7e36477f81800487
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-translations.html
title: Add Translations
version: "6.7"
versions:
  - "6.7"
keywords: ["snippet", "translations", "Resources/snippet", "<domain>.<locale>.json", ".base.json", "trans", "StorefrontController", "translator", "TranslatorInterface", "SnippetFileLoader", "i18n", "locale", "bin/console cache:clear"]
summary: "Storefront snippets: <domain>.<locale>.json in Resources/snippet, .base suffix for base languages, |trans in Twig, trans() in controllers and PHP."
lastBuilt: 2026-10-21
---
## What it is

How plugins, apps and themes ship Storefront translations (snippets) as JSON files, and how to use them in Twig, in Storefront controllers and in other PHP services.

## When to use

Your extension outputs text in the Storefront that must be translatable, or you ship a complete new language. Create the extension first ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md) or [App base guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md)).

## Key steps / config

1. Location, loaded automatically:
   - plugin: `<extension root>/src/Resources/snippet/`
   - app or theme: `<extension root>/Resources/snippet/`
   Subdirectories are scanned too. A flat structure is recommended.
2. File name `<domain>.<locale>.json`, e.g. `my-app.de.json`. The domain is free; the extension name in kebab-case is recommended. The locale must be the ISO string of the language (`de`, `en`, `es-AR`): IETF BCP 47 with ISO 639-1 two-letter codes and dashes instead of underscores. See [Fallback language selection](platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md).
3. Base translations for a whole new language use the suffix `.base`: `<name>.<locale>.base.json`, e.g. `my-app.de.base.json`.
4. Content is nested JSON. Nested keys are addressed with dots, e.g. `header.example`. Placeholders are by convention wrapped in `%`:
   ```json
   {
     "header": { "example": "..." },
     "soldProducts": "Sold about %count% products in %country%"
   }
   ```
5. Twig: `{{ 'header.example' | trans }}` or `{{ 'soldProducts' | trans({'%count%': 3, '%country%': 'Germany'}) }}`
6. Controllers extending `Shopware\Storefront\Controller\StorefrontController`: `$this->trans('soldProducts', ['%count%' => 3, '%country%' => 'Germany']);`
7. Other PHP: inject the `translator` service, which implements `Symfony\Contracts\Translation\TranslatorInterface` ([Dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md)), e.g. `$services->set(Swag\Example\Service\SwagService::class)->args([service('translator')]);`. Then call `$this->translator->trans(...)` with the same arguments.

## Essential identifiers

- `Resources/snippet`, `<domain>.<locale>.json`, `<name>.<locale>.base.json`
- `trans` (Twig filter)
- `Shopware\Storefront\Controller\StorefrontController::trans()`
- `translator` service, `Symfony\Contracts\Translation\TranslatorInterface`

## Gotchas

- Only file names with two or three dot-separated parts are recognised (`domain.locale` or `domain.locale.base`). Other names are ignored silently.
- For plugins, a snippet file is skipped when a core translation already exists for that plugin and locale.
- The docs' JSON example is labelled `en_GB/example.en-GB.json`, while the text calls it `example.en.json`. Follow the `<domain>.<locale>.json` rule with dashes.
- Translation catalogues are cached. Run `bin/console cache:clear` after adding or changing files.

## Version notes

- From Shopware 6.7.16.0 the docs describe Storefront snippets loaded from the private filesystem (`shopware.filesystem.private`, by default `files/`) under `snippets/storefront/`. Files directly in that folder get author `custom`. Files in a subdirectory use the directory name as author and technical name. These files have the lowest priority. This loader is not present in 6.7.15.1.

## Code check (6.7.15.1)
- confirmed `Resources/snippet` — snippet dir per bundle (plugins) — vendor/shopware/core/System/Snippet/Files/SnippetFileLoader.php:153
- confirmed `Resources/snippet` — app snippet dir — vendor/shopware/core/System/Snippet/Files/AppSnippetFileLoader.php:108
- confirmed `GenericSnippetFile` — two-part `domain.locale` name, locale is the second part — vendor/shopware/core/System/Snippet/Files/SnippetFileLoader.php:213
- confirmed `base` — third name part `base` marks a base file — vendor/shopware/core/System/Snippet/Files/SnippetFileLoader.php:229
- confirmed `pluginTranslationExistsForLocale` — plugin file skipped if a core translation exists — vendor/shopware/core/System/Snippet/Files/SnippetFileLoader.php:167
- confirmed `StorefrontController::trans()` — delegates to the `translator` service — vendor/shopware/storefront/Controller/StorefrontController.php:119
- unverified `snippets/storefront` — private-filesystem loader not found in 6.7.15.1 (docs: since 6.7.16.0)
- unverified `TranslatorInterface` — vendor/symfony, out of scope
