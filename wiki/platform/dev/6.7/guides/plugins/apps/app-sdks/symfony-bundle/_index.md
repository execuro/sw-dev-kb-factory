---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/symfony-bundle/_index.md
title: Official Symfony Bundle
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/symfony-bundle/
sourceHash: 19db57705f035c7000313eeba020a81fffa4565e
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware/app-bundle", "app bundle symfony", "/app/lifecycle/register", "/app/webhook", "config/routes/shopware_app.yaml", "WebhookAction", "AsEventListener", "webhook.product.written", "app.activated", "manifest-3.0.xsd", "doctrine", "dynamodb", "symfony app backend"]
summary: "Shopware App Bundle for Symfony: composer install (Doctrine or DynamoDB), manifest setup, default /app/lifecycle/* routes, webhooks as Symfony events."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md"]
---
## What it is

The App Bundle (`shopware/app-bundle`, repository `https://github.com/shopware/app-bundle-symfony`) integrates the PHP App SDK into a Symfony application: it registers the lifecycle routes, stores shops (Doctrine or DynamoDB) and can dispatch incoming webhooks as Symfony events.

## When to use

When building a Shopware app backend with Symfony and you want registration, activation, deactivation, deletion and webhook handling wired up instead of implementing them on the raw SDK.

## Key steps / config

1. Install, choosing the storage:
   - SQL (Doctrine): `composer require shopware/app-bundle doctrine/orm symfony/doctrine-bridge`
   - NoSQL (DynamoDB): `composer require shopware/app-bundle async-aws/async-aws-bundle async-aws/dynamo-db`
   - New project first if needed: `composer create-project symfony/skeleton:"6.2.*" my-app`; logging recommended via `composer require logger`.
2. Create the app manifest (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`), pointing registration and lifecycle webhooks at the bundle routes on your app host:

```xml
<manifest xsi:noNamespaceSchemaLocation="…/manifest-3.0.xsd">
    <meta><name/><label/><author/><copyright/><version/><license/></meta>
    <setup>
        <registrationUrl>…/app/lifecycle/register</registrationUrl>
        <secret>TestSecret</secret>
    </setup>
    <webhooks>
        <webhook name="appActivated" url="…/app/lifecycle/activate" event="app.activated"/>
        <webhook name="appDeactivated" url="…/app/lifecycle/deactivate" event="app.deactivated"/>
        <webhook name="appDeleted" url="…/app/lifecycle/delete" event="app.deleted"/>
    </webhooks>
</manifest>
```

3. Match the app name and secret in the Symfony `.env` file.
4. Default routes: `/app/lifecycle/register`, `/app/lifecycle/activate`, `/app/lifecycle/deactivate`, `/app/lifecycle/delete`. Change the prefix in `config/routes/shopware_app.yaml`. The registration flow also dispatches the SDK lifecycle events.
5. Connect Doctrine to a database, then implement action buttons, webhooks and payment handling (see [app registration setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md)).
6. Optional generic webhook controller: point a webhook at `/app/webhook` (default) and listen for `webhook.<event>`:

```php
#[AsEventListener(event: 'webhook.product.written')]
class ProductUpdatedListener
{
    public function __invoke(WebhookAction $action): void { /* ... */ }
}
```

with manifest `<webhook name="productWritten" url="…/app/webhook" event="product.written"/>`.

## Essential identifiers

- `shopware/app-bundle`
- `/app/lifecycle/register`, `/app/lifecycle/activate`, `/app/lifecycle/deactivate`, `/app/lifecycle/delete`
- `/app/webhook`, Symfony event name `webhook.<shopware event>`
- `config/routes/shopware_app.yaml`
- `WebhookAction`, `AsEventListener`
- Manifest: `registrationUrl`, `secret`, `webhook` (`name`, `url`, `event`)

## Gotchas

- The source's section on connecting Doctrine to a database is empty; configure Doctrine as in any Symfony project.
- The skeleton example pins Symfony `6.2.*`.

## Code check (6.7.13.0)
- unverified `shopware/app-bundle` — bundle, its routes and `WebhookAction` live outside the checked vendor roots
- confirmed `registrationUrl` — required setup element in manifest-3.0 schema — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:188
- confirmed `secret` — optional setup element (minOccurs 0) — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:195
- confirmed `webhook` — attributes `name`, `url`, `event` required — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:265
- confirmed `app.activated` — core event name — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `app.deactivated` — core event name — vendor/shopware/core/Framework/App/Event/AppDeactivatedEvent.php:13
- confirmed `app.deleted` — core event name — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
- confirmed `product.written` — core event name usable as webhook event — vendor/shopware/core/Content/Product/ProductEvents.php:31
