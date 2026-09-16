---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-utils.md
title: Using Utility Functions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/using-utils.html
sourceHash: 597ebcad5d258a547fe3310bbea7e5573c5d250f
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware.Utils", "Utils.string.capitalizeString", "capitalizeString", "lodash capitalize", "utility functions", "helpers", "string utils", "Component.register", "administration utils", "shortcuts"]
summary: Shopware.Utils exposes Administration utility functions globally, e.g. Utils.string.capitalizeString (lodash capitalize) inside a component.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/utils.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md", "platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md"]
---
## What it is

Utility functions in the Shopware 6 Administration are registered on [the Shopware object](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md) as `Shopware.Utils`, so they are reachable everywhere in Administration code. They are grouped by domain (for example `Utils.string`); the full list is in the [utils reference](platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/utils.md). Related topics: [adding filters](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md), [adding mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md).

## When to use

When a plugin component needs a common helper (string formatting and similar shortcuts) without importing a library itself. Prerequisites: a running Shopware 6 instance, a registered module, and JavaScript knowledge.

## Key steps / config

Destructure `Utils` from the global object and call the grouped function. Example with `capitalizeString`, which is lodash `capitalize`:

```javascript
const { Component, Utils } = Shopware;

Component.register('swag-basic-example', {
    data() {
        return { text: 'hello', capitalizedString: undefined };
    },
    created() {
        this.capitalize();
    },
    methods: {
        capitalize() {
            this.capitalizedString = Utils.string.capitalizeString(this.text);
        },
    },
});
```

Other functions in the same `Utils.string` group include `camelCase`, `upperFirst`, `kebabCase`, `snakeCase`, `isEmptyOrSpaces`, `isUrl`, `isValidIp` and `isValidCidr`.

## Essential identifiers

- `Shopware.Utils`
- `Utils.string.capitalizeString`
- `Component.register`

## Gotchas

- The source sample passes `this.string` to `capitalizeString` although the data property is named `text`; the snippet above passes `this.text`.

## Code check (6.7.13.0)
- confirmed `Utils` — Shopware.Utils is the util service export — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:210
- confirmed `capitalizeString` — exposed in the `string` utils group — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:88
- confirmed `lodash-es/capitalize` — source of capitalizeString — vendor/shopware/administration/Resources/app/administration/src/core/service/utils/string.utils.ts:6
- confirmed `camelCase` — further string util — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:89
- confirmed `AsyncComponentFactory.register` — backs Shopware.Component.register — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:130
