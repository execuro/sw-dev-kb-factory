---
id: platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md
title: Environment Variables
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/environment-variables.html
sourceHash: cd4cd4fa99f615b65e010a6b022e065bf76adb0e
codeCheckedAgainst: "6.7.15.1"
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/database.md", "platform/dev/6.7/resources/guidelines/code/core/feature-flags.md"]
keywords: ["environment variables", "env vars", ".env", "APP_ENV", "APP_SECRET", "APP_URL", "DATABASE_URL", "DATABASE_SSL_CA", "MESSENGER_TRANSPORT_DSN", "OPENSEARCH_URL", "SHOPWARE_ES_ENABLED", "REDIS_URL", "LOCK_DSN", "COMPOSER_PLUGIN_LOADER", "SHOPWARE_HTTP_CACHE_ENABLED"]
summary: Reference of Shopware 6.7 environment variables (APP_*, DATABASE_*, MESSENGER_*, OpenSearch/ES, Redis, HTTP cache) with defaults and purpose.
lastBuilt: 2026-10-21
---
## What it is

Reference of the environment variables Shopware 6.7 reads, with defaults (none given = empty). Set them in `.env` / `.env.local` or the server/container environment.

## When to use

When deploying Shopware and you need an exact variable name or default.

## Key steps / config

**Application**
- `APP_ENV`=`prod`; `APP_SECRET`, `INSTANCE_ID` (generate with `openssl rand -hex 32`); `APP_URL`; `APP_URL_CHECK_DISABLED`=`false`.
- `APP_BUILD_DIR`, `APP_CACHE_DIR`=`{projectRoot}/var/cache`, `APP_LOG_DIR`=`{projectRoot}/var/log` (since 6.6.8.0).
- `SHOPWARE_ADMINISTRATION_PATH_NAME`=`admin`; `SHOPWARE_DISABLE_UPDATE_CHECK`.
- `ENABLE_SERVICES`=`auto` (or `1`/`true`, `0`/`false`; `0` skips Shopware Services).
- `FEATURE_ALL` — feature flag groups, see [feature flags](platform/dev/6.7/resources/guidelines/code/core/feature-flags.md).
- `COMPOSER_HOME`=`/tmp/composer`; `COMPOSER_PLUGIN_LOADER` non-empty: all plugins in root `composer.json` active regardless of DB.
- `BLUE_GREEN_DEPLOYMENT`=`0` (needs SUPER privilege); `GENERATE_SOURCEMAPS`=`true` for prod JS sourcemaps (since 6.7.13.0).

**Database** ([Database](platform/dev/6.7/guides/hosting/infrastructure/database.md))
- `DATABASE_URL` — `mysql://user:password@host:port/dbname`.
- `DATABASE_SSL_CA`, `DATABASE_SSL_CERT`, `DATABASE_SSL_KEY`, `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` — applied by `MySQLFactory`, not DSN params.
- `DATABASE_PERSISTENT_CONNECTION`, `DATABASE_PROTOCOL_COMPRESSION`.

**Queue, lock, mail, cache**
- `MESSENGER_TRANSPORT_DSN`, `MESSENGER_TRANSPORT_FAILURE_DSN`, `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN` (e.g. `amqp://guest:guest@localhost:5672/%2f/default`).
- `LOCK_DSN`=`flock`; `MAILER_DSN`=`null://localhost` (Administration overrides).
- `REDIS_URL` (`redis://host:port`), `REDIS_PREFIX`; `SHOPWARE_HTTP_CACHE_ENABLED`=`1`; `FASTLY_API_KEY`; `PROXY_URL`.

**OpenSearch**
- `OPENSEARCH_URL`, `SHOPWARE_ES_ENABLED`=`0`, `SHOPWARE_ES_INDEXING_ENABLED`=`0`, `SHOPWARE_ES_INDEX_PREFIX`, `SHOPWARE_ES_INDEXING_BATCH_SIZE`=`100`, `SHOPWARE_ES_THROW_EXCEPTION`=`1`, `SHOPWARE_ES_EXCLUDE_SOURCE`=`0`, `SHOPWARE_ES_NGRAM_MIN_GRAM`=`4`, `SHOPWARE_ES_NGRAM_MAX_GRAM`=`5`, `SHOPWARE_ES_USE_LANGUAGE_ANALYZER`=`1`, `SHOPWARE_ES_DIMENSION_NORMALIZE`=`0` (6.7.12.0+, reindex via `bin/console es:index`).
- Admin: `ADMIN_OPENSEARCH_URL`, `SHOPWARE_ADMIN_ES_ENABLED`, `SHOPWARE_ADMIN_ES_INDEX_PREFIX`=`sw-admin`, `SHOPWARE_ADMIN_ES_INDEXING_BATCH_SIZE`=`1000`, `SHOPWARE_ADMIN_ES_THROW_EXCEPTION`=`1`, `SHOPWARE_ADMIN_ES_REFRESH_INDICES`.
- `ENABLE_OPENSEARCH_FOR_ADMIN_API=1` (experimental, 6.7.9.0+) needs `ADMIN_OPENSEARCH_URL` and `SHOPWARE_ADMIN_ES_ENABLED=1`.

## Gotchas

- Deprecated for v6.8.0 in code: `SHOPWARE_HTTP_DEFAULT_TTL` (default `7200`), `SHOPWARE_DBAL_TOKEN_MINIMUM_LENGTH` (default `3`), `SHOPWARE_DBAL_TIMEZONE_SUPPORT_ENABLED` (default `0`).
- `SHOPWARE_ADMIN_ES_REFRESH_INDICES` costs an alias check per indexer on every write; auto-created indices stay empty until a full reindex.
- `DATABASE_SSL_DONT_VERIFY_SERVER_CERT=1`: non-production only, PHP 8.2+.

## Code check (6.7.15.1)
- confirmed `LOCK_DSN` — default `flock` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:7
- confirmed `ENABLE_SERVICES` — default `auto` — vendor/shopware/core/Service/DependencyInjection/services.php:66
- confirmed `SHOPWARE_ADMINISTRATION_PATH_NAME` — default `admin` — vendor/shopware/core/Installer/DependencyInjection/services.php:98
- confirmed `DATABASE_SSL_CA` — read by MySQLFactory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:69
- confirmed `DATABASE_PERSISTENT_CONNECTION` — read by MySQLFactory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:85
- confirmed `ENABLE_OPENSEARCH_FOR_ADMIN_API` — feature flag, default false, read by Administration list pages — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:54
- confirmed `SHOPWARE_ADMIN_ES_INDEX_PREFIX` — installer default `sw-admin` — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:53
- deprecated `SHOPWARE_HTTP_DEFAULT_TTL` — default 7200, `@deprecated tag:v6.8.0` — vendor/shopware/core/Framework/DependencyInjection/services.php:194
- deprecated `SHOPWARE_DBAL_TOKEN_MINIMUM_LENGTH` — `@deprecated tag:v6.8.0` — vendor/shopware/core/Framework/DependencyInjection/data-abstraction-layer.php:163
- deprecated `SHOPWARE_DBAL_TIMEZONE_SUPPORT_ENABLED` — `@deprecated tag:v6.8.0`, then always enabled — vendor/shopware/core/Framework/DependencyInjection/data-abstraction-layer.php:160
