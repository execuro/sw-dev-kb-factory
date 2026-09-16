---
id: platform/dev/6.7/products/paas/shopware/monitoring/_index.md
title: Monitoring
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/monitoring/
sourceHash: 14bfd29ec5ac60411cb138f167767d147933b408
codeCheckedAgainst: "6.7.13.0"
keywords: ["paas native", "monitoring", "sw-paas open grafana", "grafana", "logs", "traces", "events", "blackfire", "tideways", "apm", "profiling", "load testing", "observability"]
summary: "PaaS Native monitoring overview: logs, traces, events; Grafana credentials via sw-paas open grafana; Blackfire supported, Tideways and load testing not."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/monitoring/blackfire.md"]
---
## What it is

The entry page for monitoring on Shopware PaaS Native. It introduces three monitoring components — Logs, Traces and Events — and states which observability tools are and are not available on the platform.

## When to use

When you need to track health or performance of a PaaS Native application, troubleshoot issues, or decide which profiling/APM tool you can use.

## Key steps / config

- Get Grafana access: run `sw-paas open grafana`; the CLI returns the credentials.
- Profile PHP requests with Blackfire, see [Blackfire](platform/dev/6.7/products/paas/shopware/monitoring/blackfire.md).

## Essential identifiers

- `sw-paas open grafana`
- Monitoring components: Logs, Traces, Events

## Gotchas

- Single sign-on for Grafana and similar tools is not available; use the CLI-issued credentials.
- Other APM tools such as Tideways are not supported as part of the platform (even though Shopware core ships a Tideways profiler integration).
- Managed load testing is not provided.

## Code check (6.7.13.0)
- unverified `sw-paas open grafana` — PaaS CLI command, not part of vendor/shopware
- confirmed `Tideways` — core profiler integration class exists; platform support is a PaaS statement — vendor/shopware/core/Profiling/Integration/Tideways.php:12
- confirmed `shopware.profiler.integrations` — core profiler integrations default to an empty list — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:175
