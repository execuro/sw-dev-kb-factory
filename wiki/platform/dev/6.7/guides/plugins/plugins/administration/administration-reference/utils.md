---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/utils.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-utils.md
sourceHash: f81d42ad52025e00660fd2c76a1f4c66c3576400
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/administration-reference/utils.html
title: Utils
version: "6.7"
versions:
  - "6.7"
keywords: ["utils", "Shopware.Utils", "createId", "debounce", "throttle", "object.cloneDeep", "format.currency", "dom.copyStringToClipboard", "debug.warn", "string.kebabCase", "types.isEmpty", "fileReader", "lodash helpers", "uuid"]
summary: Shopware.Utils helper namespaces in the 6.7 Administration (createId, debounce, object, format, dom, string, types, fileReader, sort, array).
lastBuilt: 2026-10-21
---
## What it is

Reference of the utility functions bound to the global object as `Shopware.Utils`, defined in `src/core/service/util.service.ts`. Many are re-exports of lodash functions; the rest are Shopware helpers.

## When to use

For common tasks in admin components or plugins (IDs, deep copies, formatting, type checks, file reading) instead of adding your own helpers. Usage guide: [using utils](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-utils.md).

## Key steps / config

Call through the namespace, e.g. `Shopware.Utils.createId()`, `Shopware.Utils.object.cloneDeep(obj)`, `Shopware.Utils.format.currency(...)`.

| Namespace | Functions (6.7.15.1) |
|---|---|
| top level | `createId` (UUID as hex string), `throttle`, `debounce`, `flow`, `get`, `moveItem` |
| `object` | `deepCopyObject`, `hasOwnProperty`, `getObjectDiff` (no entity-schema logic), `getArrayChanges`, `cloneDeep`, `merge`, `mergeWith`, `deepMergeObject`, `get`, `set`, `pick`, `unset`, `has` |
| `debug` | `warn` (console.warn), `error` (console.error); output only in development mode |
| `format` | `currency`, `date` (`Intl.DateTimeFormat`), `dateWithUserTimezone`, `fileSize`, `localeName`, `md5`, `toISODate` |
| `dom` | `getScrollbarHeight`, `getScrollbarWidth`, `copyStringToClipboard` |
| `string` | `capitalizeString`, `camelCase`, `upperFirst`, `kebabCase`, `snakeCase`, `md5`, `isEmptyOrSpaces`, `isUrl`, `isValidIp`, `isValidCidr` |
| `types` | `isObject`, `isPlainObject`, `isEmpty`, `isRegExp`, `isArray`, `isFunction`, `isDate`, `isString`, `isBoolean`, `isEqual`, `isNumber`, `isUndefined` |
| `fileReader` | `readAsArrayBuffer`, `readAsDataURL`, `readAsText`, `getNameAndExtensionFromFile`, `getNameAndExtensionFromUrl` |
| `sort` | `afterSort` (sorts by the after-id property chain) |
| `array` | `flattenDeep`, `remove`, `slice`, `uniqBy`, `chunk`, `intersectionBy` |

`throttle`, `debounce`, `flow`, `flattenDeep`, `remove`, `slice`, `uniqBy`, `chunk` and `intersectionBy` are imported from `lodash-es`.

## Essential identifiers

- `Shopware.Utils`
- `Shopware.Utils.createId`, `Shopware.Utils.debounce`, `Shopware.Utils.throttle`
- `Shopware.Utils.object`, `.format`, `.dom`, `.string`, `.types`, `.fileReader`, `.sort`, `.array`, `.debug`

## Gotchas

- The docs list `copyToClipboard` under Dom; the installed name is `dom.copyStringToClipboard` (async).
- The docs list `debug` as the second Debug function; the installed name is `debug.error`.
- The docs say `createId` is generated with the `uuid` package; 6.7 uses `uuidv7` and strips the dashes.
- The docs link to the v6.3.4.1 `util.service.js`; in 6.7 the file is TypeScript (`util.service.ts`).
- `genericRuleCondition`, `unitConversion` and `extension` are also exported but marked `@private`.

## Code check (6.7.15.1)
- confirmed `Shopware.Utils` — global binding of the util service — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:223
- corrected `createId` — docs: generated with the uuid package; code uses `uuidv7` — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:191
- corrected `copyStringToClipboard` — docs: `copyToClipboard` — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:84
- corrected `debug.error` — docs: `debug` — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:66
- confirmed `error` — uses `console.error` — vendor/shopware/administration/Resources/app/administration/src/core/service/utils/debug.utils.ts:29
- confirmed `format.dateWithUserTimezone` — added to `format` beyond the docs — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:73
- confirmed `isValidCidr` — added to `string` beyond the docs — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:98
- confirmed `chunk` — added to `array` beyond the docs — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:138
- confirmed `moveItem` — top-level export not in docs — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:178
- confirmed `afterSort` — sort namespace — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:128
