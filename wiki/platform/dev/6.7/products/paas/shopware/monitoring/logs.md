---
id: platform/dev/6.7/products/paas/shopware/monitoring/logs.md
title: Logs
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/monitoring/logs.html
sourceHash: 187b9f132181ccace3f1ac31a53d0bd2272e9691
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-paas application logs", "sw-paas application deploy logs", "sw-paas application cronjob logs", "sw-paas command logs", "sw-paas open grafana", "LogQL", "--follow", "--component", "application logs", "log retention", "grafana explore", "paas native"]
summary: "sw-paas application logs (--follow, --component, --since, --query LogQL, --output json), deploy/cronjob/command logs, Grafana Logs, 45-day retention."
lastBuilt: 2026-09-15
---
## What it is

How to query and follow runtime, deployment, cron job and command logs of a Shopware PaaS Native application from the `sw-paas` CLI, and how to view them in Grafana.

## When to use

When debugging a PaaS Native environment: inspecting recent errors, streaming live output, reading deployment setup/migration output, or checking a cron job or dedicated-container command run.

## Key steps / config

### Runtime logs

- `sw-paas application logs` — latest logs from the last 15 minutes. If the target cannot be inferred from the git remote, the CLI prompts; or pass `--organization-id <org-id> --project-id <project-id> --application-id <app-id>`.
- `--follow` / `-f` — stream new lines only; add `--since 30m` to include recent history first.
- `--component storefront` — filter by component. Supported: `admin`, `command`, `cronjob`, `migration`, `scheduled-task`, `setup`, `storefront`, `worker`, `app.build`.
- `--time-range 09:00-10:00` — local time window for the current day.
- `--limit 500` — maximum number of returned lines.
- `--query '{component="storefront"} |= "error"'` — raw LogQL query.
- `--raw` — messages only; `--output json` — machine-readable output.

After printing, the CLI outputs a Grafana Explore URL for the same query.

### Specialized log commands

- Deployment setup and migration logs: `sw-paas application deployment logs` (alias `sw-paas application deploy logs`), optionally `--deployment-id <deployment-id>`.
- Cron job run logs: `sw-paas application cronjob logs` (alias `cron`), optionally `--run-id <run-id>`, or select by `--cronjob-id <cronjob-id> --history-limit 100`.
- Dedicated-container command logs: `sw-paas command logs`, optionally `--command-id <command-id>`.
- All three accept `--follow` / `-f` and print a Grafana Explore URL at the end.

### Grafana

1. Run `sw-paas open grafana` to get the URL, username and password.
2. Open **Dashboards**, select the **Logs** dashboard.
3. Filter by component, then use the search box next to the filter.

## Essential identifiers

- `sw-paas application logs`, `sw-paas application deploy logs`, `sw-paas application cronjob logs`, `sw-paas command logs`, `sw-paas open grafana`
- Flags: `--follow`/`-f`, `--since`, `--component`, `--time-range`, `--limit`, `--query`, `--raw`, `--output json`, `--deployment-id`, `--run-id`, `--cronjob-id`, `--history-limit`, `--command-id`

## Gotchas

- `--follow` starts with new lines only; without `--since` you see no history.
- `--time-range` applies to the current day only.
- Logs older than 45 days are removed automatically.

## Code check (6.7.13.0)
- unverified `sw-paas application logs` — PaaS CLI command, not part of vendor/shopware
- unverified `sw-paas application deploy logs` — PaaS CLI command, not part of vendor/shopware
- unverified `sw-paas application cronjob logs` — PaaS CLI command, not part of vendor/shopware
- unverified `sw-paas command logs` — PaaS CLI command, not part of vendor/shopware
- unverified `sw-paas open grafana` — PaaS CLI command, not part of vendor/shopware
- unverified `LogQL` — Grafana Loki query language, outside vendor/shopware
