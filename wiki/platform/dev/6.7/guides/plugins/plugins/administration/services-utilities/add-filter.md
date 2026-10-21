---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md
title: Add Filter
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/add-filter.html
sourceHash: 8f48f334d448a139526ef33d2d5a41370438e2fc
codeCheckedAgainst: "6.7.15.1"
keywords: ["Filter.register", "Shopware.Filter", "FilterFactory", "administration filter", "text formatter", "example.filter.js", "main.js", "plugin", "custom filter", "format text"]
summary: "Register a custom Administration filter (text formatter) in a plugin with Shopware.Filter.register(name, fn) and import it in main.js."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-filter.md
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
---
## What it is

How to create a filter for the Shopware Administration from a plugin. A filter is a small helper that formats text; the example filter `example` converts its input to uppercase and wraps it in underscores.

## When to use

When Administration templates or components of your plugin need a reusable text-formatting function. It requires a working plugin (see the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)); to use the filter afterwards, see [Using filter](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-filter.md).

## Key steps / config

1. Create a file in `<plugin root>/src/Resources/app/administration/src/app/filter`, named after the filter, here `example.filter.js`.
2. Register the filter via `Filter` from the global `Shopware` object. The first argument is the filter name, the second the formatting function:

```javascript
const { Filter } = Shopware;

Filter.register('example', (value) => {
    if (!value) {
        return '';
    }

    return `_${value.toLocaleUpperCase()}_`;
});
```

3. For more arguments, extend the function signature, e.g. `(value, secondValue, thirdValue) => { ... }`.
4. Import the filter file in your plugin's `main.js`.

## Essential identifiers

- `Shopware.Filter`, `Filter.register(name, function)`
- `<plugin root>/src/Resources/app/administration/src/app/filter/example.filter.js`
- `main.js`

## Gotchas

- Filter names must be unique: registering a name that already exists only logs a warning and returns `false`, leaving the earlier filter in place. An empty name is rejected the same way.

## Code check (6.7.15.1)
- confirmed `Filter.register` — global object maps it to `FilterFactory.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:192
- confirmed `FilterFactory.register` — takes filter name and factory method, returns boolean — vendor/shopware/administration/Resources/app/administration/src/core/factory/filter.factory.ts:39
- confirmed `filterRegistry.has` — duplicate name warns and returns false — vendor/shopware/administration/Resources/app/administration/src/core/factory/filter.factory.ts:45
