---
id: platform/dev/6.7/guides/hosting/performance/performance-tweaks.md
title: Performance Tweaks
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/performance-tweaks.html
sourceHash: ebf627991a3bd90d9a89c6e6ef772db6c85d5ef2
codeCheckedAgainst: "6.7.15.1"
keywords: ["performance tuning", "SHOPWARE_HTTP_CACHE_ENABLED", "delay_options", "SHOPWARE_ES_THROW_EXCEPTION", "core.listing.partialDataLoading", "update_mail_variables_on_send", "compression_method", "zstd", "product_stream.indexing", "sitemap.scheduled_task", "opcache", "APP_URL_CHECK_DISABLED", "auto_setup", "classmap-authoritative", "speed optimization"]
summary: "Production tuning checklist for Shopware 6.7: HTTP cache, delayed invalidation in Redis, ES, compression, mail/queue, indexers, sitemap, PHP/opcache, logging."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md", "platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md", "platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md", "platform/dev/6.7/guides/development/integrations-api/partial-data-loading.md"]
---
## What it is

A checklist of configuration changes that raise Shopware throughput beyond the out-of-the-box defaults: caching, search, storage back-ends, mail, background jobs, PHP and logging.

## When to use

When preparing or tuning a production system with high traffic, large catalogues, or frequent inventory updates.

## Key steps / config

**HTTP cache** — `SHOPWARE_HTTP_CACHE_ENABLED=1` in `.env`; with many app servers add a [reverse proxy cache](platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md) such as Varnish.

**Delayed invalidation in Redis** — invalidations are processed by scheduled task `shopware.invalidate_cache` (default every 5 min; `run_interval` in seconds in the `scheduled_task` table). Tags are stored in MySQL by default; under heavy concurrent writes use Redis:

```yaml
# config/packages/prod/shopware.yaml
shopware:
    cache:
        invalidation:
            delay_options:
                storage: redis
                connection: 'ephemeral' # name from shopware.redis.connections
```

**MySQL** — on a correctly configured server ensure `group_concat_max_len` >= `320000` and `sql_mode` without `ONLY_FULL_GROUP_BY`. Prefer plain SQL over DAL for internal ID-only processes ([ADR](platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md)). CDN assets should send `Cache-Control` (e.g. `public, max-age=86400`).

**Elasticsearch/OpenSearch** — `SHOPWARE_ES_THROW_EXCEPTION=1` prevents fallback to MySQL on ES errors; `SHOPWARE_ADMIN_ES_THROW_EXCEPTION=1` helps debug admin search locally. Admin API via OpenSearch (6.7.9.0+, experimental): set `ADMIN_OPENSEARCH_URL`, `SHOPWARE_ADMIN_ES_ENABLED=1`, feature flag `ENABLE_OPENSEARCH_FOR_ADMIN_API=1`, then `bin/console es:admin:index` ([ADR](platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md), [setup](platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md)).

**Reduced listing data** (6.7.12.0+) — `Settings > Products > Load reduced product data in listings` (`core.listing.partialDataLoading`, per sales channel): partial entities with `descriptionTeaser` (max 512 chars, HTML-free). See [partial data loading](platform/dev/6.7/guides/development/integrations-api/partial-data-loading.md).

**Mail** — `shopware.mail.update_mail_variables_on_send: false`; send via queue with `framework.mailer.message_bus: 'messenger.default_bus'`.

**Storages** — [increment storage](platform/dev/6.7/guides/hosting/performance/increment.md) in Redis (or type `array` if unused); remote [lock store](platform/dev/6.7/guides/hosting/performance/lock-store.md) in clusters; [number ranges](platform/dev/6.7/guides/hosting/performance/number-ranges.md) in Redis at high order volume.

**zstd compression** (6.6.4.0+, needs PHP extension):

```yaml
shopware:
    cart:
        compress: true
        compression_method: zstd
    cache:
        compress: true            # default true
        compression_method: zstd  # default gzip
```

**Background jobs** — `shopware.product_stream.indexing: false` (6.6.10.0+); `shopware.sitemap.scheduled_task.enabled: false` (6.7.1.0+) plus a cron running `php bin/console sitemap:generate`.

**Messenger** — `auto_setup=false` in transport DSNs (e.g. `redis://localhost?auto_setup=false`), then `bin/console messenger:setup-transports` on deploy (done by the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md)).

**PHP** — `zend.assertions=-1`, `opcache.enable_file_override=1`, `opcache.interned_strings_buffer=20`, `opcache.validate_timestamps=0`, `zend.detect_unicode=0`, `realpath_cache_ttl=3600`, `opcache.max_accelerated_files` >= `20000`, PCRE JIT on (`php -i | grep 'PCRE JIT Target'`). Optional `opcache.preload=<project-root>/var/cache/opcache-preload.php` with `opcache.preload_user`. Composer-only plugins: `"classmap-authoritative": true` in `composer.json` `config`.

**Env** — `bin/console system:setup --dump-env` or `bin/console dotenv:dump {APP_ENV}` (6.4.15.0+) for `.env.local.php`; `APP_URL_CHECK_DISABLED=1`; `framework.secrets.enabled: false` if Symfony Secrets are unused.

**Logging** — `monolog.handlers.main.level: error`, `buffer_size: 30`; `business_event_handler_buffer.level: error` (drops successful flow logs).

**Speculation Rules API** (6.6.10.0+, experimental) — `Admin > Settings > System > Storefront`, eagerness `moderate`.

## Essential identifiers

`SHOPWARE_HTTP_CACHE_ENABLED`, `shopware.cache.invalidation.delay_options`, `shopware.invalidate_cache`, `SHOPWARE_ES_THROW_EXCEPTION`, `ENABLE_OPENSEARCH_FOR_ADMIN_API`, `core.listing.partialDataLoading`, `shopware.mail.update_mail_variables_on_send`, `shopware.cache.compression_method`, `shopware.product_stream.indexing`, `shopware.sitemap.scheduled_task.enabled`, `APP_URL_CHECK_DISABLED`

## Gotchas

- Logged-in customers or filled carts bypass full-page caching. The docs disable that via `shopware.cache.invalidation.http_cache: []`; in 6.7.15.1 this node is deprecated (removed in 6.8.0 with cache states).
- Docs' `cache_compression` / `cache_compression_method` are deprecated aliases of `compress` / `compression_method`. Clear the cache after changing the cache compression method.
- `opcache.enable_file_override=1` can error after cache clear; `opcache.validate_timestamps=0` requires an opcache clear on deploy; the web updater is incompatible with opcache. Preload needs a PHP-FPM restart after every cache clear or file change and breaks the Extension Manager.
- Partial listing data: enable only if theme/extensions need no extra listing data; new installs have it on, existing shops must opt in.
- Without the product stream indexer, stream category pages update only when the HTTP cache expires, and the Line Item in Stream rule always evaluates to `false`.

## Code check (6.7.15.1)
- deprecated `http_cache` — `shopware.cache.invalidation.http_cache` deprecated for 6.8.0 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:790
- deprecated `cache_compression` — use `shopware.cache.compress` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:759
- deprecated `cache_compression_method` — use `shopware.cache.compression_method` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:764
- confirmed `compression_method` — cache default `gzip`, `compress` default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:768
- confirmed `delay_options` — `storage` default `mysql`, `connection` default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:780
- confirmed `SHOPWARE_HTTP_CACHE_ENABLED` — feeds `shopware.http.cache.enabled` — vendor/shopware/core/Framework/DependencyInjection/services.php:189
- confirmed `update_mail_variables_on_send` — default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1153
- confirmed `indexing` — `shopware.product_stream.indexing`, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1654
- confirmed `scheduled_task` — `shopware.sitemap.scheduled_task.enabled`, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:333
- confirmed `core.listing.partialDataLoading` — read per sales channel by the listing loader — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingLoader.php:146
