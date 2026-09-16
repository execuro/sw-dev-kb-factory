---
id: platform/dev/6.7/products/paas/shopware/monitoring/watch.md
title: Monitor events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/monitoring/watch.html
sourceHash: 1435061caa9e09833b3e47e5d7ebb519656ee8cc
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-paas watch", "--application-ids", "--event-types", "EVENT_TYPE_DEPLOYMENT_STARTED", "EVENT_TYPE_DEPLOYMENT_FINISHED", "sw-paas application deploy get", "DEPLOYMENT STATUS HISTORY", "event stream", "deployment status", "paas native monitoring", "real-time events", "deployment history"]
summary: sw-paas watch streams Shopware PaaS Native events in real time, filterable by application IDs and event types; lists deployment status event types.
lastBuilt: 2026-09-15
---
## What it is

Real-time event monitoring in Shopware PaaS Native via the `sw-paas` CLI: a live stream of deployments, application status changes and other project events, plus the per-deployment status history.

## When to use

- Watching a deployment as it runs, or tracking application status changes in a project.
- Narrowing the stream to certain applications in a multi-application project, or to certain event types.
- Reconstructing what happened during a past deployment.

## Key steps / config

1. Start streaming all events to the terminal (runs until `Ctrl+C`; events are shown with timestamps and details):
   ```bash
   sw-paas watch
   ```
2. Limit to specific applications:
   ```bash
   sw-paas watch --application-ids app1,app2
   ```
3. Filter by event type (comma-separated, quoted):
   ```bash
   sw-paas watch --event-types "EVENT_TYPE_DEPLOYMENT_STARTED,EVENT_TYPE_DEPLOYMENT_FINISHED"
   ```
4. List all events of one deployment with `sw-paas application deploy get`; the `DEPLOYMENT STATUS HISTORY` part of the output shows every event emitted during that deployment, both from the underlying PaaS infrastructure and from the shop itself.

Deployment status event types:

| Event | Meaning |
|---|---|
| `UNSPECIFIED` | Default/unspecified status |
| `PENDING` | Queued, waiting to start |
| `BASE` / `BASE_FAILED` / `BASE_SUCCESS` | Base infrastructure components deploying / failed / done |
| `SHOP` / `SHOP_FAILED` / `SHOP_SUCCESS` | Shop-specific infrastructure deploying / failed / done |
| `DEPLOYING_STORE` / `DEPLOYING_STORE_FAILED` / `DEPLOYING_STORE_SUCCESS` | Shopware store application deploying / failed / done |
| `DEPLOYMENT_SUCCESS` / `DEPLOYMENT_FAILED` | Whole deployment succeeded / failed |

## Essential identifiers

- `sw-paas watch`, options `--application-ids`, `--event-types`
- `EVENT_TYPE_DEPLOYMENT_STARTED`, `EVENT_TYPE_DEPLOYMENT_FINISHED`
- `sw-paas application deploy get` (`DEPLOYMENT STATUS HISTORY`)

## Gotchas

- Events are tied to a preceding action; each action maps to an event type emitted on a state change, so the type shown in `sw-paas watch` output indicates what is happening.
- The stream does not end by itself; stop it with `Ctrl+C`.

## Code check (6.7.13.0)
- unverified `sw-paas watch` — PaaS Native CLI command, not part of vendor/shopware core/storefront/administration
- unverified `sw-paas application deploy get` — PaaS Native CLI command, out of scope of the installed Shopware code
- unverified `EVENT_TYPE_DEPLOYMENT_STARTED` — PaaS platform event type, not defined in the installed Shopware code
- unverified `DEPLOYING_STORE_SUCCESS` — PaaS deployment status, not defined in the installed Shopware code
