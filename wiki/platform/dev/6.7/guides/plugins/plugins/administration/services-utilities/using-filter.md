---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-filter.md
title: Using Filter
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/using-filter.html
sourceHash: 16a1d8c5807d8450230b5c74ce13f13b63e88ed9
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware.Filter.getByName", "Shopware.Filter.register", "Shopware.Filter.getRegistry", "FilterFactory", "this.$options.filters", "administration filter", "admin filter usage", "vue filter", "twig template filter", "currencyFilter", "computed filter", "pipe filter"]
summary: Using registered Administration filters in component code and templates; in 6.7 fetch them via Shopware.Filter.getByName in a computed property.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md"]
---
## What it is

How to call an Administration filter (for example a custom `example` filter registered as described in [add filter](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md)) from a component's script code and from its Twig template.

## When to use

You have a plugin with a registered Administration filter and want to format a value with it inside your own or an overridden component. Requires a working plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## Key steps / config

The installed 6.7 Administration runs on Vue 3 and resolves filters through the global filter registry, not through component options. The pattern used throughout core modules:

1. Expose the filter as a computed property that looks it up by name with `Shopware.Filter.getByName('<name>')`.
2. Call that computed property as a function in script code or in the template, passing the value first and further arguments after it.

```js
computed: {
    exampleFilter() {
        return Shopware.Filter.getByName('example');
    },
},
```

```twig
{% block my_custom_block %}
    <p>{{ exampleFilter($tc('swag-example.general.myCustomText'), 'secondArgument') }}</p>
{% endblock %}
```

Bound attributes work the same way, e.g. `:title="exampleFilter($tc('swag-example.general.myCustomText'))"`. Core example: `sw-product-list` defines a `currencyFilter()` computed returning `Shopware.Filter.getByName('currency')` and its template calls `currencyFilter(price, isoCode)`.

## Essential identifiers

- `Shopware.Filter.getByName(name)` — returns the registered filter function
- `Shopware.Filter.register(name, fn)` — registers a filter (duplicate names are rejected with a warning)
- `Shopware.Filter.getRegistry()` — the `Map` of all filters
- `$tc(...)` — snippet translation, typically the filter input in examples

## Gotchas

- The source guide shows the Vue 2 style: `this.$options.filters.example('firstArgument')` in script code, and the pipe syntax `{{ value|example }}` / `value|example('secondArgument', 'thirdArgument')` in templates and `v-bind` expressions. No usage of either exists in the installed Administration source; core components use the computed `Shopware.Filter.getByName` pattern instead.
- `register` returns `false` and logs a warning if the name is empty or already taken, so pick a unique, prefixed filter name.

## Version notes

Vue 3 dropped component filters; the 6.7 Administration code only uses registry lookups via `Shopware.Filter`.

## Code check (6.7.13.0)
- confirmed `Shopware.Filter.getByName` — global filter registry lookup — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:180
- confirmed `Shopware.Filter.register` — global filter registration — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:179
- confirmed `FilterFactory.register()` — rejects empty or duplicate names with a warning — vendor/shopware/administration/Resources/app/administration/src/core/factory/filter.factory.ts:39
- confirmed `FilterFactory.getByName()` — reads from the filter `Map` — vendor/shopware/administration/Resources/app/administration/src/core/factory/filter.factory.ts:58
- confirmed `currencyFilter()` — computed filter pattern used in a core list page — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-list/index.js:286
- confirmed `currencyFilter` — called as a function in the template — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-list/sw-product-list.html.twig:243
- unverified `this.$options.filters` — no usage in the Administration source; Vue runtime internals out of scope
