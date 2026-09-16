---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md
title: Reacting to JavaScript Events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.html
sourceHash: 00a7bc1093c684991347fa1fbce3590fce147738
codeCheckedAgainst: "6.7.13.0"
keywords: ["$emitter", "this.$emitter.publish", "$emitter.subscribe", "NativeEventEmitter", "PluginManager.getPluginInstanceFromElement", "PluginBaseClass", "hideCookieBar", "CookiePermission", "storefront js events", "event listener", "plugin events"]
summary: Listen to Storefront JS plugin events by fetching the plugin instance via PluginManager.getPluginInstanceFromElement() and calling $emitter.subscribe().
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

Storefront JavaScript plugins publish events on their own `$emitter` (a `NativeEventEmitter` created per plugin instance). Another plugin can subscribe to those events to add behavior without overriding the emitting plugin. The example reacts to the `hideCookieBar` event of the `CookiePermission` plugin.

## When to use

You want to run code when a core Storefront JS plugin does something (cookie bar hidden, etc.) and prefer not to [override the plugin](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md). Requires a running plugin with a custom JS plugin (see [adding custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md)).

## Key steps / config

1. Find events: search for `this.$emitter.publish` in the Storefront JS sources (`src/Storefront/Resources/app/storefront/src` in the platform repository; installed as `vendor/shopware/storefront/Resources/app/storefront/src`). Not every plugin publishes events.
2. In your plugin's `init()`, get the other plugin's instance from its DOM element with `window.PluginManager.getPluginInstanceFromElement(el, pluginName)`, then subscribe on **that** instance's emitter:

```javascript
// <plugin root>/src/Resources/app/storefront/src/events-plugin/events-plugin.plugin.js
const { PluginBaseClass } = window;

export default class EventsPlugin extends PluginBaseClass {
    init() {
        const plugin = window.PluginManager.getPluginInstanceFromElement(document.querySelector('[data-cookie-permission]'), 'CookiePermission');
        plugin.$emitter.subscribe('hideCookieBar', this.onHideCookieBar);
    }

    onHideCookieBar() { /* ... */ }
}
```

`subscribe(eventName, callback, opts)` has a counterpart `unsubscribe(eventName)`.

## Essential identifiers

- `this.$emitter.publish(eventName, detail, cancelable)` / `plugin.$emitter.subscribe(eventName, callback, opts)`
- `NativeEventEmitter` (`src/helper/emitter.helper`)
- `window.PluginManager.getPluginInstanceFromElement(el, pluginName)`
- `window.PluginBaseClass`
- Cookie bar events on `CookiePermission` (`[data-cookie-permission]`): `hideCookieBar`, `showCookieBar`, `onClickDenyButton`

## Gotchas

- Every plugin instance has its own emitter, so `this.$emitter.subscribe` in your plugin never receives another plugin's events — subscribe on the fetched instance's `$emitter`.
- Events are notifications only: subscribing does **not** prevent the original method from running.
- `getPluginInstanceFromElement()` is documented to return `Object|null`; core registers `CookiePermission` asynchronously and only when `window.useDefaultCookieConsent` is set, so guard against a missing instance.

## Code check (6.7.13.0)
- confirmed `$emitter` — created per plugin instance as new NativeEventEmitter(this.el) — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:24
- confirmed `NativeEventEmitter::publish()` — signature (eventName, detail, cancelable) — vendor/shopware/storefront/Resources/app/storefront/src/helper/emitter.helper.js:52
- confirmed `NativeEventEmitter::subscribe()` — signature (eventName, callback, opts) — vendor/shopware/storefront/Resources/app/storefront/src/helper/emitter.helper.js:70
- confirmed `NativeEventEmitter::unsubscribe()` — removes listeners by event name — vendor/shopware/storefront/Resources/app/storefront/src/helper/emitter.helper.js:100
- confirmed `PluginManager::getPluginInstanceFromElement()` — static, (el, pluginName), returns Object or null — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:739
- confirmed `PluginBaseClass` — exposed on window — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:799
- confirmed `hideCookieBar` — published in _hideCookieBar() — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:134
- confirmed `showCookieBar` — published in _showCookieBar() — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:124
- confirmed `onClickDenyButton` — published after the deny button click — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:200
- confirmed `CookiePermission` — registered async on [data-cookie-permission] when useDefaultCookieConsent is set — vendor/shopware/storefront/Resources/app/storefront/src/main.js:130
