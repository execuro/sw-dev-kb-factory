---
id: platform/dev/6.7/products/tools/cli/shopware-account-commands/authentication.md
title: Authentication
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/shopware-account-commands/authentication.html
sourceHash: 5a6faace20ed9ab17c68a7906dd3e8dfd874c936
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli account login", "shopware-cli account logout", "shopware-cli account producer extension list", "SHOPWARE_CLI_ACCOUNT_CLIENT_ID", "SHOPWARE_CLI_ACCOUNT_CLIENT_SECRET", "shopware account api", "authentication", "ci/cd", "extension partner", "producer account", "login"]
summary: shopware-cli account login/logout for the Shopware Account API; CI uses SHOPWARE_CLI_ACCOUNT_CLIENT_ID/_SECRET env vars; list producer extensions.
lastBuilt: 2026-09-15
---
## What it is

How Shopware CLI authenticates against the Shopware Account API: browser login, logout, environment-variable credentials for CI/CD, and listing the extensions of a producer account.

## When to use

Before running any `shopware-cli account ...` command (e.g. uploading extensions to the Shopware Store), locally or in a CI/CD pipeline.

## Key steps / config

```bash
# Interactive login (opens a browser window)
shopware-cli account login

# Remove stored credentials from the CLI
shopware-cli account logout

# List all extensions in the producer account (all projects and versions)
shopware-cli account producer extension list
```

CI/CD: set the environment variables `SHOPWARE_CLI_ACCOUNT_CLIENT_ID` and `SHOPWARE_CLI_ACCOUNT_CLIENT_SECRET` and call the desired command directly (no `login` step). Generate the client ID and secret in the Shopware Account under **Extension Partner** > **Development**.

The extension list shows names, versions and status of your Store extensions, useful for scripts and automation.

## Essential identifiers

- `shopware-cli account login`
- `shopware-cli account logout`
- `shopware-cli account producer extension list`
- `SHOPWARE_CLI_ACCOUNT_CLIENT_ID`, `SHOPWARE_CLI_ACCOUNT_CLIENT_SECRET`

## Code check (6.7.13.0)
- unverified `shopware-cli account login` — Shopware CLI (Go tool), not part of vendor/shopware
- unverified `SHOPWARE_CLI_ACCOUNT_CLIENT_ID` — CLI env var, not referenced in vendor/shopware
- unverified `SHOPWARE_CLI_ACCOUNT_CLIENT_SECRET` — CLI env var, not referenced in vendor/shopware
- unverified `shopware-cli account producer extension list` — CLI command, out of scope of vendor/shopware
