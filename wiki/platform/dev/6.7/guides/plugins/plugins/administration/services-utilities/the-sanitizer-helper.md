---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/the-sanitizer-helper.md
title: Sanitizer Helper
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/the-sanitizer-helper.html
sourceHash: 41b6071b864003078568b84bfc04bcf8ea25d352
codeCheckedAgainst: "6.7.13.0"
keywords: ["SanitizerHelper", "Shopware.Helper.SanitizerHelper", "$sanitizer", "$sanitize", "DOMPurify", "setConfig", "clearConfig", "addMiddleware", "removeMiddleware", "beforeSanitizeElements", "xss", "html sanitizing", "hooks"]
summary: Shopware.Helper.SanitizerHelper wraps DOMPurify in the Administration - sanitize, setConfig/clearConfig, add/removeMiddleware hooks.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md"]
---
## What it is

The Administration Sanitizer Helper is a static wrapper class around DOMPurify that sanitizes HTML to prevent XSS attacks. It is exposed on the [Shopware global object](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md) as `Shopware.Helper.SanitizerHelper` and on every component as `this.$sanitizer` (the class) and `this.$sanitize` (its `sanitize` function).

## When to use

Any time plugin Administration code renders or stores HTML that could contain user-controlled markup, or when you need to change DOMPurify's configuration or hook into its sanitizing steps.

## Key steps / config

Access:

```javascript
const sanitizer = Shopware.Helper.SanitizerHelper;
// inside a component
this.$sanitizer.sanitize(dirtyHtml);
this.$sanitize(dirtyHtml);
```

Sanitize: `SanitizerHelper.sanitize(dirtyHtml, config = {})` returns the cleaned string; e.g. an `img` tag with an `onerror` attribute becomes a plain `img` with only `src`.

Global config (stays active until cleared):

```javascript
Shopware.Helper.SanitizerHelper.setConfig({ USE_PROFILES: { html: true } });
Shopware.Helper.SanitizerHelper.clearConfig();
```

Hooks ("middleware") map to DOMPurify hooks:

```javascript
Shopware.Helper.SanitizerHelper.addMiddleware('beforeSanitizeElements', (currentNode, hookEvent, config) => {
    return currentNode;
});
Shopware.Helper.SanitizerHelper.removeMiddleware('beforeSanitizeElements');
```

Accepted middleware names: `beforeSanitizeElements`, `uponSanitizeElement`, `afterSanitizeElements`, `beforeSanitizeAttributes`, `uponSanitizeAttribute`, `afterSanitizeAttributes`, `beforeSanitizeShadowDOM`, `uponSanitizeShadowNode`, `afterSanitizeShadowDOM`.

## Essential identifiers

- `Shopware.Helper.SanitizerHelper`
- `this.$sanitizer`, `this.$sanitize`
- `sanitize(dirtyHtml, config)`, `setConfig(config)`, `clearConfig()`
- `addMiddleware(name, fn)`, `removeMiddleware(name)`
- `USE_PROFILES`

## Gotchas

- `addMiddleware`/`removeMiddleware` only accept the nine names listed above; any other name logs a warning and returns `false` instead of registering.
- `removeMiddleware(name)` calls DOMPurify `removeHooks`, removing every hook registered under that name, not a single function.
- `setConfig` is global for all later `sanitize` calls until `clearConfig` runs.

## Version notes

- The docs say the helper is bound to the "Vue prototype"; in 6.7 (Vue 3) the sanitize plugin sets `app.config.globalProperties.$sanitizer` and `$sanitize`.

## Code check (6.7.13.0)
- confirmed `SanitizerHelper` — exposed on Shopware.Helper — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:300
- corrected `$sanitizer` — docs: bound to Vue prototype; code: app.config.globalProperties — vendor/shopware/administration/Resources/app/administration/src/app/plugin/sanitize.plugin.js:20
- confirmed `$sanitize` — set to Sanitizer.sanitize — vendor/shopware/administration/Resources/app/administration/src/app/plugin/sanitize.plugin.js:21
- confirmed `Sanitizer::sanitize()` — sanitize(dirtyHtml, config = {}) — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:98
- confirmed `Sanitizer::setConfig()` — delegates to domPurify.setConfig — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:34
- confirmed `Sanitizer::clearConfig()` — delegates to domPurify.clearConfig — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:44
- confirmed `Sanitizer::addMiddleware()` — validates name, then domPurify.addHook — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:56
- confirmed `Sanitizer::removeMiddleware()` — validates name, then domPurify.removeHooks — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:77
- confirmed `beforeSanitizeElements` — first entry of the allowed middleware names — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:12
