---
id: "platform/dev/6.6/products/cli/shopware-account-commands/configure-composer-repository.md"
title: "Configure Composer Repository"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/cli/shopware-account-commands/configure-composer-repository.html"
sourceHash: "1f5fda2d4fda9cdd5f3bed41fedc58537b49cc80"
relatedPages: ["platform/dev/6.6/products/cli/shopware-account-commands/authentication.md"]
keywords: ["shopware-cli account merchant shop list", "configure-composer", "auth.json", "composer.json", "Shopware Store", "Composer repository", "account merchant shop", "shop list", "Composer authentication", "extension installation"]
summary: "Documents shopware-cli account merchant shop configure-composer, which writes auth.json and updates composer.json for Store installs."
lastBuilt: "2026-09-15"
---
## What it is
Documents how to configure the Composer repository needed to install extensions from the Shopware Store, using Shopware CLI to generate the required `auth.json` and `composer.json` entries automatically.

## When to use
Use this when setting up a project to install Store extensions via Composer and the Composer repository credentials are not yet configured.

## Key steps / config
Check which shops you have access to in the Shopware Account:

```bash
shopware-cli account merchant shop list
```

If the target shop is not listed, switch to the correct company — see the [Authentication](platform/dev/6.6/products/cli/shopware-account-commands/authentication.md) guide.

Generate the `auth.json` file and append the Composer repository configuration to `composer.json` for a given shop domain:

```bash
shopware-cli account merchant shop configure-composer <domain>
```

Tab completion in the terminal can be used to look up the domains of shops you have access to.

## Essential identifiers
- `shopware-cli account merchant shop list` — lists shops accessible in the Shopware Account
- `shopware-cli account merchant shop configure-composer <domain>` — writes `auth.json` and updates `composer.json` with the Composer repository config
- `auth.json` — Composer authentication file created by the command
- `composer.json` — receives the appended Composer repository configuration
