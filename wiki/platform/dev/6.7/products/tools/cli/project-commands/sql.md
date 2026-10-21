---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/tools/cli/project-commands/sql.md
sourceHash: 73906326a22bb88d5494a41fabd7a99b2be01b0a
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/sql.html
title: SQL Shell
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware-cli project sql", "sql shell", "mysql client", "database console", "--file", "--format", "json output", "tsv", "stdin script", "run sql query", "database connection", "docker database"]
summary: "shopware-cli project sql opens an SQL shell or runs a query/script on the project database using the current environment's connection."
lastBuilt: 2026-10-21
---
## What it is

`shopware-cli project sql` connects to the project database using the connection details of the current environment (local, Docker, ...), so you do not need to know the database host or credentials. It can open an interactive shell, run a single query, or execute a script.

## When to use

Inspecting or fixing data in a Shopware project database from the command line without looking up connection details — ad-hoc queries, running a fix-up script, or piping query results as JSON into other tools.

## Key steps / config

```bash
# Interactive shell (quit with `exit` or Ctrl+D)
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

- `--file <path>` executes an SQL script from disk.
- `--format` accepts `table`, `tsv` or `json`. Default: `table` when stdout is a terminal, `tsv` otherwise (piped/redirected output).

## Essential identifiers

- `shopware-cli project sql`
- `--file`
- `--format table|tsv|json`

## Gotchas

- `--file` cannot be combined with a query argument.
- A missing `--file` path is reported before the database connection is opened.
- When piping, output switches to `tsv` unless `--format` is given explicitly — pass `--format json` if a downstream tool expects JSON.

## Code check (6.7.15.1)
- unverified `shopware-cli project sql` — command lives in the separate Shopware CLI tool, outside vendor/shopware, out of scope
- unverified `--format` — Shopware CLI option (table/tsv/json), out of scope
- unverified `--file` — Shopware CLI option, out of scope
- confirmed `tax_rate` — column of the `tax` table used in the example query — vendor/shopware/core/Migration/V6_3/Migration1536232660Tax.php:25
- confirmed `sales_channel` — table queried in the JSON example exists — vendor/shopware/core/Migration/V6_3/Migration1536232940SalesChannel.php:23
