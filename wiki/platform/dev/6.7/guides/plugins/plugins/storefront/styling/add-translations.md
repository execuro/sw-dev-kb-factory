---
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md
title: Add Translations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-translations.html
sourceHash: 441b883553837119cb19d720cfd301e7b6ddbac4
codeCheckedAgainst: "6.7.13.0"
keywords: ["snippets", "translations", "Resources/snippet", "trans", "translator", "TranslatorInterface", "StorefrontController", "<domain>.<locale>.json", ".base.json", "i18n", "localization", "snippet file", "twig trans filter"]
summary: "Storefront snippet JSON files in Resources/snippet named <domain>.<locale>.json (.base for new languages), read via Twig trans, trans() or translator."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

How to ship Storefront translations (snippets) as JSON files in a plugin, app or theme, and how to read them in Twig templates, Storefront controllers and other PHP services.

## When to use

You need translatable text in Storefront templates or PHP code of your extension, or want to ship translations for an entirely new language. A plugin base ([Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) or app base ([App Base Guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md)) is required.

## Key steps / config

1. Put snippet files in `<extension root>/src/Resources/snippet/` (plugin) or `<extension root>/Resources/snippet/` (app/theme). Subdirectories are allowed (flat structure recommended).
2. Name files `<domain>.<locale>.json`, e.g. `my-app.de.json`. Domain is free (recommend extension name in kebab case); locale is the ISO string with dashes, e.g. `de`, `en`, `es-AR` (BCP 47, ISO 639-1 language codes).
3. For base translations of a whole new language use `<name>.<locale>.base.json`, e.g. `my-app.de.base.json`.
4. Content is nested JSON; nested keys are addressed dotted (`header.example`). Wrap placeholders in `%` by convention:
   ```json
   {
     "header": { "example": "Our example header" },
     "soldProducts": "Sold about %count% products in %country%"
   }
   ```
5. Twig: `{{ 'header.example' | trans }}` or `{{ 'soldProducts' | trans({'%count%': 3, '%country%': 'Germany'}) }}`.
6. Controllers extending `Shopware\Storefront\Controller\StorefrontController`: `$this->trans('soldProducts', ['%count%' => 3, '%country%' => 'Germany']);`
7. Other PHP services: inject the `translator` service (implements `Symfony\Contracts\Translation\TranslatorInterface`) and call `trans()` with the same parameters:
   ```php
   $services->set(Swag\Example\Service\SwagService::class)
       ->args([service('translator')]);
   ```

## Essential identifiers

- `Resources/snippet` directory
- `<domain>.<locale>.json`, `<name>.<locale>.base.json`
- Twig filter `trans`
- `Shopware\Storefront\Controller\StorefrontController::trans()`
- service id `translator`, `Symfony\Contracts\Translation\TranslatorInterface`

## Gotchas

- The loader splits the file name (without `.json`) on dots: only 2-part (`domain.locale`) or 3-part (`domain.locale.base`) names are registered; any other number of dot segments is silently ignored.
- The source's own JSON example uses the path `snippet/en_GB/example.en-GB.json`, which contradicts its stated naming rule (`example.en.json`); follow the naming rule.
- For plugins, a bundle snippet file is skipped when a downloaded translation for that plugin and locale already exists in the translation directory.
- There is no special variable syntax; `%name%` is only a convention and must match the keys passed to `trans`.

## Code check (6.7.13.0)
- confirmed `Resources/snippet` — plugin/bundle snippet directory scanned for JSON files — vendor/shopware/core/System/Snippet/Files/SnippetFileLoader.php:158
- confirmed `Resources/snippet` — app snippet directory — vendor/shopware/core/System/Snippet/Files/AppSnippetFileLoader.php:108
- confirmed `base` — third file-name segment `base` marks a base translation file — vendor/shopware/core/System/Snippet/Files/SnippetFileLoader.php:254
- confirmed `GenericSnippetFile` — created only for 2- or 3-part file names — vendor/shopware/core/System/Snippet/Files/SnippetFileLoader.php:238
- confirmed `StorefrontController::trans()` — `trans(string $snippet, array $parameters = [])` delegates to the translator — vendor/shopware/storefront/Controller/StorefrontController.php:118
- confirmed `translator` — service id fetched by the controller helper — vendor/shopware/storefront/Controller/StorefrontController.php:121
- confirmed `pluginTranslationExistsForLocale` — plugin file skipped if a downloaded translation exists — vendor/shopware/core/System/Snippet/Files/SnippetFileLoader.php:172
- unverified `Symfony\Contracts\Translation\TranslatorInterface` — vendor/symfony, out of scope
