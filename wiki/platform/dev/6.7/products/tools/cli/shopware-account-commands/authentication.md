---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/tools/cli/shopware-account-commands/authentication.md
sourceHash: 5a6faace20ed9ab17c68a7906dd3e8dfd874c936
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/shopware-account-commands/authentication.html
title: Authentication
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware-cli account login", "shopware-cli account logout", "SHOPWARE_CLI_ACCOUNT_CLIENT_ID", "SHOPWARE_CLI_ACCOUNT_CLIENT_SECRET", "shopware-cli account producer extension list", "shopware account api", "login", "ci/cd credentials", "extension partner", "producer account", "shopware store"]
summary: "Shopware CLI auth for the Shopware Account API: account login/logout and CI env vars SHOPWARE_CLI_ACCOUNT_CLIENT_ID/_SECRET."
lastBuilt: 2026-10-21
---
## What it is

How Shopware CLI authenticates against the Shopware Account API — interactive browser login, logout, and non-interactive credentials for CI/CD — plus the command to list the extensions in your producer account.

## When to use

Before running any `shopware-cli account ...` command (for example uploading an extension to the Shopware Store), or when configuring a CI/CD pipeline that talks to the Shopware Account.

## Key steps / config

Interactive login (opens a browser window to log in):

```bash
shopware-cli account login
```

Log out — removes the stored credentials from the CLI:

```bash
shopware-cli account logout
```

CI/CD: pass the credentials as environment variables and call the command you need directly:

- `SHOPWARE_CLI_ACCOUNT_CLIENT_ID`
- `SHOPWARE_CLI_ACCOUNT_CLIENT_SECRET`

Generate the client ID and secret in the Shopware Account, section **Extension Partner**, navigation point **Development**.

List all extensions in the producer account (across all projects and versions), showing names, versions and status — useful for scripts and automation:

```bash
shopware-cli account producer extension list
```

## Essential identifiers

- `shopware-cli account login`
- `shopware-cli account logout`
- `shopware-cli account producer extension list`
- `SHOPWARE_CLI_ACCOUNT_CLIENT_ID`, `SHOPWARE_CLI_ACCOUNT_CLIENT_SECRET`

## Code check (6.7.15.1)
- unverified `shopware-cli account login` — Shopware CLI command against the Shopware Account API, outside vendor/shopware, out of scope
- unverified `shopware-cli account logout` — Shopware CLI command, out of scope
- unverified `SHOPWARE_CLI_ACCOUNT_CLIENT_ID` — env var read by Shopware CLI, not by vendor/shopware, out of scope
- unverified `SHOPWARE_CLI_ACCOUNT_CLIENT_SECRET` — env var read by Shopware CLI, out of scope
- unverified `shopware-cli account producer extension list` — Shopware CLI command, out of scope
