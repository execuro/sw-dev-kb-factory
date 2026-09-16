---
id: platform/dev/6.7/guides/plugins/plugins/framework/rate-limiter/add-rate-limiter-to-api-route.md
title: Add Rate Limiter to API Route
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/rate-limiter/add-rate-limiter-to-api-route.html
sourceHash: 4547cbaf3ecb6dcfcab892fa6d029c11921d4acd
codeCheckedAgainst: "6.7.13.0"
keywords: ["rate limiter", "RateLimiter", "ensureAccepted", "reset", "RateLimitExceededException", "shopware.api.rate_limiter", "rate_limiter.yaml", "RateLimiterCompilerPass", "PassConfig::TYPE_BEFORE_OPTIMIZATION", "time_backoff", "brute force", "store api route", "throttle"]
summary: "Plugin rate limit: rate_limiter.yaml merged into shopware.api.rate_limiter via compiler pass, enforced with RateLimiter ensureAccepted()/reset()."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/rate-limiter.md", "platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How a plugin defines its own named rate limit and enforces it inside an API route with Shopware's `RateLimiter` service, to reduce the risk of brute-force attacks. Builds on the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md), [Dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) and an existing route ([Add Store API route](platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md)). Rate limiter configuration in general: [Rate limiter](platform/dev/6.7/guides/hosting/infrastructure/rate-limiter.md).

## When to use

A custom Store API/API route (login-like, form submission) must be limited per key, e.g. per client IP.

## Key steps / config

1. Create `<plugin root>/src/Resources/config/rate_limiter.yaml`. The root key is the unique limit name (here `example_route`). Keys: `enabled` (default `true`) and `policy` — `fixed_window`, `sliding_window`, `token_bucket` (Symfony policies, which need their own keys such as `limit`/`interval`/`rate`) or `time_backoff`. The installed factory only builds the time-backoff limiter when `limits` and `reset` are also set:
   ```yaml
   example_route:
       enabled: true
       policy: 'time_backoff'
       reset: ...
       limits: ...
   ```
2. Add a compiler pass (e.g. `Swag\BasicExample\CompilerPass\RateLimiterCompilerPass implements CompilerPassInterface`) whose `process()` reads `$container->getParameter('shopware.api.rate_limiter')`, merges `Yaml::parseFile(__DIR__ . '/../Resources/config/rate_limiter.yaml')` with `+=`, and writes it back with `setParameter('shopware.api.rate_limiter', ...)`.
3. Register it in the plugin class `build()` after `parent::build($container)`, so it runs before the core pass:
   ```php
   $container->addCompilerPass(new RateLimiterCompilerPass(), PassConfig::TYPE_BEFORE_OPTIMIZATION, 500);
   ```
   (`Symfony\Component\DependencyInjection\Compiler\PassConfig::TYPE_BEFORE_OPTIMIZATION` with a higher priority, otherwise it runs too late.)
4. Inject `Shopware\Core\Framework\RateLimiter\RateLimiter` into the route class (route scope `StoreApiRouteScope::ID`).
5. In the route method call `$this->rateLimiter->ensureAccepted('example_route', $request->getClientIp());` — it counts the request for the key and throws `Shopware\Core\Framework\RateLimiter\Exception\RateLimitExceededException` when the limit is exceeded.
6. After a successful action call `$this->rateLimiter->reset('example_route', $request->getClientIp());`.

## Essential identifiers

- `Shopware\Core\Framework\RateLimiter\RateLimiter` — `ensureAccepted(string $route, string $key)`, `reset(string $route, string $key)`
- `Shopware\Core\Framework\RateLimiter\Exception\RateLimitExceededException`
- `shopware.api.rate_limiter` (container parameter)
- `rate_limiter.yaml`, `enabled`, `policy`, `time_backoff`
- `PassConfig::TYPE_BEFORE_OPTIMIZATION`

## Gotchas

- Code, not docs: the source's YAML shows only `enabled` and `policy: 'time_backoff'`; without `limits` and `reset` the core factory skips the time-backoff branch and hands the config to Symfony's factory instead.
- `ensureAccepted()`/`reset()` throw a `RateLimiterException` (factory not found) for a name that was never registered — i.e. when the compiler pass ran too late. `ensureAcceptedIfConfigured()`/`resetIfConfigured()` silently skip unknown names.
- The core pass fills defaults for a missing `enabled` (`true`), `cache_pool` (`cache.rate_limiter`) and `lock_factory` (`lock.factory`); `enabled: false` yields a no-op limiter.
- The plugin YAML is merged with `+=`, so a name that already exists in the core config is not overwritten.

## Code check (6.7.13.0)
- confirmed `RateLimiter::ensureAccepted()` — throws via `RateLimiterException::limitExceeded()` — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:61
- confirmed `RateLimiter::reset()` — signature `(string $route, string $key)` — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:49
- confirmed `RateLimitExceededException` — returned by `limitExceeded()` — vendor/shopware/core/Framework/RateLimiter/RateLimiterException.php:21
- confirmed `shopware.api.rate_limiter` — parameter consumed by core pass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/RateLimiterCompilerPass.php:29
- confirmed `enabled` — defaults to true when missing — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/RateLimiterCompilerPass.php:56
- corrected `time_backoff` — docs: `enabled` + `policy` suffice; code also requires `limits` and `reset` — vendor/shopware/core/Framework/RateLimiter/RateLimiterFactory.php:59
- confirmed `RateLimiterCompilerPass` — core pass registered with default type and priority — vendor/shopware/core/Framework/Framework.php:135
- confirmed `RateLimiter::resetIfConfigured()` — skips unknown names — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:54
- confirmed `StoreApiRouteScope::ID` — value `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
