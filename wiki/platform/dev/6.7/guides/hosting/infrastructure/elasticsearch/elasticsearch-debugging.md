---
id: platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md
title: Debugging and Troubleshooting Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.html
sourceHash: 6e9410d73e152c6a35b278a328786123d6f04f3d
codeCheckedAgainst: "6.7.15.1"
keywords: ["es:index", "es:create:alias", "es:index:cleanup", "dal:refresh:index", "messenger:consume", "ElasticsearchIndexingMessage", "messenger_messages", "scheduled_task", "elasticsearch troubleshooting", "reindex", "stuck indexing", "opensearch", "cluster health"]
summary: "Elasticsearch troubleshooting: es:index, es:create:alias, es:index:cleanup, cluster REST checks, SQL to inspect or reset stuck indexing."
lastBuilt: 2026-10-21
---
## What it is

A troubleshooting checklist for Shopware's Elasticsearch/OpenSearch integration: CLI commands for indexing and aliases, Elasticsearch REST endpoints for cluster state, and SQL queries to inspect or reset the indexing queue. Debug mode should be active in `.env` while debugging.

## When to use

Indexing does not finish, aliases are missing, products do not show up in the Storefront, queues are stuck, or search results look wrong.

## Key steps / config

CLI commands:

- `bin/console cache:clear` — clear the cache (needed after `.env` changes).
- `bin/console es:index` — creates only the ES index (no output); the actual work is dispatched to the message queue.
- `bin/console es:create:alias` — links the alias to the index after `es:index` is done. Normally automatic; older versions required it manually.
- `bin/console dal:refresh:index --use-queue` — full reindex of all DAL indexers (ES, SEO, media, sitemap, ...). Always pass `--use-queue`; large synchronous runs can overload the server.
- `bin/console messenger:consume -vv` — starts a consumer; can run several in parallel. With more than 3 consumers use something like RabbitMQ instead of the DB queue.
- `bin/console es:index:cleanup` — removes unused indices (each indexing run creates a new index).

Elasticsearch REST checks (host `elasticsearch:9200` in the docs' Docker setup):

```bash
curl -XGET 'elasticsearch:9200/?pretty'                 # node/version info
curl -XGET 'elasticsearch:9200/_cluster/health?pretty'  # cluster status
curl -XGET 'elasticsearch:9200/_cat/indices/?pretty'    # list indices (e.g. sw1_manufacturer_<timestamp>)
curl -X DELETE 'elasticsearch:9200/_all'                # delete ALL indices
```

Indexing status in the database (DB queue): waiting vs. failed messages.

```sql
select count(*) from messenger_messages where headers like '%ElasticsearchIndexingMessage%' and queue_name <> 'failed' ;
select count(*) from messenger_messages where headers like '%ElasticsearchIndexingMessage%' and queue_name = 'failed' ;
```

While waiting messages exist, indexing is in progress and a consumer must process them.

Reset stuck indexing (DB queue only):

```sql
delete from messenger_messages where headers like '%ElasticsearchIndexingMessage%' ;
update scheduled_task set status = 'scheduled' where status = 'queued';
```

Complete reset (testing/staging only): run the reset SQL above, then `curl -X DELETE 'elasticsearch:9200/_all'`, `bin/console cache:clear`, `bin/console es:index`, `bin/console messenger:consume -vv`. If products still do not appear in the Storefront after the last message, run `bin/console es:create:alias`.

## Essential identifiers

- `es:index`, `es:create:alias`, `es:index:cleanup`
- `dal:refresh:index --use-queue`, `messenger:consume -vv`, `cache:clear`
- `Shopware\Elasticsearch\Framework\Indexing\ElasticsearchIndexingMessage`
- tables `messenger_messages` (`queue_name = 'failed'`), `scheduled_task` (`status`)

## Gotchas

- `DELETE _all` removes every index on the cluster, not only Shopware's.
- The SQL resets only work when the database is the message transport; third-party queues differ.
- Logs are usually in `/var/log/elasticsearch`; Kibana or Cerebro help inspect the cluster.

## Code check (6.7.15.1)
- confirmed `dal:refresh:index` — command name of RefreshIndexCommand — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:23
- confirmed `use-queue` — option is passed to the indexer registry to dispatch via the queue — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:45
- confirmed `STATUS_SCHEDULED` — value `scheduled` used by the reset SQL — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskDefinition.php:24
- confirmed `STATUS_QUEUED` — value `queued` used by the reset SQL — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskDefinition.php:26
- unverified `es:index` — defined in the shopware/elasticsearch package, outside the checked roots
- unverified `es:create:alias` — shopware/elasticsearch package, out of scope
- unverified `es:index:cleanup` — shopware/elasticsearch package, out of scope
- unverified `ElasticsearchIndexingMessage` — shopware/elasticsearch package, out of scope
- unverified `messenger:consume` — Symfony Messenger command, out of scope
