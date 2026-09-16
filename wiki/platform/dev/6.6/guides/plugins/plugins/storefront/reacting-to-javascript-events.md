---
id: platform/dev/6.6/guides/plugins/plugins/storefront/reacting-to-javascript-events.md
title: Reacting to javascript events
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/reacting-to-javascript-events.html
sourceHash: a37f9ef5f84c17a8ebc12ea4c8e8f37817946613
keywords: ["events", "javascript events", "$emitter", "PluginManager", "PluginBaseClass", "subscribe", "publish", "hideCookieBar", "CookiePermission", "getPluginInstanceFromElement", "storefront plugin", "js plugin"]
summary: How to find and subscribe to a Storefront JS plugin's $emitter events via PluginManager without overriding the plugin.
lastBuilt: 2026-09-15
---

## What it is

Explains how Shopware Storefront JavaScript plugins publish events on their own `$emitter` instance, and how another plugin can subscribe to those events instead of overriding the plugin.

## When to use

When you want to react to something a core or third-party JS plugin does (e.g. hiding the cookie bar) without overriding that plugin's code.

## Key steps / config

1. Find published events by searching for `this.$emitter.publish` in `platform/src/Storefront/Resources/app/storefront/src`.
2. Fetch the target plugin's instance via `window.PluginManager.getPluginInstanceFromElement(element, 'PluginName')`.
3. Subscribe on that instance's emitter: `plugin.$emitter.subscribe('eventName', this.handler)`.

Example subscribing to the `hideCookieBar` event fired by the `CookiePermission` plugin:

```javascript
export default class EventsPlugin extends PluginBaseClass {
    init() {
        const plugin = window.PluginManager.getPluginInstanceFromElement(document.querySelector('[data-cookie-permission]'), 'CookiePermission');
        plugin.$emitter.subscribe('hideCookieBar', this.onHideCookieBar);
    }

    onHideCookieBar() {
        alert("The cookie bar has been hidden!");
    }
}
```

## Essential identifiers

- `this.$emitter.publish` / `this.$emitter.subscribe`
- `window.PluginManager.getPluginInstanceFromElement()`
- `PluginBaseClass`
- Example event: `hideCookieBar` (published by `CookiePermission`)

## Gotchas

- Every plugin has its own `$emitter` instance; you cannot subscribe to another plugin's events on `this.$emitter` — you must fetch that plugin's instance via `PluginManager` first.
- Subscribing to an event does not prevent execution of the original method; treat these events as notifications only.
