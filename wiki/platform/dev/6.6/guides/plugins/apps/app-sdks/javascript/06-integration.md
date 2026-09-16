---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/06-integration.md
title: Integrations
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/javascript/06-integration.html
sourceHash: b6f701a0fc1003266654657997edb227edff9f15
keywords: ["JavaScript SDK", "Hono", "configureAppServer", "AppServer", "InMemoryShopRepository", "DynamoDBRepository", "DenoKVRepository", "CloudflareShopRepository", "BunSqliteRepository", "BetterSqlite3Repository", "manifest.xml", "webhooks"]
summary: "Documents the JavaScript App SDK's Hono integration and ready-made shop repositories for DynamoDB, Deno KV, Cloudflare KV, Bun SQLite, and better-sqlite3."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/07-external-frontend.md"]
---
## What it is

The JavaScript App SDK offers optional integrations into several JavaScript ecosystems so an app's backend can plug into an existing project, plus ready-to-use shop repositories for several storage backends.

## When to use

Use the Hono integration when building the app's backend on the Hono framework; use one of the repository integrations when you need a specific persistent store for shop credentials instead of implementing a repository yourself.

## Key steps / config

`configureAppServer(app, { appName, appSecret, shopRepository })` registers the required routes on a Hono app automatically:

- `/app/register` — registration URL
- `/app/register/confirm` — registration confirmation
- `/app/activate` — notifies via the `app.activated` webhook
- `/app/deactivate` — notifies via the `app.deactivated` webhook
- `/app/delete` — notifies via the `app.delete` webhook

These correspond to the manifest's `<setup><registrationUrl>` element and `<webhooks>` entries for the `app.activated`, `app.deactivated`, and `app.deleted` events. A middleware, configured by default for `/app/*` routes, automatically validates incoming requests against the shop secret, resolves the shop by the request's `shopId`, and signs outgoing responses with the app secret — the resolved context is available via `c.get("context")`.

Repository integrations, each importable from `@shopware-ag/app-server-sdk/integration/<name>` and usable with or without Hono by passing them into `new AppServer(...)`:

- `DynamoDBRepository` (requires `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb` installed separately)
- `DenoKVRepository`
- `CloudflareShopRepository`
- `BunSqliteRepository`
- `BetterSqlite3Repository` (requires the `better-sqlite3` package installed separately)

## Essential identifiers

- `configureAppServer`
- `InMemoryShopRepository`, `DynamoDBRepository`, `DenoKVRepository`, `CloudflareShopRepository`, `BunSqliteRepository`, `BetterSqlite3Repository`
- `@shopware-ag/app-server-sdk`
