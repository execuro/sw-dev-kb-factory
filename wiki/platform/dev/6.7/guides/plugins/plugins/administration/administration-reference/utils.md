---
id: platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/utils.md
title: Utils
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/administration-reference/utils.html
sourceHash: f81d42ad52025e00660fd2c76a1f4c66c3576400
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware.Utils", "utils", "helper functions", "createId", "debounce", "throttle", "object.cloneDeep", "debug.warn", "format.currency", "dom.copyStringToClipboard", "string.kebabCase", "types.isEmpty", "fileReader", "array.uniqBy", "util.service"]
summary: "Reference of Shopware.Utils helpers in the 6.7 Administration: createId, debounce, object, debug, format, dom, string, types, fileReader, sort, array."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-utils.md"]
---
## What it is

An overview of the utility functions bound to the global Shopware object as `Shopware.Utils` in the Administration. They are collected in `src/core/service/util.service.ts`; many wrap lodash (`lodash-es`) functions.

## When to use

When writing Administration code (components, services) and you need a helper for IDs, debouncing, object diffing/merging, formatting, string casing or type checks, instead of adding your own dependency. See [Using utils](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-utils.md).

## Key steps / config

Access pattern: `Shopware.Utils.<group>.<fn>`, e.g. `Shopware.Utils.format.currency(...)`, `Shopware.Utils.createId()`.

Top level: `createId` (UUID hex string without dashes, generated with `uuidv7`), `throttle`, `debounce`, `flow`, `get`, `moveItem`.

Groups as exported in 6.7.13.0:

- `object`: `deepCopyObject`, `hasOwnProperty`, `getObjectDiff` (simple recursive diff, no entity schema logic), `getArrayChanges`, `cloneDeep`, `merge`, `mergeWith`, `deepMergeObject`, `get`, `set`, `pick`, `unset`, `has`
- `debug`: `warn` (unified dev-console logging, development mode), `error` (same, via `console.error`)
- `format`: `currency`, `date` (localized via `Intl.DateTimeFormat`), `dateWithUserTimezone`, `fileSize`, `md5`, `toISODate`
- `dom`: `getScrollbarHeight`, `getScrollbarWidth`, `copyStringToClipboard`
- `string`: `capitalizeString`, `camelCase`, `upperFirst`, `kebabCase`, `snakeCase`, `md5`, `isEmptyOrSpaces`, `isUrl`, `isValidIp`, `isValidCidr`
- `types`: `isObject`, `isPlainObject`, `isEmpty`, `isRegExp`, `isArray`, `isFunction`, `isDate`, `isString`, `isBoolean`, `isEqual`, `isNumber`, `isUndefined`
- `fileReader`: `readAsArrayBuffer`, `readAsDataURL`, `readAsText`, `getNameAndExtensionFromFile`, `getNameAndExtensionFromUrl`
- `sort`: `afterSort` (sorts by the after-id property chain)
- `array`: `flattenDeep`, `remove`, `slice`, `uniqBy`, `chunk`, `intersectionBy`

Also exported: `VueHelper`, `EventBus`; `genericRuleCondition`, `unitConversion` and `extension` are marked `@private`.

## Essential identifiers

- `Shopware.Utils`, `createId`, `debounce`, `throttle`, `flow`, `get`
- `object`, `debug`, `format`, `dom`, `string`, `types`, `fileReader`, `sort`, `array`

## Gotchas

- The docs list a `debug.debug` function; the installed code exports `debug.error` instead (logs with `console.error`).
- The docs list `dom.copyToClipboard`; the installed name is `dom.copyStringToClipboard` (async).
- The docs say `createId` uses the `uuid` package; 6.7 generates it with `uuidv7`.
- The docs link to v6.3.4.1 `util.service.js`; in 6.7 the file is TypeScript and exports additional helpers (`dateWithUserTimezone`, `toISODate`, `upperFirst`, `isValidCidr`, `unset`, `has`, `chunk`, `intersectionBy`, `moveItem`).

## Code check (6.7.13.0)
- confirmed `Utils` — bound on the global Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:210
- corrected `createId` — docs: generated with uuid — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:191
- corrected `error` — docs: `debug.debug` — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:66
- confirmed `warn` — debug group member — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:65
- corrected `copyStringToClipboard` — docs: `copyToClipboard` — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:83
- confirmed `getObjectDiff` — object group member — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:50
- confirmed `currency` — format group member — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:71
- confirmed `isValidIp` — string group member — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:96
- confirmed `readAsDataURL` — fileReader group member — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:119
- confirmed `afterSort` — sort group member — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:127
