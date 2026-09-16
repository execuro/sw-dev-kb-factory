---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/paas/shopware-paas/cli-setup.md
sourceHash: 3488ce8f0ea1228c047aeec914ec99b1e99337b2
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/cli-setup.html
title: PaaS CLI Setup
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware paas", "paas cli", "shopware", "cli installer", "cli.shopware.com", "ssh keys", "paas console", "authentication", "login", "install"]
summary: "Install the Shopware PaaS CLI via the cli.shopware.com installer, authenticate by running shopware in a browser flow, add SSH keys in PaaS Console."
lastBuilt: 2026-09-15
---
## What it is

Setup of the Shopware PaaS CLI, the tool used to connect to a PaaS environment, push changes and trigger deployments.

## When to use

Before working with a Shopware PaaS project from your machine (pushing code, managing variables, deployments).

## Key steps / config

1. Install the CLI:

   ```sh
   curl -sfS https://cli.shopware.com/installer | php
   ```

2. Authenticate: run the CLI with no arguments and follow the browser login instructions (the first run of the CLI also asks for a browser login):

   ```sh
   shopware
   ```

3. Optional: generate an SSH key manually and add it under **My profile > SSH Keys** in the PaaS Console (console.shopware.com). GitHub's tutorial on generating SSH keys covers key creation.

## Essential identifiers

- `curl -sfS https://cli.shopware.com/installer | php`
- `shopware` (PaaS CLI binary)
- PaaS Console: **My profile > SSH Keys**

## Code check (6.7.13.0)
- unverified `shopware` — standalone PaaS CLI binary, not part of vendor/shopware
- unverified `cli.shopware.com/installer` — external installer script, outside vendor/shopware
