---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/reference.md
title: Commands and Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/reference.html
sourceHash: 968054dfb0f97243a54bdfd954cf1c89da51788d
codeCheckedAgainst: "6.7.13.0"
keywords: ["deployment helper", "shopware-deployment-helper", "run", "is-installed", "--skip-theme-compile", "--skip-assets-install", "--timeout", "--project-config", "SHOPWARE_DEPLOYMENT_STAGING", "SHOPWARE_DEPLOYMENT_TIMEOUT", "always_clear", "cli reference", "multi-environment"]
summary: "Deployment Helper CLI reference: run, is-installed, one-time-task and fastly:snippet commands, run options, and multi-environment practices."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md"]
---
## What it is

Reference of the commands and `run` options shipped by the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) (`./vendor/bin/shopware-deployment-helper`), plus best practices for multi-environment deployments.

## When to use

When scripting a deployment pipeline with the Deployment Helper, choosing `run` options, or sharing one `.shopware-project.yml` across production and staging.

## Key steps / config

Commands:

| Command | Purpose |
|---|---|
| `run` | Install or update Shopware (main command) |
| `is-installed` | Exit `0` if installed (user + sales channel exist), `1` if not or DB unreachable |
| `one-time-task:list` / `one-time-task:mark <id>` / `one-time-task:unmark <id>` | Inspect/mark/unmark one-time tasks |
| `fastly:snippet:list` / `fastly:snippet:deploy` / `fastly:snippet:remove <name>` | Manage Fastly VCL snippets |

`run` options:

- `--skip-theme-compile` — theme already compiled in CI/CD
- `--skip-assets-install` — assets already copied in CI/CD (`--skip-asset-install` is a deprecated alias)
- `--timeout=<seconds>` — script timeout; `null` disables; takes precedence over `SHOPWARE_DEPLOYMENT_TIMEOUT` (default `300`)
- `--project-config=<path>` — custom `.shopware-project.yml` (absolute or relative to project root)

`run` exits non-zero if any step fails — treat that as a failed rollout.

Guarding fresh installs:

```bash
if ! ./vendor/bin/shopware-deployment-helper is-installed; then
  export INSTALL_ADMIN_PASSWORD="..."
  export INSTALL_ADMIN_EMAIL="..."
fi
./vendor/bin/shopware-deployment-helper run
```

One committed config, environment differences via env vars:

```yaml
deployment:
  store:
    license-domain: 'example.com'
  staging:
    enabled: false
  hooks:
    post: |
      echo "Deployment complete"
```

On staging set `SHOPWARE_DEPLOYMENT_STAGING=1`; leave it unset/`0` in production.

## Essential identifiers

- `./vendor/bin/shopware-deployment-helper`
- `run`, `is-installed`
- `--skip-theme-compile`, `--skip-assets-install`, `--timeout`, `--project-config`
- `SHOPWARE_DEPLOYMENT_TIMEOUT`, `SHOPWARE_DEPLOYMENT_STAGING`, `INSTALL_ADMIN_PASSWORD`, `INSTALL_ADMIN_EMAIL`
- `deployment.store.license-domain`, `deployment.staging.enabled`, `deployment.hooks.post`, `always_clear`

## Gotchas

- Staging mode is not automatic: after copying the production database, deploy the same code with `SHOPWARE_DEPLOYMENT_STAGING=1` and verify emails are disabled and app connections reset, or staging behaves like production and can leak data.
- Smart cache clearing is the default; setting `always_clear: true` on every deploy slows deployments and can mask real issues — enable only with a specific reason.
- Keep one-time tasks in `.shopware-project.yml` under version control instead of running migrations manually in production.
- Test new extensions (and app connections) on staging before production.

## Code check (6.7.13.0)
- confirmed `theme:compile` — core storefront command that `--skip-theme-compile` skips — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- confirmed `system:setup:staging` — core command behind staging mode — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:24
- unverified `is-installed` — deployment-helper CLI command, outside code-check roots
- unverified `--skip-assets-install` — deployment-helper `run` option, outside code-check roots
- unverified `--project-config` — deployment-helper `run` option, outside code-check roots
- unverified `SHOPWARE_DEPLOYMENT_TIMEOUT` — deployment-helper env var; default 300 not verified in code-check roots
- unverified `SHOPWARE_DEPLOYMENT_STAGING` — deployment-helper env var, outside code-check roots
- unverified `always_clear` — deployment-helper cache config, outside code-check roots
