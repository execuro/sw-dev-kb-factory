---
id: platform/dev/6.7/guides/hosting/performance/lock-store.md
title: Lock Storage
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/lock-store.html
sourceHash: b575e41069a671a89fe2b383ebcfe67e12f8b097
codeCheckedAgainst: "6.7.15.1"
keywords: ["lock store", "lock storage", "framework.lock", "LOCK_DSN", "lock.factory", "symfony lock", "redis lock", "flock", "cluster", "multi-server", "config/packages/lock.yaml", "remote store"]
summary: "Configure Symfony's lock store for Shopware (framework.lock / LOCK_DSN, default flock) and use a remote store such as Redis in cluster setups."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/performance/caches.md", "platform/dev/6.7/guides/hosting/performance/increment.md", "platform/dev/6.7/guides/hosting/performance/session.md"]
---
## What it is

Shopware implements locking with Symfony's Lock component. By default a local lock store is used; in Shopware's bundled framework config `framework.lock` is `'%env(LOCK_DSN)%'` with `LOCK_DSN` defaulting to `flock` (file locks).

## When to use

When running Shopware on more than one machine (cluster): local file locks are not shared between hosts and break the system, so a remote store is required.

## Key steps / config

Use a Redis host (the same one you may already use for [caching](platform/dev/6.7/guides/hosting/performance/caches.md), [increment storage](platform/dev/6.7/guides/hosting/performance/increment.md) or [sessions](platform/dev/6.7/guides/hosting/performance/session.md)) as the lock store. Create `config/packages/lock.yaml`:

```yaml
framework:
    lock: 'redis://host:port/dbindex'
```

Example for Redis on port 6379, database 0: `lock: 'redis://127.0.0.1:6379/0'`.

Because the bundled default reads `%env(LOCK_DSN)%`, setting the `LOCK_DSN` environment variable to the DSN has the same effect as long as no project config overrides `framework.lock`.

Any lock store supported by Symfony can be used; see Symfony's lock documentation for available stores and FrameworkBundle configuration options.

## Essential identifiers

- `framework.lock`
- `LOCK_DSN` (bundled default `flock`)
- `config/packages/lock.yaml`
- `lock.factory` (Symfony `LockFactory` service consumed by Shopware, e.g. Redis number-range storage, cache clearer)

## Gotchas

- Always use a remote store when hosting Shopware in a cluster; the default file-based store only locks within one machine.

## Code check (6.7.15.1)
- confirmed `LOCK_DSN` — env default `flock` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:7
- confirmed `framework.lock` — set to `%env(LOCK_DSN)%` in bundled framework config — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:38
- confirmed `lock.factory` — injected into the Redis increment storage — vendor/shopware/core/System/DependencyInjection/number_range.php:88
- confirmed `LockFactory` — used by CacheClearer — vendor/shopware/core/Framework/Adapter/Cache/CacheClearer.php:45
- unverified `redis://host:port/dbindex` — DSN parsing lives in vendor/symfony, out of scope
