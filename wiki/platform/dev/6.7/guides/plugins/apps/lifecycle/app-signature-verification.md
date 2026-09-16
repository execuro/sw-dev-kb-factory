---
id: platform/dev/6.7/guides/plugins/apps/lifecycle/app-signature-verification.md
title: Signing & Verification in the App System
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/app-signature-verification.html
sourceHash: 4abef8f9051ef49a7c286da324d5c90b05a990c4
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-shop-signature", "shopware-app-signature", "hmac-sha256", "hash_hmac", "hash_equals", "RequestVerifier", "ResponseSigner", "RequestSigner", "QuerySigner", "app secret", "request verification", "response signing", "app server security"]
summary: "App system HMAC-SHA256 signing: verify shopware-shop-signature on incoming shop requests, sign app responses with shopware-app-signature."
lastBuilt: 2026-09-15
---
## What it is

Shopware signs every request it sends to an app server with an HMAC-SHA256 signature keyed with the app secret. The app verifies that signature to confirm origin and integrity, and must itself sign its responses so Shopware can verify them.

## When to use

Building an app backend that receives registration confirmations, webhooks, action buttons, module/iframe loads or other shop-to-app calls, and that returns responses Shopware checks.

## Key steps / config

### Verify incoming requests

- **GET requests (URLs opened by the shop):** the signature is a query parameter `shopware-shop-signature`. Remove it from the raw query string (do not re-parse/re-encode — order and encoding differ between languages), then compare:
  ```php
  $signature = hash_hmac('sha256', $queryString, $appSecret);
  $valid = hash_equals($signature, $compare);
  ```
- **POST requests:** the signature is the `shopware-shop-signature` header; the HMAC covers the raw request body. Rewind the PSR-7 body stream after reading it:
  ```php
  $signature = hash_hmac('sha256', $request->getBody()->getContents(), $appSecret);
  $request->getBody()->rewind();
  $valid = hash_equals($signature, $request->getHeader('shopware-shop-signature')[0]);
  ```
- Base the calculation on the **entire** query string or body — Shopware may add signed parameters without treating it as a breaking change.

### Sign responses

Compute `hash_hmac('sha256', $body, $shopSecret)` over the response body and set it as the `shopware-app-signature` header (`$response->withHeader('shopware-app-signature', $signature)`), rewinding the body stream after reading.

### SDK / bundle alternatives

- App PHP SDK: `\Shopware\App\SDK\Authentication\RequestVerifier` (e.g. `authenticateRegistrationRequest($request, new AppConfiguration('AppName', 'AppSecret', 'register-confirm-url'))`) and `Shopware\App\SDK\Authentication\ResponseSigner` (`$responseSigner->sign($response, $shop)`).
- Symfony app bundle: verification and signing happen automatically.

## Essential identifiers

- `shopware-shop-signature` — query parameter (GET) or header (POST) sent by the shop
- `shopware-app-signature` — response header the app must set
- `Shopware\Core\Framework\App\Hmac\RequestSigner` — core signer (`SHOPWARE_SHOP_SIGNATURE`, `SHOPWARE_APP_SIGNATURE`)
- `\Shopware\App\SDK\Authentication\RequestVerifier`, `Shopware\App\SDK\Authentication\ResponseSigner` — App PHP SDK
- `hash_hmac('sha256', ...)`, `hash_equals()`

## Gotchas

- Core signs POST requests only when the body is non-empty; a POST without body carries no signature header.
- The signed GET query contains `shop-id`, `shop-url`, `timestamp`, `sw-version`, `app-version`, `in-app-purchases`, `sw-context-language`, `sw-user-language`, `sw-user-id` in the installed code — more than older docs list; never whitelist parameters.
- On re-registration the confirmation request additionally carries `shopware-shop-signature-previous`, signed with the current (old) secret, next to `shopware-shop-signature` signed with the new one.
- The response is verified with `hash_equals` against the HMAC of the body; a missing `shopware-app-signature` header fails verification.
- The source's SDK response example mixes `MockShop` and `Shop`; only the `sign($response, $shop)` call is relevant.

## Code check (6.7.13.0)
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — value `shopware-shop-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `RequestSigner::SHOPWARE_APP_SIGNATURE` — value `shopware-app-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `RequestSigner::signRequest()` — header added only for POST with non-empty body — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:17
- confirmed `RequestSigner::isResponseAuthentic()` — requires `shopware-app-signature` header, compared with hash_equals — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:34
- confirmed `RequestSigner::signPayload()` — hash_hmac with default algorithm sha256 — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:48
- confirmed `QuerySigner::signUri()` — GET query signed and appended as `shopware-shop-signature` query value — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:34
- confirmed `shopware-shop-signature-previous` — extra header on re-registration confirmation — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:138
- unverified `RequestVerifier` — App PHP SDK class, not in vendor/shopware scope
- unverified `ResponseSigner` — App PHP SDK class, not in vendor/shopware scope
