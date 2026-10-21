---
id: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md
title: Adding Snippets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/templates-styling/adding-snippets.html
sourceHash: 2a35691e17e5c0a0872fb981d7c4c94bb3f94dc4
codeCheckedAgainst: "6.7.15.1"
keywords: ["administration snippets", "translations", "i18n", "Vue I18n", "snippet", "en-GB.json", "de-DE.json", "$t", "Shopware.Snippet", "useTranslateWithFallback", "pluralization", "app snippets", "shopware.filesystem.private"]
summary: Admin translation snippets for plugins and apps - snippet JSON file locations, nested keys, $t in JS and templates, pluralization with a pipe.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md"]
---
## What it is

How a plugin or app ships translation snippets for the Shopware 6 Administration. The Administration uses the Vue I18n plugin for translation; snippet files are JSON objects keyed by locale and collected automatically once the plugin is activated.

## When to use

When a custom Administration module, component or template needs translatable labels, including singular/plural texts, or when an app has to provide its own Administration snippets.

## Key steps / config

1. Create a `snippet` directory inside your module: `<plugin root>/src/Resources/app/administration/src/module/<your-module>/snippet`. Add one JSON file per supported language, e.g. `de-DE.json`, `en-GB.json`. Fallback language selection and file structuring are covered in [Fallback Languages](platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md).
2. If you do not build a module, the files can live anywhere under `<plugin root>/src/Resources/app/administration/src/`.
3. Apps use a flatter layout: vendor-prefixed snippet files in `<app root>/Resources/app/administration/snippet`.
4. Each file holds a nested object; nesting depth is unlimited. Keys are addressed by dotted path, e.g. `swag-example.nested.value` and `swag-example.foo`:

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

5. In a component, snippets are registered in the module scope and can be read directly with `this.$t('swag-example.general.myCustomText')` inside a method of a component registered via `Component.register('my-custom-page', { ... })`.
6. Where `this` is not a component, use `Shopware.Snippet.tc('swag-example.general.myCustomText')` (see the [Vue3 upgrade](platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md) guide). In the installed code, `Shopware.Snippet` exposes the global Vue I18n instance and its `tc` is an alias of `t`.
7. In an experimental Single File Component, use `$t` in the template and [`useTranslateWithFallback()`](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-translate-with-fallback.md) in the component's script part. The composable returns `tWithFallback(key)`, which resolves against the active locale first, then `Shopware.Context.app.fallbackLocale`.
8. Templates use the same helper. Pluralization: separate singular and plural forms with `|` in the snippet and pass the count as second argument:

```twig
{% block my_custom_block %}
    <p>
       {{ $t('swag-example.nested.examplePluralization', products.length) }}
    </p>
{% endblock %}
```

With `"examplePluralization": "One Product | {n} Products"`, a count of `1` renders `One Product`; any count above 1 renders the number, e.g. `4 Products`.

## Essential identifiers

- `snippet/` directory, `de-DE.json`, `en-GB.json`
- `<app root>/Resources/app/administration/snippet`
- `$t`
- `Shopware.Snippet.tc`
- `useTranslateWithFallback()`
- `Component.register`

## Gotchas

- App snippets are **not allowed** to override existing snippet keys; plugin snippets can.
- The source guide uses `$tc` in JavaScript and templates. In the installed 6.7.15.1 Administration, `$tc` is marked `@deprecated tag:v6.8.0` ("use $t instead") and simply forwards to the same `i18n.global.t` call as `$t`, so `$t` takes the same arguments, including the pluralization count.
- Vue I18n v10 changed the parameter order for `$t`; the installed adapter swaps arguments back and logs a warning when called with `(key, number, object)`.

## Version notes

Shopware 6.7.16.0 and later (newer than the installed 6.7.15.1) also load Administration snippets from the private filesystem (`shopware.filesystem.private`, by default the installation's `files/` directory). Every `de.json`, `de-DE.json`, `en.json`, `en-GB.json`, ... below `files/snippets/administration/`, directly or in any subdirectory (e.g. `files/snippets/administration/MyIntegration/de.json`), is picked up. These form the lowest-priority layer, so plugin and app snippets always override them. Shopware generates fallback snippets there for themes that still define `label` and `helpText` in their `theme.json` (see [Theme configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md)). Directories named after a theme's technical name are managed by Shopware and deleted and recreated on every theme refresh - use your own directory name. The Administration caches these snippets; run `bin/console cache:clear` after adding or changing files.

## Code check (6.7.15.1)
- confirmed `$t` — registered as Vue global property calling `i18n.global.t` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:180
- deprecated `$tc` — `@deprecated tag:v6.8.0`, use `$t` instead — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:186
- confirmed `Snippet` — getter on the global Shopware object returning the i18n global with `tc` aliased to `t` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:277
- confirmed `useTranslateWithFallback` — composable returning `tWithFallback`, marked experimental — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-translate-with-fallback.ts:23
- confirmed `AsyncComponentFactory.register` — backs `Shopware.Component.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
- confirmed `shopware.filesystem.private` — service id exists in installed core — vendor/shopware/core/System/DependencyInjection/snippet.php:218
- unverified `files/snippets/administration` — no loader for this directory in the installed 6.7.15.1 roots; docs state 6.7.16.0+
