---
id: platform/dev/6.7/guides/plugins/apps/lifecycle/app-signature-verification.md
title: "Signing & Verification in the App System"
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/app-signature-verification.html
sourceHash: 3f64d5c3d4f1e86aaa4b86720515978505be77e1
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-shop-signature", "shopware-app-signature", "shopware-shop-signature-previous", "hmac-sha256", "hash_hmac", "RequestVerifier", "ResponseSigner", "app secret", "request signing", "signature verification", "re-registration", "secret rotation", "app php sdk"]
summary: "HMAC-SHA256 signing of Shopware-to-app requests and app responses: shopware-shop-signature, shopware-app-signature and re-registration headers."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md"]
---
## What it is

Shopware signs every outgoing request to an app server with an HMAC-SHA256 signature computed with the app secret — over the query string for `GET` requests, over the request body for `POST` requests. The app verifies this signature, and in turn signs its responses so Shopware can verify they come from the app server.

## When to use

When building an app backend that receives registration, webhook, action-button, iframe/module or other requests from a shop, and must return signed responses (e.g. registration, payment responses). Not needed when using the App PHP SDK or the Symfony app bundle, which verify and sign automatically.

## Key steps / config

1. **GET requests (query-signed):** take the raw query string, read `shopware-shop-signature` from it, strip `&shopware-shop-signature=<value>` from the raw string, then compute `hash_hmac('sha256', $queryString, $appSecret)` and compare with `hash_equals()`. Do not re-parse and re-encode the query string — parameter order and URL encoding differ between languages.
2. **POST requests (body-signed):** compute `hash_hmac('sha256', $request->getBody()->getContents(), $appSecret)`, rewind the body stream, compare with the `shopware-shop-signature` header via `hash_equals()`.
3. **Sign responses:** compute `hash_hmac('sha256', $body, $shopSecret)` over the response body and set it as the `shopware-app-signature` response header.
4. **App PHP SDK:** `\Shopware\App\SDK\Authentication\RequestVerifier` (e.g. `authenticateRegistrationRequest($request, new AppConfiguration('AppName', 'AppSecret', 'register-confirm-url'))`) for verification; `Shopware\App\SDK\Authentication\ResponseSigner::sign($response, $shop)` for signing.
5. Base verification on the whole query string / whole body, never on a selection of parameters — Shopware may add signed parameters without treating it as a breaking change.

### Re-registration (secret rotation, shop-ID change)

Both handshake requests carry a second signature; validate both with the same HMAC check:

| request | header | signed with |
|---|---|---|
| registration `GET` (query) | `shopware-app-signature` | app identity secret (manifest `<setup><secret>` for private apps) |
| registration `GET` (query) | `shopware-shop-signature` | app secret the shop thinks the app currently holds |
| confirmation `POST` (body) | `shopware-shop-signature` | new secret the app returned in the handshake |
| confirmation `POST` (body) | `shopware-shop-signature-previous` | secret held before this re-registration |

Both `shopware-shop-signature` variants are absent on a first registration. See [app registration setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md) for the rotation procedure.

## Essential identifiers

- Headers / query param: `shopware-shop-signature`, `shopware-app-signature`, `shopware-shop-signature-previous`
- Algorithm: HMAC-SHA256 (`hash_hmac('sha256', ...)`)
- SDK: `Shopware\App\SDK\Authentication\RequestVerifier`, `Shopware\App\SDK\Authentication\ResponseSigner`
- Core: `Shopware\Core\Framework\App\Hmac\RequestSigner`, `Shopware\Core\Framework\App\Hmac\QuerySigner`

## Gotchas

- Rewind PSR-7 body streams after reading them, or later reads get an empty body.
- Shopware treats a response as authentic only if it carries `shopware-app-signature` matching the HMAC of the body.
- The signed query string includes more than `shop-id`/`shop-url`/`timestamp` (e.g. `sw-version`, `app-version`, `in-app-purchases`, language and user IDs) — another reason to verify over the raw string.

## Code check (6.7.15.1)
- confirmed `RequestSigner::SHOPWARE_APP_SIGNATURE` — value `shopware-app-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — value `shopware-shop-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `RequestSigner::signRequest()` — only POST requests with a non-empty body get the body signature header — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:17
- confirmed `RequestSigner::isResponseAuthentic()` — response without `shopware-app-signature` is rejected; compared with hash_equals — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:34
- confirmed `RequestSigner::signPayload()` — hash_hmac with default algorithm sha256 — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:48
- confirmed `QuerySigner::signUri()` — GET URLs signed over the query string, appended as `shopware-shop-signature` — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:34
- confirmed `shopware-app-signature` — private-app registration GET signed over query with the manifest secret — vendor/shopware/core/Framework/App/Lifecycle/Registration/PrivateHandshake.php:44
- confirmed `shopware-shop-signature` — added to registration GET only when a current app secret exists (re-registration) — vendor/shopware/core/Framework/App/Lifecycle/Registration/PrivateHandshake.php:51
- confirmed `shopware-shop-signature-previous` — confirmation POST carries it only on re-registration, signed with the current secret — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:253
- unverified `RequestVerifier` — App PHP SDK class, not part of the installed Shopware packages
