---
id: "platform/dev/6.6/guides/plugins/plugins/storefront/reacting-to-cookie-consent-changes.md"
title: "Reacting to cookie consent changes"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/reacting-to-cookie-consent-changes.html"
sourceHash: "c6835680245f594c2743fe4358e33b50944037b4"
keywords: ["cookie consent", "COOKIE_CONFIGURATION_UPDATE", "document.$emitter", "cookie configuration", "cookie-key-1", "event subscribe", "javascript plugin", "storefront cookie", "consent manager", "eventCallback", "updatedCookies.detail", "cookie tracking"]
summary: "Shows how to subscribe to the COOKIE_CONFIGURATION_UPDATE event to react to a user's cookie consent changes in JavaScript."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to react to cookie consent changes made by the user via JavaScript, by subscribing to the event emitted whenever the cookie configuration is saved.

## When to use
Use this when a plugin needs to run custom JavaScript logic whenever the shopper changes their cookie consent settings, for example enabling or disabling behavior tied to a specific cookie's active state.

## Key steps / config
Every time a user saves a cookie configuration, an event is published to the document's event emitter (`document.$emitter`). The event payload only contains the changeset for the cookie configuration, as an object keyed by cookie attribute name:

```javascript
// <plugin root>/src/Resources/app/storefront/src/reacting-cookie/reacting-cookie.js
import { COOKIE_CONFIGURATION_UPDATE } from 'src/plugin/cookie/cookie-configuration.plugin';

document.$emitter.subscribe(COOKIE_CONFIGURATION_UPDATE, eventCallback);

function eventCallback(updatedCookies) {
    if (typeof updatedCookies.detail['cookie-key-1'] !== 'undefined') {
        let cookieActive = updatedCookies.detail['cookie-key-1'];
    }
}
```

The example registers for the `COOKIE_CONFIGURATION_UPDATE` event and applies a custom callback. The callback checks `updatedCookies.detail` for the cookie attribute it cares about (`cookie-key-1` in the example); if the key is present, its value is the cookie's new active state — if the key is absent, that cookie was not part of this particular update. As with any custom JavaScript file, the new file must be imported from the plugin's `main.js` entry file:

```javascript
// <plugin root>/src/Resources/app/storefront/src/main.js
import './reacting-cookie/reacting-cookie'
```

## Essential identifiers
- `COOKIE_CONFIGURATION_UPDATE` — event name published whenever a cookie configuration is saved
- `document.$emitter` — document event emitter used to subscribe to the event
- `updatedCookies.detail` — object holding the changed cookie attributes and their new active state
- `main.js` — storefront plugin entry file that must import the reacting file
