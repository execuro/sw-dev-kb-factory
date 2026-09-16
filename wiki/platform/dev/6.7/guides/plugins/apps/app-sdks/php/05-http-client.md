---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/05-http-client.md
title: HTTP-client
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/05-http-client.html
sourceHash: fd1226bd07b16289ef160914eb6aefd3575b1934
codeCheckedAgainst: "6.7.13.0"
keywords: ["ClientFactory", "SimpleHttpClient", "ShopResolver", "ShopRepositoryInterface", "AppConfiguration", "createClient", "resolveShop", "psr-18", "http client", "app php sdk", "admin api request", "oauth2 token", "mock client"]
summary: "Shopware App PHP SDK HTTP client: resolve the shop, create a PSR-18 client via ClientFactory (auto OAuth2 token), SimpleHttpClient helpers, mocking in tests."
lastBuilt: 2026-09-15
---
## What it is

The App PHP SDK (`shopware/app-php-sdk`) ships an HTTP client for sending requests from an app backend to a Shopware shop's Admin API. The client is bound to a resolved Shop entity and automatically fetches the shop's OAuth2 token and adds it to each request.

## When to use

When an app server needs to call the Admin API of the shop that sent a request (webhook, action button, lifecycle call) or of a shop loaded by ID from the shop repository.

## Key steps / config

1. Obtain the Shop entity: either resolve it from the incoming PSR-7 request with `\Shopware\App\SDK\Shop\ShopResolver` (constructed with a repository implementing `\Shopware\App\SDK\Shop\ShopRepositoryInterface`, e.g. modeled on `FileShopRepository`), or load it by ID from the `ShopRepository`. Symfony HttpFoundation requests must be converted to PSR-7 first.
2. Create the client with `Shopware\App\SDK\HttpClient\ClientFactory`:

```php
$shop = (new \Shopware\App\SDK\Shop\ShopResolver($repository))->resolveShop($psrRequest);
$httpClient = (new Shopware\App\SDK\HttpClient\ClientFactory())->createClient($shop);
$response = $httpClient->sendRequest($psrHttpRequest);
```

3. Optionally wrap it in `\Shopware\App\SDK\HttpClient\SimpleHttpClient\SimpleHttpClient`, a wrapper around the PSR-18 `ClientInterface`:

```php
$simpleClient = new \Shopware\App\SDK\HttpClient\SimpleHttpClient\SimpleHttpClient($httpClient);
$response = $simpleClient->get('https://shop.com/api/_info/version');
$response->ok();   // true when 200 <= status < 300
$body = $response->json();
$simpleClient->post('https://shop.com/api/_action/sync', ['entity' => 'product', 'payload' => [/* ... */]]);
```

`put`, `patch` and `delete` work the same way; responses also expose `getHeader()`.

4. Testing: `createClient()` accepts a PSR-18 `ClientInterface` as second argument, so a mock client can replace the real transport: `$clientFactory->createClient($shop, $myMockClient)`.

## Essential identifiers

- `Shopware\App\SDK\HttpClient\ClientFactory` / `createClient($shop, ?ClientInterface)`
- `Shopware\App\SDK\HttpClient\SimpleHttpClient\SimpleHttpClient` (`get`, `post`, `put`, `patch`, `delete`; response `ok()`, `json()`, `getHeader()`)
- `Shopware\App\SDK\Shop\ShopResolver::resolveShop()`
- `Shopware\App\SDK\Shop\ShopRepositoryInterface`
- `AppConfiguration`

## Gotchas

- The source's prose refers to `ClientFactory::factory` for the mock-client argument, but its code example calls `createClient($shop, $myMockClient)`; the SDK itself is not part of the installed Shopware packages, so this could not be checked here.
- The SDK expects PSR-7 requests; convert Symfony HttpFoundation requests before calling `resolveShop()`.

## Code check (6.7.13.0)
- unverified `Shopware\App\SDK\HttpClient\ClientFactory` — lives in shopware/app-php-sdk, outside the checked vendor roots
- unverified `Shopware\App\SDK\HttpClient\SimpleHttpClient\SimpleHttpClient` — app-php-sdk, out of scope
- unverified `Shopware\App\SDK\Shop\ShopResolver` — app-php-sdk, out of scope
- unverified `Shopware\App\SDK\Shop\ShopRepositoryInterface` — app-php-sdk, out of scope
- confirmed `/api/_info/version` — GET route exists in core Admin API — vendor/shopware/core/Framework/Api/Controller/InfoController.php:222
- confirmed `/api/_action/sync` — POST route exists in core Admin API — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
- confirmed `/api/oauth/token` — shop-side OAuth2 token endpoint the client authenticates against — vendor/shopware/core/Framework/Api/Controller/AuthController.php:33
