---
id: platform/func/tutorials-and-faq/migration-tips.md
title: Migration Tips
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/migration-tips
sourceHash: c6b28bb322f29b1a47b37ba7cdafb01fade25b5af59644a3a5dda1cde89fc963
revision:
  current: true
  range: "6.0.0 - 6.6.10.10"
  swMax: "6.6.10.10"
  swMin: "6.0.0"
keywords: ["migration", "swag_migration_logging", "swag_migration_mapping", "swag_migration_media_file", "swag_migration_data", "indexing", "message queue", "dead_message", "enqueue", "message_queue_stats", "increment", "checksum", "reindexing"]
summary: "Migration troubleshooting: error log tables, stuck indexing fixes, message queue reset, and re-transferring already migrated entities."
lastBuilt: 2026-09-15
---

## What it is

Troubleshooting hints for the Shopware migration process, covering error analysis, stuck indexing, and re-running a migration for specific entities.

## Key steps / config

Error analysis tables: in addition to the large log files, the `swag_migration_logging` table can be filtered by error level and/or entity. Other relevant tables: `swag_migration_mapping`, `swag_migration_media_file`, `swag_migration_data`.

For very large data volumes (several million records, especially variants), migrating via a locally located database instead of the API/store domain can reduce load; this is set in the migration wizard's "Edit connection" option.

"No connection established" error: check the store domain/API key, and make sure the migration extension is on its latest version.

Stuck indexing: requires at least 2 GB memory limit, no long-lasting processes killed by the server, and a reset message queue. Reset by backing up and clearing each table:

```
CREATE TABLE backup_dead_message LIKE dead_message;
INSERT INTO backup_dead_message SELECT * FROM dead_message;
DELETE FROM dead_message;
```
(repeat the same pattern for `enqueue`, `message_queue_stats`, and `increment`, via `backup_increment`)

Then process the message queue via CLI and trigger reindexing:

```
bin/console dal:refresh:index --use-queue
```

Once indexing completes, clear the cache via FTP (delete all subfolders under `/var/cache/*`).

Re-migrating already-transferred data: Shopware checksums read data in the `swag_migration_mapping` table to avoid duplicate migration. Individual rows can be reset manually, e.g. to re-migrate only newsletter recipients:

```
UPDATE swag_migration_mapping SET checksum = null WHERE entity = "newsletter_recipient"
```

## Essential identifiers

- `swag_migration_logging`
- `swag_migration_mapping`
- `swag_migration_media_file`
- `swag_migration_data`
- `dal:refresh:index --use-queue`
- `dead_message`, `enqueue`, `message_queue_stats`, `increment`

## Gotchas

An incompletely built index can make the migration appear "stuck", shown by notifications like "Circa 1395350 products remaining ...". Resetting the message queue tables is required to unblock it.
