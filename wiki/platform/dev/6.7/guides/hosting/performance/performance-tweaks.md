---
id: platform/dev/6.7/guides/hosting/performance/performance-tweaks.md
title: Performance Tweaks
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/performance-tweaks.html
sourceHash: ebf627991a3bd90d9a89c6e6ef772db6c85d5ef2
codeCheckedAgainst: "6.7.13.0"
keywords: ["performance tweaks", "SHOPWARE_HTTP_CACHE_ENABLED", "delay_options", "SHOPWARE_ES_THROW_EXCEPTION", "core.listing.partialDataLoading", "update_mail_variables_on_send", "zstd", "opcache", "product_stream.indexing", "sitemap scheduled_task", "APP_URL_CHECK_DISABLED", "auto_setup", "classmap-authoritative", "production tuning", "speculation rules"]
summary: Production tuning checklist for Shopware 6.7 - HTTP cache, Redis invalidation, OpenSearch, mail/queue, zstd, PHP/opcache, indexer and sitemap switches.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md", "platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md", "platform/dev/6.7/guides/hosting/performance/increment.md", "platform/dev/6.7/guides/hosting/performance/number-ranges.md"]
---
## What it is

A checklist of configuration changes that raise Shopware throughput beyond the out-of-the-box defaults: caching, database, search, mail, compression, PHP, logging and background jobs.

## When to use

Preparing or tuning a production/high-load installation.

## Key steps / config

**HTTP cache** — set `SHOPWARE_HTTP_CACHE_ENABLED=1` in `.env`; with many app servers add a [reverse proxy cache](platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md) such as Varnish.

**Delayed cache invalidation in Redis** (MySQL adapter only if Redis is unavailable; `connection` is required for `redis`):
```yaml
shopware:
    cache:
        invalidation:
            delay_options:
                storage: redis
                connection: 'ephemeral'
```
The scheduled task `shopware.invalidate_cache` runs every 5 minutes by default; change `run_interval` (seconds) of its scheduled task row.

**MySQL** — Shopware sets session variables per request; skip this only when the server has `group_concat_max_len` >= `320000` and `sql_mode` without `ONLY_FULL_GROUP_BY`. Prefer plain SQL (DBAL) over DAL for internal processes ([ADR](platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md)).

**Elasticsearch/OpenSearch** — `SHOPWARE_ES_THROW_EXCEPTION=1` (no MySQL fallback on errors); `SHOPWARE_ADMIN_ES_THROW_EXCEPTION=1` for admin search debugging. Admin API via OpenSearch (6.7.9.0+, experimental): `ADMIN_OPENSEARCH_URL` set, `SHOPWARE_ADMIN_ES_ENABLED=1`, then `ENABLE_OPENSEARCH_FOR_ADMIN_API=1` and `bin/console es:admin:index`. See [Elasticsearch setup](platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md).

**Reduced listing data** (6.7.12.0+) — per sales channel `core.listing.partialDataLoading` (Settings > Products > Load reduced product data in listings); listing products become partial entities with `descriptionTeaser` ([Partial data loading](platform/dev/6.7/guides/development/integrations-api/partial-data-loading.md)).

**Mail** — `shopware.mail.update_mail_variables_on_send: false`; send mails via queue with `framework.mailer.message_bus: 'messenger.default_bus'`.

**Storage** — [increment storage](platform/dev/6.7/guides/hosting/performance/increment.md) to Redis or type `array`; remote [lock store](platform/dev/6.7/guides/hosting/performance/lock-store.md); [number ranges](platform/dev/6.7/guides/hosting/performance/number-ranges.md) in Redis.

**zstd compression** (6.6.4.0+, PHP extension required):
```yaml
shopware:
    cart:
        compress: true
        compression_method: zstd
    cache:
        compress: true
        compression_method: 'zstd'
```

**PHP** — `zend.assertions=-1`, `opcache.enable_file_override=1`, `opcache.interned_strings_buffer=20`, `opcache.validate_timestamps=0`, `zend.detect_unicode=0`, `realpath_cache_ttl=3600`, `opcache.max_accelerated_files` >= `20000`; PCRE JIT enabled (`php -i | grep 'PCRE JIT Target'`). Optional `opcache.preload=<project-root>/var/cache/opcache-preload.php` plus `opcache.preload_user`. Composer `"classmap-authoritative": true` when all plugins are Composer-managed.

**Environment** — `.env.local.php` via `bin/console system:setup --dump-env` or `bin/console dotenv:dump {APP_ENV}`; `APP_URL_CHECK_DISABLED=1`; `framework.secrets.enabled: false` if Symfony Secrets are unused; messenger DSN `?auto_setup=false` plus `bin/console messenger:setup-transports` on deploy (done by the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md)).

**Logging** — monolog `handlers.main.level: error`, `buffer_size: 30`, `business_event_handler_buffer.level: error`.

**Background jobs** — `shopware.product_stream.indexing: false` (6.6.10.0+); `shopware.sitemap.scheduled_task.enabled: false` (6.7.1.0+) plus a cron running `php bin/console sitemap:generate`. Speculation Rules API (6.6.10.0+, experimental) in Admin > Settings > System > Storefront.

## Essential identifiers

`SHOPWARE_HTTP_CACHE_ENABLED`, `shopware.cache.invalidation.delay_options`, `shopware.invalidate_cache`, `SHOPWARE_ES_THROW_EXCEPTION`, `ENABLE_OPENSEARCH_FOR_ADMIN_API`, `core.listing.partialDataLoading`, `shopware.mail.update_mail_variables_on_send`, `shopware.cache.compress`, `shopware.cache.compression_method`, `shopware.cart.compression_method`, `shopware.product_stream.indexing`, `shopware.sitemap.scheduled_task.enabled`, `APP_URL_CHECK_DISABLED`

## Gotchas

- Logged-in / cart-filled pages: the docs disable cache invalidation for these states with `shopware.cache.invalidation.http_cache: []`. That option is deprecated for 6.8.0 because cache states are being removed; bundled default is `['logged-in', 'cart-filled']`.
- The docs' cache compression keys `cache_compression` / `cache_compression_method` are deprecated aliases of `compress` / `compression_method`; clear the cache after changing the cache compression method.
- `opcache.enable_file_override=1` can throw errors after a cache clear; `opcache.validate_timestamps=0` and preload require an opcache reset/PHP-FPM restart on every deploy; preload breaks the Extension Manager. The web updater is incompatible with opcache.
- Disabling the product stream indexer: category pages with streams update only when the HTTP cache expires, and the Line Item in Stream rule always evaluates to `false`.
- Partial listing data: only enable if theme/extensions need no extra product fields in listings. Speculation rules add server load and can affect analytics.

## Version notes

6.4.15.0 `--dump-env`; 6.6.4.0 zstd; 6.6.10.0 product stream indexer switch and Speculation Rules; 6.7.1.0 sitemap scheduled task switch; 6.7.9.0 OpenSearch for Admin API; 6.7.12.0 reduced listing data (on by default for new installs).

## Code check (6.7.13.0)
- deprecated `http_cache` — `shopware.cache.invalidation.http_cache` deprecated for 6.8.0 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:754
- deprecated `cache_compression` — deprecated for 6.8.0, use `compress` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:723
- deprecated `cache_compression_method` — deprecated for 6.8.0, use `compression_method` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:728
- confirmed `compression_method` — cache compression method, default `gzip` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:732
- confirmed `delay_options.connection` — required when storage is `redis` — vendor/shopware/core/Framework/Adapter/Cache/CacheCompilerPass.php:23
- confirmed `update_mail_variables_on_send` — boolean, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1117
- confirmed `product_stream.indexing` — boolean, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1609
- confirmed `scheduled_task.enabled` — sitemap scheduled task switch, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:314
- confirmed `core.listing.partialDataLoading` — read per sales channel by the listing loader — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingLoader.php:146
- confirmed `SHOPWARE_HTTP_CACHE_ENABLED` — env for `shopware.http.cache.enabled` — vendor/shopware/core/Framework/DependencyInjection/services.xml:38
