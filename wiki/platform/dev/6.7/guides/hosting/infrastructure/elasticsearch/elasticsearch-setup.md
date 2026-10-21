---
id: platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md
title: Set up Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.html
sourceHash: 64c5337c3d56a03272a5fa786c3827074d30d34e
codeCheckedAgainst: "6.7.15.1"
keywords: ["OPENSEARCH_URL", "SHOPWARE_ES_ENABLED", "SHOPWARE_ES_INDEXING_ENABLED", "SHOPWARE_ES_INDEX_PREFIX", "SHOPWARE_ES_THROW_EXCEPTION", "ADMIN_OPENSEARCH_URL", "SHOPWARE_ADMIN_ES_ENABLED", "ENABLE_OPENSEARCH_FOR_ADMIN_API", "es:index", "es:admin:index", "dal:refresh:index", "opensearch", "elasticsearch setup", "shards replicas", "admin search"]
summary: Elasticsearch/OpenSearch setup for Shopware 6.7 - cluster basics, .env variables, index shard settings, indexing commands and Admin search config.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/hosting/_index.md
  - platform/dev/6.7/guides/hosting/infrastructure/message-queue.md
  - platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md
  - platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md
---
## What it is

How to connect Shopware to an Elasticsearch or OpenSearch cluster (both work the same way), configure it via `.env`, tune index settings and run indexing, for the Storefront and the Administration. The integration ships in the `shopware/elasticsearch` bundle (`composer require shopware/elasticsearch` if missing).

## When to use

Projects with several thousand data sets that need a dedicated search engine. Requirements: a supported OpenSearch/Elasticsearch server (see [hosting](platform/dev/6.7/guides/hosting/_index.md)) and background [message queue workers](platform/dev/6.7/guides/hosting/infrastructure/message-queue.md).

## Key steps / config

**Cluster basics** (`elasticsearch.yml`): `cluster.name`, `node.name`, `discovery.seed_hosts`, node roles `node.master` / `node.data` / `node.ingest`, `network.host`. One node = dev/test only; production needs at least three master-eligible nodes (quorum N/2+1), each started with `cluster.initial_master_nodes: ["masternode1","masternode2","masternode3"]`. Recommended: five nodes (3 master-eligible + 2 data). Replicas are never placed on the same node as their primary.

**`.env` variables (Storefront search):**

| Variable | Values | Meaning |
|---|---|---|
| `APP_ENV` | `prod` / `dev` | `dev` for debug mode and visible ES errors |
| `OPENSEARCH_URL` | `localhost:9200` | comma-separated host list |
| `SHOPWARE_ES_INDEXING_ENABLED` | `0` / `1` | write to the index |
| `SHOPWARE_ES_ENABLED` | `0` / `1` | use ES for search |
| `SHOPWARE_ES_INDEX_PREFIX` | e.g. `sw` | index name prefix |
| `SHOPWARE_ES_THROW_EXCEPTION` | `0` / `1` | `1` throws; `0` logs and falls back to MySQL |

`SHOPWARE_ES_ENABLED=1` + `SHOPWARE_ES_INDEXING_ENABLED=0` gives a read-only app server (search but no index updates). Production example: `SHOPWARE_ES_THROW_EXCEPTION=0`; debug example: `=1`.

**Index settings** (default three shards, three replicas), override in `config/packages/elasticsearch.yml` (since 6.4.12.0):

```yaml
elasticsearch:
  index_settings:
    number_of_shards: 1
    number_of_replicas: 0
```

**Indexing:**

1. `bin/console cache:clear` so `.env` changes apply.
2. `bin/console es:index` — data is written in bulks to the message queue (`messenger_messages` table by default); failed messages land in `queue_name = 'failed'`.
3. Run consumers: `bin/console messenger:consume -vv`. Up to three workers is normal; beyond that use RabbitMQ. Disable the admin worker in production.
4. Whole-shop reindex (ES, SEO URLs, product index, ...): `bin/console dal:refresh:index --use-queue`.
5. If indexing finished without errors but the Storefront shows no products: `bin/console es:create:alias`.

**Administration search** (AND/OR search, since 6.4.19.0):

```bash
ADMIN_OPENSEARCH_URL=...
SHOPWARE_ADMIN_ES_ENABLED=1
SHOPWARE_ADMIN_ES_INDEX_PREFIX=sw-admin
SHOPWARE_ADMIN_ES_INDEXING_BATCH_SIZE=1000
SHOPWARE_ADMIN_ES_REFRESH_INDICES=0
SHOPWARE_ADMIN_ES_THROW_EXCEPTION=1
```

CLI: `bin/console es:admin:index`, `bin/console es:admin:reset`, `bin/console es:admin:test`.

**OpenSearch for all supported Admin API searches** (requires the admin setup above): set feature flag `ENABLE_OPENSEARCH_FOR_ADMIN_API=1`, then run `bin/console es:admin:index`. Details in the [ADR](platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md).

## Essential identifiers

- `OPENSEARCH_URL`, `SHOPWARE_ES_ENABLED`, `SHOPWARE_ES_INDEXING_ENABLED`, `SHOPWARE_ES_INDEX_PREFIX`, `SHOPWARE_ES_THROW_EXCEPTION`
- `ADMIN_OPENSEARCH_URL`, `SHOPWARE_ADMIN_ES_ENABLED`, `SHOPWARE_ADMIN_ES_INDEX_PREFIX`, `SHOPWARE_ADMIN_ES_REFRESH_INDICES`
- `elasticsearch.index_settings.number_of_shards` / `number_of_replicas`
- `es:index`, `es:create:alias`, `dal:refresh:index --use-queue`, `es:admin:index`, `es:admin:reset`, `es:admin:test`
- feature flag `ENABLE_OPENSEARCH_FOR_ADMIN_API`

## Gotchas

- Shopware's own search configuration has no effect with Elasticsearch; searchable fields are configured with the Advanced Search extension.
- `SHOPWARE_ADMIN_ES_REFRESH_INDICES=1` creates missing admin indices/aliases on write, adds one alias check per indexer per write, and such indices stay empty until a full reindex — prefer `0` plus `es:admin:index` in the deployment pipeline.
- Without `--use-queue`, a whole-shop reindex has too many products to process in one go.
- The installer writes `SHOPWARE_ES_ENABLED=0`, `SHOPWARE_ES_INDEXING_ENABLED=0`, `SHOPWARE_ES_THROW_EXCEPTION=1` by default.
- More troubleshooting: [debugging guide](platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md).

## Version notes

- Index settings override: since 6.4.12.0. Admin AND/OR search: since 6.4.19.0.
- `ENABLE_OPENSEARCH_FOR_ADMIN_API`: since 6.7.9.0, experimental, default off.

## Code check (6.7.15.1)
- confirmed `OPENSEARCH_URL` — written by the installer env template — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:47
- confirmed `SHOPWARE_ES_INDEXING_ENABLED` — installer default `0` — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:49
- confirmed `SHOPWARE_ES_INDEX_PREFIX` — installer default `sw` — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:50
- confirmed `SHOPWARE_ES_THROW_EXCEPTION` — installer default `1`, matching the docs — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:51
- confirmed `SHOPWARE_ADMIN_ES_INDEX_PREFIX` — installer default `sw-admin` — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:53
- confirmed `SHOPWARE_ADMIN_ES_REFRESH_INDICES` — installer default `0` — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:55
- confirmed `ENABLE_OPENSEARCH_FOR_ADMIN_API` — experimental flag, default false, checked by admin listings — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:54
- confirmed `dal:refresh:index` — supports `--use-queue` — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:23
- unverified `SHOPWARE_ADMIN_ES_INDEXING_BATCH_SIZE` — not in core; read by the shopware/elasticsearch package, out of scope
- unverified `elasticsearch.index_settings` — es:index / es:admin:* commands and this config live in shopware/elasticsearch, out of scope
