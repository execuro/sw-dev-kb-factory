---
id: platform/dev/6.7/guides/hosting/infrastructure/rate-limiter.md
title: Rate Limiter
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/rate-limiter.html
sourceHash: 3b52ff8dec15f246b16e6a675bd4f87a6fe6e087
codeCheckedAgainst: "6.7.15.1"
keywords: ["rate limiter", "shopware.api.rate_limiter", "time_backoff", "system_config", "sliding_window", "core.cart.lineItemAddLimit", "cart_add_line_item", "login", "oauth", "login_user", "oauth_client", "brute force", "throttling", "RateLimiter"]
summary: Default Shopware rate limiters (login, oauth, password reset, forms, cart) and how to override them under shopware.api.rate_limiter.
lastBuilt: 2026-10-21
---
## What it is

Shopware ships built-in rate limiters that throttle brute-force-prone routes (customer login, admin OAuth, password reset, contact/newsletter forms, adding line items). They are always active; `shopware.api.rate_limiter` in your `config/packages/shopware.yaml` is only needed to override the core defaults, and keys you set are merged into them.

## When to use

- Raising, lowering or disabling a default limit (e.g. for load tests or a B2B shop with many logins from one IP).
- Enabling the optional per-user / per-client login limiters.
- Defining a limiter for your own route in a plugin.

## Key steps / config

Core defaults (6.7.15.1, `shopware.api.rate_limiter` in core `shopware.yaml`):

| Limiter | Policy | Reset | Limits |
|---|---|---|---|
| `login`, `guest_login`, `oauth`, `notification`, `import_export_file_download` | `time_backoff` | 24 hours | 10/10s, 15/30s, 20/60s |
| `reset_password`, `user_recovery`, `contact_form`, `newsletter_form`, `newsletter_unsubscribe_form`, `revocation_request_form` | `time_backoff` | 24 hours | 3/30s, 5/60s, 10/90s |
| `cart_add_line_item` | `system_config` | 1 hour | `domain: 'core.cart.lineItemAddLimit'`, interval 60s |
| `mcp_admin_api` | `time_backoff` | 1 hour | 300/60s, 1000/10min |
| `mcp_store_api` | `time_backoff` | 1 hour | 120/60s, 600/10min |
| `app_shop_verify` | `sliding_window` | – | 60 per 60 minutes |

Override example (`config/packages/shopware.yaml`):

```yaml
shopware:
  api:
    rate_limiter:
      login:
        enabled: false
      oauth:
        enabled: true
        policy: 'time_backoff'
        reset: '24 hours'
        limits:
          - limit: 3
            interval: '10 seconds'
```

Per-limiter options: `enabled` (default true), `policy`, `limit`, `interval`, `reset`, `limits`, `rate`, `lock_factory` (default `lock.factory`), `cache_pool` (default `cache.rate_limiter`). `time_backoff` and `system_config` are only built when both `limits` and `reset` are set.

`system_config` policy: each `limits` entry has `domain` (a system config key) plus `interval` instead of `limit`. `core.cart.lineItemAddLimit` is set under Settings > Cart settings > "Maximum addable products to cart per minute through API"; default `0` = no limit.

Optional limiters (since 6.7.10.0): `login_user` (per email, any IP), `login_client` (per IP, any email), `oauth_user` (per username), `oauth_client` (per IP). They are not in the core defaults; configure them yourself.

A plugin defines its own limiter in `<plugin>/src/Resources/config/rate_limiter.yaml` with the same shape (`example_route:` → `enabled`, `policy`, `reset`, `limits`).

## Essential identifiers

- `shopware.api.rate_limiter`
- `Shopware\Core\Framework\RateLimiter\RateLimiter` (constants such as `LOGIN_ROUTE`, `OAUTH`, `CART_ADD_LINE_ITEM`, `LOGIN_USER`, `OAUTH_CLIENT`)
- `time_backoff`, `system_config`, `sliding_window`
- `core.cart.lineItemAddLimit`

## Gotchas

- The default `cart_add_line_item` limit is `0`, so it enforces nothing until configured. Its key is product + client IP + sales channel.
- A sales-channel value of `0` or empty falls back to the global value and cannot lift a global limit; changed values apply once the key's bucket expires (one hour after its last counted request).
- The docs table omits `import_export_file_download`, which is active in core defaults.

## Version notes

- Rate limiting exists since 6.4.6.0; `notification` since 6.4.8.0, `newsletter_form` 6.4.16.0, `cart_add_line_item` 6.4.18.0; `revocation_request_form`, `newsletter_unsubscribe_form`, `app_shop_verify` 6.7.9.0.
- Docs date `mcp_admin_api`/`mcp_store_api` to 6.8.0.0, but both are already in the 6.7.15.1 defaults.
- From 6.7.16.0 a limiter can resolve its limit per sales channel; the `cart_add_line_item` key changes then, so counters restart once after updating.

## Code check (6.7.15.1)
- confirmed `rate_limiter` — config node with enabled/policy/limits/reset/cache_pool — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:180
- confirmed `login` — time_backoff, reset 24 hours, 10/15/20 limits — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:257
- confirmed `reset_password` — 3/5/10 at 30/60/90 seconds — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:301
- confirmed `cart_add_line_item` — system_config policy, reset 1 hours — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:378
- confirmed `core.cart.lineItemAddLimit` — domain of cart_add_line_item — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:383
- corrected `mcp_admin_api` — docs: since 6.8.0.0; present in 6.7.15.1 defaults — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:385
- corrected `mcp_store_api` — docs: since 6.8.0.0; present in 6.7.15.1 defaults — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:396
- confirmed `app_shop_verify` — sliding_window, 60 per 60 minutes — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:409
- corrected `import_export_file_download` — docs: not listed; enabled by default — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:279
- confirmed `RateLimiter::LOGIN_USER` — optional login_user limiter name — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:12
