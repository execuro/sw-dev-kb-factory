---
id: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md
title: Adding Snippets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/templates-styling/adding-snippets.html
sourceHash: 3d4dc7aeba5321858f67494cc2488d0604fdd991
codeCheckedAgainst: "6.7.13.0"
keywords: ["snippets", "translations", "i18n", "vue i18n", "en-GB.json", "de-DE.json", "$t", "$tc", "Shopware.Snippet.tc", "pluralization", "snippet directory", "app snippets", "/_admin/snippets", "administration"]
summary: Administration snippet JSON files per locale in plugins and apps, and reading them with $t / Shopware.Snippet in JS and Twig, including pluralization.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md", "platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md"]
---
## What it is

How to provide translations (snippets) for Administration plugin code and use them in components and templates. The Administration uses Vue I18n; snippets are nested JSON objects per locale.

## When to use

A custom Administration module or component needs translated UI texts, including singular/plural variants.

## Key steps / config

1. Create a `snippet` directory in your module: `<plugin root>/src/Resources/app/administration/src/module/<your-module>/snippet`. Outside a module structure, snippet files may be placed anywhere below `<plugin root>/src/Resources/app/administration/src/`.
2. Add one JSON file per language, e.g. `de-DE.json`, `en-GB.json`, with a nested object:

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

Keys are addressed by dotted paths: `swag-example.nested.value`, `swag-example.foo`. Nesting depth is unlimited. Shopware collects the files automatically when the plugin is activated; the Administration fetches them from `/_admin/snippets?locale=<locale>`.

3. Use in a component:

```javascript
methods: {
    createdComponent() {
        const myCustomText = this.$t('swag-example.general.myCustomText');
    }
}
```

Outside a component (no component `this`), use `Shopware.Snippet.tc('swag-example.general.myCustomText')` (see [Vue3 upgrade](platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md) and [the Shopware object](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md)).

4. Use in templates, including pluralization with a count as second argument:

```twig
{% block my_custom_block %}
    <p>{{ $t('swag-example.nested.examplePluralization', products.length) }}</p>
{% endblock %}
```

A `|` in the snippet separates singular and plural; `{n}` is replaced with the count.

**Apps:** snippet files go into `<app root>/Resources/app/administration/snippet` (vendor-prefixed), with a flatter structure.

## Essential identifiers

- `snippet/en-GB.json`, `snippet/de-DE.json`
- `$t`
- `Shopware.Snippet.tc`
- `/_admin/snippets`

## Gotchas

- The source uses `$tc` in JS and Twig; in 6.7.13 `$tc` is `@deprecated tag:v6.8.0` ("use $t instead") and with the `V6_8_0_0` flag it logs a deprecation warning. It calls the same `i18n.global.t` as `$t`.
- `Shopware.Snippet` returns `null` until the Vue I18n instance exists; `Shopware.Snippet.tc` is an alias of `i18n.global.t`.
- App snippets are not allowed to override existing snippet keys (per the docs).
- Passing `(key, number, object)` to `$t` triggers a console warning about changed parameter order in the newer Vue I18n.

## Code check (6.7.13.0)
- deprecated `$tc` — `@deprecated tag:v6.8.0 - Will be removed, use $t instead` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:185
- confirmed `$t` — global property wrapping `i18n.global.t` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:179
- confirmed `Snippet` — getter exposing `i18n.global` plus `tc` alias, `null` before i18n init — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:264
- confirmed `/_admin/snippets` — snippets fetched per locale by the snippet API service — vendor/shopware/administration/Resources/app/administration/src/core/service/api/snippet.api.service.ts:43
- confirmed `legacy` — Vue I18n created in composition mode (`legacy: false`) — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:746
- unverified `snippet` — plugin/app snippet file discovery lives in the Administration PHP bundle, outside the checked roots
