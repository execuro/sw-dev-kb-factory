---
id: platform/func/tutorials-and-faq/flooding-prevention.md
title: Flooding Prevention
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/flooding-prevention
sourceHash: fad0225729e4ca5d7f44cc65adf55af6db641f569662f025825c9d5d82736dca
revision: {current: true, range: "current", swMax: null, swMin: null}
keywords: ["flooding prevention", "rate limiter", "shopware.yaml", "rate_limiter", "login throttling", "contact form limit", "password reset limit", "time_backoff", "brute force protection", "enable_stock_management", "lock.yaml"]
summary: "How Shopware throttles login, contact-form and password-reset requests, and how to configure limits via shopware.yaml rate_limiter policies."
lastBuilt: "2026-09-15"
---
## What it is
Describes how Shopware protects against flooding (excessive requests) by delaying repeated login, contact-form and password-reset attempts, and how to configure these limits.

## When to use
When diagnosing why login/contact-form/password-reset actions are being delayed, or when customizing the rate-limit thresholds for a shop.

## Key steps / config
- Login: after 10 failed attempts, 10s delay; after 15, 30s; after 20, 60s. Resets after a successful login or 24h without a failed attempt.
- Contact form: after 3 sends, 30s delay; after 5, 60s; after 10, 90s. Resets after 24h.
- Password reset: after 3 attempts, 30s delay; after 5, 60s; after 10, 90s. Resets after 24h.
- Configuration lives in `core/framework/resources/config/packages/shopware.yaml`; copy it to `config/packages/shopware.yaml` in the shop root to override it (note: new projects may only have a `lock.yaml` under `config/packages/` — create `shopware.yaml` there if missing).
- Functions covered by `shopware.api.rate_limiter`: `login` (storefront login), `guest_login` (guest login), `oauth` (admin login), `reset_password` (storefront password reset), `user_recovery` (admin password reset), `contact_form`.
- Disable a function by setting its `enabled` key to `false`. Example structure:
```yaml
shopware:
    api:
       rate_limiter:
            login:
                enabled: true
                policy: 'time_backoff'
                reset: '24 hours'
                limits:
                    - limit: 10
                      interval: '10 seconds'
```
- After editing, run `php bin/console cache:clear` for changes to take effect.

## Essential identifiers
Config path `shopware.api.rate_limiter`; keys `login`, `guest_login`, `oauth`, `reset_password`, `user_recovery`, `contact_form`; each entry has `enabled`, `policy` (`time_backoff`), `reset`, `limits` (`limit`, `interval`); file `config/packages/shopware.yaml`.

## Gotchas
If your project's `config/packages/` only contains `lock.yaml` and was never adjusted, you must create `shopware.yaml` yourself with these overrides — copying the core defaults file is not automatic.
