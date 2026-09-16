---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/06-integration.md
title: Integrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/06-integration.html
sourceHash: b6f701a0fc1003266654657997edb227edff9f15
codeCheckedAgainst: "6.7.13.0"
keywords: ["configureAppServer", "@shopware-ag/app-server-sdk/integration/hono", "InMemoryShopRepository", "DynamoDBRepository", "DenoKVRepository", "CloudflareShopRepository", "BunSqliteRepository", "BetterSqlite3Repository", "createNotificationResponse", "hono", "shop repository", "registrationUrl", "app.activated", "app.deleted"]
summary: "JS App Server SDK: Hono configureAppServer (lifecycle routes, /app/* validation) and shop repositories for DynamoDB, Deno KV, Cloudflare KV, SQLite."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/07-external-frontend.md"]
---
## What it is

Optional integrations of the JavaScript App Server SDK (`@shopware-ag/app-server-sdk`): a Hono integration that registers the app lifecycle routes and request validation, and ready-made shop repositories for several storage backends.

## When to use

When building an app backend on Hono, or when you need to store shops in DynamoDB, Deno KV, Cloudflare KV, Bun SQLite or better-sqlite3.

## Key steps / config

**Hono setup:**

```ts
import { InMemoryShopRepository } from '@shopware-ag/app-server-sdk'
import type { AppServer, ShopInterface, Context } from "@shopware-ag/app-server-sdk";
import { Hono } from "hono";
import { configureAppServer } from "@shopware-ag/app-server-sdk/integration/hono";

const app = new Hono();
configureAppServer(app, { appName: "Test", appSecret: "Test", shopRepository: new InMemoryShopRepository() });
declare module "hono" {
  interface ContextVariableMap { app: AppServer; shop: ShopInterface; context: Context; }
}
export default app;
```

`configureAppServer` registers: `/app/register` (registration URL), `/app/register/confirm` (registration confirmation), `/app/activate`, `/app/deactivate`, `/app/delete` (lifecycle webhook targets). Manifest shape (replace `{APP_URL}` with your app server's base URL):

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

A middleware on `/app/*` (default) validates incoming requests with the shop secret, resolves the shop by the shop id in the request, and signs the response with the app secret. Handlers read the typed context:

```ts
import { createNotificationResponse } from "@shopware-ag/app-server-sdk/helper/app-actions";
app.post("/app/action-button", async (c) => {
  const ctx = c.get("context") as Context<SimpleShop, ActionButtonRequest>;
  console.log(ctx.payload.data.ids);
  return createNotificationResponse("success", "Yeah, it worked!");
});
```

**Shop repositories** — pass as `shopRepository` to `configureAppServer`, or as a constructor argument to `new AppServer(...)` without Hono:

| Backend | Import path | Constructor |
|---|---|---|
| DynamoDB | `@shopware-ag/app-server-sdk/integration/dynamodb` | `new DynamoDBRepository(client, 'my-table-name')` |
| Deno KV | `@shopware-ag/app-server-sdk/integration/deno-kv` | `new DenoKVRepository('my-namespace')` |
| Cloudflare KV | `@shopware-ag/app-server-sdk/integration/cloudflare-kv` | `new CloudflareShopRepository(env.KV_BINDING)` |
| Bun SQLite | `@shopware-ag/app-server-sdk/integration/bun-sqlite` | `new BunSqliteRepository('my-sqlite.db')` |
| better-sqlite3 | `@shopware-ag/app-server-sdk/integration/better-sqlite3` | `new BetterSqlite3Repository('my-sqlite.db')` |

DynamoDB needs `npm install --save @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb` (client: `new DynamoDBClient()` from `@aws-sdk/client-dynamodb`); better-sqlite3 needs `npm install --save better-sqlite3`.

## Essential identifiers

- `configureAppServer`, options `appName`, `appSecret`, `shopRepository`
- `InMemoryShopRepository`, `DynamoDBRepository`, `DenoKVRepository`, `CloudflareShopRepository`, `BunSqliteRepository`, `BetterSqlite3Repository`
- `createNotificationResponse` (`@shopware-ag/app-server-sdk/helper/app-actions`)
- Routes `/app/register`, `/app/register/confirm`, `/app/activate`, `/app/deactivate`, `/app/delete`
- Events `app.activated`, `app.deactivated`, `app.deleted`

## Gotchas

- The source's route list says `/app/delete` is notified by an "app.delete" webhook; the event name in core (and in the source's own manifest) is `app.deleted`.
- The source's manifest example points at a local development server over plain HTTP on port 3000; `registrationUrl` is a required `<setup>` element typed `xs:anyURI` in the manifest XSD.
- Next step: [External Frontend](platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/07-external-frontend.md).

## Code check (6.7.13.0)
- unverified `configureAppServer` — JS SDK Hono integration, outside the vendor/shopware scope
- unverified `DynamoDBRepository` — JS SDK repository classes, outside the vendor/shopware scope
- confirmed `registrationUrl` — required setup element, xs:anyURI — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:188
- confirmed `webhook` — attributes name, url, event required — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:265
- confirmed `app.activated` — AppActivatedEvent::NAME — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `app.deactivated` — AppDeactivatedEvent::NAME — vendor/shopware/core/Framework/App/Event/AppDeactivatedEvent.php:13
- corrected `app.deleted` — docs: route list says app.delete — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
- confirmed `confirmation_url` — read from the app's registration response for the confirm step — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:55
- confirmed `shopware-shop-signature` — request signature header the middleware validates — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `NotificationResponse::ACTION_TYPE` — action button response type notification — vendor/shopware/core/Framework/App/ActionButton/Response/NotificationResponse.php:13
