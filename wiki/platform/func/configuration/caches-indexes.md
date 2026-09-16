---
id: platform/func/configuration/caches-indexes.md
title: Caches Indexes
docType: functional
version: "6.6"
versions: ["6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/configuration/caches-indexes
sourceHash: 5f7a0f4cf0e891b05cdc32d0eb268f8037212a53dee040daea9d9232830b56b8
revision:
  current: true
  range: "6.6.8.0 - 6.6.10.5"
  swMin: "6.6.8.0"
  swMax: "6.6.10.5"
keywords: ["Caches & Indexes", "cache:clear", "cache:warmup", "dal:refresh:index", "SHOPWARE_HTTP_CACHE_ENABLED", "product.indexer", "category.indexer", "self-hosted", "Shopware CLI", "cronjob cache clear", "HTTP cache adapter", "refresh cache", "warm up cache"]
summary: "Self-hosted Caches & Indexes admin module: cache/environment overview, refresh/clear cache, indexers and updaters, and console commands."
lastBuilt: "2026-09-15"
---
## What it is
Documents the Caches & Indexes module (self-hosted stores only, not SaaS) used to clear/warm up caches, view environment mode/HTTP cache/cache adapter, and rebuild indexes.

## When to use
When troubleshooting stale data or search/sort issues on a self-hosted store, or when automating cache maintenance.

## Key steps / config
Overview shows whether the shop runs in "Production" **Environment**, whether **HTTP cache** is active, and the **cache adapter** used; adjust these in the shop's `.env` file. Relevant env var:

```
SHOPWARE_HTTP_CACHE_ENABLED=1
```

Setting it to `0` deactivates the cache.

Manage Caches & Indexes:
- **Refresh cache**: deletes only recently changed cached data (e.g. theme/product adjustments), console equivalent not shown.
- **Clear cache**: empties caches without immediately reheating; console: `php bin/console cache:clear`.
- **Indexes**: rebuilds indexes (category, product, SEO URLs etc.); console: `php bin/console dal:refresh:index`. Two dropdowns select which indices to update, and a Method dropdown chooses "Only update selected" vs "Update all, but skip selected".

Selected indexer names include `category.indexer`, `category.tree`, `category.seo-url`, `customer.indexer`, `landing_page.indexer`, `media.indexer`, `payment_method.indexer`, `product.indexer` (with sub-tasks `product.inheritance`, `product.stock`, `product.variant-listing`, `product.cheapest-price`, `product.search-keyword`, `product.seo-url`), `product_stream.indexer`, `promotion.indexer`, `rule.indexer`, `sales_channel.indexer`, `flow.indexer`, `newsletter_recipient.indexer`.

Automating cache clearing (not automatic by default):

```
php bin/console cache:clear
php bin/console cache:warmup
```

Recommended to run both via a daily cronjob during low-traffic hours. Manual folder deletion as a last resort:

```
rm -rf SHOPWARE-ROOT-FOLDER/var/cache/*
```

## Essential identifiers
- `SHOPWARE_HTTP_CACHE_ENABLED`
- `php bin/console cache:clear`
- `php bin/console cache:warmup`
- `php bin/console dal:refresh:index`

## Gotchas
Shopware 6 Standard does not clear the cache automatically, which over time increases disk usage on the server; a scheduled cronjob calling `cache:clear` and `cache:warmup` is recommended for live systems.
