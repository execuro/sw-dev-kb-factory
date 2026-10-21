---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/staging.md
title: Staging Mode Integration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/staging.html
sourceHash: 7181528fc75b9ee478834aa09c8d3a8d67e6709f
codeCheckedAgainst: "6.7.15.1"
keywords: ["staging mode", "staging", "deployment helper", "system:setup:staging", "SHOPWARE_DEPLOYMENT_STAGING", "deployment.staging.enabled", "PostDeploy", "production database copy", "data leak", "app reinstall", "disable mail delivery", ".config/shopware-project.yml"]
summary: Deployment Helper staging integration - enable via config or SHOPWARE_DEPLOYMENT_STAGING=1 to run system:setup:staging after each deploy.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/creating-a-staging-instance.md"]
---
## What it is

How the Deployment Helper (DH) re-applies Shopware's staging mode on every deployment, so a staging database refreshed from production gets email disabled, app connections reset and URLs rewritten.

## When to use

On a staging environment whose database is periodically copied from production, especially when the same `.config/shopware-project.yml` is shared with production.

## Key steps / config

Enable in `.config/shopware-project.yml`:

```yaml
deployment:
  staging:
    enabled: true
```

or set `SHOPWARE_DEPLOYMENT_STAGING=1` on the staging environment only (convenient with a shared config file).

When enabled, DH runs `system:setup:staging --no-interaction --force` as a `PostDeploy` event listener after extensions are managed, for both install and update flows. What staging mode changes (banners, domain rewriting, mail delivery, Elasticsearch checks) is configured in core under `shopware.staging` — see [Creating a Staging Instance](platform/dev/6.7/guides/hosting/installation-updates/creating-a-staging-instance.md):

```yaml
shopware:
  staging:
    mailing: { disable_delivery: true }
    storefront: { show_banner: true }
    administration: { show_banner: true }
    sales_channel: { domain_rewrite: [] }
    extensions: { disable: [] }
    elasticsearch: { check_for_existence: true }
```

Production DB copy workflow:
1. Copy the production database to staging.
2. Deploy the codebase to staging.
3. Enable staging mode in DH (or run `bin/console system:setup:staging` manually).

Apps on staging:
1. Deploy code with apps in `custom/apps` or via Composer.
2. `export SHOPWARE_DEPLOYMENT_STAGING=1`.
3. DH installs apps; the PostDeploy listener runs `system:setup:staging`, which deletes apps that have an app secret (an external app server) together with their integration, and deletes the shop ID.
4. On the next deployment apps are reinstalled with fresh instance IDs; configure them with staging/test API keys and webhooks.

## Essential identifiers

- `system:setup:staging` (option `--force`)
- `SHOPWARE_DEPLOYMENT_STAGING`, `deployment.staging.enabled`
- `PostDeploy` event (DH)
- `shopware.staging.*` (core staging config)
- `core.staging` system config flag, set after the command runs

## Gotchas

- Never enable on production: `system:setup:staging` is destructive (deletes apps with external connections, disables mail delivery).
- Shopware does not detect staging vs production by itself; there is no safeguard. Copying production data without staging setup means real customer emails, data leaking via app connections, production URLs in links and metrics reported to production analytics.
- Without `--force` the command asks for interactive confirmation and fails if declined.

## Code check (6.7.15.1)
- confirmed `system:setup:staging` — core console command — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:25
- confirmed `--force` — option `force`/`-f` skips the confirmation prompt — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:48
- confirmed `core.staging` — `SetupStagingEvent::CONFIG_FLAG`, set true after dispatch — vendor/shopware/core/Maintenance/Staging/Event/SetupStagingEvent.php:17
- confirmed `StagingAppHandler` — deletes apps `WHERE app_secret IS NOT NULL` plus their integration — vendor/shopware/core/Maintenance/Staging/Handler/StagingAppHandler.php:14
- confirmed `ShopIdProvider::deleteShopId()` — shop ID removed during staging setup — vendor/shopware/core/Maintenance/Staging/Handler/StagingAppHandler.php:26
- confirmed `core.mailerSettings.disableDelivery` — set when mail delivery is disabled — vendor/shopware/core/Content/Mail/Service/MailSender.php:22
- confirmed `shopware.staging` — default staging config block — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:704
- unverified `SHOPWARE_DEPLOYMENT_STAGING` — Deployment Helper env var (shopware/deployment-helper), out of scope
- unverified `PostDeploy` — Deployment Helper event, out of scope
