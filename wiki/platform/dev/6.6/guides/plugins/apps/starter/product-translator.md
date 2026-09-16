---
id: platform/dev/6.6/guides/plugins/apps/starter/product-translator.md
title: Starter Guide - Read and write data
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/starter/product-translator.html
sourceHash: 254e1cff0ddbfcda656dab813a34fa1469810829
keywords: ["app-bundle", "app-bundle-symfony", "manifest.xml", "webhooks", "entity.written", "WebhookAction", "ClientFactory", "SimpleHttpClient", "SHOPWARE_APP_NAME", "SHOPWARE_APP_SECRET", "product.written", "custom fields", "AsEventListener", "ngrok"]
summary: "Symfony app-bundle tutorial: reads product data via webhooks and writes translations back through the Admin API."
lastBuilt: "2026-09-15"
---
## What it is
A tutorial building an app server with the Symfony `app-bundle` that reads and writes data via the Shopware Admin API, using product description translation on `product.written` webhooks as the running example.

## When to use
Use when building an app server that must react to entity changes (webhooks) and read/write data back through the Admin API.

## Key steps / config
Create project with `symfony new translator-app`, then `composer require shopware/app-bundle`. Configure `.env`:

```
SHOPWARE_APP_NAME=TestApp
SHOPWARE_APP_SECRET=TestSecret
```

`manifest.xml` skeleton needs `<meta>` (matching `.env` name), `<setup>` with `<registrationUrl>` (fixed at `/app/lifecycle/register` unless routes are changed) and `<secret>`, `<permissions>` for read/update/create on `product`, `product_translation`, `language`, `locale`, and `<webhooks>` including `productWritten` on event `product.written`. The App Bundle also auto-provides `appActivated`, `appDeactivated`, `appDeleted` webhooks.

Event listener skeleton:
```php
#[AsEventListener(event: 'webhook.product.written')]
class ProductWrittenWebhookListener {
    public function __invoke(WebhookAction $action): void { /* ... */ }
}
```

Inside, use `$this->clientFactory->createSimpleClient($action->shop)`, inspect `$action->payload[0]['updatedFields']` / `['primaryKey']`, `POST /api/search/product` to read, then `PATCH /api/product/{id}` to write translations plus a `customFields['translator-last-translation-hash']` guard.

Install with `shopware-cli project extension upload ProductTranslator/release --activate --increase-version`.

## Essential identifiers
- `WebhookAction`, `ClientFactory::createSimpleClient()`
- `webhook.product.written`, `product.written`
- `registrationUrl`, `secret` (manifest `setup`)
- `SHOPWARE_APP_NAME`, `SHOPWARE_APP_SECRET`
- `/api/search/product`, `/api/product/{id}`

## Gotchas
`entity.written` webhooks trigger themselves on write operations performed by the listener (updating a product fires another `product.written` event), so the listener must guard against endless loops — the guide stores a hash of the last-translated description in a custom field to detect no-op writes. The `<secret>` element is only for development; production secrets are provided by the extension store.

## Version notes
No version-specific behavior beyond app-bundle/webhook mechanics described.
