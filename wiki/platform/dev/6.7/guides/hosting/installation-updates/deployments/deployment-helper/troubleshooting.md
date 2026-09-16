---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/troubleshooting.md
title: Troubleshooting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/troubleshooting.html
sourceHash: 03d45c018e3a66cf0ebf6d4778286082baed28b5
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-deployment-helper", "deployment helper troubleshooting", "SHOPWARE_DEPLOYMENT_TIMEOUT", "one-time-task:list", "one-time-task:mark", "DATABASE_SSL_CA", "system:update:finish", "system:setup:staging", "SHOPWARE_DEPLOYMENT_FORCE_REINSTALL", "FASTLY_API_TOKEN", "deploy failure", "timeout"]
summary: "Fixes for common shopware-deployment-helper run failures: DB connection, step timeouts, one-time tasks, config, extensions, store login, Fastly, staging."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/environment.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/one-time-tasks.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/configuration.md"]
---
## What it is

Symptom-to-fix list for failures of `vendor/bin/shopware-deployment-helper run`. `run` exits non-zero on failure and prints each step's output; find the failing command and re-run it directly (e.g. `bin/console system:update:finish`) for the full error. Full reference: [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md).

## Key steps / config

**Database unreachable** ("Could not connect to database"): the helper retries 10 times, one second apart. Check `DATABASE_URL` reachability, that the DB is up before the helper starts, and for TLS that `DATABASE_SSL_CA` / `DATABASE_SSL_CERT` / `DATABASE_SSL_KEY` point to files readable by PHP. `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` skips server-cert verification (non-production only). See [database](platform/dev/6.7/guides/hosting/infrastructure/database.md).

**Step or one-time task times out** (default 300 s):

```bash
vendor/bin/shopware-deployment-helper run --timeout=900
vendor/bin/shopware-deployment-helper run --timeout=null   # disable
```

`SHOPWARE_DEPLOYMENT_TIMEOUT` also works; `--timeout` takes precedence.

**Theme/assets not pre-built**: build the artifact in CI with `shopware-cli project ci`, deploy with `run --skip-theme-compile --skip-assets-install`. Fix the CI artifact instead of compiling at deploy time.

**One-time task reruns every deploy**: it is recorded only after full success, so it is failing partway. Inspect with `./vendor/bin/shopware-deployment-helper one-time-task:list`; mark done with `one-time-task:mark <id>`; force rerun with `one-time-task:unmark <id>`.

**Config has no effect**: validate `.shopware-project.yml` against the helper's schema in your editor; check nesting under `deployment:`; `SHOPWARE_PROJECT_CONFIG_FILE` or `--project-config` wins over the auto-discovered file; `.shopware-project.local.yml` merges on top.

**Extensions not installed/updated**: `deployment.extension-management.enabled` must be `true`; the extension must not be under `exclude` or set to `state: ignore` / `inactive` in `overrides`. Do not manage extensions from both Store/Admin and the helper.

**Store login / license refresh fails**: set `SHOPWARE_STORE_ACCOUNT_EMAIL` + `SHOPWARE_STORE_ACCOUNT_PASSWORD` (or `SHOPWARE_STORE_SHOP_SECRET`) and a license domain via `deployment.store.license-domain` or `SHOPWARE_STORE_LICENSE_DOMAIN`.

**Fastly snippets not updating**: automatic deployment needs a `config/fastly` directory, `FASTLY_API_TOKEN` and `FASTLY_SERVICE_ID` set, and `FASTLY_DISABLE_SNIPPET_UPDATE` not `1`. Manual: `fastly:snippet:*` commands.

**Staging DB copy sends real mails**: run `./bin/console system:setup:staging` once, or set `SHOPWARE_DEPLOYMENT_STAGING=1`, or in `.shopware-project.yml`:

```yaml
deployment:
  staging:
    enabled: true
  cache:
    always_clear: true   # only if cache must be cleared every deploy
```

## Essential identifiers

- `vendor/bin/shopware-deployment-helper run` (`--timeout`, `--skip-theme-compile`, `--skip-assets-install`, `--project-config`)
- `one-time-task:list`, `one-time-task:mark`, `one-time-task:unmark`
- `SHOPWARE_DEPLOYMENT_TIMEOUT`, `SHOPWARE_DEPLOYMENT_STAGING`, `SHOPWARE_DEPLOYMENT_FORCE_REINSTALL`

## Gotchas

- `system:update:finish` (migrations) runs only when the Shopware version changed; redeploying the same version skips it by design.
- Cache clearing is smart by default (only on detected changes).
- `SHOPWARE_DEPLOYMENT_FORCE_REINSTALL=1` triggers a fresh `install` with `--drop-database` and destroys data — disposable environments only.

## Code check (6.7.13.0)
- confirmed `system:update:finish` — core console command — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:29
- confirmed `system:setup:staging` — core console command — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:24
- confirmed `DATABASE_SSL_CA` — read by the MySQL connection factory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:69
- confirmed `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` — read by the MySQL connection factory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:81
- confirmed `drop-database` — `system:install` option "Drop existing database" — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:47
- unverified `vendor/bin/shopware-deployment-helper` — shopware/deployment-helper package, outside the checked vendor roots
- unverified `SHOPWARE_DEPLOYMENT_TIMEOUT` — deployment-helper env var, out of scope (default 300 s not checkable)
- unverified `one-time-task:list` — deployment-helper command, out of scope
- unverified `FASTLY_API_TOKEN` — deployment-helper Fastly integration, out of scope
- unverified `SHOPWARE_DEPLOYMENT_FORCE_REINSTALL` — deployment-helper env var, out of scope
