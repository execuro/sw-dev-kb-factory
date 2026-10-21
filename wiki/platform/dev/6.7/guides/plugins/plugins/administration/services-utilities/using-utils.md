---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-utils.md
title: Using Utility Functions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/using-utils.html
sourceHash: 597ebcad5d258a547fe3310bbea7e5573c5d250f
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware.Utils", "Utils.string", "capitalizeString", "Component.register", "utility functions", "admin utils", "helpers", "string utils", "lodash capitalize", "administration plugin", "shopware object"]
summary: Access Administration utility functions via the global Shopware.Utils object, e.g. Utils.string.capitalizeString inside a component.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md
  - platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/utils.md
  - platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md
  - platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md
---
## What it is

Utility functions in the Shopware 6 Administration are registered on [the Shopware object](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md) as `Shopware.Utils`, so they are reachable from any Administration code without imports. They are shortcuts for common tasks; the full list is in the [utils reference](platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/utils.md).

## When to use

When an Administration plugin component needs a common helper (string casing, type checks, etc.) and you want the one the Administration already ships rather than adding your own dependency. Prerequisites per the guide: a running Shopware 6 instance, a registered module, and JavaScript knowledge.

## Key steps / config

1. Destructure `Utils` (and `Component`) from the global `Shopware` object.
2. Call the helper through its namespace, e.g. `Utils.string.capitalizeString(value)`, which wraps lodash `capitalize`.

```javascript
// <extension root>/src/Resources/app/administration/app/src/component/swag-basic-example/index.js
const { Component, Utils } = Shopware;

Component.register('swag-basic-example', {
    data() { return { text: 'hello', capitalizedString: undefined }; },
    created() { this.capitalize(); },
    methods: {
        capitalize() {
            this.capitalizedString = Utils.string.capitalizeString(this.text);
        },
    },
});
```

The `string` namespace in 6.7.15.1 exports `capitalizeString`, `upperFirst`, `camelCase`, `kebabCase`, `snakeCase`, `isEmptyOrSpaces`, `isUrl`, `isValidIp`, `isValidCidr`.

## Essential identifiers

- `Shopware.Utils` / `const { Utils } = Shopware`
- `Utils.string.capitalizeString`
- `Component.register`

## Gotchas

- The source snippet passes `this.string` to `capitalizeString`, but the component's data property is `text`; as written it capitalizes `undefined`. Use the actual data property (`this.text`).

## Code check (6.7.15.1)
- confirmed `Shopware.Utils` — public property on the Shopware class assigned the utils service — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:223
- confirmed `string` — `string` namespace registered in the utils service export — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:173
- confirmed `capitalizeString` — imported from `lodash-es/capitalize` — vendor/shopware/administration/Resources/app/administration/src/core/service/utils/string.utils.ts:6
- confirmed `capitalizeString` — exported in the string utils default object — vendor/shopware/administration/Resources/app/administration/src/core/service/utils/string.utils.ts:14
