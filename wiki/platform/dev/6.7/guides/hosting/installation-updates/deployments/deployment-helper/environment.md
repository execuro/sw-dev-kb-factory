---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/environment.md
title: Environment and Database
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/environment.html
sourceHash: 1d8aa65efe2f82a07129e802b21c91e39fe7516c
codeCheckedAgainst: "6.7.13.0"
keywords: ["deployment helper environment variables", "DATABASE_URL", "INSTALL_ADMIN_PASSWORD", "INSTALL_LOCALE", "SALES_CHANNEL_URL", "SHOPWARE_DEPLOYMENT_TIMEOUT", "SHOPWARE_DEPLOYMENT_FORCE_REINSTALL", "SHOPWARE_PROJECT_CONFIG_FILE", "SHOPWARE_STORE_ACCOUNT_EMAIL", "SHOPWARE_STORE_SHOP_SECRET", "SHOPWARE_USAGE_DATA_CONSENT", "FASTLY_API_TOKEN", "DATABASE_SSL_CA", "install detection", "env vars"]
summary: Deployment Helper database requirements, install detection and env vars - INSTALL_*, DATABASE_URL/SSL, SHOPWARE_DEPLOYMENT_*, store auth, usage data, Fastly.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/database.md", "platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md"]
---
## What it is

Database prerequisites of the Deployment Helper, how it decides whether Shopware is installed, what a fresh install creates, and the environment variables it and the Shopware installation read.

## When to use

When preparing a server, container or CI secret set for `shopware-deployment-helper run`, or when a deployment unexpectedly reinstalls, cannot reach the database, or needs Store/Fastly credentials.

## Key steps / config

The database must be reachable at `DATABASE_URL` before the helper runs, writable, and compatible with the deployed Shopware version. An empty database is fine; the schema is created via `system:install`.

Shopware counts as installed only if the `system_config` table has content and `user` and `sales_channel` each have at least one row.

A fresh install creates the schema, one admin user, one Storefront sales channel named `Storefront`, the default Storefront theme assignment, messenger transport tables/queues, and all configured plugins and apps (unless excluded). More users, sales channels and settings must be added afterwards.

### Installation (fresh install only)

| Variable | Default |
|---|---|
| `INSTALL_LOCALE` | `en-GB` |
| `INSTALL_CURRENCY` | `EUR` |
| `INSTALL_ADMIN_USERNAME` | `admin` |
| `INSTALL_ADMIN_PASSWORD` | `shopware` |
| `INSTALL_ADMIN_EMAIL` | empty |
| `SALES_CHANNEL_URL` | localhost over plain HTTP |
| `APP_URL` | not set; fallback if `SALES_CHANNEL_URL` is unset |

### Database connection

- `DATABASE_URL` (required) — MySQL connection DSN
- `DATABASE_SSL_CA`, `DATABASE_SSL_CERT`, `DATABASE_SSL_KEY` — TLS CA / client cert / client key paths
- `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` — any value skips server cert verification (dev/test only); see [database SSL/TLS](platform/dev/6.7/guides/hosting/infrastructure/database.md)

### Deployment control

- `SHOPWARE_DEPLOYMENT_TIMEOUT` — max seconds per step, default `300`, `null` disables
- `SHOPWARE_DEPLOYMENT_FORCE_REINSTALL` — `1` forces a fresh install with `--drop-database`
- `SHOPWARE_DEPLOYMENT_STAGING` — `1` enables staging mode on every deployment
- `SHOPWARE_PROJECT_CONFIG_FILE` — custom path to `.shopware-project.yml`

### Store authentication (required for apps)

- `SHOPWARE_STORE_ACCOUNT_EMAIL` + `SHOPWARE_STORE_ACCOUNT_PASSWORD`, or `SHOPWARE_STORE_SHOP_SECRET` (PaaS Native only)
- `SHOPWARE_STORE_LICENSE_DOMAIN` — overrides `deployment.store.license-domain`

### Usage, telemetry, Fastly

- `SHOPWARE_USAGE_DATA_CONSENT` — `accepted` or `revoked`; overrides the Admin setting
- `DO_NOT_TRACK` — any value opts out of Deployment Helper telemetry
- `FASTLY_API_TOKEN`, `FASTLY_SERVICE_ID` — both required to deploy VCL snippets; `FASTLY_DISABLE_SNIPPET_UPDATE=1` disables updates during `run`

On Shopware PaaS, keep sensitive values in the [Vault](platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md).

## Essential identifiers

- `DATABASE_URL`, `DATABASE_SSL_CA`
- `INSTALL_ADMIN_USERNAME`, `INSTALL_ADMIN_PASSWORD`, `SALES_CHANNEL_URL`
- `SHOPWARE_DEPLOYMENT_FORCE_REINSTALL`, `SHOPWARE_PROJECT_CONFIG_FILE`
- `SHOPWARE_STORE_ACCOUNT_EMAIL`, `SHOPWARE_STORE_SHOP_SECRET`

## Gotchas

- Change `INSTALL_ADMIN_PASSWORD` from `shopware` immediately; the default is a production security risk.
- A schema without users or sales channels is treated as not installed and `system:install` runs again.
- `SHOPWARE_DEPLOYMENT_FORCE_REINSTALL=1` destroys existing data.

## Code check (6.7.13.0)
- confirmed `DATABASE_URL` — core throws when undefined or not a valid DSN — vendor/shopware/core/Maintenance/System/Struct/DatabaseConnectionInformation.php:55
- confirmed `DATABASE_SSL_CA` — read by core connection info — vendor/shopware/core/Maintenance/System/Struct/DatabaseConnectionInformation.php:83
- confirmed `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` — read by core connection info — vendor/shopware/core/Maintenance/System/Struct/DatabaseConnectionInformation.php:86
- confirmed `system:install` — core install command — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:27
- confirmed `drop-database` — system:install option used by forced reinstall — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:47
- confirmed `shop-locale` — system:install option for the install locale — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:53
- confirmed `shop-currency` — system:install option for the install currency — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:54
- unverified `INSTALL_ADMIN_PASSWORD` — read by the Deployment Helper package, outside the checked roots
- unverified `SHOPWARE_DEPLOYMENT_TIMEOUT` — Deployment Helper variable, outside the checked roots
- unverified `SHOPWARE_USAGE_DATA_CONSENT` — Deployment Helper variable, outside the checked roots
