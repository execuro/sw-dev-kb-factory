---
id: platform/dev/6.7/guides/plugins/plugins/framework/rate-limiter/_index.md
title: Rate Limiter
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/rate-limiter/
sourceHash: 15ca1de8f0778acc2ef1717930cabefcf2c31d3b
codeCheckedAgainst: "6.7.13.0"
keywords: ["rate limiter", "RateLimiter", "rate limit", "throttling", "brute force protection", "api request limit", "shopware.api.rate_limiter", "ensureAccepted", "RateLimitExceededException", "too many requests", "framework", "plugin"]
summary: Overview of the Shopware rate limiter, which caps how many API requests a key may make per time period to prevent brute-force attacks and misuse.
lastBuilt: 2026-09-15
---
## What it is

The section overview for Shopware's rate limiter in plugin development. A rate limiter controls the rate or frequency at which API requests can be made: it limits the number of requests processed within a specified time period, preventing excessive usage and reducing the chance of brute-force attacks. It helps keep the system stable, protects against misuse and enforces fair resource allocation by applying predefined limits to incoming requests.

## When to use

Start here when a plugin's API route (for example a login-like or form-submission endpoint) needs protection against repeated requests, or when you need to find where rate-limit behaviour is configured and enforced in the installed core. The how-to for adding a limit to your own route lives in the child guide of this section.

## Essential identifiers

Confirmed in the installed core (not named in this overview page itself):

- `Shopware\Core\Framework\RateLimiter\RateLimiter` — the service that enforces limits, with `ensureAccepted(string $route, string $key)` and `reset(string $route, string $key)`.
- `shopware.api.rate_limiter` — container parameter holding all named limit configurations, read by the core compiler pass.
- `Shopware\Core\Framework\RateLimiter\Exception\RateLimitExceededException` — thrown when a limit is exceeded (HTTP 429).
- Built-in limit names exist as constants on `RateLimiter`, e.g. `LOGIN_ROUTE` (`login`), `RESET_PASSWORD`, `CONTACT_FORM`, `NEWSLETTER_FORM`, `CART_ADD_LINE_ITEM`.

## Code check (6.7.13.0)
- confirmed `RateLimiter` — service class exists in core — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:8
- confirmed `RateLimiter::ensureAccepted()` — consumes a token and throws when not accepted — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:61
- confirmed `RateLimiter::reset()` — resets the limiter for route and key — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:49
- confirmed `shopware.api.rate_limiter` — parameter read by the core compiler pass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/RateLimiterCompilerPass.php:29
- confirmed `RateLimitExceededException` — responds with HTTP_TOO_MANY_REQUESTS — vendor/shopware/core/Framework/RateLimiter/Exception/RateLimitExceededException.php:14
- confirmed `RateLimiter::LOGIN_ROUTE` — built-in limit name `login` — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:10
