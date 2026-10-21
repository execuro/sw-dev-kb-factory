---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-filter.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md
sourceHash: 16a1d8c5807d8450230b5c74ce13f13b63e88ed9
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/using-filter.html
title: Using Filter
version: "6.7"
versions:
  - "6.7"
keywords: ["Shopware.Filter.getByName", "Shopware.Filter", "this.$options.filters", "filter pipe", "admin filter", "vue filter", "use filter in template", "twig template", "computed filter", "filterFactory", "v-bind"]
summary: Using a registered Administration filter in component JS and templates; 6.7 core resolves it via Shopware.Filter.getByName.
lastBuilt: 2026-10-21
---
## What it is

How to call a filter you registered (the source uses one named `example`, built in [Add filter](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md)) from component JavaScript and from the component's Twig template. Requires a running plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## When to use

You want to format values (text, dates, sizes, names) in an Administration component with a filter registered through the filter factory.

## Key steps / config

The installed 6.7 Administration resolves filters through `Shopware.Filter.getByName()` and exposes them via a computed property; templates then call it as a function. This is the pattern core components use:

```javascript
computed: {
    exampleFilter() {
        return Shopware.Filter.getByName('example');
    },
},
```

```twig
{% block my_custom_block %}
    <p>{{ exampleFilter($tc('swag-example.general.myCustomText')) }}</p>
{% endblock %}
```

Additional arguments are passed as further function arguments, e.g. `exampleFilter(value, 'secondArgument', 'thirdArgument')`; the same call works inside a `v-bind` (`:title="exampleFilter(...)"`) expression.

## Essential identifiers

- `Shopware.Filter.getByName('<name>')`
- `Shopware.Filter.register`, `Shopware.Filter.getRegistry`
- `filterFactory` (service provider)

## Gotchas

- The source shows `this.$options.filters.example('firstArgument')` in JS and the pipe syntax `{{ value|example }}` / `{{ value|example('secondArgument', 'thirdArgument') }}` in templates and `v-bind`. The installed 6.7 Administration contains no use of `$options.filters`; core components call filters as functions from a `getByName` computed property instead.

## Code check (6.7.15.1)
- confirmed `Shopware.Filter.getByName` — exposed on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:193
- confirmed `Shopware.Filter.register` — exposed on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:192
- confirmed `getByName` — filter factory lookup by name — vendor/shopware/administration/Resources/app/administration/src/core/factory/filter.factory.ts:58
- confirmed `fileSizeFilter` — core pattern: computed returns `Shopware.Filter.getByName('fileSize')` — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-media-item/index.js:85
- confirmed `fileSizeFilter` — called as a function in the template — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-media-item/sw-media-media-item.html.twig:55
- confirmed `filterFactory` — registered as service provider — vendor/shopware/administration/Resources/app/administration/src/app/init/filter-factory.init.ts:13
- unverified `this.$options.filters` — docs-only access path; no occurrence in the installed admin src
