---
id: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md
title: Reacting to Cookie Consent Changes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.html
sourceHash: b9a391ccf771c52ddc3fd96d6472662fbe413ffd
codeCheckedAgainst: "6.7.15.1"
keywords: ["COOKIE_CONFIGURATION_UPDATE", "CookieConfiguration_Update", "CookieStorage", "cookie-storage.helper", "document.$emitter", "PluginManager.register", "cookie consent", "consent change", "tracking script", "storefront javascript plugin", "gdpr", "cookie-configuration.plugin"]
summary: Storefront JS - check a cookie on page load via the CookieStorage helper and react to consent changes through the COOKIE_CONFIGURATION_UPDATE event.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/concepts/commerce/content/cookie-consent-management.md"]
---
## What it is

How Storefront JavaScript reacts to the user's cookie consent: load a third-party script or tracking feature only when consent was given, react in real time when the choice changes, and clean up when consent is withdrawn. Builds on [Add cookie to manager](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md); see also [Reacting to JavaScript events](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md) and [Add custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md).

## When to use

Your plugin registered a cookie in the consent manager and must enable or disable functionality (tracking codes, embeds, local storage use) depending on whether the user accepted it.

## Key steps / config

1. Initial page load: when consent is given, Shopware sets a cookie with the name you registered. Check it with the static helper (it returns `false` when the cookie is missing):

```javascript
import CookieStorage from 'src/helper/storage/cookie-storage.helper';
const hasConsent = !!CookieStorage.getItem('cookie-key-1');
```

2. Consent changes: every time the user saves the cookie configuration, `cookie-configuration.plugin` publishes `COOKIE_CONFIGURATION_UPDATE` (value `CookieConfiguration_Update`) on `document.$emitter`. `event.detail` is an object of changed cookie names mapped to `true` (accepted) or `false` (declined):

```javascript
import { COOKIE_CONFIGURATION_UPDATE } from 'src/plugin/cookie/cookie-configuration.plugin';
document.$emitter.subscribe(COOKIE_CONFIGURATION_UPDATE, (event) => {
    if (typeof event.detail['cookie-key-1'] === 'undefined') return;
    event.detail['cookie-key-1'] ? loadThirdPartyScript() : removeThirdPartyScript();
});
```

3. Clean up on decline: remove the injected script element and also expire any cookies and `localStorage` items it created.

4. Wrap it in a Storefront plugin (extend `Plugin` from `src/plugin-system/plugin.class`, do the initial check and subscription in `init()`), then register it asynchronously in `<plugin root>/src/Resources/app/storefront/src/main.js` so it only loads where its selector exists:

```javascript
window.PluginManager.register('CookieAwareTracking', () => import('./plugin/cookie-aware-tracking.plugin'), '[data-cookie-aware-tracking]');
```

## Essential identifiers

- `COOKIE_CONFIGURATION_UPDATE` from `src/plugin/cookie/cookie-configuration.plugin`
- `document.$emitter.subscribe()`
- `CookieStorage.getItem()` from `src/helper/storage/cookie-storage.helper`
- `PluginManager.register(name, pluginClass, selector)`

## Gotchas

- The docs instantiate the helper (`new CookieStorage()` then `cookieStorage.getItem(...)`). In 6.7.15.1 `getItem` is a static method of `CookieStorageHelper`, so call it on the class.
- The docs' plugin example subscribes via `this.$emitter`. A plugin's `this.$emitter` is bound to its own element, while the consent event is published on `document.$emitter`; subscribe there.
- Guard enable/disable with a flag so the script is not injected twice.

## Code check (6.7.15.1)
- confirmed `COOKIE_CONFIGURATION_UPDATE` — exported, value `CookieConfiguration_Update` — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-configuration.plugin.js:45
- confirmed `COOKIE_CONFIGURATION_UPDATE` — published on `document.$emitter` with the updated-cookies map — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-configuration.plugin.js:554
- confirmed `_getUpdatedCookies()` — map of cookie name to `true`/`false` — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-configuration.plugin.js:572
- corrected `CookieStorageHelper.getItem()` — docs: instance call on `new CookieStorage()`; method is static — vendor/shopware/storefront/Resources/app/storefront/src/helper/storage/cookie-storage.helper.js:46
- corrected `this.$emitter` — docs: subscribe on plugin emitter; it is bound to the plugin element — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:24
- confirmed `PluginManager.register()` — `(pluginName, pluginClass, selector, options)` — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:839
