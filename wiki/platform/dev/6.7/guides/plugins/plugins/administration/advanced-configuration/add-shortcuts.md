---
id: platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/add-shortcuts.md
title: Add Shortcuts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/advanced-configuration/add-shortcuts.html
sourceHash: c5049f86b015fb5350305d77ac09e1556dcfad70
codeCheckedAgainst: "6.7.15.1"
keywords: ["shortcuts", "SYSTEMKEY", "SYSTEMKEY+S", "ESCAPE", "Component.register", "keyboard shortcut", "hotkey", "key binding", "acl.can", "getSystemKey", "administration component option", "shortcut.plugin"]
summary: Register keyboard shortcuts on an Administration component via the shortcuts option; SYSTEMKEY maps to CTRL on macOS and ALT elsewhere.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md"]
---
## What it is

Keyboard shortcuts in the Shopware 6 Administration are defined per component through a `shortcuts` option in the component configuration. Each entry maps a key (or key combination) to a component method.

## When to use

A custom Administration module or component should react to keys such as save (`SYSTEMKEY+S`) or cancel (`ESCAPE`).

## Key steps / config

Add `shortcuts` next to `methods` in `Component.register` (or an override):

```javascript
// <plugin root>/src/Resources/app/administration/src/module/swag-example/index.js
const { Component } = Shopware;

Component.register('swag-basic-example', {
    shortcuts: {
        'SYSTEMKEY+S': {
            active() { return this.acl.can('product.editor'); },
            method: 'myEditProductFunction',
        },
        ESCAPE: 'myCancelEditProductFunction',
    },
    methods: { myEditProductFunction() {}, myCancelEditProductFunction() {} },
});
```

- String value: name of the component method to call; always active.
- Object value: `method` (method name) and `active` (a function evaluated with the component as `this`, or a boolean). Here `SYSTEMKEY+S` only fires if the user has the `product.editor` privilege (see [ACL rules](platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md)).
- Key names are matched against the upper-cased `KeyboardEvent.key`, prefixed with `SYSTEMKEY+` when the system key is held.

## Essential identifiers

- `shortcuts` (component option), `method`, `active`
- `SYSTEMKEY`, `SYSTEMKEY+S`, `ESCAPE`
- `this.acl.can('product.editor')`
- `$device.getSystemKey()`

## Gotchas

- `SYSTEMKEY` is `CTRL` on macOS and `ALT` on all other platforms; other modifiers (`CTRL` on Windows, the option key on macOS) are not supported as the system key.
- Shortcuts without `SYSTEMKEY` do not fire while focus is in `INPUT`, `TEXTAREA`, `SELECT` or a contenteditable element; no shortcut fires for keydown events inside a modal (`.sw-modal`, `.mt-modal`) or for auto-repeated keys.
- Shortcuts are removed when the component unmounts; non-system keys can form multi-key sequences with a 1000 ms delay between keystrokes.

## Code check (6.7.15.1)
- confirmed `shortcuts` — read from `this.$options.shortcuts` in a global mixin on created — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:175
- confirmed `method` — object entry uses value.method as function name and value.active (function or boolean) — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:191
- confirmed `functionName` — string entry is the method name, active always true — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:194
- confirmed `SYSTEMKEY+` — combined key prefix plus upper-cased event key — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:129
- confirmed `getSystemKey()` — returns CTRL on Mac platforms, otherwise ALT — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:161
- confirmed `restrictedTags` — INPUT/TEXTAREA/SELECT block non-system shortcuts — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:43
- confirmed `isFromModal` — keydown inside modals is ignored — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:115
- confirmed `componentShortcutKeystrokeDelay` — 1000 ms sequence reset — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:5
- confirmed `beforeUnmount()` — component shortcuts removed on unmount — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:215
- confirmed `Component.register` — exposed on the global Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
