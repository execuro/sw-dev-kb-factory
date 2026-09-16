---
id: platform/dev/6.6/guides/integrations-api/general-concepts/request-headers.md
title: Request Headers
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/integrations-api/general-concepts/request-headers.html
sourceHash: 7f69da2ed89bcac6ca76a0cbfcdaf7933840a14b
keywords: ["sw-language-id", "sw-version-id", "sw-inheritance", "sw-skip-trigger-flow", "sw-access-token", "sw-context-token", "sw-currency-id", "sw-include-seo-urls", "sw-app-integration-id", "request headers", "translated field"]
summary: "Reference of Shopware Admin/Store API request headers: language, version, inheritance, flow-skip, currency, SEO URLs, and app integration."
lastBuilt: 2026-09-15
---

## What it is

Reference of the custom `sw-*` request headers accepted by Shopware's Admin and Store
APIs to modify default request behavior.

## When to use

When a request needs a non-default language, a specific entity version, inherited
variant/product fields, to skip flow triggers during bulk import, currency conversion,
SEO URL inclusion, or app-integration permission overrides.

## Key steps / config

- `sw-language-id`: fetch entities translated into a specific language instead of the
  system language, e.g. `POST /api/search/product` with header
  `sw-language-id: <language id>`. A field with no explicit translation returns `null`;
  always read `product.translated.[value]` for a guaranteed fallback value.
- `sw-version-id`: return a specific version of a versioned entity (e.g. orders), e.g.
  `POST /api/search/order` with header `sw-version-id: <version id>`.
- `sw-inheritance`: apply parent-child inheritance (e.g. product variants inheriting
  parent fields), e.g. `POST /api/search/product` with header `sw-inheritance: 1`.
- `sw-skip-trigger-flow`: skip flow triggers (e.g. "send email on customer creation")
  during bulk operations like the sync API, e.g. `POST /api/_action/sync` with header
  `sw-skip-trigger-flow: 1`.
- `sw-access-token`: required Store API authentication header.
- `sw-context-token`: identifies a customer's context within the Store API.
- `sw-currency-id`: request prices converted to a specific currency, e.g.
  `POST /api/search/order` with header `sw-currency-id: <currency id>`.
- `sw-include-seo-urls`: include configured SEO URLs for products/categories in the
  response, e.g. `POST /api/search/product` with header `sw-include-seo-urls: 1`.
- `sw-app-integration-id`: overrides permission checks to use an app's privileges instead
  of the default; used internally by the Meteor Admin SDK's Repository Data Handling and
  handled automatically by the Administration.

## Essential identifiers

- `sw-language-id`, `sw-version-id`, `sw-inheritance`, `sw-skip-trigger-flow`,
  `sw-access-token`, `sw-context-token`, `sw-currency-id`, `sw-include-seo-urls`,
  `sw-app-integration-id`
- `product.translated.[value]`

## Gotchas

- A translatable field is only populated if an explicit translation exists; the
  `translated` object always contains a value (with fallback), so prefer
  `product.translated.[value]` over the bare field for reliability.
