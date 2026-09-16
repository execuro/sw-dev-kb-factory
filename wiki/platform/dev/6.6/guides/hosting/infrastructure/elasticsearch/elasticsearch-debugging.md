---
id: platform/dev/6.6/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md
title: Debugging Elasticsearch
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.html
sourceHash: 0b5e2f84678b941e34969743453c76909f46bd10
keywords: ["elasticsearch debugging", "es:index", "es:create:alias", "dal:refresh:index", "es:index:cleanup", "messenger:consume", "enqueue table", "dead_message table", "message_queue_stats", "reindexing", "cluster health", "cache:clear"]
summary: "CLI commands and database queries to debug, reindex, and reset Elasticsearch indexing status in Shopware."
lastBuilt: 2026-09-15
---
## What it is
Provides CLI commands and database queries for debugging Elasticsearch indexing status in a Shopware installation, including cache clearing, reindexing, and resetting the ES index.

## When to use
Use it when Elasticsearch indexing appears stuck, products are missing from the Storefront search, or you need to inspect or reset the indexing queue.

## Key steps / config
Ensure debug mode is enabled in `.env` before debugging. Key CLI commands:
- `bin/console cache:clear` — clears the cache.
- `bin/console es:index` — creates only the ES index.
- `bin/console es:create:alias` — creates the alias linking to the index after `es:index` finishes (usually automatic).
- `bin/console dal:refresh:index --use-queue` — full reindex of the DAL (ES/SEO/Media/Sitemap); always use `--use-queue` to avoid overloading the server.
- `bin/console messenger:consume -vv` — starts a message consumer (more than 3 concurrent consumers should use a broker such as RabbitMQ).
- `bin/console es:index:cleanup` — removes unused indices left behind by prior indexing runs.

Elasticsearch's REST API also exposes cluster and index status endpoints, e.g. `_cluster/health`, `_cat/indices`, and deleting all indices via `_all`.

Indexing status can be checked directly in the database:
```sql
select * from message_queue_stats;
select count(*) from enqueue;
select count(*) from dead_message;
```

To reset a stuck indexing queue (database transport only):
```sql
truncate enqueue;
truncate dead_message;
truncate message_queue_stats;
update scheduled_task set status = 'scheduled' where status = 'queued';
```

## Essential identifiers
- `bin/console es:index`
- `bin/console es:create:alias`
- `bin/console dal:refresh:index --use-queue`
- `bin/console es:index:cleanup`
- `bin/console messenger:consume -vv`
- `enqueue`, `dead_message`, `message_queue_stats`, `scheduled_task` tables

## Gotchas
Always pass `--use-queue` to `dal:refresh:index`, since large reindex requests without it can overload the server. The database reset queries only apply when the database message queue transport is used.
