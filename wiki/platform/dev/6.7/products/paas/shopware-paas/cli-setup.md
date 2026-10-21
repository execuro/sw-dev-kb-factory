---
id: platform/dev/6.7/products/paas/shopware-paas/cli-setup.md
title: PaaS CLI Setup
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/cli-setup.html
sourceHash: 3488ce8f0ea1228c047aeec914ec99b1e99337b2
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware paas", "paas cli", "shopware cli", "install cli", "cli.shopware.com/installer", "shopware", "authenticate", "login", "ssh keys", "paas console"]
summary: Installing the Shopware PaaS CLI with the cli.shopware.com installer, browser login, and SSH key setup in the PaaS Console.
lastBuilt: 2026-10-21
---
## What it is

The PaaS CLI is the command-line tool used to connect to a Shopware PaaS environment, push changes and trigger deployments. This page covers installing and authenticating it.

## When to use

Before working with a Shopware PaaS project from a local machine — the CLI is a prerequisite for pushing code and managing environment variables.

## Key steps / config

1. Install the CLI:
   ```sh
   curl -sfS https://cli.shopware.com/installer | php
   ```
2. On first run the CLI asks you to log in via the browser.
3. Alternatively, generate an SSH key manually and add it under **My profile > SSH Keys** in the PaaS Console (console.shopware.com). GitHub's SSH key guide is referenced for creating keys.
4. Authenticate by running the CLI without arguments and following the browser instructions:
   ```sh
   shopware
   ```

## Essential identifiers

- `curl -sfS https://cli.shopware.com/installer | php`
- `shopware` (CLI binary)
- **My profile > SSH Keys** (PaaS Console)

## Code check (6.7.15.1)
- unverified `shopware` — PaaS CLI binary, not part of the Shopware core/storefront/administration code
- unverified `https://cli.shopware.com/installer` — external installer script, out of scope
