---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md
title: Override Existing JavaScript
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/override-existing-javascript.html
sourceHash: 834b684b2a48a239370e0a9bc8bbc148912f79e4
codeCheckedAgainst: "6.7.15.1"
keywords: ["PluginManager.override", "CookiePermissionPlugin", "CookiePermission", "CookieStorage", "_hideCookieBar", "main.js", "window.PluginManager", "override storefront plugin", "extend javascript plugin", "storefront js", "cookie bar", "shopware-cli project storefront-build"]
summary: Override a core Storefront JS plugin by extending its class and registering it with window.PluginManager.override() in the plugin's main.js.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to replace the logic of an existing Storefront JavaScript plugin from a Shopware plugin: extend the original vanilla JS class, override its methods, and register the subclass via `PluginManager.override()`. The example extends the core `CookiePermission` plugin so the cookie bar always shows and asks for confirmation before hiding.

## When to use

When a core (or third-party) Storefront JS plugin needs different behaviour and no `$emitter` event covers the change (see [reacting to JavaScript events](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md)). Requires a running plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) and familiarity with [adding custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md).

## Key steps / config

1. Create `<plugin root>/src/Resources/app/storefront/src/my-cookie-permission/my-cookie-permission.plugin.js`.
2. Extend the original class and override methods, calling `super` where the original behaviour is still wanted:

```javascript
import CookiePermissionPlugin from 'src/plugin/cookie/cookie-permission.plugin';
import CookieStorage from 'src/helper/storage/cookie-storage.helper';

export default class MyCookiePermission extends CookiePermissionPlugin {
    init() {
        CookieStorage.setItem(this.options.cookieName, '');
        super.init();
    }
    _hideCookieBar() {
        if (confirm('Do you want to hide the cookie bar?')) { super._hideCookieBar(); }
    }
}
```

3. Register it in the auto-loaded entry point `<plugin root>/src/Resources/app/storefront/src/main.js` with `override()` (not `register()`), using the original plugin name and selector. Because core registers `CookiePermission` as an async (lazy-import) plugin, use a dynamic import:

```javascript
const PluginManager = window.PluginManager;
PluginManager.override('CookiePermission', () => import('./my-cookie-permission/my-cookie-permission.plugin'), '[data-cookie-permission]');
```

   A synchronous form `PluginManager.override('CookiePermission', MyCookiePermission, '[data-cookie-permission]')` with a static import is also accepted by the code.
4. Build the Storefront: `shopware-cli project storefront-build` (template project) or `composer run build:js:storefront` (platform contribution setup), then reload.

## Essential identifiers

- `window.PluginManager`, `PluginManager.override(name, pluginClass, selector, options)`
- `PluginManager.getPlugin(name)` — returns the registry entry; `.get('class')` gives the class
- `CookiePermissionPlugin` (`src/plugin/cookie/cookie-permission.plugin`), registered as `CookiePermission` on `[data-cookie-permission]`
- `CookieStorage` (`src/helper/storage/cookie-storage.helper`), `this.options.cookieName`
- `init()`, `_hideCookieBar()`

## Gotchas

- Each JS plugin can effectively be overridden once: `override()` deregisters the current registration and registers the new class under the same name, so a second override replaces the first — the last one wins.
- When the original class cannot be imported (e.g. third-party plugin without alias), the source suggests `window.PluginManager.getPlugin('CookiePermission').get('class')`. For a plugin registered async, the registry holds the lazy-import function, not a class, until it has been loaded — extending that value fails.
- Core only registers `CookiePermission` when `window.useDefaultCookieConsent` is set; otherwise there is nothing to override.
- The override plugin fully replaces the original; on page reload the confirm behaviour restarts from `init()`.

## Code check (6.7.15.1)
- confirmed `PluginManager.override()` — calls `extend(overrideName, overrideName, …)` — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:871
- confirmed `extend()` — same name deregisters then registers the new class (last override wins) — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:127
- confirmed `register()` — class without prototype is stored as async lazy import — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:79
- confirmed `PluginManager.getPlugin()` — returns registry entry — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:889
- confirmed `CookiePermission` — registered async under `window.useDefaultCookieConsent` — vendor/shopware/storefront/Resources/app/storefront/src/main.js:132
- confirmed `CookiePermissionPlugin` — default export of cookie-permission.plugin.js — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:10
- confirmed `_hideCookieBar()` — publishes `hideCookieBar` — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:131
- confirmed `cookieName` — default `cookie-preference` — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:23
- confirmed `setItem()` — static setter on `CookieStorageHelper` — vendor/shopware/storefront/Resources/app/storefront/src/helper/storage/cookie-storage.helper.js:23
- unverified `shopware-cli project storefront-build` — CLI tooling outside the vendor roots
