---
id: platform/dev/6.6/products/paas/shopware/CLI/watch.md
title: Monitor events
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/CLI/watch.html"
sourceHash: "8e3f1e7bb4812f7eab3586c747f03781d9b9655e"
keywords: ["watch command", "sw-paas watch", "event stream", "real-time events", "project-id", "application-ids", "event-types", "deployment events", "application events", "Git remote inference", "Shopware PaaS Native"]
summary: "The sw-paas watch command streams real-time deployment/application events for a project, filterable by application IDs and event types."
lastBuilt: "2026-09-15"
---

## What it is

The `watch` command monitors events related to a specific project in Shopware PaaS Native. It listens for real-time events associated with the project and its applications, and events can be filtered by project ID, application IDs, and event types.

## When to use

Use `sw-paas watch` to observe deployment or application activity live, for example to follow a deployment as it progresses or to debug why an application event did not occur.

## Key steps / config

```sh
sw-paas watch [flags]
```

Flags:

- `--project-id` — the ID of the project to watch. If omitted, the command attempts to infer the project from the Git repository's remote URL.
- `--application-ids` — a list of application IDs to monitor. If omitted, all applications associated with the project are watched.
- `--event-types` — a list of event types to filter (e.g., deployment events, application events). By default, all events are listened to. Available event types are fetched from Shopware PaaS Native and sorted for easy selection.

Examples:

```sh
sw-paas watch --project-id abc123
sw-paas watch --project-id abc123 --application-ids app1,app2
sw-paas watch --project-id abc123 --event-types "EVENT_TYPE_DEPLOYMENT_STARTED,EVENT_TYPE_DEPLOYMENT_FINISHED"
```

Once triggered, `watch` establishes a connection to the Shopware PaaS Native event stream and prints events out in real time to the terminal.

## Essential identifiers

- `sw-paas watch [flags]`
- `--project-id`
- `--application-ids`
- `--event-types`
- `EVENT_TYPE_DEPLOYMENT_STARTED`, `EVENT_TYPE_DEPLOYMENT_FINISHED`

## Gotchas

If `--project-id` is not set, the command relies on inferring the project from the current Git remote, which assumes a linked repository is configured locally.
