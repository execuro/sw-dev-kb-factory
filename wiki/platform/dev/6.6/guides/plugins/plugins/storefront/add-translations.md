---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-translations.md
title: Add translations
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-translations.html
sourceHash: 491d7bb8d962d3f88779e6b8cc710b49edb7ade2
keywords: ["snippet", "trans filter", "trans method", "TranslatorInterface", "snippet file structure", "base translation", "locale", "ICU format", "StorefrontController", "translator service", "dependency injection"]
summary: How Storefront snippet files are structured and loaded, and how to use trans in Twig, controllers, and general PHP.
lastBuilt: 2026-09-15
---
## What it is

Explains the snippet file naming/directory convention for Storefront translations and how to use translations in Twig templates, controllers, and general PHP code.

## When to use

When a plugin, app, or theme needs to add or override Storefront translation strings.

## Key steps / config

Snippet files live in `<extension root>/src/Resources/snippet/` (plugin) or `<extension root>/Resources/snippet/` (app/theme), named `<name>.<locale>.json`, e.g. `example.en-GB.json`; base translations for a new language use `<name>.<locale>.base.json`, e.g. `example.de-AT.base.json`. Locale combines ISO 639-1 + ISO 3166-1 alpha-2, converted internally to ICU format (`de_DE`).

```json
// <extension root>/src/Resources/snippet/en_GB/example.en-GB.json
{
  "header": { "example": "..." },
  "soldProducts": "..."
}
```

Usage:

- Twig: `{{ 'header.example' | trans }}` or `{{ 'soldProducts' | trans({'%count%': 3, '%country%': 'Germany'}) }}`
- Controller (extending `Shopware\Storefront\Controller\StorefrontController`): `$this->trans('soldProducts', ['%count%' => 3, '%country%' => 'Germany']);`
- General PHP via DI, injecting `translator` (implements `Symfony\Contracts\Translation\TranslatorInterface`): `$this->translator->trans(...)`.

## Essential identifiers

- `trans` Twig filter
- `trans()` controller method
- `Symfony\Contracts\Translation\TranslatorInterface`
- `translator` service id

## Gotchas

There is no explicit placeholder syntax for variables in the Storefront translations, but wrapping them in `%` (e.g. `%count%`) is recommended to clarify intent. Nested keys are accessed with dot notation, e.g. `exampleOne.exampleTwo.exampleThree`.
