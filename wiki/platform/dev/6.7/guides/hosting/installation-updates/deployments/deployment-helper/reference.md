---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/reference.md
title: Commands and Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/reference.html
sourceHash: 368350c16392631d034b466f690deee5e7dc0422
codeCheckedAgainst: "6.7.15.1"
keywords: ["deployment helper", "shopware-deployment-helper", "run", "is-installed", "--skip-theme-compile", "--skip-assets-install", "--timeout", "--project-config", "SHOPWARE_DEPLOYMENT_STAGING", "SHOPWARE_DEPLOYMENT_TIMEOUT", "always_clear", "cli reference", "multi-environment"]
summary: Deployment Helper CLI reference - run, is-installed, one-time-task and fastly commands, run options, and multi-environment best practices.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md"]
---
## What it is

Command and option reference for the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) (`./vendor/bin/shopware-deployment-helper`), plus best practices for deploying one configuration to several environments.

## When to use

When scripting a Shopware install/update in CI/CD, guarding fresh installs vs updates, or deciding which `run` options and env vars to set per environment.

## Key steps / config

Commands:

| Command | Purpose |
|---|---|
| `run` | Install or update Shopware (main deployment command) |
| `is-installed` | Exit `0` if installed (user + sales channel exist), `1` if not or DB unreachable |
| `one-time-task:list` / `one-time-task:mark <id>` / `one-time-task:unmark <id>` | Inspect / mark / unmark one-time tasks |
| `fastly:snippet:list` / `fastly:snippet:deploy` / `fastly:snippet:remove <name>` | Manage Fastly VCL snippets |

Guarding a fresh install:

```bash
if ! ./vendor/bin/shopware-deployment-helper is-installed; then
  export INSTALL_ADMIN_PASSWORD="..."
  export INSTALL_ADMIN_EMAIL="admin@example.com"
fi
./vendor/bin/shopware-deployment-helper run
```

`run` options:
- `--skip-theme-compile` — theme already compiled in CI/CD
- `--skip-assets-install` — assets already copied in CI/CD
- `--timeout=<seconds>` — script timeout; `null` disables; takes precedence over `SHOPWARE_DEPLOYMENT_TIMEOUT` (default `300`)
- `--project-config=<path>` — custom project config file (absolute or relative to project root)

`run` exits non-zero if any step fails — treat that as a failed deployment and stop the rollout.

One config for all environments, differences via env vars:

```yaml
# .config/shopware-project.yml
deployment:
  store:
    license-domain: 'example.com'
  staging:
    enabled: false
  hooks:
    post: |
      echo "Deployment complete"
```

On staging set `SHOPWARE_DEPLOYMENT_STAGING=1`; leave it unset/`0` on production.

## Essential identifiers

- `run`, `is-installed`, `one-time-task:*`, `fastly:snippet:*`
- `--skip-theme-compile`, `--skip-assets-install`, `--timeout`, `--project-config`
- `SHOPWARE_DEPLOYMENT_TIMEOUT`, `SHOPWARE_DEPLOYMENT_STAGING`, `INSTALL_ADMIN_PASSWORD`, `INSTALL_ADMIN_EMAIL`
- `.config/shopware-project.yml` keys `deployment.store.license-domain`, `deployment.staging.enabled`, `deployment.hooks.post`

## Gotchas

- `--skip-asset-install` is a deprecated alias for `--skip-assets-install`.
- Staging mode is not automatic: after copying a production DB to staging, deploy the same code, set `SHOPWARE_DEPLOYMENT_STAGING=1`, then verify emails are disabled and app connections reset — otherwise staging behaves as production and can leak data.
- Smart cache clearing is the default; enabling `always_clear: true` on every deployment slows deploys and can mask real issues — only use it with a specific reason (e.g. custom caching in hooks).
- Test new extensions (and app connections) on staging before production.
- Commit one-time tasks in `.config/shopware-project.yml` instead of running migrations manually in production.

## Code check (6.7.15.1)
- confirmed `theme:compile` — core Storefront command that `--skip-theme-compile` skips — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
- confirmed `assets:install` — core command that `--skip-assets-install` skips — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:23
- confirmed `system:install` — core install command used for fresh installs — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:31
- confirmed `system:setup:staging` — core command behind staging mode — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:25
- unverified `is-installed` — Deployment Helper command (shopware/deployment-helper), out of scope
- unverified `SHOPWARE_DEPLOYMENT_TIMEOUT` — Deployment Helper env var, default 300 not verifiable in core
- unverified `always_clear` — Deployment Helper cache option, out of scope
- unverified `--project-config` — Deployment Helper `run` option, out of scope
