---
id: platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md
title: Debugging and Troubleshooting Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.html
sourceHash: e3dcce49b6d185194aab8b85ee1620c72f83a1fc
codeCheckedAgainst: "6.7.13.0"
keywords: ["es:index", "es:create:alias", "es:index:cleanup", "dal:refresh:index", "messenger:consume", "ElasticsearchIndexingMessage", "messenger_messages", "elasticsearch troubleshooting", "opensearch debugging", "reindex", "cluster health", "stuck indexing"]
summary: "Elasticsearch troubleshooting in Shopware: es:index, es:create:alias, dal:refresh:index --use-queue, consumers, cluster REST checks and full reset/reindex."
lastBuilt: 2026-09-15
---
## What it is

Troubleshooting checklist for Shopware's Elasticsearch/OpenSearch integration: CLI commands for indexing and aliases, Elasticsearch REST calls to inspect the cluster, and how to reset a stuck indexing run. Debug mode should be active in `.env`.

## When to use

Indexing hangs, aliases are missing, queues do not drain, or products do not appear in Storefront search.

## Key steps / config

**CLI commands**

- `bin/console cache:clear` — clear the cache (e.g. after `.env` changes).
- `bin/console es:index` — create the Elasticsearch index only; no output.
- `bin/console es:create:alias` — point the alias at the new index once `es:index` has finished. Normally automatic; run manually if products are still missing.
- `bin/console dal:refresh:index --use-queue` — full DAL reindex (ES, SEO, media, sitemap, ...). Always pass `--use-queue` so large runs go through the message queue instead of overloading the server; prints one progress bar per indexer (`product.indexer`, `category.indexer`, ...).
- `bin/console messenger:consume -vv` — start a consumer; run several in parallel. Indexing shows up as `Shopware\Elasticsearch\Framework\Indexing\ElasticsearchIndexingMessage`. More than three consumers call for a dedicated broker such as RabbitMQ.
- `bin/console es:index:cleanup` — delete unused indices (every indexing run creates a new index).

**Elasticsearch REST checks** (host `elasticsearch:9200` in the examples)

- `GET /?pretty` — node/version info.
- `GET /_cluster/health?pretty` — cluster status (`green`/`yellow`/`red`, shard counts).
- `GET /_cat/indices/?pretty` — indices such as `sw1_manufacturer_<timestamp>`.
- `DELETE /_all` — delete all indices (testing/staging only).

**Queue state (installed code).** With the Doctrine transport, pending messages are rows in the `messenger_messages` table. Stuck scheduled tasks can be reset from status `queued` to `scheduled`:

```sql
update scheduled_task set status = 'scheduled' where status = 'queued';
```

**Full reset (testing/staging)**: clear the database queue, `DELETE` all indices, then `cache:clear` → `es:index` → `messenger:consume -vv` until drained → `es:create:alias` if the Storefront still shows nothing.

## Essential identifiers

- `es:index`, `es:create:alias`, `es:index:cleanup`
- `dal:refresh:index --use-queue`, `messenger:consume -vv`, `cache:clear`
- `Shopware\Elasticsearch\Framework\Indexing\ElasticsearchIndexingMessage`
- `messenger_messages`, `scheduled_task`

## Gotchas

- The docs' SQL checks and resets use the tables `enqueue`, `dead_message` and `message_queue_stats` (`select count(*) from enqueue`, `truncate dead_message`, ...). All three are dropped by 6.5 migrations and do not exist in 6.7; those queries fail.
- Queue statistics in 6.7 come from the increment gateway pool `IncrementGatewayRegistry::MESSAGE_QUEUE_POOL` (`message_queue`), which is deprecated for v6.8.0 — do not build tooling on it.
- The reset only applies to the database queue; external brokers need their own purge.
- Logs are usually under `/var/log/elasticsearch`; Kibana or Cerebro help inspect the cluster.

## Version notes

- Manual `es:create:alias` was required in older versions; it normally runs automatically now.

## Code check (6.7.13.0)
- confirmed `dal:refresh:index` — DAL reindex command — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:22
- confirmed `use-queue` — option on dal:refresh:index — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:45
- corrected `enqueue` — docs: count/truncate the enqueue table; code drops the table in 6.5 — vendor/shopware/core/Migration/V6_5/Migration1669125399DropEnqueueTable.php:26
- corrected `dead_message` — docs: truncate dead_message; code drops the table — vendor/shopware/core/Migration/V6_5/Migration1669124190AddDoctrineMessengerTable.php:43
- corrected `message_queue_stats` — docs: query/truncate the table; code drops it — vendor/shopware/core/Migration/V6_5/Migration1675082889DropUnusedTables.php:22
- confirmed `messenger_messages` — Doctrine messenger transport table — vendor/shopware/core/Migration/V6_5/Migration1669124190AddDoctrineMessengerTable.php:24
- deprecated `IncrementGatewayRegistry::MESSAGE_QUEUE_POOL` — increment-based queue stats deprecated for v6.8.0 — vendor/shopware/core/Framework/Increment/IncrementGatewayRegistry.php:16
- confirmed `ScheduledTaskDefinition::STATUS_QUEUED` — status value 'queued' — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskDefinition.php:23
- unverified `es:index` — command ships in shopware/elasticsearch, outside the checked roots
- unverified `ElasticsearchIndexingMessage` — class in shopware/elasticsearch, outside the checked roots
