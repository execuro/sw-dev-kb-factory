---
id: platform/dev/6.7/guides/hosting/performance/session.md
title: Session
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/session.html
sourceHash: 895cad993ee0157e3f5adf3d1104082a3322c7fe
codeCheckedAgainst: "6.7.13.0"
keywords: ["session", "redis session", "framework.session.handler_id", "framework.session.cookie_lifetime", "framework.session.gc_maxlifetime", "shopware.api.store.context_lifetime", "shopware.sales_channel_context.expire_days", "shopware.cart.expire_days", "context token", "cart lifetime", "PdoSessionHandler", "session.save_handler", "allkeys-lru"]
summary: "Session, sales channel context and cart lifetimes (cookie_lifetime, gc_maxlifetime, context_lifetime, expire_days) and Redis/PDO session handler setup."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/scheduled-task.md"]
---
## What it is

How Shopware stores PHP/Symfony sessions (PHP default, usually files) and how to move them to Redis or another Symfony handler, plus the independent lifetimes of the Symfony session, the Store API sales channel context token, and the persisted cart.

## When to use

Clustered or high-traffic setups that need shared session storage, or when tuning how long logins, context tokens and carts survive.

## Key steps / config

Lifecycles on a request: session cookie -> Symfony session -> context resolved via context token -> cart loaded by context token (a new token is issued if the context expired). Each hop has its own setting:

| Setting | File | Limits |
|---|---|---|
| `framework.session.cookie_lifetime` | `config/packages/framework.yaml` | How long the browser keeps the cookie (seconds) |
| `framework.session.gc_maxlifetime` | `config/packages/framework.yaml` | When server session data may be garbage-collected (seconds) |
| `shopware.api.store.context_lifetime` | `config/packages/shopware.yaml` | Context token validity, `DateInterval`, default `P1D` |
| `shopware.sales_channel_context.expire_days` | `config/packages/shopware.yaml` | Cleanup task removal of stored contexts, default `120` |
| `shopware.cart.expire_days` | `config/packages/shopware.yaml` | Cleanup task removal of persisted carts, default `120` |

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

Without Symfony config access, set `session.cookie_lifetime` / `session.gc_maxlifetime` in `php.ini`. The `expire_days` values feed scheduled cleanup tasks ([Scheduled tasks](platform/dev/6.7/guides/hosting/infrastructure/scheduled-task.md)).

**Redis via php.ini**

```ini
session.save_handler = redis
session.save_path = "tcp://host:6379?database=0"
```

**Redis via Shopware config** (`config/packages/redis.yml`):

```yaml
framework:
    session:
        handler_id: "redis://host:port/0"
```

Redis instance: enable persistence (RDB snapshots and/or AOF) since session data should survive restarts; use eviction policy `allkeys-lru`.

**Other Symfony handlers** (`PdoSessionHandler`, `MemcachedSessionHandler`, `MongoDbSessionHandler`): register a service and point `handler_id` at its id.

```php
$services->set('session.db', Symfony\Component\HttpFoundation\Session\Storage\Handler\PdoSessionHandler::class)
    ->args([/* ... */]);
```

```yaml
framework:
    session:
        handler_id: "session.db"
```

## Essential identifiers

- `framework.session.handler_id`, `framework.session.cookie_lifetime`, `framework.session.gc_maxlifetime`
- `shopware.api.store.context_lifetime`
- `shopware.sales_channel_context.expire_days`
- `shopware.cart.expire_days`
- `session.save_handler`, `session.save_path`
- `Symfony\Component\HttpFoundation\Session\Storage\Handler\PdoSessionHandler`

## Gotchas

- Cookie and server lifetimes diverge if unset: PHP defaults are typically `session.cookie_lifetime = 0` (until browser close) and `session.gc_maxlifetime = 1440` s. A browser can still send a cookie whose server data is gone, starting a new empty session. Set both explicitly to similar values for predictable login duration.
- A customer may keep a valid cart token after the Symfony session expired, or a session cookie after the stored context was cleaned up.
- Longer lifetimes raise risk on shared devices and increase storage (e.g. Redis memory).

## Code check (6.7.13.0)
- confirmed `api.store.context_lifetime` — scalar node, default 'P1D' — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:199
- confirmed `shopware.api.store.context_lifetime` — injected into SalesChannelContextPersister — vendor/shopware/core/System/DependencyInjection/sales_channel.xml:136
- confirmed `sales_channel_context.expire_days` — integer node, min 1, default 120 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:963
- confirmed `shopware.sales_channel_context.expire_days` — used by CleanupSalesChannelContextTaskHandler — vendor/shopware/core/System/DependencyInjection/sales_channel.xml:286
- confirmed `cart.expire_days` — integer node, min 1, default 120 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:892
- confirmed `shopware.cart.expire_days` — used by CleanupCartTaskHandler — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:42
- confirmed `framework.session.handler_id` — Shopware ships handler_id ~ (PHP default handler) — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:20
- unverified `framework.session.cookie_lifetime` — Symfony framework config, outside checked vendor roots
- unverified `framework.session.gc_maxlifetime` — Symfony framework config, outside checked vendor roots
- unverified `PdoSessionHandler` — vendor/symfony, out of scope
