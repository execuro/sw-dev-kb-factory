---
id: platform/dev/6.7/products/paas/shopware/guides/cronjobs.md
title: Manage Cron Jobs
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/cronjobs.html
sourceHash: 4f691108ccf9b211116206dc9917905499b27545
codeCheckedAgainst: "6.7.15.1"
keywords: ["cronJobs", "application.yaml", "sw-paas application cronjob", "sw-paas application cron", "cronjob update", "cronjob history list", "cronjob logs", "cron job", "cron expression", "timezone", "scheduled tasks", "paas native", "recurring task"]
summary: PaaS Native cron jobs declared under cronJobs in application.yaml; enable, list, history and logs via sw-paas application cronjob.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/monitoring/logs.md"]
---
## What it is

PaaS Native cron jobs schedule recurring shell commands for an application (cache warming, index updates, data exports). They are declared under the `cronJobs` key in `application.yaml` and managed with the `sw-paas application cronjob` CLI. They are an addition to Shopware's built-in Scheduled Tasks and do not interact with that system at all.

## When to use

Running a `bin/console` (or other shell) command on a fixed cron schedule in a PaaS Native application, independent of Shopware's scheduled task queue.

## Key steps / config

1. Declare jobs in `application.yaml`; they are created, updated or removed on every deployment of the configuration:

```yaml
cronJobs:
  - name: guest-cleanup
    schedule: "0 3 * * *"
    command: "bin/console customer:delete-unused-guests"
  - name: es-index-cleanup
    schedule: "0 4 * * 0"
    command: "bin/console es:index:cleanup"
    timezone: Europe/Berlin   # optional, default UTC
```

| Field | Required | Default | Meaning |
|---|---|---|---|
| `name` | yes | — | Unique id: lowercase `a-z`, `0-9`, `-`; starts/ends with letter or digit; min 2 chars |
| `schedule` | yes | — | Standard 5-field cron (minute hour day-of-month month day-of-week, Sunday = 0) |
| `command` | yes | — | Shell command |
| `timezone` | no | `UTC` | Any IANA identifier; `Local` is not allowed |

Valid names: `guest-cleanup`, `daily-cleanup`. Invalid: `My-Job`, `-my-job`, `my_job`.

2. Jobs are **disabled by default**. Enable them, then redeploy — `cronjob update` changes only apply after a new deployment:
   - Interactive: `sw-paas application cronjob update` (`↑/↓` navigate, `space` toggle, `a` enable all, `d` disable all, `enter` confirm, `q`/`esc` abort).
   - One job: `sw-paas application cronjob update --id <cronjob-id> --enable` (or `--disable`).
   - All: `sw-paas application cronjob update --enable --all` (or `--disable --all`).

3. Inspect:
   - `sw-paas application cronjob list` (`-o json` for JSON) — id, name, schedule, command, timezone, enabled, last run, last status.
   - `sw-paas application cronjob get --id <cronjob-id>` (omit `--id` for a prompt).
   - `sw-paas application cronjob history list` with `--date 2024-01-15`, or `--from "..." --to "..."`, `--cronjob-id <id>`, `--run-id <id>`, `--limit 100 --offset 50`. History is kept 61 days; the Failure Reason column is set only for `FAILED` runs.
   - `sw-paas application cronjob logs [--run-id <run-id>]` prints the full output and ends with a Grafana Explore URL; see [Logs](platform/dev/6.7/products/paas/shopware/monitoring/logs.md).

All commands accept `--organization-id`, `--project-id`, `--application-id`; otherwise the CLI auto-detects from the git remote or prompts. `cron` is a short alias for `cronjob` (e.g. `sw-paas application cron list`).

## Essential identifiers

- `cronJobs` (in `application.yaml`) with `name`, `schedule`, `command`, `timezone`
- `sw-paas application cronjob list | get | update | history list | logs`
- Flags `--id`, `--enable`, `--disable`, `--all`, `--run-id`, `--cronjob-id`, `--date`, `--from`, `--to`, `--limit`, `--offset`, `-o json`

## Gotchas

- Enabled state changes require a redeploy; until then the scheduler uses the previous state.
- `--enable`/`--disable` are mutually exclusive, as are `--all`/`--id`; `--date` cannot be combined with `--from`/`--to`.
- Not a replacement for Shopware Scheduled Tasks (`scheduled-task:run`).

## Code check (6.7.15.1)
- confirmed `customer:delete-unused-guests` — console command used in the example job exists in core — vendor/shopware/core/Checkout/Customer/Command/DeleteUnusedGuestCustomersCommand.php:16
- confirmed `scheduled-task:run` — Shopware's own scheduled task runner, separate from PaaS cron jobs — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:20
- unverified `es:index:cleanup` — Elasticsearch bundle command, outside the checked code roots
- unverified `cronJobs` — PaaS application.yaml key, outside the Shopware code roots
- unverified `sw-paas application cronjob` — PaaS CLI, outside the Shopware code roots
