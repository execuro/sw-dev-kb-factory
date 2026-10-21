---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/symfony-bundle/_index.md
title: Official Symfony Bundle
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/symfony-bundle/
sourceHash: 19db57705f035c7000313eeba020a81fffa4565e
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware/app-bundle", "app-bundle-symfony", "symfony", "app php sdk", "/app/lifecycle/register", "/app/webhook", "shopware_app.yaml", "WebhookAction", "AsEventListener", "webhook.product.written", "doctrine", "dynamodb", "manifest-3.0.xsd"]
summary: Shopware App Bundle for Symfony - Doctrine/DynamoDB install, default lifecycle routes, manifest setup, webhooks as Symfony events.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md"]
---
## What it is

The App Bundle (`shopware/app-bundle`, repository https://github.com/shopware/app-bundle-symfony) integrates the PHP App SDK into a Symfony application: it registers the app lifecycle routes, persists shop data via Doctrine or DynamoDB, and can dispatch incoming webhooks as Symfony events.

## When to use

When your app backend is a Symfony project and you want registration, activation/deactivation/deletion handling and webhook routing provided by the framework integration.

## Key steps / config

1. Create a Symfony project if needed: `composer create-project symfony/skeleton:"6.2.*" my-app`
2. Install the bundle with a storage backend:
   - SQL (Doctrine): `composer require shopware/app-bundle doctrine/orm symfony/doctrine-bridge`
   - NoSQL (DynamoDB): `composer require shopware/app-bundle async-aws/async-aws-bundle async-aws/dynamo-db`
   - Recommended for logging: `composer require logger`
3. Create the app manifest (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`) pointing `setup` and the lifecycle webhooks at the bundle routes:

```xml
<manifest xsi:noNamespaceSchemaLocation=".../manifest-3.0.xsd">
    <meta><name>TestApp</name> ... </meta>
    <setup>
        <registrationUrl>{app-host}/app/lifecycle/register</registrationUrl>
        <secret>TestSecret</secret>
    </setup>
    <webhooks>
        <webhook name="appActivated" url="{app-host}/app/lifecycle/activate" event="app.activated"/>
        <webhook name="appDeactivated" url="{app-host}/app/lifecycle/deactivate" event="app.deactivated"/>
        <webhook name="appDeleted" url="{app-host}/app/lifecycle/delete" event="app.deleted"/>
    </webhooks>
</manifest>
```

   Change app name and secret, and match the environment variables in `.env`.
4. Default routes: `/app/lifecycle/register`, `/app/lifecycle/activate`, `/app/lifecycle/deactivate`, `/app/lifecycle/delete`. Change the prefix in `config/routes/shopware_app.yaml`.
5. Connect Doctrine to a database, then implement action buttons, webhooks and payments (see [app registration setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md)).

### Optional: webhooks as Symfony events

Point webhooks at the generic URL `/app/webhook`; the bundle dispatches each webhook as a Symfony event named `webhook.<event>`:

```php
#[AsEventListener(event: 'webhook.product.written')]
class ProductUpdatedListener
{
    public function __invoke(WebhookAction $action): void { /* ... */ }
}
```

## Essential identifiers

- `shopware/app-bundle`
- `config/routes/shopware_app.yaml`
- `/app/lifecycle/register`, `/app/lifecycle/activate`, `/app/lifecycle/deactivate`, `/app/lifecycle/delete`, `/app/webhook`
- `WebhookAction`, `#[AsEventListener(event: 'webhook.product.written')]`

## Gotchas

- The registration flow also dispatches the PHP SDK lifecycle events (see the App SDK events page).

## Code check (6.7.15.1)
- unverified `shopware/app-bundle` — separate package, outside vendor/shopware/{core,storefront,administration}
- unverified `WebhookAction` — app-php-sdk class, out of scope
- confirmed `registrationUrl` — `setup` element in the core manifest-3.0 schema — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:199
- confirmed `secret` — optional `setup` element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:206
- confirmed `webhook` — `webhooks` child element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:252
- confirmed `AppActivatedEvent::NAME` — `app.activated` — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `AppDeactivatedEvent::NAME` — `app.deactivated` — vendor/shopware/core/Framework/App/Event/AppDeactivatedEvent.php:13
- confirmed `AppDeletedEvent::NAME` — `app.deleted` — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
