---
id: platform/dev/6.7/guides/hosting/performance/_index.md
title: Performance
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/
sourceHash: 6c5701549185e73f953113ea656f7f94740c1591
codeCheckedAgainst: "6.7.15.1"
keywords: ["performance", "hosting performance", "cache", "session", "storage", "locking", "scalability", "tuning", "optimization", "speed"]
summary: Entry page of the hosting performance guides - tuning cache usage, session and storage management, and locking for speed and scalability.
lastBuilt: 2026-10-21
---
## What it is

Entry page of the hosting performance section. It states that store performance is improved by fine-tuning cache usage, optimizing session and storage management, and using efficient locking mechanisms, and that hosting optimization means weighing these factors to improve speed, scalability and reliability. The page itself contains no configuration; the concrete settings live in the individual performance guides of this section.

## When to use

Starting point when tuning a production Shopware installation for speed, scalability or reliability and looking for the guide covering caches, session/storage backends or locks.

## Code check (6.7.15.1)
- confirmed `shopware.http_cache` — cache configuration root exists in core config tree — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1337
- confirmed `shopware.cart.storage` — storage backend node for carts (mysql/redis) — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:932
- confirmed `shopware.increment` — increment storage pools configuration root — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1133
- unverified `session` — session handler configuration is Symfony FrameworkBundle, out of scope
- unverified `lock` — lock store configuration is Symfony FrameworkBundle, out of scope
