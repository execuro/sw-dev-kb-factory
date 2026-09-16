---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md
title: Override Existing JavaScript
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/override-existing-javascript.html
sourceHash: 834b684b2a48a239370e0a9bc8bbc148912f79e4
codeCheckedAgainst: "6.7.13.0"
keywords: ["PluginManager.override", "PluginManager.getPlugin", "CookiePermissionPlugin", "CookiePermission", "CookieStorage", "_hideCookieBar", "[data-cookie-permission]", "main.js", "shopware-cli project storefront-build", "override javascript plugin", "extend storefront plugin", "async plugin"]
summary: Override a core Storefront JS plugin by subclassing it and registering it via PluginManager.override() in main.js; example extends CookiePermission.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

Storefront JavaScript plugins are plain ES classes, so a Shopware plugin can subclass one, override its methods (calling `super` where needed) and swap its registration with `PluginManager.override()`. The guide's example extends the core `CookiePermission` plugin so the cookie bar always shows and asks for confirmation before hiding.

## When to use

You need to change the behavior of an existing Storefront JS plugin and no emitter event covers it (check [reacting to JavaScript events](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md) first). Requires a running plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) and familiarity with [adding custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md).

## Key steps / config

1. Create `<plugin root>/src/Resources/app/storefront/src/my-cookie-permission/my-cookie-permission.plugin.js` with a class extending the original:

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

2. If the original class cannot be imported (e.g. a third-party plugin without an alias), get it from the registry: `window.PluginManager.getPlugin('CookiePermission').get('class')` and extend that.
3. Register in `<plugin root>/src/Resources/app/storefront/src/main.js` (a `main.ts` there is also picked up) with the registered plugin name and selector. Core registers `CookiePermission` with a dynamic import, so override it the same way:

```javascript
window.PluginManager.override('CookiePermission', () => import('./my-cookie-permission/my-cookie-permission.plugin'), '[data-cookie-permission]');
```

   For a plugin registered synchronously, pass the class directly: `PluginManager.override('Name', MyClass, '[selector]')`.
4. Build the Storefront: `shopware-cli project storefront-build` (template) or `composer run build:js:storefront` (platform contribution setup), then reload.

## Essential identifiers

- `window.PluginManager`, `PluginManager.override(overrideName, pluginClass, selector, options)`, `PluginManager.register()`, `PluginManager.getPlugin()`
- `CookiePermissionPlugin` (`src/plugin/cookie/cookie-permission.plugin`), registered as `CookiePermission` on `[data-cookie-permission]`
- `CookieStorage` (`src/helper/storage/cookie-storage.helper`), `this.options.cookieName` (default `cookie-preference`)
- `init()`, `_hideCookieBar()`

## Gotchas

- Each JS plugin can only be overridden once; if two plugins override the same one, only the last registration works (`override()` deregisters and re-registers under the same name).
- `override()` only works on an already registered name — otherwise it logs "Trying to extend non-registered plugin" and does nothing. Core registers `CookiePermission` only when `window.useDefaultCookieConsent` is set.
- An async (dynamic-import) registered plugin needs an async override import as well.
- Reloading the page brings the cookie bar back in this example, by design.

## Code check (6.7.13.0)
- confirmed `PluginManager::override()` — calls extend() with the same name for both arguments — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:698
- confirmed `PluginManagerSingleton::extend()` — warns and returns if not registered; same name deregisters then registers — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:122
- confirmed `PluginManager::getPlugin()` — returns the registry definition — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:716
- confirmed `class` — registry map key holding the plugin class — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.registry.js:50
- confirmed `CookiePermission` — registered async on [data-cookie-permission] inside the useDefaultCookieConsent check — vendor/shopware/storefront/Resources/app/storefront/src/main.js:130
- confirmed `CookiePermissionPlugin` — core class in src/plugin/cookie/cookie-permission.plugin.js — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:10
- confirmed `cookieName` — option default 'cookie-preference' — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:23
- confirmed `CookiePermissionPlugin::init()` — checks preference via CookieStorage — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:42
- confirmed `CookiePermissionPlugin::_hideCookieBar()` — hides bar and publishes hideCookieBar — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:131
- confirmed `cookie-storage.helper` — import path src/helper/storage/cookie-storage.helper — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:7
