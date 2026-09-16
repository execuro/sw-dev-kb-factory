---
id: platform/dev/6.6/guides/plugins/plugins/administration/advanced-configuration/add-shortcuts.md
title: Add shortcuts
docType: developer
version: "6.6"
versions: ["6.6"]
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md", "platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/writing-templates.md"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/advanced-configuration/add-shortcuts.html
sourceHash: 37cc59babf318833fc4ce662a4059f6c8a1f1b89
keywords: ["shortcuts", "keyboard shortcut", "Component.register", "shortcuts attribute", "SYSTEMKEY", "ESCAPE", "ACL", "acl.can", "product.editor", "Administration component", "component method", "custom shortcut"]
summary: "Register keyboard shortcuts on an Administration component via its shortcuts attribute, optionally gated by ACL."
lastBuilt: "2026-09-15"
---
## What it is

This guide shows how to add custom keyboard shortcuts to an Administration component in Shopware 6. Shortcuts are defined on a per-component basis.

## When to use

Use this when a plugin's Administration component needs a keyboard shortcut to trigger a method, optionally restricted to users holding a specific ACL privilege.

## Key steps / config

Register shortcuts inside a component using the `shortcuts` attribute:

```javascript
// <plugin root>/src/Resources/app/administration/src/module/swag-example/index.js
const { Component } = Shopware;

Component.register('swag-basic-example', {
    shortcuts: {
        'SYSTEMKEY+S': {
            active() {
                return this.acl.can('product.editor');
            },
            method: 'myEditProductFunction'
        },
        ESCAPE: 'myCancelEditProductFunction'
    },
    methods: {
        myEditProductFunction() { /* ... */ },
        myCancelEditProductFunction() { /* ... */ }
    }
});
```

The `SYSTEMKEY+S` shortcut invokes the component method named in `method` (`myEditProductFunction`), but only if the `active()` callback returns true — here it checks the `product.editor` ACL privilege via `this.acl.can()`. The `ESCAPE` shortcut maps directly to a method name (`myCancelEditProductFunction`) with no ACL gate.

`SYSTEMKEY` resolves to `CTRL` on macOS and `ALT` on Windows; other system keys such as `CTRL` on Windows or the macOS Option key are not supported as `SYSTEMKEY`.

## Essential identifiers

- `shortcuts` — component option object mapping key combinations to a method name or an `{ active, method }` object.
- `Component.register()` — where the `shortcuts` option is declared.
- `this.acl.can()` — used inside `active()` to gate a shortcut by ACL privilege.
- `SYSTEMKEY` — placeholder resolving to `CTRL` (macOS) / `ALT` (Windows).

## Gotchas

- `SYSTEMKEY` only maps to `CTRL` on macOS and `ALT` on Windows; other combinations like `CTRL` on Windows or the macOS `⌥` key are not supported as `SYSTEMKEY`.
