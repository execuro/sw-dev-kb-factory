---
id: platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-filter.md
title: Add filter
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/services-utilities/add-filter.html
sourceHash: db9cb1a1ed58c15f4f7c833eb0f3bd167bab443c
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/using-filter.md
keywords: ["filter", "Filter.register", "administration filter", "text formatting", "example.filter.js", "Shopware Filter", "filter arguments", "administration", "filter function", "uppercase filter", "main.js import"]
summary: How to create an Administration text-formatting filter with Shopware's Filter.register, including a single-argument and a multi-argument example.
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to create a filter for the Shopware Administration — a small helper for formatting text. The worked example builds a filter that converts input text to uppercase and wraps it with an underscore on each side.

## When to use

Use this when a plugin needs a reusable text-transformation helper that can be applied both in JavaScript code and inside Twig templates, rather than duplicating formatting logic in multiple places. It assumes a basic plugin is already running; the companion guide covers how to actually use the filter once it is registered.

## Key steps / config

Create a new file under `<plugin root>/src/Resources/app/administration/src/app/filter`, named after the filter — the example uses `example.filter.js` for a filter named `example`. Destructure `Filter` from the `Shopware` object and call `Filter.register` with the filter's name and a formatting function:

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

The first argument to `register` is the filter's name (`example`); the second is the function that receives the value to format and returns the formatted result — here converting to uppercase with `toLocaleUpperCase()` and adding a leading and trailing underscore, with an early return of an empty string when no value is passed.

A filter function can also accept more than one argument if needed:

```javascript
Filter.register('example', (value, secondValue, thirdValue) => {
    ...
});
```

Finally, the filter file must be imported in the plugin's `main.js` so it is registered when the plugin boots.

## Essential identifiers

- `Shopware.Filter.register(name, formatterFn)` — registers a named filter function.
- `example.filter.js` — the file-naming convention used for filter files (`<name>.filter.js`).
- `toLocaleUpperCase()` — the string method used in the example formatter.

## Gotchas

A filter file has no effect until it is imported from the plugin's `main.js`; simply creating the file under the `app/filter` directory does not register it on its own.
