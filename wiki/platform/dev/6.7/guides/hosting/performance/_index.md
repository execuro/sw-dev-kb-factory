---
id: platform/dev/6.7/guides/hosting/performance/_index.md
title: Performance
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/
sourceHash: 6c5701549185e73f953113ea656f7f94740c1591
codeCheckedAgainst: "6.7.13.0"
keywords: ["performance", "hosting performance", "cache", "session", "storage", "locking", "scalability", "optimization"]
summary: "Entry page for Shopware hosting performance guides: cache usage, session and storage management, and locking mechanisms."
lastBuilt: 2026-09-15
---
## What it is

The index of the hosting performance section. It states that tuning cache usage, session and storage management, and locking mechanisms improves the speed, scalability and reliability of a Shopware store; the individual topics are covered on the child pages of this section (for example cache configuration and cart storage).

## When to use

Starting point when looking for server-side performance tuning of a Shopware installation, before picking the specific guide for caches, storage, sessions or locks.

## Code check (6.7.13.0)
- confirmed `shopware.http_cache` — HTTP cache config section (cache usage topic) — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1301
- confirmed `shopware.cart.storage` — cart storage config section (storage topic) — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:896
