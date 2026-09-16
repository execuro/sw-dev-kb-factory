---
id: platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/the-sanitizer-helper.md
title: The Sanitizer helper
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/services-utilities/the-sanitizer-helper.html
sourceHash: be6f215c0fd9c6ac831c8ac54311f76b75b1167e
keywords: ["Sanitizer helper", "SanitizerHelper", "DOMPurify", "XSS", "sanitize", "sanitizer.plugin.js", "setConfig", "clearConfig", "addMiddleware", "removeMiddleware", "html sanitization"]
summary: How to use Shopware's SanitizerHelper (a DOMPurify wrapper) to sanitize HTML and prevent XSS in the Administration.
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md
---
## What it is
The Sanitizer Helper is a wrapper around `DOMPurify` used to sanitize HTML and prevent XSS attacks in the Administration.

## When to use
Use when a plugin renders user-supplied or dynamic HTML and needs it stripped of dangerous attributes/elements.

## Key steps / config
Access it via the global Shopware object or the Vue prototype:
```javascript
const sanitizer = Shopware.Helper.SanitizerHelper;
// in Vue components:
const Sanitizer = this.$sanitizer;
const sanitize = this.$sanitize;
```
Sanitize HTML:
```javascript
Shopware.Helper.SanitizerHelper.sanitize('<img src=x onerror=alert(1)//>'); // becomes <img src="x">
```
Set/clear config:
```javascript
Shopware.Helper.SanitizerHelper.setConfig({ USE_PROFILES: { html: true } });
Shopware.Helper.SanitizerHelper.clearConfig()
```
Add/remove a hook:
```javascript
Shopware.Helper.SanitizerHelper.addMiddleware('beforeSanitizeElements', function (currentNode, hookEvent, config) {
    return currentNode;
});
Shopware.Helper.SanitizerHelper.removeMiddleware('beforeSanitizeElements');
```

## Essential identifiers
- `Shopware.Helper.SanitizerHelper`
- `SanitizerHelper.sanitize()`, `.setConfig()`, `.clearConfig()`, `.addMiddleware()`, `.removeMiddleware()`
- `this.$sanitizer`, `this.$sanitize` (Vue prototype)

## Gotchas
The helper is registered on the Vue prototype via a plugin file, so it is available both as `Shopware.Helper.SanitizerHelper` and as `this.$sanitizer`/`this.$sanitize` inside components.
