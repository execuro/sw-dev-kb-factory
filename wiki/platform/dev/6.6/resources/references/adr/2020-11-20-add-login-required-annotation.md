---
id: platform/dev/6.6/resources/references/adr/2020-11-20-add-login-required-annotation.md
title: Add the login required annotation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-11-20-add-login-required-annotation.html
sourceHash: b1b5df6bb9eaa391485ccabf9d8f01dbcb545735
keywords: ["LoginRequired", "@LoginRequired", "allowGuest", "CustomerNotLoggedInException", "SalesChannelContext", "store-api", "storefront", "annotation", "routing", "login required", "Core\\Framework\\Routing\\Annotation\\LoginRequired"]
summary: "ADR introducing the @LoginRequired routing annotation to guard store-api/storefront routes that need a logged-in customer."
lastBuilt: "2026-09-15"
---
## What it is

An architecture decision record introducing a routing annotation, `\Core\Framework\Routing\Annotation\LoginRequired`, so `store-api`/`storefront` routes that depend on a logged-in customer declare that requirement consistently instead of checking it ad hoc.

## When to use

Apply it to any `store-api`/`storefront` route whose handling depends on `SalesChannelContext` knowing whether the current customer is logged in.

## Key steps / config

- `@LoginRequired` validates that the `SalesChannelContext` has a Customer and returns success; otherwise it throws `CustomerNotLoggedInException`.
- `@LoginRequired(allowGuest=true)` validates that the `SalesChannelContext` has a Customer while also allowing guest customers; otherwise it throws `CustomerNotLoggedInException`.

```php
/**
 * @Since("6.0.0.0")
 * @LoginRequired()
 * @Route(path="/store-api/v{version}/account/logout", name="store-api.account.logout", methods={"POST"})
 */
```

## Essential identifiers

- `@LoginRequired`, `@LoginRequired(allowGuest=true)`
- `\Core\Framework\Routing\Annotation\LoginRequired`
- `CustomerNotLoggedInException`
- `SalesChannelContext`

## Gotchas

Every new `store-api`/`storefront` route that requires a logged-in customer must use the `LoginRequired` annotation from now on; if it is absent, the route is treated as accessible without login.
