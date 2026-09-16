---
docType: developer
id: platform/dev/6.6/guides/plugins/plugins/framework/rate-limiter/add-rate-limiter-to-api-route.md
sourceHash: 1693226b4808f39cb81b54ccd61df6f3be7ef8dc
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/rate-limiter/add-rate-limiter-to-api-route.html
title: Add Rate Limiter to API Route
version: "6.6"
versions:
  - "6.6"
keywords: ["rate limiter", "RateLimiter", "ensureAccepted", "reset", "rate_limiter.yaml", "shopware.api.rate_limiter", "RateLimiterCompilerPass", "RateLimitExceededException", "fixed_window", "sliding_window", "token_bucket", "time_backoff", "compiler pass"]
summary: "How to configure and inject Shopware's RateLimiter service to protect a custom API route against brute-force requests."
lastBuilt: "2026-09-15"
---
## What it is
This guide shows how to secure an API route with a rate limit, reducing the risk of brute-force attacks, using Shopware's rate limiter framework.

## When to use
When a custom API route (e.g. a store-api route) needs to cap how often a client can call it, in addition to Shopware's existing rate limiters.

## Key steps / config
1. Create a plugin config file `rate_limiter.yaml` in `<plugin root>/src/Resources/config/`, keyed by a unique route name (e.g. `example_route`):
```yaml
// <plugin root>/src/Resources/config/rate_limiter.yaml
example_route:
    enabled: true
    policy: 'time_backoff'
```
   Each entry needs `enabled` (default `true`) and `policy` — one of `fixed_window`, `sliding_window`, `token_bucket`, `time_backoff`.
2. Merge this file into the container parameter `shopware.api.rate_limiter` via a compiler pass (`RateLimiterCompilerPass implements CompilerPassInterface`) that reads the existing parameter, merges in `Yaml::parseFile(...rate_limiter.yaml)`, and sets it back.
3. Register the compiler pass in the plugin's `build()` method using `Symfony\Component\DependencyInjection\Compiler\PassConfig::TYPE_BEFORE_OPTIMIZATION` with a higher priority (example uses `500`), otherwise it builds too late.
4. Inject `Shopware\Core\Framework\RateLimiter\RateLimiter` into the API route class.
5. Call `$this->rateLimiter->ensureAccepted('example_route', $request->getClientIp())` in the route method — arguments are the configured route name and a key (e.g. client IP). It throws `Shopware\Core\Framework\RateLimiter\Exception\RateLimitExceededException` if the limit is exceeded.
6. After a successful action, call `$this->rateLimiter->reset('example_route', $request->getClientIp())` to reset the limit for that key.

## Essential identifiers
- `Shopware\Core\Framework\RateLimiter\RateLimiter` (`ensureAccepted`, `reset`)
- `Shopware\Core\Framework\RateLimiter\Exception\RateLimitExceededException`
- Container parameter `shopware.api.rate_limiter`
- Config file `rate_limiter.yaml`, keys `enabled`, `policy`
- `Symfony\Component\DependencyInjection\Compiler\PassConfig::TYPE_BEFORE_OPTIMIZATION`
- Policies: `fixed_window`, `sliding_window`, `token_bucket`, `time_backoff`

## Gotchas
- The compiler pass must be added with `TYPE_BEFORE_OPTIMIZATION` and a sufficiently high priority, or it is built too late to affect `shopware.api.rate_limiter`.
