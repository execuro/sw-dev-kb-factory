---
id: platform/dev/6.6/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md
title: Set up Elasticsearch
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.html
sourceHash: 181ba8062b9938dc23716e88009f0537825c2e66
keywords: ["elasticsearch setup", "opensearch", "shopware/elasticsearch bundle", "OPENSEARCH_URL", "SHOPWARE_ES_ENABLED", "SHOPWARE_ES_INDEXING_ENABLED", "SHOPWARE_ES_THROW_EXCEPTION", "number_of_shards", "number_of_replicas", "es:index", "dal:refresh:index", "es:admin:index", "master node", "cluster nodes"]
summary: "Covers ES/OpenSearch cluster basics, required .env variables, shard/replica config, indexing commands, and admin search setup."
lastBuilt: 2026-09-15
---
## What it is
Describes how to set up Elasticsearch/OpenSearch integration for Shopware 6, covering server cluster basics, required `.env` variables, index configuration, and indexing commands for both the Storefront and Administration search.

## When to use
Consult this when a shop needs advanced search on catalogs with several thousand data sets, when installing the `shopware/elasticsearch` bundle, or when configuring or troubleshooting ES/OpenSearch indexing.

## Key steps / config
- Requirements: OpenSearch >= 2.0 or Elasticsearch >= 7.8, and running message queue workers.
- Install with `composer require shopware/elasticsearch` if the bundle isn't already present.
- Cluster basics: a single-node cluster suits dev/test only; production needs at least 3 master-eligible nodes (`node.master`) for a valid election quorum (N/2+1), with `cluster.initial_master_nodes` listing them. Ingest nodes are controlled by `node.ingest`, data nodes by `node.data`, all configured in `elasticsearch.yml` (`cluster.name`, `node.name`, `discovery.seed_hosts`, `network.host`).
- Shards: primary shards hold the original data, replica shards are copies; more replicas increase both search scaling and fault tolerance.
- `.env` variables:

| Variable | Values | Purpose |
|---|---|---|
| `APP_ENV` | `prod`/`dev` | enables debug output for ES errors |
| `OPENSEARCH_URL` | host:port list | comma-separated ES/OpenSearch hosts |
| `SHOPWARE_ES_INDEXING_ENABLED` | `0`/`1` | activates indexing to ES |
| `SHOPWARE_ES_ENABLED` | `0`/`1` | activates ES for the shop |
| `SHOPWARE_ES_INDEX_PREFIX` | e.g. `sw_myshop` | prefix for ES indices |
| `SHOPWARE_ES_THROW_EXCEPTION` | `0`/`1` | debug mode; `0` silently falls back to MySQL |

- Shard/replica overrides go in `config/packages/elasticsearch.yml` (available since 6.4.12.0):

```yaml
elasticsearch:
  index_settings:
    number_of_shards: 1
    number_of_replicas: 0
```

- Indexing commands: `bin/console cache:clear` before indexing; `bin/console es:index` for a basic index run; `bin/console dal:refresh:index --use-queue` to reindex the whole shop (ES, SEO URLs, product index, etc.); `bin/console es:create:alias` if the alias isn't created automatically; `bin/console messenger:consume` (add `-vv` for verbose output) to process the queue. Up to 3 worker processes is typical for production; beyond that use a broker like RabbitMQ.
- Administration search (Shopware 6.4.19.0+) supports AND/OR queries via `ADMIN_OPENSEARCH_URL`, `SHOPWARE_ADMIN_ES_ENABLED`, `SHOPWARE_ADMIN_ES_REFRESH_INDICES`, `SHOPWARE_ADMIN_ES_INDEX_PREFIX`, plus commands `bin/console es:admin:index`, `bin/console es:admin:reset`, `bin/console es:admin:test`.

## Essential identifiers
- `shopware/elasticsearch` composer package
- `OPENSEARCH_URL`, `SHOPWARE_ES_ENABLED`, `SHOPWARE_ES_INDEXING_ENABLED`, `SHOPWARE_ES_INDEX_PREFIX`, `SHOPWARE_ES_THROW_EXCEPTION`
- `config/packages/elasticsearch.yml` → `elasticsearch.index_settings.number_of_shards`/`number_of_replicas`
- `bin/console es:index`, `bin/console dal:refresh:index --use-queue`, `bin/console es:create:alias`
- `ADMIN_OPENSEARCH_URL`, `SHOPWARE_ADMIN_ES_ENABLED`, `bin/console es:admin:index`

## Gotchas
- Shopware's own search configuration has no effect once Elasticsearch is active; searchable fields must instead be configured via the separate Advanced Search extension.
- `SHOPWARE_ES_THROW_EXCEPTION=0` silently falls back to MySQL without any error message if Elasticsearch fails.
- Deactivate the admin messenger worker in production to avoid CPU load, per the message queue documentation.

## Version notes
Index shard/replica configuration via `config/packages/elasticsearch.yml` is available since Shopware 6.4.12.0; Administration AND/OR search support since 6.4.19.0.
