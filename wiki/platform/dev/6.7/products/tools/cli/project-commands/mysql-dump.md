---
id: platform/dev/6.7/products/tools/cli/project-commands/mysql-dump.md
title: Generating MySQL Dumps
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/mysql-dump.html
sourceHash: 43eb00bc2e5caf74735e6a429cb228f7772355ef
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli project dump", "mysql dump", "database export", "--anonymize", "anonymization", "gdpr safe dump", "--clean", "--skip-lock-tables", "--compression", "--limit", "dump.rewrite", "dump.nodata", "dump.ignore", "dump.where", "dump.limit"]
summary: shopware-cli project dump writes a native MySQL dump with compression, anonymization, table cleaning/ignoring, where clauses and FK-aware row limits.
lastBuilt: 2026-10-21
---
## What it is

`shopware-cli project dump` is a native MySQL dump implementation (it does not call `mysqldump`). It writes `dump.sql` in the current directory using the database credentials from the project's `.env`, and can compress, anonymize, skip or filter table data.

## When to use

Exporting a production or staging database for local development — typically anonymized, without log/queue tables, and optionally trimmed to a subset of rows.

## Key steps / config

```bash
shopware-cli project dump
shopware-cli project dump --host 127.0.0.1 --username root --password root --database sw6
shopware-cli project dump --anonymize
shopware-cli project dump --limit order=100
```

- `--compression=gzip` or `--compression=zstd` compresses the dump.
- `--skip-lock-tables` skips the lock-tables step (large DBs, or a MySQL user without lock rights). Locking is on by default.
- `--anonymize` anonymizes known customer-data tables while keeping structure and relations; the list is in the shopware-cli source ([config.go](https://github.com/shopware/shopware-cli/blob/main/internal/shop/config.go#L246)).
- `--clean` dumps no content for default tables: `cart`, `customer_recovery`, `messenger_messages`, `increment`, `elasticsearch_index_task`, `log_entry`, `notification`, `payment_token`, `refresh_token`, `version`, `version_commit`, `version_commit_data`, `webhook_event_log` (plus legacy names, see Gotchas).
- `--limit <table>=<rows>` caps rows of one table; tables referencing it via foreign keys (transitively) keep only matching rows; for self-references (e.g. `product.parent_id`) ancestors of kept rows are exported too.

Persistent settings in `.config/shopware-project.yml`:

```yaml
dump:
  rewrite:
    <table-name>:
      <column-name>: "'new-value'"            # literal
      <column-name>: "faker.Internet().Email()" # go-faker
  nodata: [<table-name>]      # skip content only
  ignore: [<table-name>]      # skip table entirely
  where:
    <table-name>: 'id > 5'
  limit:
    <table-name>: { rows: 100, order_by: 'created_at DESC' }
```

`limit.order_by` defaults to `created_at DESC` when the table has a `created_at` column.

## Essential identifiers

- `shopware-cli project dump`, `dump.sql`
- Flags: `--host`, `--username`, `--password`, `--database`, `--compression`, `--skip-lock-tables`, `--anonymize`, `--clean`, `--limit`
- Config: `dump.rewrite`, `dump.nodata`, `dump.ignore`, `dump.where`, `dump.limit` (`rows`, `order_by`)

## Gotchas

- The source prose says additional content-less tables go under `dump.ignore`, but its example uses `dump.nodata`; `dump.ignore` is shown separately as dropping the whole table, not only its content.
- A second `--limit` on a table already filtered via foreign keys is rejected.
- `--limit` needs MySQL `CREATE` and `DROP` privileges (kept rows are frozen in staging tables).
- The `--clean` list also names `dead_message`, `enqueue` and `message_queue_stats`; core 6.5 migrations drop these tables, so they do not exist on a 6.7 database.

## Code check (6.7.15.1)
- confirmed `messenger_messages` — Doctrine Messenger table created by core migration — vendor/shopware/core/Migration/V6_5/Migration1669124190AddDoctrineMessengerTable.php:24
- confirmed `increment` — increment table — vendor/shopware/core/Migration/V6_4/Migration1635388654CreateIncrementTable.php:23
- confirmed `notification` — table added in 6.7 migrations — vendor/shopware/core/Migration/V6_7/Migration1742563555AddNotificationTable.php:23
- confirmed `webhook_event_log` — webhook log table — vendor/shopware/core/Migration/V6_4/Migration1620147234CreateWebhookEventLogTable.php:23
- confirmed `customer_recovery` — password recovery table — vendor/shopware/core/Migration/V6_3/Migration1570622696CustomerPasswordRecovery.php:26
- corrected `dead_message` — docs: listed for `--clean`; dropped by a 6.5 migration — vendor/shopware/core/Migration/V6_5/Migration1669124190AddDoctrineMessengerTable.php:43
- corrected `enqueue` — docs: listed for `--clean`; dropped by a 6.5 migration — vendor/shopware/core/Migration/V6_5/Migration1669125399DropEnqueueTable.php:26
- corrected `message_queue_stats` — docs: listed for `--clean`; dropped by a 6.5 migration — vendor/shopware/core/Migration/V6_5/Migration1675082889DropUnusedTables.php:22
- confirmed `ParentFkField` — product has a parent FK (self-reference `product.parent_id`) — vendor/shopware/core/Content/Product/ProductDefinition.php:155
- unverified `shopware-cli project dump` — Go CLI, not part of the Shopware core/storefront/administration packages
