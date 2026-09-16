---
id: platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md
title: Set up Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.html
sourceHash: 29d7c15dcc3909f1daef6dbe09aa7e0ba0851d4c
codeCheckedAgainst: "6.7.13.0"
keywords: ["OPENSEARCH_URL", "SHOPWARE_ES_ENABLED", "SHOPWARE_ES_INDEXING_ENABLED", "SHOPWARE_ES_THROW_EXCEPTION", "ADMIN_OPENSEARCH_URL", "SHOPWARE_ADMIN_ES_ENABLED", "ENABLE_OPENSEARCH_FOR_ADMIN_API", "es:index", "es:admin:index", "dal:refresh:index", "shopware/elasticsearch", "opensearch setup", "elasticsearch cluster", "admin search"]
summary: "Elasticsearch/OpenSearch setup for Shopware: cluster basics, SHOPWARE_ES_* and admin env vars, index_settings, es:index, Admin API OpenSearch flag."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md", "platform/dev/6.7/guides/hosting/infrastructure/message-queue.md", "platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md", "platform/dev/6.7/guides/hosting/_index.md"]
---
## What it is

Setup guide for Shopware's Elasticsearch/OpenSearch integration (both behave the same): cluster basics, the `.env` variables that enable search and indexing, index settings, indexing commands, and Elasticsearch for the Administration. The integration lives in the `shopware/elasticsearch` bundle (`composer require shopware/elasticsearch`).

## When to use

Projects with several thousand data sets, or when the Administration needs AND/OR search. Requires a supported OpenSearch/Elasticsearch server and message queue workers running in the background (see platform/dev/6.7/guides/hosting/infrastructure/message-queue.md).

## Key steps / config

**1. Cluster basics.** One-node clusters are for dev/test only. Production needs at least three master-eligible nodes (quorum N/2+1); five nodes (3 master-eligible + 2 data) is the recommended layout. Configure in `elasticsearch.yml`: `cluster.name`, `node.name`, `discovery.seed_hosts`, `node.master`, `node.data`, `node.ingest`, `network.host`, and `cluster.initial_master_nodes: ["masternode1","masternode2","masternode3"]` on each master-eligible node. Replica shards are never placed on the same node as their primary.

**2. `.env` variables**

| Variable | Values | Purpose |
|---|---|---|
| `APP_ENV` | `prod` / `dev` | `dev` shows ES errors (debug) |
| `OPENSEARCH_URL` | `host:9200` | comma-separated host list |
| `SHOPWARE_ES_INDEXING_ENABLED` | `0`/`1` | write to the index |
| `SHOPWARE_ES_ENABLED` | `0`/`1` | use ES for search |
| `SHOPWARE_ES_INDEX_PREFIX` | e.g. `sw` | index name prefix |
| `SHOPWARE_ES_THROW_EXCEPTION` | `0`/`1` | `0` = silent fallback to MySQL |

`SHOPWARE_ES_ENABLED=1` + `SHOPWARE_ES_INDEXING_ENABLED=0` gives read-only app servers; both `1` is full support. Production: `SHOPWARE_ES_THROW_EXCEPTION=0`; debug: `1`.

**3. Index settings** (default three shards, three replicas; since 6.4.12.0), in `config/packages/elasticsearch.yml`:

```yaml
elasticsearch:
  index_settings:
    number_of_shards: 1
    number_of_replicas: 0
```

**4. Indexing**

- `bin/console cache:clear` so `.env` changes apply.
- `bin/console es:index` — index to Elasticsearch.
- `bin/console dal:refresh:index --use-queue` — reindex the whole shop (ES, SEO URLs, product index, …) through the message queue.
- `bin/console es:create:alias` — run manually if indexing finished without errors but the Storefront shows no products.
- `bin/console messenger:consume -vv` — consumers; up to three is typical, beyond that use RabbitMQ. Disable the admin worker in production.

**5. Administration search** (6.4.19.0+, AND/OR search):

```bash
ADMIN_OPENSEARCH_URL=...
SHOPWARE_ADMIN_ES_ENABLED=1
SHOPWARE_ADMIN_ES_INDEX_PREFIX=sw-admin
SHOPWARE_ADMIN_ES_INDEXING_BATCH_SIZE=1000
SHOPWARE_ADMIN_ES_REFRESH_INDICES=0
SHOPWARE_ADMIN_ES_THROW_EXCEPTION=1
```

Commands: `bin/console es:admin:index`, `bin/console es:admin:reset`, `bin/console es:admin:test`.

**6. OpenSearch for all supported Admin API searches** (experimental, 6.7.9.0+): with admin ES configured, set `ENABLE_OPENSEARCH_FOR_ADMIN_API=1`, then run `bin/console es:admin:index`. Details: platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md.

## Essential identifiers

- `OPENSEARCH_URL`, `SHOPWARE_ES_ENABLED`, `SHOPWARE_ES_INDEXING_ENABLED`, `SHOPWARE_ES_INDEX_PREFIX`, `SHOPWARE_ES_THROW_EXCEPTION`
- `ADMIN_OPENSEARCH_URL`, `SHOPWARE_ADMIN_ES_ENABLED`, `SHOPWARE_ADMIN_ES_INDEX_PREFIX`, `SHOPWARE_ADMIN_ES_INDEXING_BATCH_SIZE`, `SHOPWARE_ADMIN_ES_REFRESH_INDICES`, `SHOPWARE_ADMIN_ES_THROW_EXCEPTION`
- `ENABLE_OPENSEARCH_FOR_ADMIN_API`
- `elasticsearch.index_settings.number_of_shards`, `elasticsearch.index_settings.number_of_replicas`
- `es:index`, `es:create:alias`, `dal:refresh:index`, `es:admin:index`, `es:admin:reset`, `es:admin:test`

## Gotchas

- Shopware's own search configuration has no effect with Elasticsearch; searchable fields are configured via the Advanced Search extension.
- `SHOPWARE_ADMIN_ES_REFRESH_INDICES=1` creates missing admin indices/aliases on write, costs one alias check per indexer per write, and such indices stay empty until a full reindex — prefer `0` plus `es:admin:index` in deployment.
- The installer's default `.env` template writes `SHOPWARE_ES_THROW_EXCEPTION=1`; set `0` in production.
- The docs say failed messages go to the `enqueue` / `dead_messages` tables; those tables were dropped in 6.5 — messages use the Symfony Messenger transport.
- `ENABLE_OPENSEARCH_FOR_ADMIN_API` is an experimental feature flag (default off).

## Version notes

- Index settings override: since 6.4.12.0. Admin AND/OR search: since 6.4.19.0. `ENABLE_OPENSEARCH_FOR_ADMIN_API`: since 6.7.9.0, experimental.

## Code check (6.7.13.0)
- confirmed `OPENSEARCH_URL` — in the installer's default .env template — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:48
- confirmed `SHOPWARE_ES_ENABLED` — template default 0 — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:49
- confirmed `SHOPWARE_ES_INDEXING_ENABLED` — template default 0 — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:50
- confirmed `SHOPWARE_ES_THROW_EXCEPTION` — template writes 1 — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:52
- confirmed `SHOPWARE_ADMIN_ES_REFRESH_INDICES` — template default 0 — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:56
- confirmed `ENABLE_OPENSEARCH_FOR_ADMIN_API` — experimental toggleable flag, default false, read by admin list pages — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:54
- confirmed `dal:refresh:index` — command with a use-queue option — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:22
- corrected `enqueue` — docs: indexing messages are stored in the enqueue/dead_messages tables; table dropped in 6.5 — vendor/shopware/core/Migration/V6_5/Migration1669125399DropEnqueueTable.php:26
- unverified `es:admin:index` — shipped by shopware/elasticsearch, outside the checked roots
- unverified `elasticsearch.index_settings` — bundle config of shopware/elasticsearch, outside the checked roots
