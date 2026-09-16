---
id: platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md
title: Webhook
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/webhook.html
sourceHash: 7233385a4f11a3ec1c09ffbda3370e1c8b19f827
codeCheckedAgainst: "6.7.13.0"
keywords: ["webhook", "<webhooks>", "onlyLiveVersion", "product.written", "entity.written", "shopware-shop-signature", "sw-version", "sw-context-language", "sw-user-language", "eventId", "primaryKey", "HookableEntityWrittenEvent", "Defaults::LIVE_VERSION", "app events", "event subscription"]
summary: "App webhooks: <webhook> in manifest, POST JSON payload (data, source, timestamp), shopware-shop-signature HMAC, sw-* headers, onlyLiveVersion filter."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md", "platform/dev/6.7/resources/references/app-reference/webhook-events-reference.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/versioning-entities.md"]
---
## What it is

Webhooks let an app subscribe to Shopware events: when the event occurs, Shopware sends a signed `POST` request with a JSON body to the URL declared for that event in the app manifest.

## When to use

An app backend must react to data changes or other events in a shop (e.g. every product change, placed orders) without polling.

## Key steps / config

1. Declare webhooks in `manifest.xml`:
   ```xml
   <webhooks>
     <webhook name="product-changed" url="https://example.com/event/product-changed" event="product.written"/>
     <webhook name="order-created" url="https://example.com/event/order-created" event="order.written" onlyLiveVersion="true"/>
   </webhooks>
   ```
   Attributes `name`, `url`, `event` are required; `onlyLiveVersion` is optional, default `false`. Event names: see [Webhook events reference](platform/dev/6.7/resources/references/app-reference/webhook-events-reference.md).
2. Receive the request body:
   ```json
   {
     "data": { "payload": [ { "entity": "product", "operation": "...", "primaryKey": "...", "updatedFields": [] } ], "event": "product.written" },
     "source": { "url": "...", "appVersion": "...", "shopId": "...", "eventId": "..." },
     "timestamp": 123123123
   }
   ```
   - `source.url` — shop URL for API calls; `appVersion` — installed app version; `shopId` — shop identifier; `eventId` — unique, stable across retries.
   - `data.event` lets one endpoint handle several events; `data.payload` carries the event data.
   - `timestamp` — use to reject old requests (replay protection).
3. Verify `shopware-shop-signature` (HMAC SHA-256 of the body with the shop's app secret), same as the registration confirmation request (see [App registration](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md)).
4. Read headers: `sw-version`; `sw-context-language` (context language ID) and `sw-user-language` (user/context locale).
5. Handle it with the App PHP SDK (`ShopResolver::resolveShop()`, `ContextResolver::assembleWebhook()`) or in the Symfony bundle by type-hinting `Shopware\App\SDK\Context\Webhook\WebhookAction` in a controller.

## Essential identifiers

- `<webhooks>`, `<webhook name url event onlyLiveVersion>`
- `shopware-shop-signature`, `sw-version`, `sw-context-language`, `sw-user-language`
- Payload keys `data.payload`, `data.event`, `source.url`, `source.appVersion`, `source.shopId`, `source.eventId`, `timestamp`
- `Shopware\Core\Defaults::LIVE_VERSION`
- `HookableEntityWrittenEvent`

## Gotchas

- `entity.written` payloads carry only `entity`, `operation`, `primaryKey`, `updatedFields` (plus `versionId` when written) — never full entities; fetch data through the API. Other events contain entity data but possibly not all associations.
- `updatedFields` is not present for delete operations.
- Written-event webhooks are delivered only if the app has read permission on the entity; deactivated apps receive only app lifecycle events.
- `onlyLiveVersion` only affects `HookableEntityWrittenEvent`; when enabled, non-live-version entries are removed from the payload, and the webhook is skipped if all versioned entries are non-live (unversioned writes still send). See [Versioning entities](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/versioning-entities.md).

## Version notes

- 6.4.1.0: `timestamp` property and `sw-version` header.
- 6.4.5.0: `sw-context-language` and `sw-user-language` headers.
- 6.4.11.0: `source.eventId`.
- 6.5.7.0: `onlyLiveVersion` option.

## Code check (6.7.13.0)
- confirmed `onlyLiveVersion` — optional boolean webhook attribute, default false — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:269
- confirmed `WebhookManager::filterPayloadByLiveVersion()` — applies only to HookableEntityWrittenEvent — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:319
- confirmed `Defaults::LIVE_VERSION` — live version ID compared against `versionId` — vendor/shopware/core/Defaults.php:20
- confirmed `eventId` — random per event, placed in `source` — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:283
- confirmed `Source::$appVersion` — source adds `shopId` and `appVersion` for apps — vendor/shopware/core/Framework/App/Payload/Source.php:23
- confirmed `timestamp` — added to payload when the request is built — vendor/shopware/core/Framework/App/Payload/AppPayloadServiceHelper.php:72
- confirmed `sw-version` — request header, plus language headers when known — vendor/shopware/core/Framework/App/Payload/AppPayloadServiceHelper.php:79
- corrected `updatedFields` — docs sample: present (empty) for delete; code omits it for EntityDeletedEvent — vendor/shopware/core/Framework/Webhook/Hookable/HookableEntityWrittenEvent.php:62
- confirmed `HookableEntityWrittenEvent::isAllowed()` — requires read privilege on the entity — vendor/shopware/core/Framework/Webhook/Hookable/HookableEntityWrittenEvent.php:42
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — `shopware-shop-signature` header name — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
