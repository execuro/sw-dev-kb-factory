---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/staging.md
title: Staging Mode Integration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/staging.html
sourceHash: 71aa58b7f9f220bd6a6777bc4e3d5896bb0c2412
codeCheckedAgainst: "6.7.13.0"
keywords: ["deployment helper", "staging mode", "system:setup:staging", "SHOPWARE_DEPLOYMENT_STAGING", "deployment.staging.enabled", "PostDeploy", "production database copy", "app reinstall", "disable mail delivery", "data leak", "SetupStagingEvent", "staging instance"]
summary: "Deployment Helper staging mode: SHOPWARE_DEPLOYMENT_STAGING or deployment.staging.enabled runs system:setup:staging after deploy; apps get deleted."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/creating-a-staging-instance.md"]
---
## What it is

How the Deployment Helper re-applies Shopware's staging mode on every deployment, so a staging database refreshed from production gets mail delivery disabled, app connections reset and URLs rewritten.

## When to use

When a staging environment regularly receives a copy of the production database and shares the same `.shopware-project.yml` as production.

## Key steps / config

Enable in `.shopware-project.yml`:

```yaml
deployment:
  staging:
    enabled: true
```

or set `SHOPWARE_DEPLOYMENT_STAGING=1` only on the staging environment (convenient when the config file is shared).

When enabled, the Deployment Helper runs `system:setup:staging --no-interaction --force` as a `PostDeploy` event listener after extensions are managed, in both install and update flows. What staging mode changes (banners, URL rewriting, mail delivery, Elasticsearch checks) is configured in core under `shopware.staging` — see [Creating a Staging Instance](platform/dev/6.7/guides/hosting/installation-updates/creating-a-staging-instance.md).

Production DB copy workflow:

1. Copy the production database to staging.
2. Deploy the Shopware codebase to staging.
3. Enable staging mode in the Deployment Helper, or run `bin/console system:setup:staging` manually.

App workflow on staging:

1. Deploy with apps in `custom/apps` or Composer and `SHOPWARE_DEPLOYMENT_STAGING=1`.
2. The Deployment Helper installs apps; the PostDeploy listener then runs `system:setup:staging`, which deletes apps registered with an app server (those with an app secret) plus their integrations, and deletes the shop ID.
3. On the next deployment apps are reinstalled with fresh instance IDs; configure them with staging/test API keys and webhooks.

## Essential identifiers

- `deployment.staging.enabled`
- `SHOPWARE_DEPLOYMENT_STAGING`
- `system:setup:staging` (`--force`, `--no-interaction`)
- `SetupStagingEvent` (core event dispatched by the command)
- `shopware.staging.mailing.disable_delivery` (default `true`)

## Gotchas

- Never enable on production: `system:setup:staging` is destructive (deletes apps with external connections, disables mail delivery).
- Shopware does not detect staging vs production. Copying production data without running staging setup leaves real emails, live app connections, production URLs and production analytics active — this has caused real data leaks.
- Mail delivery is only disabled if `shopware.staging.mailing.disable_delivery` is true (the default).
- Without `--force` the core command asks for confirmation and fails when declined.

## Code check (6.7.13.0)
- confirmed `system:setup:staging` — core command — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:24
- confirmed `force` — option skipping the confirmation prompt — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:48
- confirmed `SetupStagingEvent` — dispatched by the command; handlers apply staging changes — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:60
- confirmed `core.staging` — system config flag set after setup — vendor/shopware/core/Maintenance/Staging/Event/SetupStagingEvent.php:17
- confirmed `app_secret` — only apps with an app secret (app server) are deleted, with their integration — vendor/shopware/core/Maintenance/Staging/Handler/StagingAppHandler.php:31
- confirmed `deleteShopId` — shop ID removed so apps re-register — vendor/shopware/core/Maintenance/Staging/Handler/StagingAppHandler.php:26
- confirmed `disable_delivery` — `shopware.staging.mailing.disable_delivery`, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1228
- confirmed `disableMailDelivery` — mail handler returns early when false — vendor/shopware/core/Maintenance/Staging/Handler/StagingMailHandler.php:23
- unverified `SHOPWARE_DEPLOYMENT_STAGING` — deployment-helper env var, outside code-check roots
- unverified `PostDeploy` — deployment-helper event listener, outside code-check roots
