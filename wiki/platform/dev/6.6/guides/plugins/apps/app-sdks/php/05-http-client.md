---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/php/05-http-client.md
title: HTTP-client
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/php/05-http-client.html
sourceHash: fd1226bd07b16289ef160914eb6aefd3575b1934
keywords: ["ClientFactory", "SimpleHttpClient", "ShopResolver", "sendRequest", "OAuth2", "psr-18", "testing", "mock client", "sync api", "_action/sync"]
summary: "PHP App SDK HTTP client: ClientFactory::createClient(shop) attaches the OAuth2 token; SimpleHttpClient wraps PSR-18 for get/post/put/patch/delete."
lastBuilt: "2026-09-15"
---
## What it is

Documents the SDK's HTTP client for calling the Shopware server API, plus `SimpleHttpClient`, a simplified PSR-18 wrapper. The client automatically fetches and attaches the shop's OAuth2 token.

## Key steps / config

```php
$shopResolver = new \Shopware\App\SDK\Shop\ShopResolver($repository);
$shop = $shopResolver->resolveShop($psrRequest);

$clientFactory = new Shopware\App\SDK\HttpClient\ClientFactory();
$httpClient = $clientFactory->createClient($shop);

$response = $httpClient->sendRequest($psrHttpRequest);
```

`SimpleHttpClient` wraps a PSR-18 client for a simpler API:

```php
$simpleClient = new \Shopware\App\SDK\HttpClient\SimpleHttpClient\SimpleHttpClient($httpClient);

$response = $simpleClient->get('https://shop.com/api/_info/version');
$response->ok();
$body = $response->json();

$simpleClient->post('https://shop.com/api/_action/sync', [
    'entity' => 'product',
    'offset' => 0,
    'total' => 100,
    'payload' => [ ['id' => '123', 'name' => 'Foo'] ],
]);
```

For testing, `ClientFactory::factory` accepts a PSR-18 `ClientInterface` as a second argument to swap in a mock client.

## Essential identifiers

- `\Shopware\App\SDK\HttpClient\ClientFactory`
- `\Shopware\App\SDK\HttpClient\SimpleHttpClient\SimpleHttpClient`
- `ClientFactory::createClient()`
- routes: `/api/_info/version`, `/api/_action/sync`
