---
docType: developer
id: platform/dev/6.6/guides/hosting/performance/lock-store.md
sourceHash: 9b45b1c2f8220b2ef9f21bc1d0e99764fb44383d
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/performance/lock-store.html
title: Lock Storage
version: "6.6"
versions: ["6.6"]
keywords: ["lock store", "Symfony lock component", "framework.lock", "lock.yaml", "redis lock", "remote lock store", "cluster locking", "file lock"]
summary: "Configuring Shopware's Symfony-based locking to use a remote store like Redis instead of local file locks in cluster setups."
lastBuilt: "2026-09-15"
---
## What it is

This page documents Shopware's use of Symfony's lock component for locking functionality, and how to switch from the default local lock store to a remote one.

## When to use

Use it in multi-machine (cluster) setups, where naive local file locks would break the system; a remote lock store is highly recommended in that case.

## Key steps / config

Create `config/packages/lock.yaml`:

```yaml
framework:
    lock: 'redis://host:port'
```

Redis, if already used for caching, increment storage, or session storage, can also serve as the remote lock store host. Any lock store supported by Symfony's lock component can be used, not only Redis.

## Essential identifiers

- `framework.lock`
- `config/packages/lock.yaml`

## Gotchas

By default Symfony uses a local lock store, which is unsafe across multiple machines/cluster nodes — always use a remote store when hosting Shopware in a cluster.
