---
id: "platform/dev/6.6/products/cli/project-commands/mysql-dump.md"
title: "Generating MySQL dumps"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/cli/project-commands/mysql-dump.html"
sourceHash: "307fe11e23b4b06717b8dd7a894cb5d7d0db61a0"
keywords: ["shopware-cli project dump", "mysql dump", "skip-lock-tables", "compression gzip zstd", "anonymize flag", "dump.rewrite", "dump.nodata", "dump.ignore", "dump.where", "shopware-project.yml", "table locking"]
summary: "Documents shopware-cli project dump: creating, compressing, anonymizing, filtering and locking-control for native MySQL dumps."
lastBuilt: "2026-09-15"
---
## What it is
Documents Shopware-CLI's built-in MySQL dump command, a native dump implementation that does not rely on external tools such as `mysqldump`.

## When to use
Use this to create a database dump for backups, transfers, or anonymized copies of a Shopware project's database, with optional compression, table locking control, and data anonymization or filtering.

## Key steps / config
Create a dump using credentials from the `.env` file:

```bash
shopware-cli project dump
```

This creates `dump.sql` in the current directory. To use different credentials:

```bash
shopware-cli project dump --host 127.0.0.1 --username root --password root --database sw6
```

Use `--skip-lock-tables` to skip locking tables before the dump — useful for large databases or when the MySQL user lacks lock rights, since table locking is otherwise the default.

Compress the dump with `--compression=gzip` or `--compression=zstd`.

Anonymize known user data tables with `--anonymize`. Customize anonymization via the `dump.rewrite` configuration in `shopware-cli.yml`:

```yaml
dump:
  rewrite:
    <table-name>:
      <column-name>: "'new-value'"
```

Skip the content of default tables such as `cart`, `log_entry`, `refresh_token`, and `version` with `--clean`; add more with `dump.nodata` in `shopware-project.yml`:

```yaml
dump:
  nodata:
    - <table-name>
```

Fully exclude a table, not just its content:

```yaml
dump:
  ignore:
    - <table-name>
```

Export only rows matching a condition:

```yaml
dump:
  where:
    <table-name>: 'id > 5'
```

## Essential identifiers
- `shopware-cli project dump` — creates a `dump.sql` MySQL dump
- `--skip-lock-tables`, `--compression=gzip|zstd`, `--anonymize`, `--clean` — dump command flags
- `dump.rewrite` / `dump.nodata` / `dump.ignore` / `dump.where` — `shopware-project.yml` dump configuration keys

## Gotchas
`--skip-lock-tables` may be required if the MySQL user has no rights to lock tables, since table locking is the default behavior.
