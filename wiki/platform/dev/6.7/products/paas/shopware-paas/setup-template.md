---
id: platform/dev/6.7/products/paas/shopware-paas/setup-template.md
title: Setup Template
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/setup-template.html
sourceHash: 3195ccdda54ed93472294148f08277716c287359
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware paas", "setup template", "shopware/paas-meta", ".platform/applications.yaml", ".platform/services.yaml", ".platform/routes.yaml", "build hook", "deploy hook", "post_deploy", "mounts", "workers", "relationships", "DATABASE_URL", "MESSENGER_TRANSPORT_DSN", "environment variables"]
summary: "Shopware PaaS setup template from shopware/paas-meta: applications.yaml hooks, mounts, workers, services.yaml, and auto-set env vars like DATABASE_URL."
lastBuilt: 2026-09-15
---
## What it is

The setup template installed by Symfony Flex when requiring `shopware/paas-meta`: build/deploy logic plus infrastructure and service configuration for Shopware PaaS. It adds `.platform/applications.yaml`, `.platform/routes.yaml`, `.platform/services.yaml`, `bin/prestart_cacheclear.sh`, `config/packages/paas.yaml` and `files/theme-config/`.

## When to use

When customizing build/deploy behaviour, services, mounts or workers of a Shopware PaaS project, or looking up which environment variables the platform sets automatically.

## Key steps / config

### `.platform/applications.yaml` sections

- `name` — app name used in commands like `shopware ssh -A app 'bin/console theme:dump'`; leave it as `app`.
- `type` — base build image; sets the PHP version.
- `variables` — env vars, server settings, feature flags. Entries in `env` are injected as environment variables and override `.env` values.
- `hooks`:
  - build hook — builds assets (composer dependencies, core/extension JS and CSS), disables the UI installer. File system writable; no access to services (database, Redis).
  - deploy hook — copies theme config, runs database migrations, sets sales channel domains for non-production environments, clears cache. First deployment also runs setup, sets the theme, generates secrets, creates `install.lock`.
  - `post_deploy` — runs after the container accepts connections.
- `relationships` — maps services from `services.yaml` to the app.
- `mounts` — writable directories after build; type `local` (per service, e.g. `/var/cache`) or `service` (shared `network-storage`, e.g. `/public/media` for workers).
- `web` — routes dynamic requests to `public/index.php`.
- `workers` — two by default: message queue and scheduled tasks.

### Other files

- `.platform/routes.yaml` — routes incoming HTTP requests to `app`.
- `.platform/services.yaml` — default services: `db`, `cacheredis`, `rabbitmq`, `fileshare`.
- `files/theme-config` — theme configuration under version control (builds without database).

### Automatic environment variables (by relationship)

- global: `APP_SECRET`, `APP_ENV`, `APP_URL`, `MAILER_DSN`
- `database`: `DATABASE_URL`; `database-replica`: `DATABASE_REPLICA_0_URL`
- `rabbitmqqueue`: `MESSENGER_TRANSPORT_DSN`, `MESSENGER_TRANSPORT_DSN_PREFIX`
- `rediscache`: `CACHE_DSN`, `CACHE_URL`
- `redissession`: `SESSION_REDIS_HOST`, `SESSION_REDIS_PORT`, `SESSION_REDIS_URL`
- `opensearch`: `OPENSEARCH_URL`, `ADMIN_OPENSEARCH_URL`
- `elasticsearch`: `ELASTICSEARCH_HOST`, `ELASTICSEARCH_PORT`, `ELASTICSEARCH_URL`
- `mongodatabase`: `MONGODB_SERVER`, `MONGODB_DB`, `MONGODB_USERNAME`, `MONGODB_PASSWORD`

## Essential identifiers

- `shopware/paas-meta`, `.platform/applications.yaml`, `.platform/services.yaml`, `.platform/routes.yaml`
- `install.lock`, `bin/console theme:dump`
- `DATABASE_URL`, `MESSENGER_TRANSPORT_DSN`, `OPENSEARCH_URL`

## Gotchas

- Web traffic is cut off while the deploy hook runs; keep it short. Requests are queued in a suspended state, not necessarily failed. Do as much as possible in the build hook.
- Storage is read-only except mounts, and mounts are not available during the build.

## Code check (6.7.13.0)
- confirmed `DATABASE_URL` — read by core MySQL connection factory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:42
- confirmed `DATABASE_REPLICA_0_URL` — replica connection read by core — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:93
- confirmed `MESSENGER_TRANSPORT_DSN` — DSN of the `async` Messenger transport — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:68
- confirmed `APP_SECRET` — used as `framework.secret` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:25
- confirmed `MAILER_DSN` — default `null://null` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:6
- confirmed `APP_URL` — injected into the Fastly gateway — vendor/shopware/core/Framework/DependencyInjection/cache.xml:248
- confirmed `OPENSEARCH_URL` — default for `system:setup --es-hosts` — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:60
- confirmed `ADMIN_OPENSEARCH_URL` — default for `system:setup --admin-es-hosts` — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:63
- confirmed `install.lock` — `system:install` skips when the file exists — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:70
- confirmed `theme:dump` — storefront console command — vendor/shopware/storefront/Theme/Command/ThemeDumpCommand.php:29
