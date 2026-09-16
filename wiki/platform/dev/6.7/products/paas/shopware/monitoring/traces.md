---
id: platform/dev/6.7/products/paas/shopware/monitoring/traces.md
title: Traces
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/monitoring/traces.html
sourceHash: 6b2d3f41c8d3c39a66d84a6752a2d8821d549493
codeCheckedAgainst: "6.7.13.0"
keywords: ["traces", "application traces", "sw-paas open grafana", "grafana", "tempo", "explore", "service name shopware", "tracing", "trace retention", "opentelemetry", "paas native"]
summary: "View Shopware PaaS Native application traces in Grafana Explore with Tempo data source, Service Name shopware; traces retained 14 days."
lastBuilt: 2026-09-15
---
## What it is

How to view application traces of a Shopware PaaS Native environment in Grafana, and how long traces are kept.

## When to use

When you need request-level traces to investigate performance or errors in a PaaS Native application.

## Key steps / config

1. Run `sw-paas open grafana` to get the Grafana URL, username and password.
2. In Grafana, go to the **Explore** tab.
3. Select **Tempo** as the data source.
4. Make sure the query type is **Search**.
5. Filter by setting Service Name to `shopware`.
6. Run the query.

## Essential identifiers

- `sw-paas open grafana`
- Data source **Tempo**, query type **Search**, Service Name `shopware`

## Gotchas

- Traces older than 14 days are removed automatically.

## Code check (6.7.13.0)
- unverified `sw-paas open grafana` — PaaS CLI command, not part of vendor/shopware
- unverified `shopware` — Tempo service name is set by the platform's tracing setup, not in vendor/shopware
- unverified `Tempo` — Grafana data source, outside vendor/shopware
