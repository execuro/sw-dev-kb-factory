---
id: platform/dev/6.6/resources/references/administration-reference/utils.md
title: Utils
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/administration-reference/utils.html
sourceHash: 674890d69183d9f649ba2bd61e12d49ff3921649
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/using-utils.md"]
keywords: ["utils", "utility functions", "shopware global object", "administration", "createId", "throttle", "debounce", "cloneDeep", "deepCopyObject", "camelCase", "isEqual", "getObjectDiff"]
summary: "Administration utility functions on the shopware global object: ID generation, throttling, object/type/string helpers, formatting, arrays."
lastBuilt: 2026-09-15
---
## What it is

This page is a reference for the utility functions bound to the `shopware` global object in the Administration. They provide shortcuts for common tasks such as generating IDs, throttling/debouncing calls, manipulating objects, formatting values, DOM helpers, string casing, type checks, reading files, sorting, and array operations.

## When to use

Use when writing Administration plugin code and a ready-made helper already exists instead of re-implementing common logic — for example generating a UUID, deep-copying an object, formatting a currency value, or checking a value's type.

## Key steps / config

Functions are grouped by category:
- **General**: `createId`, `throttle`, `debounce`, `flow`, `get`
- **Object**: `deepCopyObject`, `hasOwnProperty`, `getObjectDiff`, `getArrayChanges`, `cloneDeep`, `merge`, `mergeWith`, `deepMergeObject`, `get`, `set`, `pick`
- **Debug**: `warn`, `debug`
- **Format**: `currency`, `date`, `fileSize`, `md5`
- **Dom**: `getScrollbarHeight`, `getScrollbarWidth`, `copyToClipboard`
- **String**: `capitalizeString`, `camelCase`, `kebabCase`, `snakeCase`, `md5`, `isEmptyOrSpaces`, `isUrl`, `isValidIp`
- **Type**: `isObject`, `isPlainObject`, `isEmpty`, `isRegExp`, `isArray`, `isFunction`, `isDate`, `isString`, `isBoolean`, `isEqual`, `isNumber`, `isUndefined`
- **FileReader**: `readAsArrayBuffer`, `readAsDataURL`, `readAsText`, `getNameAndExtensionFromFile`, `getNameAndExtensionFromUrl`
- **Sort**: `afterSort`
- **Array**: `flattenDeep`, `remove`, `slice`, `uniqBy`

`createId` returns a uuid string in hex format. `throttle` creates a throttled function that only invokes `func` at most once per every `wait` milliseconds. `debounce` creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last invocation. `deepCopyObject`/`cloneDeep` deep-copy a value; `getObjectDiff` gets a simple recursive diff of two objects; `merge`/`mergeWith` recursively merge objects, the latter accepting a customizer for producing merged values. `warn` provides a unified-style log message shown in the developer console in development mode; `debug` does the same but uses `console.error`.

## Essential identifiers

`createId`, `throttle`, `debounce`, `cloneDeep`, `deepCopyObject`, `getObjectDiff`, `merge`, `mergeWith`, `isObject`, `isEqual`, `capitalizeString`, `camelCase`

## Gotchas

`getObjectDiff` does not consider an entity schema or entity-related logic when computing its diff — it is a plain recursive object diff only.
