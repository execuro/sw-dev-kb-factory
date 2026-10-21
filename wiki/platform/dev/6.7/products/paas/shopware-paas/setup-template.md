---
id: platform/dev/6.7/products/paas/shopware-paas/setup-template.md
title: Setup Template
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/setup-template.html
sourceHash: 3195ccdda54ed93472294148f08277716c287359
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware/paas-meta", ".platform/applications.yaml", ".platform/routes.yaml", ".platform/services.yaml", "prestart_cacheclear.sh", "config/packages/paas.yaml", "build hook", "deploy hook", "post_deploy", "mounts", "workers", "relationships", "DATABASE_URL", "MESSENGER_TRANSPORT_DSN", "paas environment variables"]
summary: Files the shopware/paas-meta Flex recipe adds (applications/routes/services.yaml, hooks, mounts, workers) and the env vars PaaS sets per service.
lastBuilt: 2026-10-21
---
## What it is

The Shopware PaaS setup template is installed by Symfony Flex when you require `shopware/paas-meta`. It holds the build and deployment logic and the infrastructure/service configuration. Files added:

```text
.platform/applications.yaml
.platform/routes.yaml
.platform/services.yaml
bin/prestart_cacheclear.sh
config/packages/paas.yaml
files/theme-config/
```

## When to use

When you customise the build/deploy behaviour, services, mounts or workers of a Shopware PaaS project, or need to know which environment variables PaaS injects.

## Key steps / config

`.platform/applications.yaml` ([recipe](https://github.com/shopware/recipes/blob/main/shopware/paas-meta/6.4/.platform/applications.yaml)), by section:

- `name`: the app name, used in commands such as `shopware ssh -A app 'bin/console theme:dump'`. Leave it as `app` unless you have a reason to change it.
- `type`: the base image for the build. This is where you set the PHP version.
- `variables`: environment variables and server settings, including feature flags. Entries under `env` are injected as environment variables and override values from `.env`.
- `hooks`:
  - build hook: installs Composer dependencies, builds core and extension JS/CSS, and disables the UI installer. The filesystem is writable during this step. No services (database, Redis) are reachable.
  - deploy hook: copies the theme config, runs migrations, sets sales channel domains on non-production environments, and clears the cache. On the first deployment it also runs setup, sets the theme, generates secrets and creates `install.lock`.
  - `post_deploy`: runs after the container accepts connections.
- `relationships`: maps services from `services.yaml` to the app.
- `mounts`: the writable directories after the build, of type `local` (per app instance, e.g. `/var/cache`) or `service` (a shared `network-storage` service, e.g. `/public/media`, which the workers also need).
- `web`: the public root `public/index.php`.
- `workers`: two by default, one for message queues and one for scheduled tasks.

`.platform/routes.yaml` routes incoming HTTP requests to the `app` instance. `.platform/services.yaml` enables four services by default: `db`, `cacheredis`, `rabbitmq` and `fileshare`. Check your theme configuration in to `files/theme-config` so you can build without a database.

PaaS sets these environment variables automatically, by relationship name:

| Relationship | Variables |
|---|---|
| (global) | `APP_SECRET`, `APP_ENV`, `APP_URL`, `MAILER_DSN` |
| `database` / `database-replica` | `DATABASE_URL` / `DATABASE_REPLICA_0_URL` |
| `rabbitmqqueue` | `MESSENGER_TRANSPORT_DSN`, `MESSENGER_TRANSPORT_DSN_PREFIX` |
| `rediscache` | `CACHE_DSN`, `CACHE_URL` |
| `redissession` | `SESSION_REDIS_HOST`, `SESSION_REDIS_PORT`, `SESSION_REDIS_URL` |
| `opensearch` | `OPENSEARCH_URL`, `ADMIN_OPENSEARCH_URL` |
| `elasticsearch` | `ELASTICSEARCH_HOST`, `ELASTICSEARCH_PORT`, `ELASTICSEARCH_URL` |
| `mongodatabase` | `MONGODB_SERVER`, `MONGODB_DB`, `MONGODB_USERNAME`, `MONGODB_PASSWORD` |

## Essential identifiers

- `shopware/paas-meta`, `.platform/applications.yaml`, `.platform/routes.yaml`, `.platform/services.yaml`
- `bin/prestart_cacheclear.sh`, `config/packages/paas.yaml`, `files/theme-config`
- `install.lock`, `bin/console theme:dump`
- `DATABASE_URL`, `MESSENGER_TRANSPORT_DSN`, `OPENSEARCH_URL`, `APP_URL`

## Gotchas

- The deploy hook cuts the environment off from web traffic while it runs. Keep it short and do as much work as possible in the build hook. Requests that arrive during deployment are queued in a suspended state and take longer to complete.
- Storage is read-only after the build. Mounts are writable only afterwards and are not available during the build.
- Do not share `/var/cache` between app servers. Make it a `local` mount.

## Code check (6.7.15.1)
- confirmed `theme:dump` — storefront console command — vendor/shopware/storefront/Theme/Command/ThemeDumpCommand.php:30
- confirmed `install.lock` — written to the project dir on install — vendor/shopware/core/Installer/Finish/SystemLocker.php:19
- confirmed `APP_SECRET` — used as framework secret — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:25
- confirmed `MAILER_DSN` — default `null://null` when unset — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:6
- confirmed `MESSENGER_TRANSPORT_DSN` — default doctrine queue when unset — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:3
- confirmed `DATABASE_URL` — read by the MySQL connection factory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:42
- confirmed `DATABASE_REPLICA_0_URL` — read as read-replica URL — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:93
- confirmed `OPENSEARCH_URL` — default for system:setup es-hosts — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:60
- confirmed `APP_URL` — env passed to the Fastly gateway — vendor/shopware/core/Framework/DependencyInjection/cache.php:337
- unverified `shopware/paas-meta` — Flex recipe package, not in the core packages
