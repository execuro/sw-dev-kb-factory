---
id: platform/dev/6.7/guides/hosting/performance/lock-store.md
title: Lock Storage
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/lock-store.html
sourceHash: b575e41069a671a89fe2b383ebcfe67e12f8b097
codeCheckedAgainst: "6.7.13.0"
keywords: ["lock store", "lock storage", "framework.lock", "LOCK_DSN", "flock", "symfony lock", "redis", "cluster", "multi-machine", "remote lock store", "lock.yaml"]
summary: Configure Symfony lock store for Shopware clusters; default framework.lock is %env(LOCK_DSN)% (flock), switch to a remote store such as Redis.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/performance/caches.md", "platform/dev/6.7/guides/hosting/performance/increment.md", "platform/dev/6.7/guides/hosting/performance/session.md"]
---
## What it is

Shopware implements locking with Symfony's Lock component. Out of the box the lock store is local: Shopware's bundled framework config sets `framework.lock: '%env(LOCK_DSN)%'` with `LOCK_DSN` defaulting to `flock` (file locks). File locks are not shared between machines, so multi-machine (cluster) setups need a remote store.

## When to use

Hosting Shopware on more than one app server, or already running Redis for [caching](platform/dev/6.7/guides/hosting/performance/caches.md), the [increment store](platform/dev/6.7/guides/hosting/performance/increment.md) or [session storage](platform/dev/6.7/guides/hosting/performance/session.md) and wanting to reuse it for locks.

## Key steps / config

Point the lock store at a Redis DSN in `config/packages/lock.yaml`:

```yaml
framework:
    lock: 'redis://host:port/dbindex'
```

Example for Redis on the local host, port 6379, database 0: `lock: 'redis://127.0.0.1:6379/0'`.

Because the bundled default reads the `LOCK_DSN` environment variable, setting `LOCK_DSN` to the same DSN is an equivalent option that avoids a YAML override.

Any other store supported by Symfony Lock can be used the same way; in a cluster always choose a remote store.

## Essential identifiers

- `framework.lock`
- `LOCK_DSN` (default `flock`)
- `config/packages/lock.yaml`

## Gotchas

- Naive local file locks in a cluster break the system — each node locks only its own filesystem.
- Available store types and further options (e.g. named lock resources) are defined by Symfony's Lock component, not by Shopware.

## Code check (6.7.13.0)
- confirmed `lock` — bundled `framework.lock` reads `%env(LOCK_DSN)%` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:38
- confirmed `LOCK_DSN` — default value `flock` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:7
- unverified `framework.lock` Redis DSN support — Symfony FrameworkBundle/Lock, vendor/symfony out of scope
