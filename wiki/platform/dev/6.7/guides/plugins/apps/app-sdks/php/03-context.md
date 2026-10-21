---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/03-context.md
title: Context
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/03-context.html
sourceHash: 5358634d7439d2f633a0d62ebf9a6a24b329c9c4
codeCheckedAgainst: "6.7.15.1"
keywords: ["ContextResolver", "assembleWebhook", "ShopResolver", "resolveShop", "WebhookAction", "ActionButtonAction", "ModuleAction", "TaxProviderAction", "PaymentPayAction", "app php sdk", "request context", "webhook parsing"]
summary: PHP App SDK ContextResolver validates Shopware requests and maps them to structs (webhook, action button, module, tax provider, payment actions).
lastBuilt: 2026-10-21
---
## What it is

The PHP App SDK's `ContextResolver` turns incoming Shopware requests into typed struct classes and validates the request on the way.

## When to use

Your PHP app backend receives a webhook, action button, iframe module, tax-provider or payment call from a shop and you want a typed object instead of parsing the raw JSON.

## Key steps / config

1. Resolve the shop from the PSR-7 request with `\Shopware\App\SDK\Shop\ShopResolver($repository)`:
   `$shop = $shopResolver->resolveShop($psrRequest);`
2. Create `\Shopware\App\SDK\Context\ContextResolver()` (no constructor arguments in the source).
3. Assemble the struct matching the request type, e.g. for a webhook:

```php
$webhook = $contextResolver->assembleWebhook($psrRequest, $shop);
$webhook->eventName; // the event name
$webhook->payload;   // the event data
```

Supported request structs (in the app-php-sdk repository under `src/Context/`):

| Request | Struct |
|---|---|
| Webhooks / app lifecycle events | `WebhookAction` |
| Administration action buttons | `ActionButtonAction` |
| Iframe modules | `ModuleAction` |
| Tax calculation | `TaxProviderAction` |
| Payment pay / capture / validate / finalize | `PaymentPayAction`, `PaymentCaptureAction`, `PaymentValidateAction`, `PaymentFinalizeAction` |

Shopware itself sends a webhook body shaped as below, with POST bodies signed in the `shopware-shop-signature` header:

```json
{ "data": { "payload": {}, "event": "..." }, "source": {} }
```

## Essential identifiers

- `\Shopware\App\SDK\Context\ContextResolver` — `assembleWebhook($psrRequest, $shop)`
- `\Shopware\App\SDK\Shop\ShopResolver` — `resolveShop($psrRequest)`
- `WebhookAction`, `ActionButtonAction`, `ModuleAction`, `TaxProviderAction`, `PaymentPayAction`, `PaymentCaptureAction`, `PaymentValidateAction`, `PaymentFinalizeAction`

## Code check (6.7.15.1)
- unverified `\Shopware\App\SDK\Context\ContextResolver` — shopware/app-php-sdk package, outside the checked roots
- unverified `\Shopware\App\SDK\Shop\ShopResolver` — app-php-sdk package, out of scope
- unverified `WebhookAction` — app-php-sdk struct, out of scope
- confirmed `payload` — core webhook body nests payload and event under data, plus source — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:298
- confirmed `RequestSigner::signRequest()` — POST bodies get a shopware-shop-signature header — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:17
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — header name shopware-shop-signature — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
