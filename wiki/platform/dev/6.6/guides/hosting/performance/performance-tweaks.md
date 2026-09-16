---
id: platform/dev/6.6/guides/hosting/performance/performance-tweaks.md
title: Performance Tweaks
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/performance/performance-tweaks.html
sourceHash: 1ff1737c345ef24745fc30f15668311af7e2826c
keywords: ["performance tuning", "http cache", "SHOPWARE_HTTP_CACHE_ENABLED", "cache invalidation", "delayed invalidation", "shopware.invalidate_cache", "elasticsearch", "SHOPWARE_ES_THROW_EXCEPTION", "opcache", "zstd compression", "number ranges", "lock store", "message queue", "SHOPWARE_CACHE_ID", "product stream indexer"]
summary: "Config keys and env vars to tune Shopware 6.6 HTTP cache, DB load, mail, locks, opcache, and compression for production."
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/resources/references/adr/2022-03-25-prevent-mail-updates.md
  - platform/dev/6.6/guides/hosting/installation-updates/deployments/deployment-helper.md
---

## What it is

A collection of configuration switches and environment tweaks that trade Shopware's
out-of-the-box defaults for higher throughput in larger or high-traffic production setups.

## When to use

When a project needs to reduce database, cache, or class-loading overhead beyond the
default configuration — e.g. high RPS storefronts, large product assortments, or clustered
deployments.

## Key steps / config

- HTTP cache: set `SHOPWARE_HTTP_CACHE_ENABLED=1` in `.env`; add a reverse proxy such as
  Varnish for high traffic.
- Disable cache invalidation for logged-in/cart pages:
  ```yaml
  shopware:
      cache:
          invalidation:
              http_cache: []
  ```
- Delayed cache invalidation (Redis or MySQL adapter), tunable via the `scheduled_taks` DB
  table's `run_interval` for the `shopware.invalidate_cache` entry:
  ```yaml
  shopware:
      cache:
          invalidation:
              delay: 1
              delay_options:
                  storage: redis
                  connection: 'ephemeral'
  ```
- MySQL: ensure `group_concat_max_len` >= `320000`, `sql_mode` excludes `ONLY_FULL_GROUP_BY`,
  `time_zone` is UTC, then set `SQL_SET_DEFAULT_SESSION_VARIABLES=0` in `.env`.
- Prefer DBAL (plain SQL) over the DAL for internal, single-ID lookups.
- Elasticsearch/OpenSearch: set `SHOPWARE_ES_THROW_EXCEPTION=1` to avoid silent MySQL
  fallback on query errors.
- Disable mail template auto-completion writes with
  `shopware.mail.update_mail_variables_on_send: false`.
- Increment storage: use `array` type to disable it, or move it to Redis to avoid
  transaction locks.
- Lock storage: configure `framework.lock: 'redis://host:port'` instead of the default
  file-based lock store for clustered setups.
- Number ranges: store states in Redis for high-throughput order/invoice numbering.
- Route mail sending through the queue: `framework.mailer.message_bus: 'messenger.default_bus'`.
- PHP tuning: `opcache.max_accelerated_files` >= `20000`, `opcache.interned_strings_buffer`,
  `opcache.validate_timestamps=0`, `zend.assertions=-1`, `realpath_cache_ttl`.
- Composer: add `"classmap-authoritative": true` in `composer.json` when all plugins are
  Composer-managed.
- Hardcode a static cache id with `SHOPWARE_CACHE_ID=foo` to skip a per-request SQL lookup.
- Use `.env.local.php` in production; generate via `bin/console system:setup --dump-env` or
  `bin/console dotenv:dump {APP_ENV}` (since Shopware 6.4.15.0).
- Reduce logging: set monolog handler `level: error` and limit `buffer_size`; the
  `business_event_handler_buffer` handler controls flow-activity logging.
- Disable Admin's self-request check with `APP_URL_CHECK_DISABLED=1`.
- Disable fine-grained cache tagging via `shopware.cache.tagging.each_config`,
  `each_snippet`, `each_theme_config: false`.
- Use `zstd` instead of `gzip` for cart/cache compression (since Shopware 6.6.4.0) via
  `shopware.cart.compress`/`compression_method` and `shopware.cache.cache_compression`/
  `cache_compression_method`.
- Disable Symfony Secrets with `framework.secrets.enabled: false`.
- Disable Messenger `auto_setup` with `redis://localhost?auto_setup=false` and run
  `bin/console messenger:setup-transports` on deploy (or use the Deployment Helper).
- Disable the Product Stream Indexer (since Shopware 6.6.10.0) via the
  `product_stream.yaml` config snippet.

## Essential identifiers

- `SHOPWARE_HTTP_CACHE_ENABLED`, `SHOPWARE_ES_THROW_EXCEPTION`, `SHOPWARE_CACHE_ID`,
  `APP_URL_CHECK_DISABLED`, `SQL_SET_DEFAULT_SESSION_VARIABLES`
- `shopware.cache.invalidation.http_cache`, `shopware.cache.invalidation.delay`,
  `shopware.mail.update_mail_variables_on_send`, `shopware.cart.compression_method`,
  `shopware.cache.cache_compression_method`, `shopware.cache.tagging.each_config`
- `framework.lock`, `framework.mailer.message_bus`, `framework.secrets.enabled`
- `bin/console system:setup --dump-env`, `bin/console dotenv:dump`,
  `bin/console messenger:setup-transports`
- `opcache.max_accelerated_files`, `opcache.preload`, `opcache.validate_timestamps`

## Gotchas

- `opcache.validate_timestamps=0` requires clearing opcache (php-fpm reload/cachetool) on
  every deploy, and `opcache.enable_file_override=1` can throw errors after a cache clear.
- Enabling `opcache.preload` requires a PHP-FPM restart after every modification; the web
  updater is not compatible with opcache preload.
- Redis is preferred over MySQL for delayed cache invalidation because the MySQL adapter
  can deadlock under high load.
- Disabling the Product Stream Indexer means category pages using a stream don't update
  until the HTTP cache expires, and stream Line Item rules always evaluate to `false`.
- Changing the cache compression method requires clearing the cache afterward.

## Version notes

- "Prevent mail updates" is available starting with Shopware 6.4.11.0.
- `zstd` compression support was added in Shopware 6.6.4.0.
- Disabling the Product Stream Indexer and the Speculation Rules API are both available
  starting with Shopware 6.6.10.0.
