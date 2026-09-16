---
id: platform/dev/6.7/guides/plugins/apps/lifecycle/product-translator.md
title: Read and write data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/product-translator.html
sourceHash: ecbf5279f00b6846670bed75365a7414f9eb9195
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware/app-bundle", "app server", "symfony app bundle", "manifest.xml", "product.written", "webhook.product.written", "WebhookAction", "ClientFactory", "createSimpleClient", "/api/search/product", "SHOPWARE_APP_SECRET", "shopware-cli project extension upload", "admin api read write", "product translation", "updatedFields"]
summary: "Symfony app-bundle tutorial: manifest, permissions, product.written webhook; listener reads a product via Admin API and patches its translation."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/_index.md", "platform/dev/6.7/guides/plugins/apps/checkout/payment.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/cart-manipulation.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/add-api-endpoint.md"]
---
## What it is

A walkthrough for an app server built with the Symfony app bundle (`shopware/app-bundle`) that reacts to `product.written` webhooks, reads the product through the Admin API and writes a translated description back.

## When to use

Starting an app backend in PHP/Symfony that must read and write shop data in response to entity changes.

## Key steps / config

1. **Create the project and install the bundle**
   ```sh
   symfony new translator-app
   composer require shopware/app-bundle
   ```
   Accept the Flex recipe (it registers the bundle and routing); otherwise create those files manually. Set in `.env`: `SHOPWARE_APP_NAME`, `SHOPWARE_APP_SECRET`, and `DATABASE_URL`. Start with `symfony server:start -v`; expose it publicly for a cloud shop (e.g. `ngrok http 8000`). Install the [Shopware CLI](platform/dev/6.7/products/tools/cli/_index.md) for the last step.
2. **Manifest** (`release/manifest.xml`, schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`):
   ```xml
   <manifest xsi:noNamespaceSchemaLocation="...manifest-3.0.xsd">
     <meta><name>product-translator</name><label>…</label><version>0.1.0</version>…</meta>
     <setup><registrationUrl>…/app/lifecycle/register</registrationUrl><secret>TestSecret</secret></setup>
     <permissions><read>product</read><read>product_translation</read><read>language</read><read>locale</read>
       <update>product</update><update>product_translation</update><create>product_translation</create></permissions>
     <webhooks>
       <webhook name="appActivated" url="…/app/lifecycle/activate" event="app.activated"/>
       <webhook name="appDeactivated" url="…/app/lifecycle/deactivate" event="app.deactivated"/>
       <webhook name="appDeleted" url="…/app/lifecycle/delete" event="app.deleted"/>
       <webhook name="productWritten" url="…/app/webhook" event="product.written"/>
     </webhooks>
   </manifest>
   ```
   `<name>` must equal `SHOPWARE_APP_NAME`. The registration path is `/app/lifecycle/register` unless `config/routes/shopware_app.yaml` is changed. `<secret>` is only for development; in production the store provides it.
3. **Listener** — the bundle verifies the request and dispatches `webhook.<event>`:
   ```php
   #[AsEventListener(event: 'webhook.product.written')]
   class ProductWrittenWebhookListener {
       public function __construct(private readonly ClientFactory $clientFactory, private readonly LoggerInterface $logger) {}
       public function __invoke(WebhookAction $action): void { /* ... */ }
   }
   ```
   Classes: `Shopware\App\SDK\HttpClient\ClientFactory`, `Shopware\App\SDK\Context\Webhook\WebhookAction`.
4. **Inside `__invoke`**: `$client = $this->clientFactory->createSimpleClient($action->shop);` read `$action->payload[0]['updatedFields']` and `['primaryKey']`; return early unless `description` changed.
5. **Read**: `$client->post(sprintf('%s/api/search/product', $action->shop->getShopUrl()), ['ids' => [$id], 'associations' => ['translations' => ['associations' => ['language' => ['associations' => ['locale' => []]]]]]])`; check `$response->ok()`, then pick the translation whose `language.locale.code` matches.
6. **Loop guard**: store `md5($description)` in `customFields['translator-last-translation-hash']`; skip if it matches.
7. **Write**: `$client->patch(sprintf('%s/api/product/%s', $shopUrl, $id), ['translations' => ['en-GB' => ['name' => …, 'description' => …]], 'customFields' => [...]])`.
8. **Install**: `shopware-cli project config init`, then
   ```sh
   shopware-cli project extension upload ProductTranslator/release --activate --increase-version
   ```
   `--increase-version` bumps the manifest version so Shopware picks up manifest changes.

Next: [app payments](platform/dev/6.7/guides/plugins/apps/checkout/payment.md), [cart manipulation scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/cart-manipulation.md), [custom API endpoints](platform/dev/6.7/guides/plugins/apps/app-scripts/add-api-endpoint.md).

## Essential identifiers

- `shopware/app-bundle`, `SHOPWARE_APP_NAME`, `SHOPWARE_APP_SECRET`, `DATABASE_URL`
- `manifest-3.0.xsd`, `<setup>`, `<registrationUrl>`, `<secret>`, `<permissions>`, `<webhooks>`
- Events `app.activated`, `app.deactivated`, `app.deleted`, `product.written`; bundle event `webhook.product.written`
- `WebhookAction`, `ClientFactory::createSimpleClient()`
- `/api/search/product`, `/api/product/{id}`

## Gotchas

- `entity.written` webhooks fire on your own writes — without a guard (hash in custom fields) the listener loops endlessly.
- Webhooks are only delivered for entities the app can read; the payload has `primaryKey` and `updatedFields` only, not the entity — fetch data via the API. `updatedFields` is omitted for delete operations.
- The source states a 5 s timeout for requests to the app server. In the installed code that is the general app-system HTTP client (5 s, connect 1 s); webhook delivery uses its own client with 20 s request / 10 s connect timeout.
- Custom fields are schema-less, so the hash can be written without defining a field set.

## Code check (6.7.13.0)
- confirmed `registrationUrl` — required `<setup>` element in manifest-3.0.xsd — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:188
- confirmed `secret` — optional `<setup>` element for local development — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:195
- confirmed `permissions` — read/create/update/delete/crud/permission children — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:219
- confirmed `AppActivatedEvent::NAME` — `app.activated` — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `AppDeactivatedEvent::NAME` — `app.deactivated` — vendor/shopware/core/Framework/App/Event/AppDeactivatedEvent.php:13
- confirmed `AppDeletedEvent::NAME` — `app.deleted` — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
- confirmed `updatedFields` — sent for non-delete writes, alongside `primaryKey` — vendor/shopware/core/Framework/Webhook/Hookable/HookableEntityWrittenEvent.php:62
- corrected `timeout` — docs: 5 s for app server requests; true for app-system client, webhooks use 20 s — vendor/shopware/core/Framework/DependencyInjection/app.php:598
- confirmed `WebhookClient::REQUEST_TIMEOUT` — 20 s webhook delivery timeout, connect 10 s — vendor/shopware/core/Framework/Webhook/Service/WebhookClient.php:21
- unverified `ClientFactory::createSimpleClient()` — App PHP SDK / app-bundle, not in vendor/shopware scope
