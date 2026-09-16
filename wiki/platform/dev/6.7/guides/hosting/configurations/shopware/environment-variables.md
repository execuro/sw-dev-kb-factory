---
id: platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md
title: Environment Variables
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/environment-variables.html
sourceHash: e0c7c759a2c1eff52c1032b9c8427cd7ba2e90a9
codeCheckedAgainst: "6.7.13.0"
keywords: ["environment variables", "env vars", ".env", "APP_ENV", "APP_SECRET", "APP_URL", "DATABASE_URL", "DATABASE_SSL_CA", "BLUE_GREEN_DEPLOYMENT", "MESSENGER_TRANSPORT_DSN", "SHOPWARE_ES_ENABLED", "OPENSEARCH_URL", "SHOPWARE_HTTP_CACHE_ENABLED", "REDIS_URL", "GENERATE_SOURCEMAPS"]
summary: "Reference of Shopware 6.7 environment variables with defaults: app paths, database/TLS, messenger, OpenSearch/Elasticsearch, HTTP cache, Redis, build."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/database.md"]
---
## What it is

Reference list of the environment variables Shopware 6.7 reads, with defaults (in parentheses; empty defaults omitted).

## When to use

Writing `.env`/`.env.local` or container environment for a deployment.

## Key steps / config

- **App**: `APP_ENV` (`prod`), `APP_SECRET` and `INSTANCE_ID` (generate: `openssl rand -hex 32`), `APP_URL`, `APP_URL_CHECK_DISABLED` (`false`), `APP_BUILD_DIR`/`APP_CACHE_DIR` (`{projectRoot}/var/cache`), `APP_LOG_DIR` (`{projectRoot}/var/log`), `SHOPWARE_ADMINISTRATION_PATH_NAME` (`admin`), `SHOPWARE_DISABLE_UPDATE_CHECK`, `COMPOSER_HOME` (`/tmp/composer`).
- `COMPOSER_PLUGIN_LOADER`: non-empty → all plugins in root `composer.json` active, database state ignored.
- `ENABLE_SERVICES` (`auto` from `APP_ENV`; `1`/`0`; `0` = Shopware Services not installed).
- `BLUE_GREEN_DEPLOYMENT`: needs SUPER privilege (triggers); default see Gotchas.
- **Database** ([details](platform/dev/6.7/guides/hosting/infrastructure/database.md)): `DATABASE_URL` = `mysql://user:password@host:port/dbname`; TLS via `DATABASE_SSL_CA`, `DATABASE_SSL_CERT`, `DATABASE_SSL_KEY`, `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` (non-prod, PHP 8.2+), applied by `MySQLFactory` — not DSN query params; `DATABASE_PERSISTENT_CONNECTION`, `DATABASE_PROTOCOL_COMPRESSION`.
- **Queues/infra**: `MESSENGER_TRANSPORT_DSN`, `MESSENGER_TRANSPORT_FAILURE_DSN`, `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN`, `LOCK_DSN` (`flock`), `MAILER_DSN` (`null://localhost`), `REDIS_URL`, `REDIS_PREFIX`, `FASTLY_API_KEY`, `PROXY_URL`.
- **HTTP cache**: `SHOPWARE_HTTP_CACHE_ENABLED` (`1`), `SHOPWARE_HTTP_DEFAULT_TTL` (`7200`).
- **Storefront search**: `OPENSEARCH_URL`, `SHOPWARE_ES_ENABLED` (`0`), `SHOPWARE_ES_INDEXING_ENABLED` (`0`), `SHOPWARE_ES_INDEX_PREFIX`, `SHOPWARE_ES_INDEXING_BATCH_SIZE` (`100`), `SHOPWARE_ES_EXCLUDE_SOURCE` (`0`), `SHOPWARE_ES_THROW_EXCEPTION` (`1`), `SHOPWARE_ES_NGRAM_MIN_GRAM` (`4`), `SHOPWARE_ES_NGRAM_MAX_GRAM` (`5`), `SHOPWARE_ES_USE_LANGUAGE_ANALYZER` (`1`; `0` = `sw_whitespace_analyzer`), `SHOPWARE_ES_DIMENSION_NORMALIZE` (`0`, 6.7.12.0+, reindex with `bin/console es:index`).
- **Admin search**: `ADMIN_OPENSEARCH_URL`, `SHOPWARE_ADMIN_ES_ENABLED`, `SHOPWARE_ADMIN_ES_INDEX_PREFIX` (`sw-admin`), `SHOPWARE_ADMIN_ES_INDEXING_BATCH_SIZE` (`1000`), `SHOPWARE_ADMIN_ES_THROW_EXCEPTION` (`1`), `SHOPWARE_ADMIN_ES_REFRESH_INDICES` (auto-create indices instead of `bin/console es:admin:index`), `ENABLE_OPENSEARCH_FOR_ADMIN_API` (experimental, 6.7.9.0+, needs `SHOPWARE_ADMIN_ES_ENABLED=1`).
- **Build**: `GENERATE_SOURCEMAPS=true` → sourcemaps in production Storefront/Vite builds (6.7.13.0+).

## Essential identifiers

`APP_SECRET`, `APP_URL`, `DATABASE_URL`, `DATABASE_SSL_CA`, `MySQLFactory`, `MESSENGER_TRANSPORT_DSN`, `OPENSEARCH_URL`, `SHOPWARE_ES_ENABLED`, `SHOPWARE_HTTP_CACHE_ENABLED`, `COMPOSER_PLUGIN_LOADER`, `ENABLE_SERVICES`

## Gotchas

- `BLUE_GREEN_DEPLOYMENT`: docs say default `0`, but unset resolves `shopware.deployment.blue_green` to `true`; the installer's `.env` writes `0`. Set it explicitly.
- `SHOPWARE_DBAL_TOKEN_MINIMUM_LENGTH` (`3`) and `SHOPWARE_DBAL_TIMEZONE_SUPPORT_ENABLED` (`0`) are deprecated for v6.8.0.
- `SHOPWARE_ADMIN_ES_REFRESH_INDICES` adds an alias check per indexer per write; auto-created indices stay empty until reindex.
- Sourcemaps can expose source code; keep `FASTLY_API_KEY` out of version control.

## Code check (6.7.13.0)
- confirmed `DATABASE_SSL_CA` — read by MySQLFactory into PDO SSL CA option — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:69
- confirmed `DATABASE_PERSISTENT_CONNECTION` — sets `PDO::ATTR_PERSISTENT` — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:85
- confirmed `DATABASE_PROTOCOL_COMPRESSION` — sets MySQL compress attribute — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:89
- corrected `BLUE_GREEN_DEPLOYMENT` — docs: default `0`; unset falls back to `defaults_bool_true` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:408
- confirmed `SHOPWARE_HTTP_DEFAULT_TTL` — default parameter 7200 — vendor/shopware/core/Framework/DependencyInjection/services.xml:43
- confirmed `ENABLE_SERVICES` — default `auto` — vendor/shopware/core/Service/DependencyInjection/services.xml:8
- confirmed `APP_URL_CHECK_DISABLED` — default `false` — vendor/shopware/core/Maintenance/DependencyInjection/services.xml:7
- confirmed `GENERATE_SOURCEMAPS` — enables `source-map` in storefront webpack when `true` — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:109
- deprecated `SHOPWARE_DBAL_TOKEN_MINIMUM_LENGTH` — `@deprecated tag:v6.8.0`, default `3` — vendor/shopware/core/Framework/DependencyInjection/data-abstraction-layer.php:157
- deprecated `SHOPWARE_DBAL_TIMEZONE_SUPPORT_ENABLED` — `@deprecated tag:v6.8.0`, default `0` — vendor/shopware/core/Framework/DependencyInjection/data-abstraction-layer.php:154
