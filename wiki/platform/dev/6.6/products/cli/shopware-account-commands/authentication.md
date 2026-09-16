---
id: platform/dev/6.6/products/cli/shopware-account-commands/authentication.md
title: Authentication
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/shopware-account-commands/authentication.html
sourceHash: 97f67c76b9ec3ece0af1e5f440cd6dccf7dc8e98
keywords: ["shopware-cli", "account login", "SHOPWARE_CLI_ACCOUNT_EMAIL", "SHOPWARE_CLI_ACCOUNT_PASSWORD", "account company list", "account company use", "Shopware Account", "CI/CD", "multiple companies"]
summary: "shopware-cli account login authenticates to the Shopware Account API; CI/CD uses SHOPWARE_CLI_ACCOUNT_EMAIL/PASSWORD env vars."
lastBuilt: "2026-09-15"
---
## What it is

Describes how to authenticate to the Shopware Account API with Shopware CLI, and how to switch between multiple companies on one account.

## When to use

Needed before using any Shopware Account-dependent command (e.g. Composer repository setup, extension release/store-page commands).

## Key steps / config

Interactive login:

```bash
shopware-cli account login
```

For CI/CD, pass credentials as environment variables and call the command directly: `SHOPWARE_CLI_ACCOUNT_EMAIL` and `SHOPWARE_CLI_ACCOUNT_PASSWORD`. Use a dedicated Shopware Account with limited Store access for CI/CD.

A Shopware Account can belong to multiple companies; only one is active at a time.

```bash
shopware-cli account company list
shopware-cli account company use <id>
```

## Essential identifiers

- `shopware-cli account login`
- `SHOPWARE_CLI_ACCOUNT_EMAIL`, `SHOPWARE_CLI_ACCOUNT_PASSWORD`
- `shopware-cli account company list` / `use <id>`
