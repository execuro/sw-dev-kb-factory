---
id: platform/dev/6.7/products/paas/shopware/guides/opensearch.md
title: How to set up OpenSearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/opensearch.html
sourceHash: fb05e3ae8bc1200fb71c99e1b4c6734eb21b7c0c
codeCheckedAgainst: "6.7.15.1"
keywords: ["services.opensearch.enabled", "application.yaml", "Shopware\\Elasticsearch\\Profiler\\DataCollector", "web_profiler.yaml", "APP_ENV", "dal:refresh:index", "--use-queue", "sw-paas exec --new", "opensearch", "elasticsearch", "search index", "paas native"]
summary: Enable OpenSearch on PaaS Native via services.opensearch.enabled, fix the dev profiler, then run dal:refresh:index --use-queue.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md", "platform/dev/6.7/products/paas/shopware/fundamentals/applications.md"]
---
## What it is

The steps to turn on OpenSearch for a Shopware PaaS Native application: a dev-environment profiler fix, the `application.yaml` switch, and the initial indexing run.

## When to use

You want product search backed by OpenSearch in a PaaS Native shop.

## Key steps / config

1. If the application runs with `APP_ENV=dev`, add this under `when@dev:` in `config/packages/web_profiler.yaml` **before** deploying, otherwise the deployment fails:

```yaml
services:
    Shopware\Elasticsearch\Profiler\DataCollector:
        arguments:
            $enabled: false
            $adminEnabled: false
```

2. Set `services.opensearch.enabled` to `true` in [`application.yaml`](platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md):

```yaml
services:
  opensearch:
    enabled: true
```

3. Commit, push, and update the application (see [Applications](platform/dev/6.7/products/paas/shopware/fundamentals/applications.md)).
4. Index: open `sw-paas exec --new`, then run `bin/console dal:refresh:index --use-queue`.

## Essential identifiers

- `services.opensearch.enabled`
- `Shopware\Elasticsearch\Profiler\DataCollector` (`$enabled`, `$adminEnabled`)
- `config/packages/web_profiler.yaml`, `when@dev`
- `sw-paas exec --new`, `bin/console dal:refresh:index --use-queue`

## Gotchas

- The deployment reports success before the index exists. `--use-queue` only queues the indexing work and returns immediately; workers process it in the background, and search returns no results until the queue is drained — slow on large catalogs.

## Code check (6.7.15.1)
- confirmed `dal:refresh:index` — console command name — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:23
- confirmed `use-queue` — option queues indexing via the indexer registry instead of running it inline — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:45
- unverified `Shopware\Elasticsearch\Profiler\DataCollector` — Elasticsearch bundle, outside the checked code roots
- unverified `services.opensearch.enabled` — PaaS application.yaml key, outside the Shopware code roots
