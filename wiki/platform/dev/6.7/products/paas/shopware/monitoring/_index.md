---
id: platform/dev/6.7/products/paas/shopware/monitoring/_index.md
title: Monitoring
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/monitoring/
sourceHash: 75fda51806cc58b45b0c7e5ec2cf6768aeb2c425
codeCheckedAgainst: "6.7.15.1"
keywords: ["monitoring", "sw-paas open grafana", "grafana", "logs", "traces", "events", "blackfire", "tideways", "profiler", "apm", "observability", "load testing"]
summary: "Shopware PaaS Native monitoring overview: logs, traces, events in Grafana via sw-paas open grafana; Blackfire or Tideways profiling, one at a time."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/monitoring/blackfire.md", "platform/dev/6.7/products/paas/shopware/monitoring/tideways.md"]
---
## What it is

Entry page for the monitoring capabilities of Shopware PaaS Native: built-in tools to observe application health and performance and to troubleshoot issues. Monitoring is built on three components: Logs, Traces and Events.

## When to use

When you need to look at logs, traces or events of a PaaS Native application, get into Grafana, or choose a PHP profiler.

## Key steps / config

- **Grafana**: access uses credentials returned by the CLI with `sw-paas open grafana`. Single sign-on for Grafana and similar tools is not available.
- **Profilers** for PHP requests: [Blackfire](platform/dev/6.7/products/paas/shopware/monitoring/blackfire.md) or [Tideways](platform/dev/6.7/products/paas/shopware/monitoring/tideways.md). Enable only one at a time; each needs your own account with that vendor.

## Essential identifiers

- `sw-paas open grafana`
- Profilers: Blackfire, Tideways

## Gotchas

- Other application performance monitoring tools are not supported on the platform.
- Managed load testing is not provided as part of the platform.

## Code check (6.7.15.1)
- confirmed `Tideways` — Shopware core ships a Tideways profiler integration tagged shopware.profiler — vendor/shopware/core/Profiling/DependencyInjection/services.php:27
- unverified `sw-paas open grafana` — PaaS CLI command, outside vendor/shopware
- unverified `Blackfire` — no Blackfire integration class in vendor/shopware core; profiler setup is platform-side
