---
id: platform/dev/6.7/guides/plugins/apps/lifecycle/product-translator.md
title: Read and write data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/product-translator.html
sourceHash: ecbf5279f00b6846670bed75365a7414f9eb9195
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware/app-bundle", "SHOPWARE_APP_NAME", "SHOPWARE_APP_SECRET", "manifest.xml", "product.written", "webhook.product.written", "WebhookAction", "ClientFactory", "createSimpleClient", "/api/search/product", "shopware-cli project extension upload", "symfony app server", "admin api read write", "product translation app"]
summary: "Symfony app server with shopware/app-bundle that reacts to product.written webhooks and reads/writes product translations via the Admin API."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/_index.md", "platform/dev/6.7/guides/plugins/apps/checkout/payment.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/cart-manipulation.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/add-api-endpoint.md"]
---
## What it is

A tutorial for building an app backend with the Symfony [app bundle](https://github.com/shopware/app-bundle-symfony) (`shopware/app-bundle`): it subscribes to `product.written`, fetches the product's translations through the shop's Admin API and writes a translated description back.

## When to use

When an app server must react to entity changes in a shop and read or modify data via the Admin API — here, translating product descriptions on save.

## Key steps / config

1. **Project:** `symfony new translator-app`, then `composer require shopware/app-bundle` — accept the contrib recipe (it adds routing and bundle registration; otherwise create those files manually). Prerequisites: [shopware-cli](platform/dev/6.7/products/tools/cli/_index.md), symfony-cli, a MariaDB/MySQL database.
2. **Env (`.env`):** set `SHOPWARE_APP_NAME`, `SHOPWARE_APP_SECRET` and `DATABASE_URL`. Start with `symfony server:start -v`; expose a local server for a cloud store with `ngrok http 8000`.
3. **Manifest** (`release/manifest.xml`, schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`). `<name>` must equal `SHOPWARE_APP_NAME`:

```xml
<manifest>
  <meta><name>product-translator</name><label/><version>0.1.0</version>...</meta>
  <setup><registrationUrl>.../app/lifecycle/register</registrationUrl><secret>TestSecret</secret></setup>
  <permissions>
    <read>product</read><read>product_translation</read><read>language</read><read>locale</read>
    <update>product</update><update>product_translation</update><create>product_translation</create>
  </permissions>
  <webhooks>
    <webhook name="appActivated" url=".../app/lifecycle/activate" event="app.activated"/>
    <webhook name="appDeactivated" url=".../app/lifecycle/deactivate" event="app.deactivated"/>
    <webhook name="appDeleted" url=".../app/lifecycle/delete" event="app.deleted"/>
    <webhook name="productWritten" url=".../app/webhook" event="product.written"/>
  </webhooks>
</manifest>
```

The bundle implements `/app/lifecycle/register` (changeable in `config/routes/shopware_app.yaml`) and handles the lifecycle webhooks. `<secret>` belongs only in development builds; in production the extension store supplies it.

4. **Listener:** a Symfony listener with `#[AsEventListener(event: 'webhook.product.written')]`, constructor-injected `Shopware\App\SDK\HttpClient\ClientFactory` and `Psr\Log\LoggerInterface`, and `__invoke(Shopware\App\SDK\Context\Webhook\WebhookAction $action)`. The bundle has already verified the request.
5. **Client:** `$client = $this->clientFactory->createSimpleClient($action->shop)` — a pre-authenticated PSR-18 client.
6. **Inspect payload:** `$action->payload[0]['updatedFields']` and `['primaryKey']`; return early unless `description` changed.
7. **Fetch:** `$client->post(sprintf('%s/api/search/product', $action->shop->getShopUrl()), ['ids' => [$id], 'associations' => ['translations' => ['associations' => ['language' => ['associations' => ['locale' => []]]]]]])`; check `$response->ok()`, read `$response->json()['data'][0]` and pick the translation where `language.locale.code` is `en-GB`.
8. **Loop guard + write:** compare `md5($description)` with `customFields['translator-last-translation-hash']`; if different, `$client->patch(sprintf('%s/api/product/%s', ...), ['translations' => [...], 'customFields' => ['translator-last-translation-hash' => md5($description)]])`. Custom fields are schema-less, so no setup is needed.
9. **Install:** `shopware-cli project config init` once, then `shopware-cli project extension upload ProductTranslator/release --activate --increase-version`.

Further reading: [app payments](platform/dev/6.7/guides/plugins/apps/checkout/payment.md), [cart manipulation scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/cart-manipulation.md), [custom API endpoints](platform/dev/6.7/guides/plugins/apps/app-scripts/add-api-endpoint.md).

## Essential identifiers

- Packages/env: `shopware/app-bundle`, `SHOPWARE_APP_NAME`, `SHOPWARE_APP_SECRET`, `DATABASE_URL`
- Events: `app.activated`, `app.deactivated`, `app.deleted`, `product.written`; bundle event `webhook.product.written`
- SDK: `ClientFactory::createSimpleClient()`, `WebhookAction` (`$action->shop`, `$action->payload`)
- Admin API: `POST /api/search/product`, `PATCH /api/product/{id}`
- CLI: `shopware-cli project extension upload ... --activate --increase-version`

## Gotchas

- `entity.written` webhooks fire for the app's own writes — without a guard (here the description hash in custom fields) the listener loops forever.
- `--increase-version` is required so Shopware picks up `manifest.xml` changes since the last install.
- The source states a 5-second timeout for requests to the app server; in 6.7.15.1 webhook delivery uses a 10 s connect and 20 s request timeout.
- The source's manifest examples use plain-HTTP localhost URLs for development.

## Code check (6.7.15.1)
- confirmed `webhooks` — optional manifest element in the installed manifest-3.0 schema — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:81
- confirmed `registrationUrl` — setup element; `secret` is optional (minOccurs 0) — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:199
- confirmed `permissions` — read/create/update child elements — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:232
- confirmed `AppActivatedEvent::NAME` — app.activated — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `AppDeactivatedEvent::NAME` — app.deactivated — vendor/shopware/core/Framework/App/Event/AppDeactivatedEvent.php:13
- confirmed `AppDeletedEvent::NAME` — app.deleted — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
- corrected `WebhookClient::REQUEST_TIMEOUT` — docs: 5 second timeout; code uses 20 s request, 10 s connect — vendor/shopware/core/Framework/Webhook/Service/WebhookClient.php:24
- unverified `webhook.product.written` — Symfony app bundle event, not in the installed Shopware packages
- unverified `ClientFactory::createSimpleClient()` — App PHP SDK, out of scope
