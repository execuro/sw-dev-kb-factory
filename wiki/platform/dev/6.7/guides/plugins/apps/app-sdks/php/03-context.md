---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/03-context.md
title: Context
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/03-context.html
sourceHash: 5358634d7439d2f633a0d62ebf9a6a24b329c9c4
codeCheckedAgainst: "6.7.13.0"
keywords: ["ContextResolver", "assembleWebhook", "resolveShop", "ShopResolver", "WebhookAction", "ActionButtonAction", "ModuleAction", "TaxProviderAction", "PaymentPayAction", "webhook payload", "request context", "app-php-sdk"]
summary: "PHP app SDK ContextResolver: resolve the shop from a Shopware request and map webhooks, action buttons, modules, tax and payment calls to typed structs."
lastBuilt: 2026-09-15
---
## What it is

The PHP App Server SDK page on `\Shopware\App\SDK\Context\ContextResolver`, which maps incoming Shopware requests to struct classes and validates that the request is valid.

## When to use

When your PHP app backend receives webhooks, action button clicks, admin module (iframe) loads, tax provider or payment calls and you want typed access instead of parsing raw JSON.

## Key steps / config

1. Resolve the shop that sent the request, then assemble the struct for the request type:

```php
$shopResolver = new \Shopware\App\SDK\Shop\ShopResolver($repository);
$contextResolver = new \Shopware\App\SDK\Context\ContextResolver();

$shop = $shopResolver->resolveShop($psrRequest);
$webhook = $contextResolver->assembleWebhook($psrRequest, $shop);

$webhook->eventName; // the event name
$webhook->payload;   // the event data
```

`$repository` implements `\Shopware\App\SDK\Shop\ShopRepositoryInterface`; `$psrRequest` is a PSR-7 request.

2. Supported request structs (in the SDK's `src/Context/`):
   - `WebhookAction` — webhooks and app lifecycle events
   - `ActionButtonAction` — Administration action buttons
   - `ModuleAction` — iframe modules
   - `TaxProviderAction` — tax calculation
   - `PaymentPayAction`, `PaymentCaptureAction`, `PaymentValidateAction`, `PaymentFinalizeAction` — payment steps

Raw webhook body the core sends (installed core), which `assembleWebhook` maps to `eventName`/`payload`:

```json
{
  "data": { "payload": [], "event": "..." },
  "source": { "url": "...", "eventId": "..." }
}
```

For app webhooks the `source` block is extended with the shop id, app version and in-app purchase token.

## Essential identifiers

- `\Shopware\App\SDK\Context\ContextResolver` — `assembleWebhook()`
- `\Shopware\App\SDK\Shop\ShopResolver` — `resolveShop()`
- `WebhookAction`, `ActionButtonAction`, `ModuleAction`, `TaxProviderAction`
- `PaymentPayAction`, `PaymentCaptureAction`, `PaymentValidateAction`, `PaymentFinalizeAction`

## Gotchas

- Flow-action webhooks (app flow actions) have a different shape in core: the payload is sent flat with `source.action` added, not wrapped in `data`.

## Code check (6.7.13.0)
- unverified `\Shopware\App\SDK\Context\ContextResolver` — external package shopware/app-php-sdk, not in vendor/shopware
- unverified `ShopResolver::resolveShop()` — external SDK method, out of scope
- unverified `WebhookAction` — SDK struct, out of scope
- confirmed `data.payload` — webhook body wraps payload and event under data — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:302
- confirmed `data.event` — event name in webhook body — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:303
- confirmed `source.eventId` — random id per webhook in source block — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:283
- confirmed `AppFlowActionEvent` — flow actions send flat payload with source.action — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:293
- confirmed `AppPayloadServiceHelper::buildSource()` — adds shop id, app version, IAP token to source — vendor/shopware/core/Framework/App/Payload/AppPayloadServiceHelper.php:45
