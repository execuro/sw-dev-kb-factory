---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/php/03-context.md
title: Context
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/php/03-context.html
sourceHash: 5358634d7439d2f633a0d62ebf9a6a24b329c9c4
keywords: ["ContextResolver", "RegistrationService", "ShopResolver", "AppConfiguration", "Webhook", "ActionButton", "Module", "TaxProvider", "Payment", "context"]
summary: "ContextResolver maps Shopware requests to typed struct classes and validates them for webhooks, action buttons, modules, tax providers, and payments."
lastBuilt: "2026-09-15"
---
## What it is

The `ContextResolver` maps incoming Shopware requests to typed struct classes so you can work with them more easily, performing validation and checking whether the request is valid.

## When to use

Use it in your app's webhook or HTTP endpoint after resolving the shop, to turn the raw request into a strongly-typed context object for the specific action being invoked.

## Key steps / config

```php
$app = new AppConfiguration('Foo', 'test', '<confirmation-url>');
$repository = ...; // implements Shopware\App\SDK\Shop\ShopRepositoryInterface, see FileShopRepository
$registrationService = new \Shopware\App\SDK\Registration\RegistrationService($app, $repository);
$shopResolver = new \Shopware\App\SDK\Shop\ShopResolver($repository);
$contextResolver = new \Shopware\App\SDK\Context\ContextResolver();

$shop = $shopResolver->resolveShop($psrRequest);
$webhook = $contextResolver->assembleWebhook($psrRequest, $shop);
$webhook->eventName;
$webhook->payload;
```

`ContextResolver` supports several request kinds via matching `assemble*` calls: Webhook (webhooks or app lifecycle events), ActionButton (Administration buttons), Module (iframe), TaxProvider (tax calculation), and Payment Pay/Capture/Validate/Finalize actions.

## Essential identifiers

- `Shopware\App\SDK\Context\ContextResolver`
- `Shopware\App\SDK\Shop\ShopResolver`
- `Shopware\App\SDK\Registration\RegistrationService`
- `Shopware\App\SDK\Shop\ShopRepositoryInterface`
- `WebhookAction`, `ActionButtonAction`, `ModuleAction`, `TaxProviderAction`
- `PaymentPayAction`, `PaymentCaptureAction`, `PaymentValidateAction`, `PaymentFinalizeAction`
