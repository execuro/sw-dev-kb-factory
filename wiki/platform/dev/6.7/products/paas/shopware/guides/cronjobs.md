---
id: platform/dev/6.7/products/paas/shopware/guides/cronjobs.md
title: Manage Cron Jobs
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/cronjobs.html
sourceHash: 4f691108ccf9b211116206dc9917905499b27545
codeCheckedAgainst: "6.7.13.0"
keywords: ["cronJobs", "application.yaml", "sw-paas application cronjob", "sw-paas application cron", "cronjob history list", "cronjob logs", "customer:delete-unused-guests", "es:index:cleanup", "cron expression", "timezone", "paas native", "scheduled jobs", "recurring tasks"]
summary: "PaaS Native cronJobs in application.yaml (name, schedule, command, timezone) and sw-paas application cronjob list/get/update/history/logs CLI."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/monitoring/logs.md"]
---
## What it is

Shopware PaaS Native cron jobs: recurring shell commands declared under the `cronJobs` key of `application.yaml` and managed with the `sw-paas` CLI. They are separate from, and do not interact with, Shopware's built-in Scheduled Tasks.

## When to use

When a PaaS Native application needs a command run on a fixed schedule, or you need to enable/disable jobs, inspect run history, or read job logs.

## Key steps / config

1. Declare jobs in `application.yaml`; they are created, updated or removed on each deployment:

```yaml
cronJobs:
  - name: guest-cleanup
    schedule: "0 3 * * *"
    command: "bin/console customer:delete-unused-guests"
    timezone: Europe/Berlin   # optional, default UTC
```

Fields: `name` (required, unique; lowercase `a-z`, digits, hyphens; starts/ends with letter or digit; min 2 chars), `schedule` (required, 5-field cron, Sunday = 0), `command` (required), `timezone` (optional, default `UTC`, IANA identifier).

2. Deploy, then enable (jobs are disabled by default), then redeploy — enabled-state changes apply only after a new deployment:
   - `sw-paas application cronjob update` (interactive menu)
   - `sw-paas application cronjob update --id <cronjob-id> --enable` / `--disable`
   - `sw-paas application cronjob update --enable --all` / `--disable --all`
3. Inspect:
   - `sw-paas application cronjob list` (`-o json`)
   - `sw-paas application cronjob get --id <cronjob-id>`
   - `sw-paas application cronjob history list` with `--date`, `--from`/`--to`, `--cronjob-id`, `--run-id`, `--limit`, `--offset`
   - `sw-paas application cronjob logs [--run-id <run-id>]` — ends with a Grafana Explore URL; see [Logs](platform/dev/6.7/products/paas/shopware/monitoring/logs.md).
4. `--organization-id`, `--project-id`, `--application-id` target a resource; otherwise it is detected from the git remote or prompted. `cron` aliases `cronjob`.

## Essential identifiers

- `cronJobs` (`name`, `schedule`, `command`, `timezone`)
- `sw-paas application cronjob list|get|update|history list|logs`

## Gotchas

- `timezone: Local` is explicitly rejected.
- `--enable`/`--disable` and `--all`/`--id` are mutually exclusive; `--date` cannot be combined with `--from`/`--to`.
- History is kept 61 days; Failure Reason is set only for `FAILED` runs.
- Installed code: `customer:delete-unused-guests` asks an interactive confirmation (default "no") before deleting — verify it deletes in an unattended run. Core already ships the daily scheduled task `customer.delete_unused_guests`.
- `es:index:cleanup` needs `shopware/elasticsearch`, not installed in this project.

## Code check (6.7.13.0)
- confirmed `customer:delete-unused-guests` — console command exists in core — vendor/shopware/core/Checkout/Customer/Command/DeleteUnusedGuestCustomersCommand.php:15
- confirmed `confirm` — command prompts for confirmation with default false before deleting — vendor/shopware/core/Checkout/Customer/Command/DeleteUnusedGuestCustomersCommand.php:47
- confirmed `customer.delete_unused_guests` — built-in scheduled task covering the same cleanup — vendor/shopware/core/Checkout/Customer/DeleteUnusedGuestCustomerTask.php:13
- confirmed `DAILY` — that scheduled task's default interval — vendor/shopware/core/Checkout/Customer/DeleteUnusedGuestCustomerTask.php:18
- unverified `es:index:cleanup` — shopware/elasticsearch package not installed; not in scanned roots
- unverified `report:generate` — illustrative command name, not found in scanned roots
- unverified `cronJobs` — PaaS application.yaml schema, outside vendor/shopware
- unverified `sw-paas application cronjob` — PaaS CLI, outside vendor/shopware
