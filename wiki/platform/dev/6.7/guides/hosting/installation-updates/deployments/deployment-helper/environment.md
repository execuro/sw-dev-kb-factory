---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/environment.md
title: Environment and Database
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/environment.html
sourceHash: f090a0483b3777710305ff99f28f6ab22b6e9198
codeCheckedAgainst: "6.7.15.1"
keywords: ["DATABASE_URL", "DATABASE_SSL_CA", "INSTALL_ADMIN_PASSWORD", "INSTALL_LOCALE", "INSTALL_CURRENCY", "SALES_CHANNEL_URL", "SHOPWARE_DEPLOYMENT_FORCE_REINSTALL", "SHOPWARE_DEPLOYMENT_TIMEOUT", "SHOPWARE_STORE_ACCOUNT_EMAIL", "FASTLY_API_TOKEN", "system:install", "env vars", "deployment helper environment", "database requirements"]
summary: Deployment Helper env vars and DB requirements - install detection, fresh-install defaults, DB TLS, deploy control, Store and Fastly.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md", "platform/dev/6.7/resources/references/core-reference/commands-reference.md", "platform/dev/6.7/guides/hosting/infrastructure/database.md"]
---
## What it is

The prerequisites and environment variables for the Deployment Helper. It covers the MySQL/MariaDB requirements, how the helper decides whether Shopware is installed, what a fresh install creates, and every env var the helper reads.

## When to use

- Preparing a server, container or CI deploy job for `shopware-deployment-helper run`.
- Setting the initial admin, sales channel URL, DB TLS, Store credentials or Fastly integration.

## Key steps / config

**Database:** reachable at `DATABASE_URL` before the helper runs, writable (create tables, insert data), and compatible with the Shopware version being deployed. An empty database is fine; the helper then runs `system:install`.

**Install detection:** Shopware counts as installed only if all three hold:

- the `system_config` table exists and has content;
- there is at least one row in `user`;
- there is at least one row in `sales_channel`.

If the schema exists but users or sales channels are missing, the helper runs `system:install` again.

**Fresh install creates:**

- The schema, locale, currency and core setup via `system:install`.
- One admin user from `INSTALL_ADMIN_*`.
- A `Storefront` sales channel through `sales-channel:create:storefront`. This happens only if the Storefront is installed and no sales channel with that URL exists. The URL is `SALES_CHANNEL_URL`, falling back to `APP_URL`, otherwise empty.
- The default Storefront theme assignment.
- Messenger transport tables and queues.
- All configured plugins and apps.

Create additional users and sales channels yourself.

### Installation (fresh install only, read by the helper)

| Variable | Default |
|---|---|
| `INSTALL_LOCALE` | `en-GB` (passed as `--shop-locale`) |
| `INSTALL_CURRENCY` | `EUR` (passed as `--shop-currency`) |
| `INSTALL_ADMIN_USERNAME` | `admin` |
| `INSTALL_ADMIN_PASSWORD` | `shopware` (change it) |
| `INSTALL_ADMIN_EMAIL` | empty |
| `SALES_CHANNEL_URL` / `APP_URL` | not set |

For other `system:install` options, see the [commands reference](platform/dev/6.7/resources/references/core-reference/commands-reference.md).

### Database connection

`DATABASE_URL` (required, e.g. `mysql://user:pass@host:3306/shop`), `DATABASE_SSL_CA`, `DATABASE_SSL_CERT`, `DATABASE_SSL_KEY`, `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` (any value skips server-cert verification; dev/test only). TLS details are on the [database page](platform/dev/6.7/guides/hosting/infrastructure/database.md).

### Deployment control

- `SHOPWARE_DEPLOYMENT_TIMEOUT`: maximum seconds per step, default `300`; `null` disables the limit.
- `SHOPWARE_DEPLOYMENT_FORCE_REINSTALL=1`: forces a fresh install with `--drop-database`, which destroys existing data.
- `SHOPWARE_DEPLOYMENT_STAGING=1`: enables staging mode on every deployment.
- `SHOPWARE_PROJECT_CONFIG_FILE`: custom path to the project config, absolute or relative to the project root.

### Store, usage data, Fastly

- Store authentication is required for apps and optional if you only use plugins. Use `SHOPWARE_STORE_ACCOUNT_EMAIL` + `SHOPWARE_STORE_ACCOUNT_PASSWORD`, or `SHOPWARE_STORE_SHOP_SECRET` (PaaS Native only).
- `SHOPWARE_STORE_LICENSE_DOMAIN` overrides `deployment.store.license-domain`.
- `SHOPWARE_USAGE_DATA_CONSENT` = `accepted`|`revoked` overrides the Admin setting.
- `DO_NOT_TRACK` (any value) opts out of helper telemetry.
- `FASTLY_API_TOKEN` + `FASTLY_SERVICE_ID` are required to deploy VCL snippets. `FASTLY_DISABLE_SNIPPET_UPDATE=1` turns off snippet updates during `run`.

On Shopware PaaS, store sensitive values in the [Vault](platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md).

## Essential identifiers

- `DATABASE_URL`, `DATABASE_SSL_CA`, `DATABASE_SSL_CERT`, `DATABASE_SSL_KEY`, `DATABASE_SSL_DONT_VERIFY_SERVER_CERT`
- `INSTALL_LOCALE`, `INSTALL_CURRENCY`, `INSTALL_ADMIN_USERNAME`, `INSTALL_ADMIN_PASSWORD`, `INSTALL_ADMIN_EMAIL`, `SALES_CHANNEL_URL`, `APP_URL`
- `SHOPWARE_DEPLOYMENT_TIMEOUT`, `SHOPWARE_DEPLOYMENT_FORCE_REINSTALL`, `SHOPWARE_DEPLOYMENT_STAGING`, `SHOPWARE_PROJECT_CONFIG_FILE`
- `SHOPWARE_STORE_ACCOUNT_EMAIL`, `SHOPWARE_STORE_ACCOUNT_PASSWORD`, `SHOPWARE_STORE_SHOP_SECRET`, `SHOPWARE_STORE_LICENSE_DOMAIN`
- `SHOPWARE_USAGE_DATA_CONSENT`, `DO_NOT_TRACK`, `FASTLY_API_TOKEN`, `FASTLY_SERVICE_ID`, `FASTLY_DISABLE_SNIPPET_UPDATE`

## Gotchas

- The `INSTALL_*` variables are read by the Deployment Helper, not by `bin/console system:install`, and apply only on a fresh install.
- The default `INSTALL_ADMIN_PASSWORD` (`shopware`) is a production security risk. Change it immediately.
- `SHOPWARE_DEPLOYMENT_FORCE_REINSTALL=1` wipes the database on every run while it is set.

## Code check (6.7.15.1)
- confirmed `shop-locale` — `system:install` option exists — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:57
- confirmed `shop-currency` — `system:install` option exists — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:58
- confirmed `drop-database` — `system:install` option exists — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:51
- confirmed `url` — `sales-channel:create:storefront` option exists — vendor/shopware/storefront/Framework/Command/SalesChannelCreateStorefrontCommand.php:48
- confirmed `DATABASE_URL` — read by core when building the DB connection info — vendor/shopware/core/Maintenance/System/Struct/DatabaseConnectionInformation.php:53
- confirmed `DATABASE_SSL_CA` — read by the core MySQLFactory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:69
- confirmed `DATABASE_SSL_KEY` — read by the core MySQLFactory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:77
- confirmed `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` — read by core, applied only when the PDO constant exists — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:81
- unverified `INSTALL_ADMIN_PASSWORD` — read by the deployment-helper package, out of scope
- unverified `SHOPWARE_DEPLOYMENT_TIMEOUT` — read by the deployment-helper package, out of scope
