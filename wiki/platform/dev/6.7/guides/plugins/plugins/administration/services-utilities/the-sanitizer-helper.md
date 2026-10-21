---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/the-sanitizer-helper.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md
sourceHash: 41b6071b864003078568b84bfc04bcf8ea25d352
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/the-sanitizer-helper.html
title: Sanitizer Helper
version: "6.7"
versions:
  - "6.7"
keywords: ["Shopware.Helper.SanitizerHelper", "SanitizerHelper", "$sanitizer", "$sanitize", "setConfig", "clearConfig", "addMiddleware", "removeMiddleware", "DOMPurify", "xss", "sanitize html", "dompurify hooks"]
summary: Shopware.Helper.SanitizerHelper wraps DOMPurify to sanitize HTML against XSS; also $sanitizer/$sanitize in components, with config and hook methods.
lastBuilt: 2026-10-21
---
## What it is

The Administration Sanitizer Helper is a static wrapper around `DOMPurify` that sanitizes HTML to prevent XSS attacks. It is registered on the [Shopware global object](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md) and as component globals.

## When to use

You render user- or API-supplied HTML in the Administration (e.g. via `v-html`) and need it stripped of script vectors, or you need to tune DOMPurify config/hooks globally.

## Key steps / config

Access:

```javascript
const sanitizer = Shopware.Helper.SanitizerHelper;
// inside components
const Sanitizer = this.$sanitizer;   // the helper class
const sanitize = this.$sanitize;     // its sanitize function
```

Sanitize (optional second argument: a per-call DOMPurify config, default `{}`):

```javascript
Shopware.Helper.SanitizerHelper.sanitize('<img src=x onerror=alert(1)//>'); // <img src="x">
this.$sanitizer.sanitize('<svg><g/onload=alert(2)//<p>'); // <svg><g></g></svg>
```

Global config (stays active until cleared):

```javascript
Shopware.Helper.SanitizerHelper.setConfig({ USE_PROFILES: { html: true } });
Shopware.Helper.SanitizerHelper.clearConfig();
```

Hooks (DOMPurify hooks, called "middleware" here):

```javascript
Shopware.Helper.SanitizerHelper.addMiddleware('beforeSanitizeElements', function (currentNode, hookEvent, config) {
    return currentNode;
});
Shopware.Helper.SanitizerHelper.removeMiddleware('beforeSanitizeElements');
```

Allowed hook names: `beforeSanitizeElements`, `uponSanitizeElement`, `afterSanitizeElements`, `beforeSanitizeAttributes`, `uponSanitizeAttribute`, `afterSanitizeAttributes`, `beforeSanitizeShadowDOM`, `uponSanitizeShadowNode`, `afterSanitizeShadowDOM`.

## Essential identifiers

- `Shopware.Helper.SanitizerHelper`
- `sanitize(dirtyHtml, config?)`, `setConfig(config)`, `clearConfig()`, `addMiddleware(name, fn)`, `removeMiddleware(name)`
- `this.$sanitizer`, `this.$sanitize`

## Gotchas

- `addMiddleware`/`removeMiddleware` return `false` and log a warning for a name outside the allowed list; they return `true` on success.
- `removeMiddleware(name)` removes all hooks registered under that name (DOMPurify `removeHooks`), not only yours.
- `setConfig` is global and affects every later `sanitize` call in the Administration until `clearConfig()`.

## Version notes

The source says the helper is bound to the "Vue prototype". In 6.7 (Vue 3) the sanitize plugin sets `app.config.globalProperties.$sanitizer` and `$sanitize`; component access is unchanged.

## Code check (6.7.15.1)
- confirmed `Shopware.Helper.SanitizerHelper` — registered on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:313
- corrected `$sanitizer` — docs: Vue prototype; code uses `app.config.globalProperties` — vendor/shopware/administration/Resources/app/administration/src/app/plugin/sanitize.plugin.js:20
- confirmed `$sanitize` — bound to `Sanitizer.sanitize` — vendor/shopware/administration/Resources/app/administration/src/app/plugin/sanitize.plugin.js:21
- confirmed `Sanitizer::setConfig()` — delegates to `domPurify.setConfig` — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:34
- confirmed `Sanitizer::clearConfig()` — delegates to `domPurify.clearConfig` — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:44
- confirmed `Sanitizer::addMiddleware()` — validates name, calls `domPurify.addHook` — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:56
- confirmed `Sanitizer::removeMiddleware()` — calls `domPurify.removeHooks` — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:77
- confirmed `Sanitizer::sanitize()` — `(dirtyHtml, config = {})` — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:98
- confirmed `beforeSanitizeElements` — in the allowed middleware names list — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:12
