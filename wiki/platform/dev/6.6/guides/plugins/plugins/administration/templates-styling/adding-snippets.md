---
id: platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/adding-snippets.md
title: Adding snippets
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/templates-styling/adding-snippets.html
sourceHash: 783c4bf0196a373975ed919edb41fd42bf485918
keywords: ["snippets", "Vue I18n", "$tc", "Shopware.Snippet.tc", "translation", "de-DE.json", "en-GB.json", "pluralization", "snippet directory", "app snippets", "localization"]
summary: How to create JSON snippet files and use the $tc helper (or Shopware.Snippet.tc) for translations in the Administration.
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/resources/references/upgrades/administration/vue3.md
  - platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md
---
## What it is
This guide explains how to create translation snippet files for a plugin module and use them in JavaScript and Twig templates via the Vue I18n plugin.

## When to use
Use when a plugin module needs localized text in the Administration UI.

## Key steps / config
1. Create a `snippet` directory inside the module: `<plugin root>/src/Resources/app/administration/src/module/<your-module>/snippet`, with one JSON file per language (e.g. `de-DE.json`, `en-GB.json`).
2. Structure translations as nested objects:
```json
{
    "swag-example": {
        "nested": {
            "value": "example",
            "examplePluralization": "1 Product | {n} Products"
        },
        "foo": "bar"
    }
}
```
Accessed by dotted path, e.g. `swag-example.nested.value`, `swag-example.foo`.
3. Use in JavaScript via the `$tc` helper: `this.$tc('swag-example.general.myCustomText')`, or `Shopware.Snippet.tc('swag-example.general.myCustomText')` when `this` is not a component.
4. Use in Twig: `{{ $tc('swag-example.general.myCustomText') }}`.
5. Pluralize with a `|` separator in the snippet value (singular | plural) and pass a count as the second `$tc()` argument, e.g. `$tc('swag-example.nested.examplePluralization', products.length)`.

App snippets use a simpler path, `<app root>/Resources/app/administration/snippet`, and — unlike plugins — are not allowed to override existing snippet keys. Files outside a module's suggested structure can be placed anywhere under `<plugin root>/src/Resources/app/administration/src/`.

## Essential identifiers
- `$tc(key, count?)`
- `Shopware.Snippet.tc(key)`
- Snippet file naming: `de-DE.json`, `en-GB.json`

## Gotchas
App-provided snippets cannot override existing snippet keys, unlike plugin snippets which can.
