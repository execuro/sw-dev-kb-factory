---
id: platform/dev/6.7/guides/development/integrations-api/request-headers.md
title: Request Headers
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/request-headers.html
sourceHash: 365c38dec36241e5dd7636f86b65b5d820ba7212
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-language-id", "sw-version-id", "sw-inheritance", "sw-skip-trigger-flow", "sw-expect-packages", "sw-access-key", "sw-context-token", "sw-currency-id", "sw-include-seo-urls", "sw-app-integration-id", "sw-app-user-id", "PlatformRequest", "http headers", "api headers"]
summary: Shopware API request headers (sw-language-id, sw-inheritance, sw-skip-trigger-flow, sw-expect-packages, sw-app-user-id, ...) and what each one controls.
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md"]
---
## What it is

The `sw-*` HTTP headers control how the Shopware Admin API and Store API handle a request: language, entity version, inheritance, flow triggering, package expectations, context, currency, SEO URLs and app permissions. All names are constants on `Shopware\Core\PlatformRequest` (`HEADER_*`).

## When to use

- A client needs translated content, a specific order version or inherited variant data.
- A bulk import through `POST /api/_action/sync` must not fire flows.
- An integration must refuse to run against a shop with incompatible plugin or package versions.
- An app calls the API on behalf of a specific admin user.

## Key steps / config

| Header | Effect |
|---|---|
| `sw-language-id` | Return entities in this language instead of the system language |
| `sw-version-id` | Return this version of a versioned entity (e.g. orders) instead of the live record |
| `sw-inheritance: 1` | Apply parent-child inheritance (product variants) to returned data |
| `sw-skip-trigger-flow: 1` | Do not trigger flows (e.g. customer-created mails) for this request |
| `sw-expect-packages` | Comma-separated `package:constraint` pairs, Composer constraint syntax |
| `sw-access-key` | Sales channel access key that authenticates Store API requests |
| `sw-context-token` | Identifies the customer context in the Store API |
| `sw-currency-id` | Currency ID that prices are returned in |
| `sw-include-seo-urls: 1` | Include configured SEO URLs of products/categories in the response |
| `sw-app-integration-id` | Use the app's privileges for permission checks (set automatically by the Meteor Admin SDK) |
| `sw-app-user-id` | Run the request as a user, intersecting user and app permissions |

```bash
POST /api/_action/sync
--header 'sw-expect-packages: acme/erp-connector:^3.2,shopware/core:~6.7.0'
```

`sw-expect-packages` is checked against active plugin metadata first, then Composer's installed packages. If a package is missing or does not satisfy its constraint, the request is rejected with `417 Expectation Failed` before any data is processed.

## Essential identifiers

- `PlatformRequest::HEADER_LANGUAGE_ID`, `HEADER_VERSION_ID`, `HEADER_INHERITANCE`, `HEADER_SKIP_TRIGGER_FLOW`, `HEADER_EXPECT_PACKAGES`, `HEADER_ACCESS_KEY`, `HEADER_CONTEXT_TOKEN`, `HEADER_CURRENCY_ID`, `HEADER_INCLUDE_SEO_URLS`, `HEADER_APP_INTEGRATION_ID`, `HEADER_APP_USER_ID`
- Permission `app.all`

## Gotchas

- With `sw-language-id`, a plain translatable field such as `product.name` is `null` when no explicit translation exists for that language. The nested `translated` object always has values, with language inheritance applied. Display clients should read `product.translated.<field>`. See [Plain vs translated entity fields](platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md).
- The docs name the Store API auth header `sw-access-token`. That string does not exist in the code. The Store API reads `sw-access-key` (`PlatformRequest::HEADER_ACCESS_KEY`).
- `sw-expect-packages` is only evaluated on Admin API routes that require authentication. On unauthenticated routes, a non-empty header is rejected with 417 ("not supported on endpoints that do not require authentication"), because failure messages disclose installed versions.
- `sw-app-user-id` only takes effect together with `sw-app-integration-id`. The user must be an admin, hold `app.<appName>` or hold `app.all`. Otherwise a missing-privilege error is thrown.

## Code check (6.7.15.1)
- confirmed `PlatformRequest::HEADER_LANGUAGE_ID` — value sw-language-id — vendor/shopware/core/PlatformRequest.php:20
- confirmed `PlatformRequest::HEADER_VERSION_ID` — value sw-version-id — vendor/shopware/core/PlatformRequest.php:23
- confirmed `PlatformRequest::HEADER_INHERITANCE` — read by API context resolver — vendor/shopware/core/Framework/Routing/ApiRequestContextResolver.php:124
- confirmed `PlatformRequest::HEADER_SKIP_TRIGGER_FLOW` — parsed as boolean — vendor/shopware/core/Framework/Routing/ApiRequestContextResolver.php:69
- confirmed `PlatformRequest::HEADER_EXPECT_PACKAGES` — comma-separated package:constraint list — vendor/shopware/core/Framework/Api/EventListener/ExpectationSubscriber.php:89
- confirmed `ApiException::expectationNotSupported()` — 417 on routes without auth — vendor/shopware/core/Framework/Api/ApiException.php:206
- absent `sw-access-token` — docs name; no occurrence in code, Store API uses sw-access-key
- confirmed `PlatformRequest::HEADER_ACCESS_KEY` — value sw-access-key — vendor/shopware/core/PlatformRequest.php:19
- confirmed `PlatformRequest::HEADER_INCLUDE_SEO_URLS` — checked by Store API SEO resolver — vendor/shopware/core/Content/Seo/SalesChannel/StoreApiSeoResolver.php:74
- confirmed `app.all` — admin, app.<name> or app.all required for sw-app-user-id — vendor/shopware/core/Framework/Routing/ApiRequestContextResolver.php:483
