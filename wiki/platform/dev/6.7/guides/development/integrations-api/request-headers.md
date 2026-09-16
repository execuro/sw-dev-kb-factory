---
id: platform/dev/6.7/guides/development/integrations-api/request-headers.md
title: Request Headers
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/request-headers.html
sourceHash: effea0f6d1c4259490af882d449dbda5cc65ead8
codeCheckedAgainst: "6.7.13.0"
keywords: ["request headers", "sw-language-id", "sw-version-id", "sw-inheritance", "sw-skip-trigger-flow", "sw-access-key", "sw-context-token", "sw-currency-id", "sw-include-seo-urls", "sw-app-integration-id", "sw-app-user-id", "PlatformRequest", "api headers", "translation header"]
summary: Shopware API request headers for language, entity version, inheritance, skipping flows, Store API auth/context, currency, SEO URLs and app permissions.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md"]
---
## What it is

Reference of the HTTP headers that control how the Shopware APIs handle language, entity versions, parent-child inheritance, flow triggering, Store API authentication and context, currency, SEO URLs and app permissions. Header names are defined as constants on `Shopware\Core\PlatformRequest`.

## When to use

When an API request must return a specific translation, order version or inherited variant data, when bulk-importing via the sync API without firing flows, or when an app acts on behalf of a user.

## Key steps / config

| Header | Constant | Effect |
|---|---|---|
| `sw-language-id` | `HEADER_LANGUAGE_ID` | Return entities in the given language instead of the system language |
| `sw-version-id` | `HEADER_VERSION_ID` | Read a specific entity version (e.g. orders); default is the most recent record |
| `sw-inheritance` | `HEADER_INHERITANCE` | Consider parent-child inheritance (products/variants); send `1` |
| `sw-skip-trigger-flow` | `HEADER_SKIP_TRIGGER_FLOW` | Do not trigger flows, e.g. on `POST /api/_action/sync` imports; send `1` |
| `sw-access-key` | `HEADER_ACCESS_KEY` | Authenticates Store API requests against a sales channel |
| `sw-context-token` | `HEADER_CONTEXT_TOKEN` | Identifies the customer context in the Store API |
| `sw-currency-id` | `HEADER_CURRENCY_ID` | Currency ID in which prices are returned |
| `sw-include-seo-urls` | `HEADER_INCLUDE_SEO_URLS` | Include configured SEO URLs for products/categories |
| `sw-app-integration-id` | `HEADER_APP_INTEGRATION_ID` | Use the app's privileges for permission checks; set automatically by the Meteor Admin SDK repository |
| `sw-app-user-id` | `HEADER_APP_USER_ID` | Run the request as a user; effective permissions = user permissions intersected with app permissions |

Example shape:

```bash
POST /api/search/product
--header 'sw-language-id: <language-id>'
--header 'sw-inheritance: 1'
```

## Essential identifiers

- `Shopware\Core\PlatformRequest` constants listed above
- `sw-language-id`, `sw-version-id`, `sw-inheritance`, `sw-skip-trigger-flow`, `sw-access-key`, `sw-context-token`, `sw-currency-id`, `sw-include-seo-urls`, `sw-app-integration-id`, `sw-app-user-id`
- `app.all` (privilege)

## Gotchas

- With `sw-language-id`, a translatable plain field (e.g. `product.name`) is `null` when no explicit translation exists; the nested `translated` object always holds a value with language inheritance applied. Display clients should read `product.translated.<field>`; use the plain field only in Admin/CRUD flows. See [Plain vs translated entity fields](platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md).
- The docs name the Store API auth header `sw-access-token`; that string does not exist in the installed code - the header is `sw-access-key`.
- In the installed core, `sw-include-seo-urls` is evaluated by `StoreApiSeoResolver`, which only acts on Store API responses.
- `sw-app-user-id` requires the user to be an admin, or to hold the app-specific privilege `app.<appName>` or `app.all`; otherwise a missing-privilege error is thrown.

## Code check (6.7.13.0)
- confirmed `PlatformRequest::HEADER_LANGUAGE_ID` — `sw-language-id` — vendor/shopware/core/PlatformRequest.php:20
- confirmed `PlatformRequest::HEADER_VERSION_ID` — `sw-version-id` — vendor/shopware/core/PlatformRequest.php:23
- confirmed `PlatformRequest::HEADER_INHERITANCE` — `sw-inheritance` — vendor/shopware/core/PlatformRequest.php:22
- confirmed `PlatformRequest::HEADER_SKIP_TRIGGER_FLOW` — read as boolean in the API context resolver — vendor/shopware/core/Framework/Routing/ApiRequestContextResolver.php:68
- absent `sw-access-token` — docs name it as Store API auth header; not found in installed code
- confirmed `PlatformRequest::HEADER_ACCESS_KEY` — actual Store API auth header `sw-access-key` — vendor/shopware/core/PlatformRequest.php:19
- confirmed `PlatformRequest::HEADER_CONTEXT_TOKEN` — `sw-context-token` — vendor/shopware/core/PlatformRequest.php:18
- confirmed `PlatformRequest::HEADER_CURRENCY_ID` — `sw-currency-id` — vendor/shopware/core/PlatformRequest.php:21
- confirmed `PlatformRequest::HEADER_INCLUDE_SEO_URLS` — checked only on Store API responses — vendor/shopware/core/Content/Seo/SalesChannel/StoreApiSeoResolver.php:69
- confirmed `app.all` — user privilege accepted for sw-app-user-id besides admin or app-specific privilege — vendor/shopware/core/Framework/Routing/ApiRequestContextResolver.php:483
