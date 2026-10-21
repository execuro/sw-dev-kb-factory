---
id: platform/dev/6.7/guides/hosting/performance/session.md
title: Session
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/session.html
sourceHash: 895cad993ee0157e3f5adf3d1104082a3322c7fe
codeCheckedAgainst: "6.7.15.1"
keywords: ["session", "framework.session.handler_id", "framework.session.cookie_lifetime", "framework.session.gc_maxlifetime", "shopware.api.store.context_lifetime", "shopware.sales_channel_context.expire_days", "shopware.cart.expire_days", "redis session", "session.save_handler", "PdoSessionHandler", "context token lifetime", "cart expiry", "session storage"]
summary: Session storage (PHP default, Redis, PDO/Memcached handlers) and the separate lifetimes of Symfony session, context token, stored context and cart.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/scheduled-task.md"]
---
## What it is

How Shopware stores Symfony sessions and which settings govern the independent lifetimes of the session cookie, server-side session data, the Store API context token, persisted sales channel contexts and persisted carts. By default Shopware uses the session storage configured in PHP (usually the file system).

## When to use

Clustered or high-traffic setups that need an alternative session store such as Redis, or when login/cart persistence durations need tuning.

## Key steps / config

Lifecycles are resolved per request: session cookie -> session data -> context token -> stored context -> cart. Each has its own setting:

| Scope | Setting | Limits |
|---|---|---|
| Browser cookie | `framework.session.cookie_lifetime` | How long the browser keeps the cookie (falls back to PHP `session.cookie_lifetime`, typically `0`) |
| Server session data | `framework.session.gc_maxlifetime` | When data can be garbage-collected (falls back to PHP `session.gc_maxlifetime`, typically `1440` s) |
| Store API context token | `shopware.api.store.context_lifetime` | Token validity, `DateInterval`, default `P1D` |
| Persisted context | `shopware.sales_channel_context.expire_days` | Cleanup task removes stored context records (default `120`) |
| Persisted cart | `shopware.cart.expire_days` | Cleanup task removes persisted carts (default `120`) |

Symfony keys go in `config/packages/framework.yaml`, Shopware keys in `config/packages/shopware.yaml`:

```yaml
framework:
    session:
        cookie_lifetime: 86400
        gc_maxlifetime: 86400
shopware:
    api:
        store:
            context_lifetime: 'P1D'
    sales_channel_context:
        expire_days: 120
    cart:
        expire_days: 120
```

Redis via `php.ini`:

```ini
session.save_handler = redis
session.save_path = "tcp://host:6379?database=0"
```

Redis via Shopware config (`config/packages/redis.yml`): `framework.session.handler_id: "redis://host:port/0"`.

Other Symfony handlers (`PdoSessionHandler`, `MemcachedSessionHandler`, `MongoDbSessionHandler`): register a service and point `handler_id` at its id:

```php
$services->set('session.db', Symfony\Component\HttpFoundation\Session\Storage\Handler\PdoSessionHandler::class)
    ->args([/* ... */]);
```

then `framework.session.handler_id: "session.db"`.

## Essential identifiers

- `framework.session.handler_id`, `framework.session.cookie_lifetime`, `framework.session.gc_maxlifetime`
- `shopware.api.store.context_lifetime`
- `shopware.sales_channel_context.expire_days`, `shopware.cart.expire_days`
- `session.save_handler`, `session.save_path`
- `Symfony\Component\HttpFoundation\Session\Storage\Handler\PdoSessionHandler`

## Gotchas

- Cookie and server-side lifetimes can diverge: the browser may still send a cookie for deleted session data, which starts a new empty session. Set both explicitly to similar values for predictable login duration.
- A cart token can outlive the Symfony session, and a session cookie can outlive the persisted context; a new context token is issued when the context expired.
- `expire_days` values are applied by scheduled cleanup tasks (see platform/dev/6.7/guides/hosting/infrastructure/scheduled-task.md), not on request.
- Session data in Redis should be persisted (RDB snapshots and/or AOF); use the `allkeys-lru` eviction policy.
- Longer lifetimes raise risk on shared devices and increase storage use (e.g. Redis memory).

## Code check (6.7.15.1)
- confirmed `context_lifetime` — scalar node, default `P1D` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:203
- confirmed `shopware.api.store.context_lifetime` — injected into SalesChannelContextPersister — vendor/shopware/core/System/DependencyInjection/sales_channel.php:236
- confirmed `shopware.sales_channel_context.expire_days` — used by CleanupSalesChannelContextTaskHandler — vendor/shopware/core/System/DependencyInjection/sales_channel.php:410
- confirmed `sales_channel_context.expire_days` — default 120 — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:493
- confirmed `shopware.cart.expire_days` — used by CleanupCartTaskHandler — vendor/shopware/core/Checkout/DependencyInjection/cart.php:172
- confirmed `cart.expire_days` — default 120 — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:477
- confirmed `framework.session.handler_id` — Shopware default `~` (PHP-configured storage) — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:20
- unverified `PdoSessionHandler` — vendor/symfony, out of scope
- unverified `framework.session.gc_maxlifetime` — Symfony FrameworkBundle option, out of scope
