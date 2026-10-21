---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/05-http-client.md
title: HTTP-client
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/05-http-client.html
sourceHash: fd1226bd07b16289ef160914eb6aefd3575b1934
codeCheckedAgainst: "6.7.15.1"
keywords: ["ClientFactory", "createClient", "SimpleHttpClient", "ShopResolver", "ShopRepository", "/api/_info/version", "/api/_action/sync", "/api/oauth/token", "psr-18", "admin api client", "oauth2 token", "app php sdk"]
summary: PHP App SDK ClientFactory::createClient() builds a PSR-18 client with automatic OAuth2 token for a shop; SimpleHttpClient adds get/post/put/patch/delete.
lastBuilt: 2026-10-21
---
## What it is

The PHP App SDK's HTTP client for calling a shop's Admin API from the app backend. It fetches the shop's OAuth2 token automatically and adds it to each request.

## When to use

Your app backend needs to read or write data in a registered shop (e.g. query the version, run a sync).

## Key steps / config

1. Get the shop: from the current request via `$shopResolver->resolveShop($psrRequest)` (`\Shopware\App\SDK\Shop\ShopResolver`), or by ID from the `ShopRepository`.
2. Create the PSR-18 client:

```php
$clientFactory = new Shopware\App\SDK\HttpClient\ClientFactory();
$httpClient = $clientFactory->createClient($shop);
$response = $httpClient->sendRequest($psrHttpRequest);
```

3. Optionally wrap it in `\Shopware\App\SDK\HttpClient\SimpleHttpClient\SimpleHttpClient($httpClient)`, which offers `get`, `post`, `put`, `patch`, `delete`. Its response has `getHeader()`, `ok()` (true when 200 <= status < 300) and `json()` (decoded body).
4. Example targets: `GET /api/_info/version`, `POST /api/_action/sync`. The sync body is a map of operations, each with `entity`, `action` and `payload`:

```json
{ "write-product": { "entity": "product", "action": "upsert", "payload": [ { "id": "...", "name": "Foo" } ] } }
```

5. Testing: pass a mock PSR-18 `ClientInterface` as the second argument — `$clientFactory->createClient($shop, $myMockClient);`.

## Essential identifiers

- `Shopware\App\SDK\HttpClient\ClientFactory` — `createClient($shop, ?ClientInterface)`
- `\Shopware\App\SDK\HttpClient\SimpleHttpClient\SimpleHttpClient` — `get`, `post`, `put`, `patch`, `delete`; response `ok()`, `json()`
- Admin API routes `/api/oauth/token`, `/api/_info/version`, `/api/_action/sync`

## Gotchas

- The source's sync example posts a flat object (`entity`, `offset`, `total`, `payload`). Shopware 6.7.15.1 iterates the top-level keys as operations and rejects a non-array value with "Invalid payload format. Expected an array of operations." — wrap the operation under a key and give it an `action`.
- The testing section names `ClientFactory::factory` in prose, while its code calls `createClient`; the code example is what the SDK calls.

## Code check (6.7.15.1)
- unverified `Shopware\App\SDK\HttpClient\ClientFactory` — shopware/app-php-sdk package, outside the checked roots
- unverified `\Shopware\App\SDK\HttpClient\SimpleHttpClient\SimpleHttpClient` — app-php-sdk package, out of scope
- unverified `ClientFactory::factory` — docs prose name, app-php-sdk package, out of scope
- confirmed `/api/oauth/token` — Admin API token route the client authenticates against — vendor/shopware/core/Framework/Api/Controller/AuthController.php:38
- confirmed `/api/_info/version` — GET route api.info.shopware.version — vendor/shopware/core/Framework/Api/Controller/InfoController.php:229
- confirmed `/api/_action/sync` — POST route api.action.sync — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
- corrected `SyncController::sync()` — docs: flat body with entity/offset/total/payload; code expects a map of operation arrays — vendor/shopware/core/Framework/Api/Controller/SyncController.php:44
- confirmed `SyncOperation::createFromArray()` — reads entity, action, payload, criteria per operation — vendor/shopware/core/Framework/Api/Sync/SyncOperation.php:122
