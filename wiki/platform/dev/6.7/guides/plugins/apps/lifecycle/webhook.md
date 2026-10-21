---
id: platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md
title: Webhook
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/webhook.html
sourceHash: 7233385a4f11a3ec1c09ffbda3370e1c8b19f827
codeCheckedAgainst: "6.7.15.1"
keywords: ["<webhooks>", "<webhook>", "onlyLiveVersion", "product.written", "HookableEntityWrittenEvent", "Defaults::LIVE_VERSION", "shopware-shop-signature", "sw-version", "sw-context-language", "sw-user-language", "eventId", "webhook payload", "app event subscription", "WebhookAction"]
summary: "App webhooks: <webhook> manifest entries, JSON payload (data/source/timestamp), headers, signature check and the onlyLiveVersion option."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md", "platform/dev/6.7/resources/references/app-reference/webhook-events-reference.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/versioning-entities.md"]
---
## What it is

Webhooks let an app subscribe to Shopware events: whenever the event fires, Shopware sends a `POST` request with a JSON body to the URL configured for it in the app manifest.

## When to use

When an app backend must react to changes in a shop (e.g. every time a product is written) instead of polling the API. See the [webhook events reference](platform/dev/6.7/resources/references/app-reference/webhook-events-reference.md) for available events.

## Key steps / config

1. Declare webhooks in `manifest.xml`. Attributes `name`, `url`, `event` are required; `onlyLiveVersion` is optional (default `false`):

```xml
<webhooks>
    <webhook name="product-changed" url="https://example.com/event/product-changed" event="product.written"/>
    <webhook name="order-created" url="https://example.com/event/order-created" event="order.written" onlyLiveVersion="true"/>
</webhooks>
```

2. Receive the request body:

```json
{
  "data": { "payload": [ { "entity": "product", "operation": "delete", "primaryKey": "...", "updatedFields": [] } ], "event": "product.written" },
  "source": { "url": "...", "appVersion": "0.0.1", "shopId": "...", "eventId": "..." },
  "timestamp": 123123123
}
```

   - `source.url` — where the app reaches the shop and its API; `appVersion` — installed app version; `shopId` — shop identifier; `eventId` — unique per event, stable across retries.
   - `data.event` lets one endpoint handle several events; `data.payload` holds event data. For `entity.written` events it carries only `primaryKey` (plus `updatedFields`), so fetch current data and the associations you need through the API.
   - `timestamp` — when the webhook was handled; reject old ones to prevent replay attacks.
3. Read the headers `sw-version`, and (when a language context exists) `sw-context-language` and `sw-user-language`.
4. Verify the `shopware-shop-signature` header: HMAC-SHA256 of the request body with the secret the app assigned the shop during [registration](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md) — same check as the confirmation request.
5. Parsing helpers: App PHP SDK `ShopResolver::resolveShop()` then `ContextResolver::assembleWebhook($serverRequest, $shop)`; Symfony bundle: type-hint `Shopware\App\SDK\Context\Webhook\WebhookAction` in a controller action and return e.g. `new Response(null, 204)`.

### Live version only

With `onlyLiveVersion="true"` the webhook fires only for writes with live version ID (`Shopware\Core\Defaults::LIVE_VERSION`), e.g. to skip order drafts, and the payload is filtered to live-version entries. The option is only evaluated for `HookableEntityWrittenEvent`; other events ignore it. See [versioning entities](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/versioning-entities.md).

## Essential identifiers

- Manifest: `<webhooks>`, `<webhook name url event onlyLiveVersion>`
- Payload keys: `data.payload`, `data.event`, `source.url`, `source.appVersion`, `source.shopId`, `source.eventId`, `timestamp`
- Headers: `shopware-shop-signature`, `sw-version`, `sw-context-language`, `sw-user-language`
- Classes: `Shopware\Core\Defaults::LIVE_VERSION`, `HookableEntityWrittenEvent`

## Gotchas

- The source's `onlyLiveVersion` example omits the attribute itself; it must be set as `onlyLiveVersion="true"` on `<webhook>`.
- `entity.written` payloads never contain full entities — fetch them by `primaryKey`.
- Non-written events contain entity data but may lack associations.
- Webhooks of a deactivated app only receive app lifecycle events.

## Version notes

- `timestamp` in the body and the `sw-version` header since 6.4.1.0.
- `sw-context-language` / `sw-user-language` headers since 6.4.5.0.
- `source.eventId` since 6.4.11.0.
- `onlyLiveVersion` since 6.5.7.0.

## Code check (6.7.15.1)
- confirmed `onlyLiveVersion` — boolean webhook attribute, default false; name/url/event required — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:280
- confirmed `HookableEntityWrittenEvent` — live-version payload filter applies only to this event type — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:315
- confirmed `Defaults::LIVE_VERSION` — payload entries kept only when versionId equals it — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:320
- confirmed `eventId` — source carries url and a random eventId — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:279
- confirmed `data.payload` — body shape data.payload + data.event + source — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:298
- confirmed `AppPayloadServiceHelper::buildSource()` — adds shopId and appVersion to source — vendor/shopware/core/Framework/App/Payload/AppPayloadServiceHelper.php:45
- confirmed `timestamp` — set on the payload when the webhook request is built — vendor/shopware/core/Framework/App/Payload/AppPayloadServiceHelper.php:72
- confirmed `sw-version` — header on every webhook request; language headers only when language and locale are known — vendor/shopware/core/Framework/App/Payload/AppPayloadServiceHelper.php:79
- confirmed `AuthMiddleware::SHOPWARE_CONTEXT_LANGUAGE` — sw-context-language — vendor/shopware/core/Framework/App/Hmac/Guzzle/AuthMiddleware.php:26
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — POST body signed into shopware-shop-signature — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
