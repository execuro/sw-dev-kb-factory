---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/one-time-tasks.md
title: One-Time Tasks
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/one-time-tasks.html
sourceHash: ca886b40b4866e7df8eb425e38d36eb8c892a136
codeCheckedAgainst: "6.7.13.0"
keywords: ["deployment helper", "one-time-tasks", "one_time_tasks", "one-time-task:list", "one-time-task:mark", "one-time-task:unmark", "SHOPWARE_DEPLOYMENT_TIMEOUT", "--timeout", "data migration", "run once", "idempotent", "system:update:finish"]
summary: "Deployment Helper one-time tasks: run-once scripts per environment, when: before/after, one_time_tasks table, mark/unmark commands, 300s timeout."
lastBuilt: 2026-09-15
---
## What it is

One-time tasks are scripts the Deployment Helper runs once per environment during deployment and never again — for data fixes, initial setup or one-off migrations. Execution state is stored in the database table `one_time_tasks`; a task is marked complete only after it succeeds, so a failed task is retried on the next deployment.

## When to use

When a deployment needs a script that must not re-run on later deployments, or when you need to inspect, skip or re-run such a task.

## Key steps / config

Define tasks in `.shopware-project.yml`:

```yaml
deployment:
  one-time-tasks:
    - id: migrate_old_custom_field_to_new
      when: after
      script: |
        %php.bin% bin/console custom:migrate-field-data
```

Timing (`when`):

- `before` — before `system:update:finish` (migrations); for data that must change before schema changes.
- `after` (default) — after extensions are managed and installed; safest for most tasks.

Manage tasks:

- `./vendor/bin/shopware-deployment-helper one-time-task:list` — table of which tasks ran, when, and status
- `./vendor/bin/shopware-deployment-helper one-time-task:mark <id>` — mark as done without running (e.g. after a manual fix)
- `./vendor/bin/shopware-deployment-helper one-time-task:unmark <id>` — remove the mark so it runs again next deployment

Timeout (default 300 seconds; a timed-out task is marked incomplete and retried):

- `vendor/bin/shopware-deployment-helper run --timeout=900`
- `export SHOPWARE_DEPLOYMENT_TIMEOUT=900`
- `--timeout=null` disables the timeout (not recommended)

## Essential identifiers

- `deployment.one-time-tasks[]` with `id`, `when` (`before`/`after`), `script`
- `%php.bin%` placeholder in scripts
- `one_time_tasks` table
- `one-time-task:list`, `one-time-task:mark`, `one-time-task:unmark`
- `run --timeout`, `SHOPWARE_DEPLOYMENT_TIMEOUT`

## Gotchas

- Partial failure is not rolled back: work already written stays in the database, and the retry starts from the beginning — tasks must be idempotent (e.g. check a "done" marker and `exit 0` first).
- Exit non-zero on failure so the deployment fails and the task is retried.
- Keep tasks short (source suggests moving anything over ~60s to a scheduled task or post-deploy webhook); test in staging first; remove completed, verified tasks from the config.

## Code check (6.7.13.0)
- confirmed `one_time_tasks` — table name known to core (listed in DefinitionValidator's ignored tables) — vendor/shopware/core/Framework/DataAbstractionLayer/DefinitionValidator.php:116
- confirmed `system:update:finish` — core console command that `when: before` tasks precede — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:29
- unverified `one-time-task:list` — deployment-helper CLI command, outside code-check roots
- unverified `one-time-task:mark` — deployment-helper CLI command, outside code-check roots
- unverified `one-time-task:unmark` — deployment-helper CLI command, outside code-check roots
- unverified `SHOPWARE_DEPLOYMENT_TIMEOUT` — read by the deployment-helper package, outside code-check roots; default 300 not verified
- unverified `%php.bin%` — deployment-helper script placeholder, outside code-check roots
