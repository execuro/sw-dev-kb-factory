---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/06-integration.md
title: Integrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/06-integration.html
sourceHash: b6f701a0fc1003266654657997edb227edff9f15
codeCheckedAgainst: "6.7.15.1"
keywords: ["configureAppServer", "hono", "InMemoryShopRepository", "DynamoDBRepository", "DenoKVRepository", "CloudflareShopRepository", "BunSqliteRepository", "BetterSqlite3Repository", "createNotificationResponse", "/app/register", "app.activated", "shop repository", "javascript app sdk", "registrationUrl"]
summary: "JS App Server SDK integrations: Hono configureAppServer (auto routes, request validation, signing) and shop repositories for DynamoDB, KV, SQLite."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/07-external-frontend.md"]
---
## What it is

Optional integrations of the JavaScript App Server SDK (`@shopware-ag/app-server-sdk`): a Hono integration that registers the app lifecycle routes and validates/signs requests, and ready-made shop repositories for several storage backends.

## When to use

When building an app server on Hono, or when you need persistent shop storage (DynamoDB, Deno KV, Cloudflare KV, Bun SQLite, better-sqlite3) instead of `InMemoryShopRepository`.

## Key steps / config

Hono setup (`@shopware-ag/app-server-sdk/integration/hono`):

```ts
const app = new Hono();
configureAppServer(app, {
  appName: "Test",
  appSecret: "Test",
  shopRepository: new InMemoryShopRepository(),
});
declare module "hono" {
  interface ContextVariableMap { app: AppServer; shop: ShopInterface; context: Context; }
}
```

Routes registered automatically:

- `/app/register` — registration URL
- `/app/register/confirm` — registration confirmation
- `/app/activate` — `app.activated` webhook
- `/app/deactivate` — `app.deactivated` webhook
- `/app/delete` — `app.deleted` webhook

Matching `manifest.xml` (host elided):

```xml
<setup>
    <registrationUrl>{APP_URL}/app/register</registrationUrl>
</setup>
<webhooks>
    <webhook name="appActivated" url="{APP_URL}/app/activate" event="app.activated"/>
    <webhook name="appDeactivated" url="{APP_URL}/app/deactivate" event="app.deactivated"/>
    <webhook name="appDeleted" url="{APP_URL}/app/delete" event="app.deleted"/>
</webhooks>
```

A middleware on `/app/*` validates incoming requests with the shop secret, resolves the shop by shop id and signs the response with the app secret. In a handler, read the typed context via `c.get("context")` (e.g. `Context<SimpleShop, ActionButtonRequest>`) and return e.g. `createNotificationResponse("success", "...")` from `@shopware-ag/app-server-sdk/helper/app-actions`.

Shop repositories (pass as `shopRepository` to `configureAppServer`, or as the repository argument of `new AppServer(...)`):

| Backend | Import path | Constructor |
|---|---|---|
| DynamoDB | `.../integration/dynamodb` | `new DynamoDBRepository(client, 'my-table-name')` |
| Deno KV | `.../integration/deno-kv` | `new DenoKVRepository('my-namespace')` |
| Cloudflare KV | `.../integration/cloudflare-kv` | `new CloudflareShopRepository(env.KV_BINDING)` |
| Bun SQLite | `.../integration/bun-sqlite` | `new BunSqliteRepository('my-sqlite.db')` |
| better-sqlite3 | `.../integration/better-sqlite3` | `new BetterSqlite3Repository('my-sqlite.db')` |

Extra installs: `npm install --save @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb` (DynamoDB), `npm install --save better-sqlite3` (Node SQLite).

## Essential identifiers

- `configureAppServer`, `appName`, `appSecret`, `shopRepository`
- `InMemoryShopRepository`, `DynamoDBRepository`, `DenoKVRepository`, `CloudflareShopRepository`, `BunSqliteRepository`, `BetterSqlite3Repository`
- `createNotificationResponse`
- `registrationUrl`, `<webhook>` events `app.activated`, `app.deactivated`, `app.deleted`

## Gotchas

- The source's route list calls the delete hook "app.delete"; the actual event name is `app.deleted` (as its manifest example uses).
- The source's manifest example uses plain-HTTP localhost URLs; only the path part matters for the routes.
- For a separate frontend served through the app server, see [External Frontend](platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/07-external-frontend.md).

## Code check (6.7.15.1)
- confirmed `AppActivatedEvent::NAME` — `app.activated` — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `AppDeactivatedEvent::NAME` — `app.deactivated` — vendor/shopware/core/Framework/App/Event/AppDeactivatedEvent.php:13
- corrected `AppDeletedEvent::NAME` — docs: "app.delete webhook" in route list; event is `app.deleted` — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
- confirmed `registrationUrl` — required element of manifest `setup` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:199
- confirmed `webhook` — attributes `name`, `url`, `event` required — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:276
- confirmed `NotificationResponse::ACTION_TYPE` — `notification` action response type — vendor/shopware/core/Framework/App/ActionButton/Response/NotificationResponse.php:13
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — shop signs requests via `shopware-shop-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- unverified `configureAppServer` — JavaScript SDK Hono integration, not in the Shopware code roots
- unverified `DynamoDBRepository` — JavaScript SDK repository, out of scope
