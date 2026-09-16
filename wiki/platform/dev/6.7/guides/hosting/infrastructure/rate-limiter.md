---
id: platform/dev/6.7/guides/hosting/infrastructure/rate-limiter.md
title: Rate Limiter
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/rate-limiter.html
sourceHash: 7a9f38b0265c130f88b5997e4d952c060d8fe07f
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware.api.rate_limiter", "time_backoff", "system_config", "sliding_window", "login", "oauth", "cart_add_line_item", "core.cart.lineItemAddLimit", "login_user", "oauth_client", "RateLimiter", "brute force", "throttling", "rate limit"]
summary: Shopware 6.7 default rate limiters (login, oauth, password reset, forms, cart, MCP) and how to override them under shopware.api.rate_limiter.
lastBuilt: 2026-09-15
---
## What it is

Shopware ships always-active rate limiters that throttle brute-force-prone endpoints (login, password reset, forms, cart). Defaults live in core `Framework/Resources/config/packages/shopware.yaml` under `shopware.api.rate_limiter`; your project `shopware.yml` only overrides them.

## When to use

Raising, lowering or disabling a limit, enabling the optional per-user / per-IP login limiters, or adding a limiter for your own route.

## Key steps / config

Installed defaults (6.7.13.0), `limit / interval`:

| Limiter | Policy | Reset | Limits |
|---|---|---|---|
| `login`, `guest_login`, `oauth`, `notification` | `time_backoff` | 24 hours | 10/10s, 15/30s, 20/60s |
| `reset_password`, `user_recovery`, `contact_form`, `newsletter_form`, `revocation_request_form`, `newsletter_unsubscribe_form` | `time_backoff` | 24 hours | 3/30s, 5/60s, 10/90s |
| `cart_add_line_item` | `system_config` | 1 hour | limit from `core.cart.lineItemAddLimit`, interval 60s |
| `mcp_admin_api` (per OAuth token) | `time_backoff` | 1 hour | 300/60s, 1000/10min |
| `mcp_store_api` (per context token) | `time_backoff` | 1 hour | 120/60s, 600/10min |
| `app_shop_verify` | `sliding_window` | — | 60 / 60 minutes |

Override in `config/packages/shopware.yaml` — keys merge into the defaults, so set only what changes:

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
          - limit: 5
            interval: '60 seconds'
```

Per-limiter keys accepted by the config tree: `enabled` (default `true`), `policy`, `limit`, `interval`, `reset`, `limits` (list), `rate` (`interval`, `amount`), `cache_pool` (default `cache.rate_limiter`), `lock_factory` (default `lock.factory`).

`time_backoff` (Shopware's own policy): throttle in steps — e.g. after 3 requests wait 10 seconds, from 5 requests always 60 seconds; the counter resets after `reset` with no further requests.

Optional limiters, not in the defaults and only enforced once you define them under `shopware.api.rate_limiter`:
- `login_user` — customer login per email, regardless of IP
- `login_client` — customer login per IP, regardless of email
- `oauth_user` — API OAuth / Administration login per username
- `oauth_client` — API OAuth / Administration login per IP

## Essential identifiers

- `shopware.api.rate_limiter`
- policies `time_backoff`, `system_config`, `sliding_window`
- limiter names above; `core.cart.lineItemAddLimit`
- `Shopware\Core\Framework\RateLimiter\RateLimiter` (service `shopware.rate_limiter`)

## Gotchas

- The docs show the `time_backoff` example as a plugin file `src/Resources/config/rate_limiter.yaml`; no loader for such a file was found in installed core — limiters are registered from the `shopware.api.rate_limiter` parameter.
- Default values change between versions; the core `shopware.yaml` of the running version is authoritative.

## Version notes

- Rate limiting exists since 6.4.6.0 (`login`, `guest_login`, `oauth`, `reset_password`, `user_recovery`, `contact_form`); `notification` 6.4.8.0; `newsletter_form` 6.4.16.0; `cart_add_line_item` 6.4.18.0; `revocation_request_form`, `newsletter_unsubscribe_form`, `app_shop_verify` 6.7.9.0; optional `login_user`/`login_client`/`oauth_user`/`oauth_client` 6.7.10.0.
- Docs list `mcp_admin_api`/`mcp_store_api` as 6.8.0.0, but both are already defaults in installed 6.7.13.0.

## Code check (6.7.13.0)
- confirmed `rate_limiter` — config node under api, enabled default true, cache_pool cache.rate_limiter — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:176
- confirmed `login` — time_backoff, 24 hours, 10/15/20 steps — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:238
- confirmed `reset_password` — 3/5/10 steps over 30/60/90 seconds — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:271
- confirmed `cart_add_line_item` — system_config policy, domain core.cart.lineItemAddLimit — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:348
- corrected `mcp_admin_api` — docs: since 6.8.0.0; present in 6.7.13.0 defaults — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:355
- corrected `mcp_store_api` — docs: since 6.8.0.0; present in 6.7.13.0 defaults — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:366
- confirmed `app_shop_verify` — sliding_window, 60 per 60 minutes — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:379
- confirmed `login_user` — constant exists, no default config entry — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:12
- confirmed `RateLimiter::ensureAcceptedIfConfigured()` — skips limiters without a registered factory — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:70
- unverified `rate_limiter.yaml` — plugin file loader not found in core; not confirmed as a supported location
