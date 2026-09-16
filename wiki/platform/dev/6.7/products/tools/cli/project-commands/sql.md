---
id: platform/dev/6.7/products/tools/cli/project-commands/sql.md
title: SQL Shell
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/sql.html
sourceHash: 73906326a22bb88d5494a41fabd7a99b2be01b0a
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project sql", "sql shell", "mysql client", "database console", "--file", "--format", "table", "tsv", "json", "stdin", "query", "database connection"]
summary: shopware-cli project sql opens a DB shell or runs a query/script (argument, stdin, --file) using the environment's connection; --format table, tsv or json.
lastBuilt: 2026-09-15
---
## What it is

`shopware-cli project sql` connects to the project database using the connection details of the current environment (local, Docker, ...), so you do not need to know the host or credentials. It opens an interactive shell, runs a single query, or executes a script.

## When to use

When you need to inspect or modify the Shopware database of a project from the command line without looking up credentials — ad-hoc queries, running SQL scripts, or piping JSON results into other tools.

## Key steps / config

```bash
# Interactive shell (quit with exit or Ctrl+D)
shopware-cli project sql

# Single query as argument
shopware-cli project sql "SELECT id, tax_rate FROM tax"

# Script via stdin
shopware-cli project sql < script.sql

# Script from a file
shopware-cli project sql --file script.sql

# Output format: table, tsv or json
shopware-cli project sql --format json "SELECT * FROM sales_channel" | jq
```

- `--format` accepts `table`, `tsv` or `json`. Default: `table` when stdout is a terminal, `tsv` otherwise.
- `--file` executes a SQL script from disk.

## Essential identifiers

- `shopware-cli project sql`
- `--file`
- `--format` (`table`, `tsv`, `json`)

## Gotchas

- `--file` cannot be combined with a query argument.
- A missing `--file` path is reported before the database connection opens.
- Piped output defaults to `tsv`, not `table` — set `--format` explicitly in scripts if you rely on a format.

## Code check (6.7.13.0)
- unverified `shopware-cli project sql` — Shopware CLI (Go tool), not part of vendor/shopware
- unverified `--format` — CLI option, out of scope of vendor/shopware
- confirmed `tax` — table used in the example query exists — vendor/shopware/core/Migration/V6_3/Migration1536232660Tax.php:23
- confirmed `tax.tax_rate` — column used in the example query exists — vendor/shopware/core/Migration/V6_3/Migration1536232660Tax.php:25
- confirmed `sales_channel` — table used in the JSON example exists — vendor/shopware/core/Migration/V6_3/Migration1536232940SalesChannel.php:23
