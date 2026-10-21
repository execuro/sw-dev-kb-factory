---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/one-time-tasks.md
title: One-Time Tasks
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/one-time-tasks.html
sourceHash: ca886b40b4866e7df8eb425e38d36eb8c892a136
codeCheckedAgainst: "6.7.15.1"
keywords: ["one-time tasks", "deployment helper", "one-time-tasks", "one_time_tasks", "one-time-task:list", "one-time-task:mark", "one-time-task:unmark", "SHOPWARE_DEPLOYMENT_TIMEOUT", "--timeout", "data migration", "idempotent", "deployment script"]
summary: Deployment Helper one-time tasks - scripts run once per environment, before or after migrations, tracked in one_time_tasks, with mark/unmark and timeout.
lastBuilt: 2026-10-21
---
## What it is

One-time tasks are scripts the Deployment Helper (DH) runs once per environment during deployment and then never again — for data fixes, initial setup, or one-off migrations. Execution state is stored in the database table `one_time_tasks`; a task is marked complete only after it succeeds, so a failed task is retried on the next deployment.

## When to use

When a deployment needs a script that must not re-run on later deployments (e.g. migrating custom field data), and you want it versioned in `.config/shopware-project.yml` rather than run manually in production.

## Key steps / config

Define tasks under `deployment.one-time-tasks` in `.config/shopware-project.yml`:

```yaml
deployment:
  one-time-tasks:
    - id: migrate_old_custom_field_to_new
      when: after
      script: |
        %php.bin% bin/console custom:migrate-field-data
```

Timing (`when`):
- `before` — before `system:update:finish` (migrations); use when data must be updated before schema changes.
- `after` (default) — after extensions are managed and installed; safest for most tasks.

Managing tasks:
- `./vendor/bin/shopware-deployment-helper one-time-task:list` — table of tasks, when they ran, status
- `./vendor/bin/shopware-deployment-helper one-time-task:mark <id>` — mark complete without running (e.g. after a manual fix)
- `./vendor/bin/shopware-deployment-helper one-time-task:unmark <id>` — remove the mark so it runs again

Timeout: default 300 seconds per task. Raise it with `vendor/bin/shopware-deployment-helper run --timeout=900` or `export SHOPWARE_DEPLOYMENT_TIMEOUT=900`; `--timeout=null` disables it (not recommended). A timed-out task is marked incomplete and retried.

## Essential identifiers

- `deployment.one-time-tasks` with keys `id`, `when`, `script`
- `%php.bin%` placeholder in `script`
- `one_time_tasks` (DB table)
- `one-time-task:list`, `one-time-task:mark`, `one-time-task:unmark`
- `run --timeout`, `SHOPWARE_DEPLOYMENT_TIMEOUT`

## Gotchas

- Partial failure is not rolled back: if a task migrating 100k records fails at 50k, the first 50k stay changed and the next deployment retries the whole task from the beginning. Make tasks idempotent (check whether work is already done, exit 0 if so).
- Exit non-zero on error so the deployment fails and the task is retried.
- Keep tasks short; for work over ~60s the source suggests a post-deploy webhook or scheduled task instead.
- Test in staging first; remove completed, verified tasks from the config to keep the list clean.

## Code check (6.7.15.1)
- confirmed `one_time_tasks` — table exists without a DAL definition (listed in core's tables-without-definition) — vendor/shopware/core/Framework/DataAbstractionLayer/DefinitionValidator.php:119
- confirmed `system:update:finish` — core console command that "before" tasks run ahead of — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:30
- unverified `one-time-task:mark` — Deployment Helper command (shopware/deployment-helper), out of scope
- unverified `SHOPWARE_DEPLOYMENT_TIMEOUT` — read by Deployment Helper, not core; default 300 not verifiable here
- unverified `%php.bin%` — Deployment Helper script placeholder; out of scope
