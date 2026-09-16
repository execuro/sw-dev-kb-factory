---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md
title: Add Filter
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/add-filter.html
sourceHash: 8f48f334d448a139526ef33d2d5a41370438e2fc
codeCheckedAgainst: "6.7.13.0"
keywords: ["Filter.register", "Shopware.Filter", "example.filter.js", "administration filter", "text formatting", "custom filter", "app/filter", "main.js", "FilterFactory", "formatter"]
summary: "Register a custom Administration text-formatting filter with Shopware.Filter.register in a *.filter.js file imported from the plugin's main.js."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-filter.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to create a filter for the Shopware 6.7 Administration. A filter is a small helper that formats a value; the example converts text to uppercase and wraps it in underscores.

## When to use

A plugin needs a reusable formatting function in the Administration (for use in templates or code, see platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-filter.md). Requires a working plugin (platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## Key steps / config

1. Create the file in `<plugin root>/src/Resources/app/administration/src/app/filter`, named after the filter — for filter `example`: `example.filter.js`.
2. Register it via `Filter` from the global `Shopware` object. First argument: filter name; second: the formatting function, which receives the value (and optionally further arguments):

```javascript
// <plugin root>/src/Resources/app/administration/src/app/filter/example.filter.js
const { Filter } = Shopware;

Filter.register('example', (value) => {
    if (!value) {
        return '';
    }
    return `_${value.toLocaleUpperCase()}_`;
});
```

Multiple arguments: `Filter.register('example', (value, secondValue, thirdValue) => { ... });`

3. Import the filter file in the plugin's `main.js`.

## Essential identifiers

- `Shopware.Filter` / `Filter.register(name, fn)`
- `example.filter.js`
- `<plugin root>/src/Resources/app/administration/src/app/filter`

## Gotchas

- In the installed code `Filter.register` returns `false` and only logs a warning when the name is empty or already registered — the existing filter is kept, so pick a unique (e.g. plugin-prefixed) name.
- The filter is not available unless its file is imported from `main.js`.

## Code check (6.7.13.0)
- confirmed `Shopware.Filter` — global exposes register, getByName, getRegistry — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:178
- confirmed `Filter.register` — maps to FilterFactory.register — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:179
- confirmed `register` — signature (filterName, filterFactoryMethod), returns boolean — vendor/shopware/administration/Resources/app/administration/src/core/factory/filter.factory.ts:39
- confirmed `filterRegistry.has` — duplicate name warns and returns false — vendor/shopware/administration/Resources/app/administration/src/core/factory/filter.factory.ts:45
- unverified `example.filter.js` — plugin file naming convention, not enforced by vendor code
