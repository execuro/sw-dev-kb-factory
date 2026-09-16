---
id: platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/using-utils.md
title: Using utility functions
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/services-utilities/using-utils.html
sourceHash: f2525788b7b1fe7cac4e0a193b53f479273f44ad
keywords: ["utility functions", "Shopware.Utils", "capitalizeString", "lodash capitalize", "Utils.string", "administration utils", "shortcuts", "the Shopware object"]
summary: How to access built-in Administration utility functions such as Utils.string.capitalizeString via the Shopware object.
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md
  - platform/dev/6.6/resources/references/administration-reference/utils.md
  - platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-filter.md
---
## What it is
Utility functions in the Shopware 6 Administration are registered on the Shopware object and accessible anywhere, providing shortcuts for common tasks.

## When to use
Use when a plugin needs a common helper (e.g. string capitalization) without writing it from scratch.

## Key steps / config
Destructure `Utils` from `Shopware`, then call a namespaced function such as `Utils.string.capitalizeString`, which wraps lodash's `capitalize`:
```javascript
const { Component, Utils } = Shopware;

Component.register('swag-basic-example', {
    data() {
        return { text: 'hello', capitalizedString: undefined };
    },
    created() { this.capitalize(); },
    methods: {
        capitalize() {
            this.capitalizedString = Utils.string.capitalizeString(this.string);
        },
    },
});
```

## Essential identifiers
- `Shopware.Utils`
- `Utils.string.capitalizeString()`

## Gotchas
None stated in the source beyond the underlying dependency on lodash's `capitalize` function.
