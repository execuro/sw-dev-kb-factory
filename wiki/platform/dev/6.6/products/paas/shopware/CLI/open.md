---
id: platform/dev/6.6/products/paas/shopware/CLI/open.md
title: Accessing Services
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/CLI/open.html"
sourceHash: "ab91556adf1517b8efa2daaf4d480b81bf128168"
keywords: ["open command", "sw-paas open", "admin panel access", "storefront url", "grafana dashboard", "open service", "service tunnel", "context command", "interactive mode", "database", "valkey-app", "valkey-worker"]
summary: "The sw-paas open command retrieves Admin/Storefront URLs, opens the Grafana dashboard, or tunnels to an internal service like the database."
lastBuilt: "2026-09-15"
---

## What it is

The `open` command gives access to critical service interfaces and internal tools within Shopware PaaS Native, such as navigating to the Admin, Storefront, Grafana dashboard, or opening service tunnels for debugging and direct access.

## When to use

Use `sw-paas open [command]` to quickly retrieve access URLs/credentials for the Admin or Storefront, open the Grafana monitoring dashboard, or establish a local tunnel to an internal backend service for debugging.

## Key steps / config

```sh
sw-paas open [command]
```

Sub-commands:

- `sw-paas open admin [flags]` — retrieves the Admin URL and credentials for the Shopware Admin interface. Flags: `--organization-id`, `--application-id`.
- `sw-paas open storefront [flags]` — retrieves the URL of the Shopware Storefront application. Flags: `--organization-id`, `--application-id`.
- `sw-paas open grafana [flags]` — opens the Grafana dashboard to visualize and monitor application metrics. Flags: `--organization-id`, `--application-id`.
- `sw-paas open service [flags]` — establishes a local port tunnel to an internal service, for debugging or interacting directly with backend components. Flags: `--service`, `--organization-id`, `--application-id`. Currently supported services: `database`, `valkey-app`, `valkey-worker`.

Example:

```sh
sw-paas open service --service database --organization-id abc123 --application-id abc123
```

## Essential identifiers

- `sw-paas open admin`
- `sw-paas open storefront`
- `sw-paas open grafana`
- `sw-paas open service`
- `--service` (`database`, `valkey-app`, `valkey-worker`)

## Gotchas

To avoid repeatedly specifying `organization-id` and `application-id` on every `open` invocation, the documentation recommends using the `context` command to set them persistently, or running the CLI in interactive mode for guided input.
