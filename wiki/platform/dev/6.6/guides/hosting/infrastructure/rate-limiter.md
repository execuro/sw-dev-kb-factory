---
id: platform/dev/6.6/guides/hosting/infrastructure/rate-limiter.md
title: Rate Limiter
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/infrastructure/rate-limiter.html
sourceHash: d0c17b6cdb44f1c06bfc130cc2a94be0d2e5aae9
keywords: ["rate limiter", "shopware.api.rate_limiter", "login rate limit", "oauth rate limit", "time_backoff policy", "brute force protection", "reset_password", "contact_form", "guest_login", "user_recovery", "rate_limiter.yaml"]
summary: "Documents shopware.api.rate_limiter, its default limiters (login, oauth, etc.), and the time_backoff throttling policy."
lastBuilt: 2026-09-15
---
## What it is
Describes Shopware's built-in API rate limiter, which throttles brute-force-prone endpoints like login and password reset, available since Shopware 6.4.6.0.

## When to use
Use it when you need to adjust or disable the default rate limits for authentication, password reset, or contact-form endpoints.

## Key steps / config
Configuration lives under `shopware.api.rate_limiter` in `config/packages/shopware.yaml`. Default limiters:
- `login` — Storefront/Store-API customer authentication
- `guest_login` — Storefront/Store-API guest authentication after ordering
- `oauth` — API OAuth authentication / Administration login
- `reset_password` — Storefront/Store-API password reset
- `user_recovery` — Administration user password recovery
- `contact_form` — Storefront/Store-API contact form

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

The `time_backoff` policy (used by `oauth` above) throttles progressively: e.g. 10 seconds after 3 requests, 60 seconds from the 5th request onward, resetting after 24 hours if there are no further requests. The same shape applies to custom routes configured via a plugin's `src/Resources/config/rate_limiter.yaml`.

## Essential identifiers
- `shopware.api.rate_limiter`
- `login`, `guest_login`, `oauth`, `reset_password`, `user_recovery`, `contact_form`
- `time_backoff` policy

## Version notes
Available starting with Shopware 6.4.6.0.
