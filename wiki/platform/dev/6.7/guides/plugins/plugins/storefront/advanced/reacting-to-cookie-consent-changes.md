---
id: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md
title: Reacting to Cookie Consent Changes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.html
sourceHash: b9a391ccf771c52ddc3fd96d6472662fbe413ffd
codeCheckedAgainst: "6.7.13.0"
keywords: ["COOKIE_CONFIGURATION_UPDATE", "CookieStorage", "cookie-storage.helper", "cookie-configuration.plugin", "document.$emitter", "PluginManager.register", "cookie consent", "consent manager", "gdpr", "tracking script", "storefront javascript plugin", "revoke consent cleanup"]
summary: "Storefront JS: check cookie consent on page load via CookieStorage.getItem and react to COOKIE_CONFIGURATION_UPDATE on document.$emitter to load/unload scripts."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How a Storefront JavaScript plugin enables or disables functionality (third-party scripts, tracking) depending on the user's cookie consent: check consent on initial page load, react in real time when the consent configuration is saved, and clean up when consent is withdrawn.

## When to use

Your plugin registered a cookie in the consent manager (see [Adding a cookie to the consent manager](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md)) and must only load its feature once that cookie is accepted.

## Key steps / config

1. **Initial page load** — when a user consents, Shopware sets a cookie with the name you defined. Check its existence. `CookieStorageHelper` exposes only static methods, so call it on the class, not on an instance:
   ```javascript
   import CookieStorage from 'src/helper/storage/cookie-storage.helper';
   const hasConsent = !!CookieStorage.getItem('cookie-key-1');
   ```
2. **Consent changes** — every time the user saves the cookie configuration, the cookie configuration plugin publishes `COOKIE_CONFIGURATION_UPDATE` (value `'CookieConfiguration_Update'`) on `document.$emitter`. Subscribe there (also inside a class-based plugin — the plugin's own emitter is bound to the plugin element and does not receive it):
   ```javascript
   import { COOKIE_CONFIGURATION_UPDATE } from 'src/plugin/cookie/cookie-configuration.plugin';
   document.$emitter.subscribe(COOKIE_CONFIGURATION_UPDATE, (event) => {
       const state = event.detail['cookie-key-1']; // true | false | undefined
       if (typeof state === 'undefined') return;
       state ? loadThirdPartyScript() : removeThirdPartyScript();
   });
   ```
   `event.detail` maps only the *changed* cookie names to `true` (accepted) or `false` (declined).
3. **Clean up** on decline: remove the injected script element, expire cookies the script set (`document.cookie = 'name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'`) and remove `localStorage` entries.
4. **Plugin class** (`src/plugin/cookie-aware-tracking.plugin.js`) extends `Plugin` from `src/plugin-system/plugin.class`, with `static options` (`cookieName`, `trackingUrl`), an `init()` that subscribes and checks initial consent, and `enableTracking()`/`disableTracking()` guarded by an `isTrackingEnabled` flag.
5. **Register** it asynchronously in `<plugin root>/src/Resources/app/storefront/src/main.js`:
   ```javascript
   window.PluginManager.register('CookieAwareTracking', () => import('./plugin/cookie-aware-tracking.plugin'), '[data-cookie-aware-tracking]');
   ```
   A dynamic import means the plugin is only loaded where the selector is present.

## Essential identifiers

- `COOKIE_CONFIGURATION_UPDATE` from `src/plugin/cookie/cookie-configuration.plugin`
- `CookieStorage` (`src/helper/storage/cookie-storage.helper`), static `getItem(key)`
- `document.$emitter.subscribe(...)`, `event.detail`
- `Plugin` (`src/plugin-system/plugin.class`)
- `PluginManager.register(name, class | () => import(...), selector)`

## Gotchas

- The source example calls `new CookieStorage()` and then `cookieStorage.getItem(...)`; the installed helper defines `getItem` as `static`, so the instance call is undefined — use `CookieStorage.getItem(...)`.
- The source's class-based example subscribes via `this.$emitter`; the event is published on `document.$emitter`, so subscribe there.
- When all cookies are accepted from the cookie bar without opening the off-canvas, every active/inactive cookie is reported as changed.
- Withdrawing consent does not remove anything automatically; your plugin must remove scripts, cookies and storage itself.

## Code check (6.7.13.0)
- confirmed `COOKIE_CONFIGURATION_UPDATE` — exported constant `'CookieConfiguration_Update'` — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-configuration.plugin.js:45
- confirmed `document.$emitter.publish(COOKIE_CONFIGURATION_UPDATE, updatedCookies)` — published on the document emitter — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-configuration.plugin.js:550
- confirmed `_getUpdatedCookies()` — detail maps changed cookie names to true/false — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-configuration.plugin.js:568
- corrected `CookieStorageHelper.getItem()` — docs: called on a `new CookieStorage()` instance; it is static — vendor/shopware/storefront/Resources/app/storefront/src/helper/storage/cookie-storage.helper.js:46
- corrected `this.$emitter` — docs: plugin subscribes on its own emitter; it is bound to the plugin element, not document — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:24
- confirmed `PluginManager.register()` — accepts a class or an async import factory — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:74
