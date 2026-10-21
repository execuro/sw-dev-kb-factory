---
id: platform/dev/6.7/products/paas/shopware/monitoring/traces.md
title: Traces
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/monitoring/traces.html
sourceHash: 6b2d3f41c8d3c39a66d84a6752a2d8821d549493
codeCheckedAgainst: "6.7.15.1"
keywords: ["traces", "tracing", "sw-paas open grafana", "grafana", "tempo", "explore", "service name shopware", "opentelemetry", "trace retention", "paas native", "apm"]
summary: View Shopware PaaS Native application traces in Grafana Explore with the Tempo data source, service name shopware; traces kept 14 days.
lastBuilt: 2026-10-21
---
## What it is

How to view your application's traces for a Shopware PaaS Native environment in Grafana, and how long traces are kept.

## When to use

When you want to inspect request traces of a PaaS Native application environment.

## Key steps / config

1. Run `sw-paas open grafana`; it prints the Grafana URL, username and password.
2. In Grafana, go to the **Explore** tab.
3. Select **Tempo** as the data source.
4. Make sure the query type is **Search**.
5. Filter traces by setting **Service Name** to `shopware`.
6. Run the query to view your application traces.

## Essential identifiers

- `sw-paas open grafana`
- Grafana data source **Tempo**, Service Name `shopware`

## Gotchas

- Traces older than 14 days are automatically removed.

## Code check (6.7.15.1)
- unverified `sw-paas open grafana` — PaaS CLI command, out of scope of the installed Shopware packages
- unverified `shopware` — Tempo service name set by the PaaS platform, not configured in Shopware core
- confirmed `shopware/opentelemetry` — core telemetry docs point to this separate package for an OpenTelemetry transport — vendor/shopware/core/Framework/Telemetry/README.md:141
