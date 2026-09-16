---
id: platform/dev/6.6/guides/plugins/apps/webhook.md
title: Webhook
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/webhook.html
sourceHash: 808bdcfc92cb24bc17039371baccae51c00c01e7
keywords: ["webhook", "webhooks", "app manifest", "webhooks element", "product.written", "HookableEntityWrittenEvent", "onlyLiveVersion", "shopware-shop-signature", "sw-version", "sw-context-language", "sw-user-language", "eventId", "app registration", "signature verification"]
summary: "Explains how Shopware apps subscribe to core events via webhooks defined in the app manifest, including payload shape and live-version filtering."
lastBuilt: "2026-09-15"
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/framework/data-handling/versioning-entities.md
---
## What it is
Webhooks let an App subscribe to Shopware events; when an event fires, Shopware sends a `POST` request with a JSON payload to the URL configured for that webhook.

## When to use
Use webhooks when building a Shopware App that needs to react to changes in the shop (for example product changes or order creation) from an external backend service.

## Key steps / config
Declare a `<webhooks>` element in the app manifest, for example:
```xml
<webhook name="order-created" url="https://example.com/event/order-created" event="order.written"/>
```
Payload shape sent as JSON in the request body:
```json
{
  "data": {
    "payload": [
      { "entity": "...", "operation": "...", "primaryKey": "...", "updatedFields": [] }
    ],
    "event": "..."
  },
  "source": { "url": "...", "appVersion": "...", "shopId": "...", "eventId": "..." },
  "timestamp": 0
}
```
Verify authenticity via the `shopware-shop-signature` header — a SHA256 HMAC of the request body, signed with the secret assigned to the shop during app registration.

## Essential identifiers
- `<webhooks>` manifest element
- `onlyLiveVersion` webhook attribute
- `shopware-shop-signature` header
- `sw-version`, `sw-context-language`, `sw-user-language` headers
- `Shopware\Core\Defaults::LIVE_VERSION`
- `HookableEntityWrittenEvent`

## Gotchas
- The `payload` for `entity.written` events only contains the entity's `primaryKey`, not full entity data, since it might become outdated; the app must fetch additional data through the shop API.
- `onlyLiveVersion` is only checked for instances of `HookableEntityWrittenEvent`; for other events the option is ignored. By default it is `false`.
- `timestamp` marks when the webhook was handled and can be used to reject stale/replayed requests, since an attacker cannot change it without invalidating the signature.

## Version notes
- `eventId` is available since 6.4.11.0.
- `timestamp` is available since 6.4.1.0; the `sw-version` header is sent since 6.4.1.0; `sw-context-language`/`sw-user-language` headers are sent since 6.4.5.0.
- The `onlyLiveVersion` option was introduced in 6.5.7.0.
