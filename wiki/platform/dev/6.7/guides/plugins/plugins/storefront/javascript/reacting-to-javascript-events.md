---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md
title: Reacting to JavaScript Events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.html
sourceHash: 00a7bc1093c684991347fa1fbce3590fce147738
codeCheckedAgainst: "6.7.15.1"
keywords: ["$emitter", "this.$emitter.publish", "$emitter.subscribe", "getPluginInstanceFromElement", "PluginBaseClass", "window.PluginManager", "hideCookieBar", "NativeEventEmitter", "storefront js events", "listen to plugin event", "javascript event subscriber", "CookiePermission"]
summary: Subscribe to events published by another Storefront JS plugin by fetching its instance via PluginManager and calling $emitter.subscribe on it.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How a custom Storefront JavaScript plugin listens to events that core JS plugins publish on their own `$emitter`, as a lighter alternative to overriding the plugin. Example: reacting when the cookie bar is hidden (`hideCookieBar`).

## When to use

When you need to run code in response to something a core Storefront JS plugin does, without changing its behaviour. If no suitable event exists, [override the plugin](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md) instead. Assumes a running plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) and an existing custom JS plugin ([adding custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md)).

## Key steps / config

1. Find events: search for `this.$emitter.publish` in `src/Storefront/Resources/app/storefront/src` of the Shopware source.
2. In your plugin (`<plugin root>/src/Resources/app/storefront/src/events-plugin/events-plugin.plugin.js`), fetch the publishing plugin's instance from its element via `PluginManager`, then subscribe on *that instance's* emitter:

```javascript
const { PluginBaseClass } = window;

export default class EventsPlugin extends PluginBaseClass {
    init() {
        const plugin = window.PluginManager.getPluginInstanceFromElement(document.querySelector('[data-cookie-permission]'), 'CookiePermission');
        plugin.$emitter.subscribe('hideCookieBar', this.onHideCookieBar);
    }
    onHideCookieBar() { /* ... */ }
}
```

## Essential identifiers

- `window.PluginBaseClass` — base class for Storefront JS plugins
- `window.PluginManager.getPluginInstanceFromElement(el, pluginName)`
- `this.$emitter.publish(eventName, detail)` / `plugin.$emitter.subscribe(eventName, callback)`
- `hideCookieBar` — published by `CookiePermission` (`[data-cookie-permission]`)

## Gotchas

- Every plugin instance has its own emitter (a `NativeEventEmitter` bound to the plugin's element), so `this.$emitter.subscribe` only hears your own plugin's events — you must subscribe on the other plugin's `$emitter`.
- Events are notifications only: subscribing does not prevent the original method from running.
- `getPluginInstanceFromElement` returns the instance only if one exists on that element. In 6.7 `CookiePermission` is registered as an async plugin and only when `window.useDefaultCookieConsent` is set, so guard against a missing instance.

## Code check (6.7.15.1)
- confirmed `window.PluginBaseClass` — assigned globally — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:972
- confirmed `PluginManager.getPluginInstanceFromElement()` — static, delegates to singleton — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:912
- confirmed `$emitter` — per-instance `NativeEventEmitter` on the plugin element — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:24
- confirmed `publish()` — `publish(eventName, detail = {}, cancelable = false)` — vendor/shopware/storefront/Resources/app/storefront/src/helper/emitter.helper.js:52
- confirmed `subscribe()` — `subscribe(eventName, callback, opts = {})` — vendor/shopware/storefront/Resources/app/storefront/src/helper/emitter.helper.js:70
- confirmed `hideCookieBar` — published in `_hideCookieBar()` — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:134
- confirmed `CookiePermission` — async registration on `[data-cookie-permission]` — vendor/shopware/storefront/Resources/app/storefront/src/main.js:132
