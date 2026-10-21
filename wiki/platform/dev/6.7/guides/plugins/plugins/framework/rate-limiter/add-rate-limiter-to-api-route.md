---
id: platform/dev/6.7/guides/plugins/plugins/framework/rate-limiter/add-rate-limiter-to-api-route.md
title: Add Rate Limiter to API Route
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/rate-limiter/add-rate-limiter-to-api-route.html
sourceHash: 4404c0500d0444aa8fe706bed605f78a1bea9f13
codeCheckedAgainst: "6.7.15.1"
keywords: ["RateLimiter", "ensureAccepted", "RateLimitExceededException", "RateLimiterCompilerPass", "shopware.api.rate_limiter", "rate_limiter.yaml", "time_backoff", "system_config", "PassConfig::TYPE_BEFORE_OPTIMIZATION", "rate limit", "throttling", "brute force protection", "store api route"]
summary: Register a custom rate limit via rate_limiter.yaml and a compiler pass, then call RateLimiter::ensureAccepted()/reset() in a Store API route.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/rate-limiter.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md"]
---
## What it is

How a plugin defines its own named rate limit and enforces it inside an API route (typically a Store API route) using the core `Shopware\Core\Framework\RateLimiter\RateLimiter` service, to slow down brute-force attempts. Policy configuration details live in [Rate limiter](platform/dev/6.7/guides/hosting/infrastructure/rate-limiter.md).

## When to use

You have an existing API route (see [Add Store API route](platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md)) and want to cap how often a client (e.g. per IP) can call it.

## Key steps / config

1. Create `<plugin root>/src/Resources/config/rate_limiter.yaml`. The root key is the unique limit name:

   ```yaml
   example_route:
       enabled: true
       policy: 'time_backoff'
   ```

   - `enabled` defaults to `true` if omitted (core also defaults `cache_pool` to `cache.rate_limiter` and `lock_factory` to `lock.factory`).
   - `policy`: Symfony's `fixed_window`, `sliding_window`, `token_bucket`, or Shopware's `time_backoff` / `system_config`. The two Shopware policies are only used when both `limits` and `reset` are set; otherwise the config is passed to the Symfony rate limiter factory.

2. Write a compiler pass `Swag\BasicExample\CompilerPass\RateLimiterCompilerPass` implementing `CompilerPassInterface` whose `process()` reads the `shopware.api.rate_limiter` parameter, merges `Yaml::parseFile(__DIR__ . '/../Resources/config/rate_limiter.yaml')` into it with `+=`, and writes it back with `setParameter()`.

3. Register it in the plugin class `build()` (after `parent::build($container)`) so it runs before the core pass that turns the parameter into limiter factories:

   ```php
   $container->addCompilerPass(new RateLimiterCompilerPass(), PassConfig::TYPE_BEFORE_OPTIMIZATION, 500);
   ```

4. Inject `Shopware\Core\Framework\RateLimiter\RateLimiter` into the route class (constructor argument).

5. In the route method call `$this->rateLimiter->ensureAccepted('example_route', $request->getClientIp());` — it consumes one attempt for that key and throws `Shopware\Core\Framework\RateLimiter\Exception\RateLimitExceededException` when the limit is exceeded.

6. After a successful action, call `$this->rateLimiter->reset('example_route', $request->getClientIp());` with the same key.

## Essential identifiers

- `Shopware\Core\Framework\RateLimiter\RateLimiter` — `ensureAccepted(string $route, string $key)`, `reset(string $route, string $key)`
- `Shopware\Core\Framework\RateLimiter\Exception\RateLimitExceededException`
- `shopware.api.rate_limiter` (container parameter)
- `Symfony\Component\DependencyInjection\Compiler\PassConfig::TYPE_BEFORE_OPTIMIZATION`, priority `500`
- policies: `time_backoff`, `system_config`, `fixed_window`, `sliding_window`, `token_bucket`

## Gotchas

- The plugin pass needs the higher priority; the core `RateLimiterCompilerPass` (registered without an explicit priority) builds the limiter factories from the parameter, and a limit merged in after it is never registered — `ensureAccepted()`/`reset()` then throw a "factory not found" exception for that name.
- The limit name passed to `ensureAccepted()`/`reset()` must match the YAML root key exactly.
- When limiting per sales channel, include the sales channel ID in the key (e.g. `$request->getClientIp() . '-' . $context->getSalesChannelId()`): persisted buckets keep the limits they were created with, so a shared key lets one channel's limits apply to all until the bucket expires. Use the same composed key for `reset()`.

## Version notes

- The docs describe an optional third `salesChannelId` argument to `ensureAccepted()` (limits of the `system_config` policy are then read from that channel's configuration), available from Shopware 6.7.16.0 and only positional until 6.8.0.0. The installed 6.7.15.1 signature has only `$route` and `$key`, so on this version use the composed key alone.

## Code check (6.7.15.1)
- corrected `RateLimiter::ensureAccepted()` — docs: optional third argument `salesChannelId`; installed signature is `(string $route, string $key)` — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:63
- confirmed `RateLimiter::reset()` — `(string $route, string $key)` — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:51
- confirmed `RateLimitExceededException` — returned by `RateLimiterException::limitExceeded()` — vendor/shopware/core/Framework/RateLimiter/RateLimiterException.php:22
- confirmed `shopware.api.rate_limiter` — parameter read by the core compiler pass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/RateLimiterCompilerPass.php:29
- confirmed `enabled` — defaults to `true` when the key is missing — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/RateLimiterCompilerPass.php:56
- confirmed `RateLimiterCompilerPass` — core pass added without explicit priority — vendor/shopware/core/Framework/Framework.php:132
- confirmed `time_backoff` — `TimeBackoffLimiter` when `limits` and `reset` are set — vendor/shopware/core/Framework/RateLimiter/RateLimiterFactory.php:65
- confirmed `system_config` — `SystemConfigLimiter` when `limits` and `reset` are set — vendor/shopware/core/Framework/RateLimiter/RateLimiterFactory.php:74
- unverified `PassConfig::TYPE_BEFORE_OPTIMIZATION` — vendor/symfony, out of scope
