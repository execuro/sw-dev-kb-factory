---
id: platform/dev/6.7/products/paas/shopware/monitoring/logs.md
title: Logs
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/monitoring/logs.html
sourceHash: 187b9f132181ccace3f1ac31a53d0bd2272e9691
codeCheckedAgainst: "6.7.15.1"
keywords: ["logs", "sw-paas application logs", "sw-paas application deploy logs", "sw-paas application cronjob logs", "sw-paas command logs", "sw-paas open grafana", "logql", "grafana", "log streaming", "follow logs", "log retention", "paas native", "runtime logs"]
summary: Query, follow and filter Shopware PaaS Native runtime, deployment, cron job and command logs with sw-paas CLI or Grafana; 45-day retention.
lastBuilt: 2026-10-21
---
## What it is

How to read application logs on Shopware PaaS Native: the `sw-paas` CLI log commands (runtime, deployment, cron job, command logs) and the Grafana **Logs** dashboard.

## When to use

When you need to inspect or stream runtime errors, deployment setup/migration output, cron job runs, or output of commands executed in dedicated containers for a PaaS Native application environment.

## Key steps / config

**Runtime logs**: `sw-paas application logs` returns logs from the last 15 minutes by default. If the target cannot be inferred from the current git remote, the CLI prompts for organization, project and application, or pass them explicitly:

```bash
sw-paas application logs \
  --organization-id <org-id> \
  --project-id <project-id> \
  --application-id <app-id>
```

Options:

- `--follow` / `-f` — stream new lines only; add `--since 30m` to include recent history first.
- `--component <name>` — one of `admin`, `command`, `cronjob`, `migration`, `scheduled-task`, `setup`, `storefront`, `worker`, `app.build`.
- `--time-range 09:00-10:00` — local time window for the current day.
- `--limit 500` — maximum number of returned lines.
- `--query '{component="storefront"} |= "error"'` — raw `LogQL` query.
- `--raw` — print only log messages; `--output json` — machine-readable output.

After printing, the CLI prints a Grafana Explore URL for the same query.

**Specialized commands** (all accept `--follow`/`-f` and also print a Grafana Explore URL):

- Deployment setup and migration logs: `sw-paas application deployment logs` (alias `sw-paas application deploy logs`), optionally `--deployment-id <deployment-id>`.
- Cron job run logs: `sw-paas application cronjob logs` (alias `sw-paas application cron logs`), optionally `--run-id <run-id>`, or select by `--cronjob-id <cronjob-id>` with `--history-limit 100` controlling how many history entries are used for selection.
- Commands executed in dedicated containers: `sw-paas command logs`, optionally `--command-id <command-id>`.

**Grafana**: run `sw-paas open grafana` to get the URL, username and password. Then open **Dashboards** → **Logs**, filter by component, and use the search box next to the filter to search within the selected logs.

## Essential identifiers

- `sw-paas application logs` with `--follow`, `--since`, `--component`, `--time-range`, `--limit`, `--query`, `--raw`, `--output json`
- `sw-paas application deployment logs` / `sw-paas application deploy logs` (`--deployment-id`)
- `sw-paas application cronjob logs` / `sw-paas application cron logs` (`--run-id`, `--cronjob-id`, `--history-limit`)
- `sw-paas command logs` (`--command-id`)
- `sw-paas open grafana`

## Gotchas

- `--follow` starts with new lines only; without `--since` you see no history.
- `--time-range` applies to the current day only, in local time.
- Logs older than 45 days are automatically removed.

## Code check (6.7.15.1)
- unverified `sw-paas application logs` — PaaS CLI command, out of scope of the installed Shopware packages
- unverified `sw-paas application deploy logs` — PaaS CLI command, out of scope of the installed Shopware packages
- unverified `sw-paas application cronjob logs` — PaaS CLI command, out of scope of the installed Shopware packages
- unverified `sw-paas command logs` — PaaS CLI command, out of scope of the installed Shopware packages
- unverified `sw-paas open grafana` — PaaS CLI command; Grafana/Loki are platform services, not Shopware code
