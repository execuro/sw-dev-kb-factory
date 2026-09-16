---
id: platform/dev/6.7/products/tools/cli/project-commands/mysql-dump.md
title: Generating MySQL Dumps
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/mysql-dump.html
sourceHash: af4238466b01ffad0d5ede41003e183f50f25a9d
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project dump", "--anonymize", "--clean", "--skip-lock-tables", "--compression", "--limit", "dump.rewrite", "dump.nodata", "dump.ignore", "dump.where", "dump.limit", "mysql dump", "database export", "anonymize production data"]
summary: "shopware-cli project dump: native MySQL dump with compression, anonymization, --clean, row limits and dump.rewrite/nodata/ignore/where config."
lastBuilt: 2026-09-15
---
## What it is

`shopware-cli project dump` is a native MySQL dump implementation (not `mysqldump`) that writes `dump.sql` in the current directory, with options to anonymize, skip or filter table data.

## When to use

Exporting a (production) Shopware database for local development, optionally anonymized and trimmed.

## Key steps / config

```bash
shopware-cli project dump                     # credentials from .env
shopware-cli project dump --host 127.0.0.1 --username root --password root --database sw6
shopware-cli project dump --anonymize
shopware-cli project dump --limit order=100
```

Flags: `--compression=gzip` or `--compression=zstd`; `--skip-lock-tables` (no LOCK TABLES, for large DBs or users without lock rights); `--anonymize` (known customer-data tables); `--clean` (skip content of log-like tables); `--limit <table>=<rows>`.

`--clean` skips the content of: `cart`, `customer_recovery`, `dead_message`, `enqueue`, `messenger_messages`, `increment`, `elasticsearch_index_task`, `log_entry`, `message_queue_stats`, `notification`, `payment_token`, `refresh_token`, `version`, `version_commit`, `version_commit_data`, `webhook_event_log`.

`.shopware-project.yml` shape:

```yaml
dump:
  rewrite:
    <table-name>:
      <column-name>: "'new-value'"            # or "faker.Internet().Email()"
  nodata: [<table-name>]                    # keep structure, drop content
  ignore: [<table-name>]                    # drop table entirely
  where:
    <table-name>: 'id > 5'
  limit:
    <table-name>:
      rows: 100
      order_by: 'created_at DESC'           # default when created_at exists
```

## Essential identifiers

- `shopware-cli project dump`, `dump.sql`
- `--anonymize`, `--clean`, `--skip-lock-tables`, `--compression`, `--limit`, `--host`, `--username`, `--password`, `--database`
- `dump.rewrite`, `dump.nodata`, `dump.ignore`, `dump.where`, `dump.limit.<table>.rows`, `dump.limit.<table>.order_by`

## Gotchas

- Table locking is on by default and fails without lock privileges; use `--skip-lock-tables`.
- `--limit` also filters tables referencing the limited table via foreign keys (transitively); a second limit on an already-filtered table is rejected. Self-referencing tables (e.g. `product.parent_id`) also export ancestors of kept rows. Requires `CREATE` and `DROP` privileges (staging tables).
- The source's prose says `dump.ignore` for skipping extra table content, but its example uses `dump.nodata`; `dump.ignore` drops whole tables.
- Rewrite values are SQL expressions (note the inner quotes) or go-faker calls.
- Several `--clean` tables (`enqueue`, `dead_message`, `message_queue_stats`) are dropped by 6.5 destructive migrations and only exist on databases that have not run them.

## Code check (6.7.13.0)
- confirmed `DATABASE_URL` — core builds its DB connection from this env var (the `.env` credentials) — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:42
- confirmed `enqueue` — dropped by destructive migration — vendor/shopware/core/Migration/V6_5/Migration1669125399DropEnqueueTable.php:26
- confirmed `dead_message` — dropped by destructive migration — vendor/shopware/core/Migration/V6_5/Migration1669124190AddDoctrineMessengerTable.php:43
- confirmed `message_queue_stats` — dropped by destructive migration — vendor/shopware/core/Migration/V6_5/Migration1675082889DropUnusedTables.php:22
- confirmed `messenger_messages` — created for the Doctrine messenger transport — vendor/shopware/core/Migration/V6_5/Migration1669124190AddDoctrineMessengerTable.php:24
- confirmed `notification` — table created in 6.7 — vendor/shopware/core/Migration/V6_7/Migration1742563555AddNotificationTable.php:23
- confirmed `webhook_event_log` — table exists — vendor/shopware/core/Migration/V6_4/Migration1620147234CreateWebhookEventLogTable.php:23
- confirmed `increment` — table exists — vendor/shopware/core/Migration/V6_4/Migration1635388654CreateIncrementTable.php:23
- confirmed `cart` — table exists — vendor/shopware/core/Migration/V6_3/Migration1536232980Cart.php:23
- unverified `shopware-cli project dump` — Go shopware-cli command, flags and `dump.*` config, out of scope
