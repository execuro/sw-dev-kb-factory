---
docType: developer
id: platform/dev/6.6/guides/plugins/apps/app-signature-verification.md
sourceHash: d274ac2fcd29193fd45b59d96539b41d4f7c68cd
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-signature-verification.html
title: Signing & Verification in the App System
version: "6.6"
versions:
  - "6.6"
keywords: ["signature verification", "HMAC-SHA256", "shopware-shop-signature", "hash_hmac", "hash_equals", "RequestVerifier", "ResponseSigner", "app secret", "request forgery", "App PHP SDK", "Symfony Bundle", "signing responses"]
summary: "Shopware signs outgoing app requests with HMAC-SHA256 over query string or body; apps must verify and sign responses similarly."
lastBuilt: 2026-09-15
---
## What it is

Describes how Shopware signs requests sent to an app's backend, and how the app server should verify those requests and sign its responses.

## When to use

When implementing an app backend that receives requests from Shopware and must confirm they genuinely originate from Shopware and were not altered in transit.

## Key steps / config

Shopware signs every outgoing request using `HMAC-SHA256`, hashing either the query string (GET) or the request body (POST), keyed with the app secret. Shopware may add new parameters to the signed data without treating it as a breaking change, so verification should hash the whole query string or body rather than selecting individual parameters.

Manual PHP verification for GET requests: read the query string, extract and remove the `shopware-shop-signature` parameter, compute `hash_hmac('sha256', $queryString, $appSecret)`, and compare with `hash_equals()`. For POST requests, compute the HMAC over the raw request body and compare against the `shopware-shop-signature` header (rewind the body stream afterward so it can be read again).

To sign a response back to Shopware, compute `hash_hmac('sha256', $body, $appSecret)` over the response body and set it as the `shopware-shop-signature` header.

Using the App PHP SDK, `\Shopware\App\SDK\Authentication\RequestVerifier` verifies registration requests (e.g. `authenticateRegistrationRequest($request, new AppConfiguration(...))`), and `\Shopware\App\SDK\Authentication\ResponseSigner` signs responses (`$responseSigner->sign($response, $shop)`). The Symfony Bundle (`app-bundle-symfony`) handles both verification and signing automatically.

## Essential identifiers

- `hash_hmac('sha256', ..., $appSecret)`, `hash_equals()`
- `shopware-shop-signature` header/query parameter
- `Shopware\App\SDK\Authentication\RequestVerifier`
- `Shopware\App\SDK\Authentication\ResponseSigner`
- App PHP SDK, Symfony Bundle

## Gotchas

Shopware may add signature-generation parameters without it counting as a breaking change; apps not using the SDK/bundle must base verification on the entire query string or body, not on individually selected parameters. Avoid re-parsing and re-encoding the query string, since parameter order and URL-encoding can vary by language.
