---
id: platform/dev/6.7/guides/plugins/plugins/framework/rate-limiter/_index.md
title: Rate Limiter
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/rate-limiter/
sourceHash: 15ca1de8f0778acc2ef1717930cabefcf2c31d3b
codeCheckedAgainst: "6.7.15.1"
keywords: ["rate limiter", "rate limiting", "throttling", "brute force protection", "RateLimiter", "RateLimitExceededException", "shopware.api.rate_limiter", "time_backoff", "TimeBackoffLimiter", "login", "request limit", "api protection"]
summary: Section index for Shopware rate limiter guides - limiting request frequency per period to stop brute-force attacks and API misuse.
lastBuilt: 2026-10-21
---
## What it is

Section index for the plugin guides on the rate limiter. A rate limiter caps how many API requests may be processed within a time period, which prevents excessive usage and brute-force attacks, keeps the system stable, and allocates resources fairly.

## When to use

Open this section when a plugin needs to protect its own endpoints (e.g. login- or form-like routes) against repeated requests, or must adjust the limits Shopware applies to its own routes.

## Essential identifiers

Confirmed in the installed core (not named on this index page itself):

- `Shopware\Core\Framework\RateLimiter\RateLimiter` - service holding named limiters; constants such as `RateLimiter::LOGIN_ROUTE` (`login`), `GUEST_LOGIN`, `RESET_PASSWORD`, `CONTACT_FORM`.
- `Shopware\Core\Framework\RateLimiter\Exception\RateLimitExceededException` - thrown when a limit is hit.
- Config `shopware.api.rate_limiter.<name>` with keys `enabled`, `policy` (core uses `time_backoff`), `reset`, `limits` (`limit` + `interval`).

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

## Code check (6.7.15.1)
- confirmed `RateLimiter` — core class with named limiter constants — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:8
- confirmed `RateLimiter::LOGIN_ROUTE` — value 'login' — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:10
- confirmed `RateLimitExceededException` — extends RateLimiterException — vendor/shopware/core/Framework/RateLimiter/Exception/RateLimitExceededException.php:14
- confirmed `rate_limiter` — config block under shopware.api with login defaults — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:256
- confirmed `time_backoff` — default policy for login — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:259
- confirmed `TimeBackoffLimiter` — policy implementation — vendor/shopware/core/Framework/RateLimiter/Policy/TimeBackoffLimiter.php:23
