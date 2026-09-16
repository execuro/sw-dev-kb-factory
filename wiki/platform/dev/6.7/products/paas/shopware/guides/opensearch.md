---
id: platform/dev/6.7/products/paas/shopware/guides/opensearch.md
title: How to set up OpenSearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/opensearch.html
sourceHash: 10f1fd5abe0ec7e4e24e4bd4693702e30c086922
codeCheckedAgainst: "6.7.13.0"
keywords: ["services.opensearch.enabled", "application.yaml", "opensearch", "elasticsearch", "dal:refresh:index", "--use-queue", "sw-paas exec --new", "Shopware\\Elasticsearch\\Profiler\\DataCollector", "web_profiler.yaml", "APP_ENV=dev", "search index", "paas native"]
summary: "Enable OpenSearch on Shopware PaaS Native via services.opensearch.enabled, then reindex with bin/console dal:refresh:index --use-queue."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md", "platform/dev/6.7/products/paas/shopware/fundamentals/applications.md"]
---
## What it is

How to turn on the OpenSearch service for a Shopware PaaS Native application and build the search index afterwards.

## When to use

When a PaaS Native shop should use OpenSearch for search, or when a deployment with `APP_ENV=dev` fails after OpenSearch was enabled.

## Key steps / config

1. In [`application.yaml`](platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md) set `services.opensearch.enabled` to `true`:

```yaml
services:
  opensearch:
    enabled: true
```

2. Commit and push the change, then update the application (see [Applications](platform/dev/6.7/products/paas/shopware/fundamentals/applications.md)).
3. Index the shop: open an interactive session with `sw-paas exec --new`, then run `bin/console dal:refresh:index --use-queue` (the option hands indexing to the message queue instead of running it inline).
4. If `APP_ENV=dev`, add under `when@dev:` in `config/packages/web_profiler.yaml`:

```yaml
services:
    Shopware\Elasticsearch\Profiler\DataCollector:
        arguments:
            $enabled: false
            $adminEnabled: false
```

## Essential identifiers

- `services.opensearch.enabled`
- `sw-paas exec --new`
- `bin/console dal:refresh:index --use-queue`
- `Shopware\Elasticsearch\Profiler\DataCollector` (`$enabled`, `$adminEnabled`)

## Gotchas

- Without the `web_profiler.yaml` override in `APP_ENV=dev`, the next deployment fails.
- Enabling the service alone does not populate the index; the reindex step is required.

## Code check (6.7.13.0)
- confirmed `dal:refresh:index` — console command in core — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:22
- confirmed `use-queue` — VALUE_NONE option passed to EntityIndexerRegistry::index() — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:45
- unverified `Shopware\Elasticsearch\Profiler\DataCollector` — shopware/elasticsearch package not installed; outside scanned roots
- unverified `services.opensearch.enabled` — PaaS application.yaml schema, outside vendor/shopware
- unverified `sw-paas exec --new` — PaaS CLI, outside vendor/shopware
