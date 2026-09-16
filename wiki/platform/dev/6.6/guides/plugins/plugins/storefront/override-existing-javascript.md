---
id: platform/dev/6.6/guides/plugins/plugins/storefront/override-existing-javascript.md
title: Override existing Javascript
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/override-existing-javascript.html
sourceHash: 61f23ceb64d968a72fcf498c9dfdd602f7eeb905
keywords: ["PluginManager.override", "CookiePermission", "cookie-permission.plugin", "PluginManager.getPlugin", "extending storefront plugin", "main.js", "async plugin override", "build-storefront.sh", "composer run build:js:storefront", "super.init"]
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-javascript.md
summary: How to extend and override a core Storefront JavaScript plugin using PluginManager.override, illustrated with the cookie-permission plugin.
lastBuilt: 2026-09-15
---
## What it is

Shows how to override an existing Storefront JavaScript plugin (vanilla JS class) by extending it and registering the override with `PluginManager.override`, using the cookie-permission plugin as example.

## When to use

When a plugin needs to change the behavior of a core (or another plugin's) Storefront JS plugin rather than writing a new one.

## Key steps / config

Extend the original plugin class:

```javascript
import CookiePermissionPlugin from 'src/plugin/cookie/cookie-permission.plugin';

export default class MyCookiePermission extends CookiePermissionPlugin {
    init() {
        CookieStorage.setItem(this.options.cookieName, '');
        super.init();
    }

    _hideCookieBar() {
        if (confirm('Do you want to hide the cookie bar?')) {
            super._hideCookieBar();
        }
    }
}
```

If the class cannot be imported directly, retrieve it via `window.PluginManager.getPlugin('CookiePermission').get('class')`.

Register the override in `main.js`:

```javascript
const PluginManager = window.PluginManager;
PluginManager.override('CookiePermission', MyCookiePermission, '[data-cookie-permission]');
```

For an async-registered plugin, override with an async import: `PluginManager.override('CookiePermission', () => import('./my-cookie-permission/my-cookie-permission.plugin'), '[data-cookie-permission]');`

Rebuild the Storefront to see changes: `./bin/build-storefront.sh` or `composer run build:js:storefront`.

## Essential identifiers

- `PluginManager.override()`
- `PluginManager.getPlugin()`
- `CookieStorage`
- `main.js`

## Gotchas

Each JavaScript plugin can only be overridden once — if two Shopware plugins try to override the same plugin, only the last one takes effect.
