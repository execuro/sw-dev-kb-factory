---
id: platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/add-shortcuts.md
title: Add Shortcuts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/advanced-configuration/add-shortcuts.html
sourceHash: c5049f86b015fb5350305d77ac09e1556dcfad70
codeCheckedAgainst: "6.7.13.0"
keywords: ["shortcuts", "keyboard shortcuts", "hotkeys", "SYSTEMKEY", "SYSTEMKEY+S", "ESCAPE", "Component.register", "shortcut.plugin.js", "acl.can", "getSystemKey", "administration component", "key combination"]
summary: Register Administration keyboard shortcuts per component via the `shortcuts` option (SYSTEMKEY+S, ESCAPE), mapping keys to methods with optional ACL guard.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md"]
---
## What it is

Keyboard shortcuts in the Shopware 6 Administration are defined per component through a `shortcuts` option on the component config. A global Vue mixin (the shortcut plugin) collects them on `created`, listens to `keydown` on the document, and calls the named component method.

## When to use

You have a custom Administration module/component (e.g. a detail page) and want a key combination such as save (`SYSTEMKEY+S`) or cancel (`ESCAPE`) to invoke one of its methods, optionally only when the user holds an ACL privilege.

## Key steps / config

Add a `shortcuts` object next to `methods` in the component registered in `<plugin root>/src/Resources/app/administration/src/module/swag-example/index.js`:

```javascript
const { Component } = Shopware;
Component.register('swag-basic-example', {
    shortcuts: {
        'SYSTEMKEY+S': {
            active() { return this.acl.can('product.editor'); },
            method: 'myEditProductFunction'
        },
        ESCAPE: 'myCancelEditProductFunction'
    },
    methods: { myEditProductFunction() {}, myCancelEditProductFunction() {} }
});
```

- Key = key name, optionally prefixed with `SYSTEMKEY+`. Value is either a method name string (always active) or an object `{ active, method }`.
- `active` may be a function (bound to the component instance) or a boolean.
- The first shortcut above fires only if the user has the privilege `product.editor`; the core `sw-product-detail` page uses exactly this pattern with `onSave`/`onCancel`.

## Essential identifiers

- `shortcuts` component option; keys `SYSTEMKEY+S`, `ESCAPE`
- `active()` / `method` object form, or a plain method-name string
- `this.acl.can('product.editor')` for privilege-gated shortcuts
- `$device.getSystemKey()` — returns `CTRL` on macOS, `ALT` elsewhere

## Gotchas

- `SYSTEMKEY` is `CTRL` on macOS and `ALT` on Windows; other system keys (`CTRL` on Windows, the option key on macOS) are not supported.
- Keys are compared upper-cased, so `SYSTEMKEY+c` and `SYSTEMKEY+C` match the same press.
- Shortcuts without `SYSTEMKEY` are ignored while focus is in an `INPUT`, `TEXTAREA`, `SELECT` or a contenteditable `DIV`; `SYSTEMKEY+S` blurs such a field before calling the method so pending edits are applied.
- No shortcut fires when the key event originates inside a `.sw-modal` / `.sw-modal__dialog`.
- Non-system keys may form multi-key sequences; the sequence buffer resets after 1000 ms.
- Shortcuts are removed on `beforeUnmount` of the component that declared them.

## Code check (6.7.13.0)
- confirmed `shortcuts` — mixin reads `this.$options.shortcuts` on created — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:166
- confirmed `method` — object form maps `value.method` to the function name, `active` may be boolean or function — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:186
- confirmed `SYSTEMKEY+` — combined key built from system key state plus upper-cased key — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:122
- confirmed `getSystemKey()` — `CTRL` on Mac platform, otherwise `ALT` — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:151
- confirmed `SYSTEMKEY+S` — core product detail uses `active()` with `acl.can('product.editor')` and `ESCAPE: 'onCancel'` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/index.js:44
- confirmed `isRestrictedSource` — non-system shortcuts skipped in INPUT/TEXTAREA/SELECT/contenteditable — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:41
- confirmed `isFromModal` — events from `.sw-modal` are ignored — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:108
- confirmed `componentShortcutKeystrokeDelay` — sequence buffer reset delay 1000 ms — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:5
- confirmed `beforeUnmount` — component shortcuts removed on unmount — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:213
