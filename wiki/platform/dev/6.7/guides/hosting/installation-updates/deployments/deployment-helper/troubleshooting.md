---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/troubleshooting.md
relatedPages:
  - platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md
  - platform/dev/6.7/guides/hosting/infrastructure/database.md
  - platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/environment.md
  - platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/one-time-tasks.md
sourceHash: 1a43cee5d5a6b98db4187e0c9e7868f0eba7f7a8
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/troubleshooting.html
title: Troubleshooting
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware-deployment-helper", "deployment helper troubleshooting", "SHOPWARE_DEPLOYMENT_TIMEOUT", "--timeout", "DATABASE_SSL_CA", "one-time-task:list", "one-time-task:mark", "system:update:finish", "system:setup:staging", "SHOPWARE_DEPLOYMENT_FORCE_REINSTALL", "FASTLY_API_TOKEN", "deploy fails", "step timeout"]
summary: "Deployment Helper run failures and fixes: DB connection, step timeouts, one-time tasks, config, extensions, Store, Fastly, staging."
lastBuilt: 2026-10-21
---
## What it is

Symptom-by-symptom fixes for `vendor/bin/shopware-deployment-helper run`. `run` exits non-zero and prints each step's output; re-run the failing Shopware command directly (e.g. `bin/console system:update:finish`) for its full error. Reference: [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md).

## When to use

A Deployment Helper deploy fails, times out, repeats a task, ignores config, or leaves extensions, Fastly snippets or staging in an unexpected state.

## Key steps / config

- **DB unreachable** (`Could not connect to database`; helper retries 10x, 1 s apart): check `DATABASE_URL` reachability, DB started before the helper, and for TLS `DATABASE_SSL_CA` / `DATABASE_SSL_CERT` / `DATABASE_SSL_KEY` readable by PHP; `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` skips cert verification (non-production). See [database TLS](platform/dev/6.7/guides/hosting/infrastructure/database.md).
- **Step timeout** (default 300 s, one-time tasks too): `run --timeout=900`, `run --timeout=null` (disable), or `SHOPWARE_DEPLOYMENT_TIMEOUT=900`; `--timeout` wins.
- **Theme/assets**: build with `shopware-cli project ci`, deploy with `run --skip-theme-compile --skip-assets-install`. Missing assets = broken CI artifact; do not compile at deploy time.
- **One-time task re-runs**: only recorded after full success, so it fails partway:

```bash
./vendor/bin/shopware-deployment-helper one-time-task:list
./vendor/bin/shopware-deployment-helper one-time-task:mark <id>    # stop re-running
./vendor/bin/shopware-deployment-helper one-time-task:unmark <id>  # force rerun
```

- **Config ignored**: validate `.config/shopware-project.yml` against the helper schema; nest under `deployment:`; `SHOPWARE_PROJECT_CONFIG_FILE` / `--project-config` override discovery; `.config/shopware-project.local.yml` merges on top.
- **Extensions**: `deployment.extension-management.enabled: true`; not in `exclude`, not `state: ignore` / `inactive` in `overrides`; don't manage via both Store/Administration and helper.
- **Store login / license**: `SHOPWARE_STORE_ACCOUNT_EMAIL` + `SHOPWARE_STORE_ACCOUNT_PASSWORD` (or `SHOPWARE_STORE_SHOP_SECRET`), plus `deployment.store.license-domain` or `SHOPWARE_STORE_LICENSE_DOMAIN`.
- **Fastly**: needs `config/fastly` dir, `FASTLY_API_TOKEN`, `FASTLY_SERVICE_ID`, and `FASTLY_DISABLE_SNIPPET_UPDATE` not `1`; else use `fastly:snippet:*`.
- **Staging after DB copy**: `./bin/console system:setup:staging` once, `SHOPWARE_DEPLOYMENT_STAGING=1`, or config:

```yaml
deployment:
  staging:
    enabled: true
  cache:
    always_clear: true   # optional
```

## Essential identifiers

- `vendor/bin/shopware-deployment-helper run`, `--timeout`, `--skip-theme-compile`, `--skip-assets-install`
- `SHOPWARE_DEPLOYMENT_TIMEOUT`, `SHOPWARE_DEPLOYMENT_STAGING`, `SHOPWARE_DEPLOYMENT_FORCE_REINSTALL`
- `bin/console system:update:finish`, `bin/console system:setup:staging`

## Gotchas

- `system:update:finish` runs only when the Shopware version changed; same-version redeploys skip it by design.
- Cache clearing is smart by default; `always_clear: true` forces it every deploy.
- Without staging mode, a copied production DB sends real emails and can leak data to production apps.
- `SHOPWARE_DEPLOYMENT_FORCE_REINSTALL=1` runs a fresh `install` with `--drop-database` — destroys data; never in production.

## Code check (6.7.15.1)
- confirmed `system:update:finish` — console command exists in core — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:30
- confirmed `system:setup:staging` — console command exists in core — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:25
- confirmed `DATABASE_URL` — read by the core MySQL connection factory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:42
- confirmed `DATABASE_SSL_CA` — applied as PDO SSL CA when set — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:69
- confirmed `DATABASE_SSL_CERT` — applied as PDO SSL cert when set — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:73
- confirmed `DATABASE_SSL_KEY` — applied as PDO SSL key when set — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:77
- confirmed `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` — disables server-cert verification when set — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:81
- confirmed `--drop-database` — option of `system:install` — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:51
- unverified `vendor/bin/shopware-deployment-helper` — run/one-time-task commands, timeouts and env vars live in the separate shopware/deployment-helper package, out of scope
- unverified `deployment.extension-management.enabled` — `.config/shopware-project.yml` schema belongs to the deployment-helper package, out of scope
