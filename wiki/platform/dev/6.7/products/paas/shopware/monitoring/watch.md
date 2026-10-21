---
id: platform/dev/6.7/products/paas/shopware/monitoring/watch.md
title: Monitor events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/monitoring/watch.html
sourceHash: 1435061caa9e09833b3e47e5d7ebb519656ee8cc
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-paas watch", "event monitoring", "events", "EVENT_TYPE_DEPLOYMENT_STARTED", "EVENT_TYPE_DEPLOYMENT_FINISHED", "sw-paas application deploy get", "DEPLOYMENT STATUS HISTORY", "deployment status", "--event-types", "--application-ids", "paas native", "real-time"]
summary: Stream Shopware PaaS Native deployment and status events with sw-paas watch, filter by app or event type, and read deployment status history.
lastBuilt: 2026-10-21
---
## What it is

Real-time event monitoring for Shopware PaaS Native applications: the `sw-paas watch` command streams deployments, application status changes and other events to your terminal, and `sw-paas application deploy get` shows the event history of a deployment.

## When to use

When you want to follow what is happening in a project as it happens, especially during deployments, or reconstruct what happened during a past deployment.

## Key steps / config

- Stream all events: `sw-paas watch`. The stream runs until stopped with `Ctrl+C`; events show timestamps and details.
- Limit to specific applications (useful in multi-application projects): `sw-paas watch --application-ids app1,app2`.
- Filter by event type: `sw-paas watch --event-types "EVENT_TYPE_DEPLOYMENT_STARTED,EVENT_TYPE_DEPLOYMENT_FINISHED"`.
  - `EVENT_TYPE_DEPLOYMENT_STARTED` — a deployment begins.
  - `EVENT_TYPE_DEPLOYMENT_FINISHED` — a deployment completes.
- List all events of a deployment: `sw-paas application deploy get`. The `DEPLOYMENT STATUS HISTORY` output lists every event emitted during the deployment, from the PaaS infrastructure and from the shop itself.

Events are generally linked to a preceding action; each action maps to an event type emitted on a state change, and the type is shown in the `sw-paas watch` output.

Common deployment status events:

| Event | Meaning |
|---|---|
| `UNSPECIFIED` | Default or unspecified deployment status |
| `PENDING` | Queued, waiting to start |
| `BASE` / `BASE_FAILED` / `BASE_SUCCESS` | Infrastructure: base components deploying / failed / succeeded |
| `SHOP` / `SHOP_FAILED` / `SHOP_SUCCESS` | Infrastructure: shop-specific components deploying / failed / succeeded |
| `DEPLOYING_STORE` / `DEPLOYING_STORE_FAILED` / `DEPLOYING_STORE_SUCCESS` | Store: Shopware store application deploying / failed / succeeded |
| `DEPLOYMENT_SUCCESS` / `DEPLOYMENT_FAILED` | Complete deployment succeeded / failed |

## Essential identifiers

- `sw-paas watch` (`--application-ids`, `--event-types`)
- `EVENT_TYPE_DEPLOYMENT_STARTED`, `EVENT_TYPE_DEPLOYMENT_FINISHED`
- `sw-paas application deploy get` and its `DEPLOYMENT STATUS HISTORY` output

## Code check (6.7.15.1)
- unverified `sw-paas watch` — PaaS CLI command, out of scope of the installed Shopware packages
- unverified `EVENT_TYPE_DEPLOYMENT_STARTED` — PaaS platform event type, not present in Shopware core/storefront/administration code
- unverified `EVENT_TYPE_DEPLOYMENT_FINISHED` — PaaS platform event type, not present in Shopware core/storefront/administration code
- unverified `sw-paas application deploy get` — PaaS CLI command, out of scope of the installed Shopware packages
- unverified `DEPLOYING_STORE_SUCCESS` — PaaS deployment status, not a Shopware code identifier
