---
id: platform/dev/6.6/guides/hosting/configurations/shopware/environment-variables.md
title: Environment Variables
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/configurations/shopware/environment-variables.html
sourceHash: b9698c3318c6d1b3371aac23a51a8f039aa29ac8
keywords: ["environment variables", "APP_ENV", "APP_SECRET", "APP_URL", "DATABASE_URL", "INSTANCE_ID", "JWT_PRIVATE_KEY", "JWT_PUBLIC_KEY", "MAILER_DSN", "OPENSEARCH_URL", "SHOPWARE_ES_ENABLED", "MESSENGER_TRANSPORT_DSN", "BLUE_GREEN_DEPLOYMENT"]
summary: "Reference table of all environment variables that configure a Shopware installation, with defaults and descriptions."
lastBuilt: "2026-09-15"
---
## What it is

Lists all environment variables that can be used to configure a Shopware installation.

## Key steps / config

Selected variables and their defaults:

- `APP_ENV` (default `prod`) — environment.
- `APP_SECRET` (empty) — can be generated with `openssl rand -hex 32`.
- `APP_CACHE_DIR` / `APP_BUILD_DIR` / `APP_LOG_DIR` (default under `{projectRoot}/var/...`, since 6.6.8.0) — cache, build, and log directories.
- `INSTANCE_ID` (empty) — unique store identifier, generatable with `openssl rand -hex 32`.
- `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` (empty) — generatable with `shopware-cli project generate-jwt --env`.
- `LOCK_DSN` (default `flock`) — DSN for Symfony locking.
- `APP_URL` (empty) — where Shopware is accessible.
- `BLUE_GREEN_DEPLOYMENT` (default `0`) — needs elevated database privilege to create a trigger.
- `DATABASE_URL`, `DATABASE_SSL_CA`, `DATABASE_SSL_CERT`, `DATABASE_SSL_KEY`, `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` — MySQL DSN and SSL settings.
- `MAILER_DSN` (default `null://localhost`) — mailer DSN, overridden by admin configuration.
- `ENABLE_SERVICES` (default `auto`) — auto-detected from `APP_ENV`; also accepts `true`/`false`.
- `OPENSEARCH_URL`, `SHOPWARE_ES_ENABLED` (default `0`), `SHOPWARE_ES_INDEXING_ENABLED` (default `0`), `SHOPWARE_ES_INDEX_PREFIX` — OpenSearch connection and indexing.
- `COMPOSER_HOME` (default `/tmp/composer`) — caching for the Plugin Manager.
- `SHOPWARE_HTTP_CACHE_ENABLED` (default `1`), `SHOPWARE_HTTP_DEFAULT_TTL` (default `7200`) — HTTP cache.
- `MESSENGER_TRANSPORT_DSN`, `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN`, `MESSENGER_TRANSPORT_FAILURE_DSN` (empty) — async queue DSNs, e.g. an `amqp://` transport.

## Essential identifiers

`APP_ENV`, `APP_SECRET`, `APP_CACHE_DIR`, `APP_BUILD_DIR`, `APP_LOG_DIR`, `INSTANCE_ID`, `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`, `LOCK_DSN`, `APP_URL`, `BLUE_GREEN_DEPLOYMENT`, `DATABASE_URL`, `MAILER_DSN`, `ENABLE_SERVICES`, `OPENSEARCH_URL`, `SHOPWARE_ES_ENABLED`, `SHOPWARE_ES_INDEXING_ENABLED`, `SHOPWARE_ES_INDEX_PREFIX`, `COMPOSER_HOME`, `SHOPWARE_HTTP_CACHE_ENABLED`, `SHOPWARE_HTTP_DEFAULT_TTL`, `MESSENGER_TRANSPORT_DSN`, `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN`, `MESSENGER_TRANSPORT_FAILURE_DSN`.
