---
id: platform/dev/6.6/products/paas/shopware-paas/cli-setup.md
title: PaaS CLI Setup
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware-paas/cli-setup.html"
sourceHash: "3488ce8f0ea1228c047aeec914ec99b1e99337b2"
keywords: ["PaaS CLI", "cli.shopware.com", "installer", "SSH key", "PaaS Console", "authenticate", "shopware command", "login", "install PaaS CLI", "browser login", "console.shopware.com", "My profile SSH Keys"]
summary: "Install the PaaS CLI via a curl installer script, then authenticate via browser or an SSH key added in the PaaS Console."
lastBuilt: "2026-09-15"
---

## What it is

The PaaS CLI is the tool used to connect to a Shopware PaaS environment, push changes, and trigger deployments.

## When to use

Use this page when setting up local access to a Shopware PaaS environment for the first time, before running any other `sw-paas`/PaaS CLI commands.

## Key steps / config

To install the PaaS CLI, run:

```sh
curl -sfS https://cli.shopware.com/installer | php
```

The first time the PaaS CLI runs, it prompts a login via the browser. Alternatively, an SSH key can be generated manually and added under **My profile > SSH Keys** in the PaaS Console (`https://console.shopware.com/`).

To authenticate, run:

```sh
shopware
```

and follow the instructions; authentication can also be completed through the browser.

## Essential identifiers

- `curl -sfS https://cli.shopware.com/installer | php` — install command
- `shopware` — authenticate command
- PaaS Console SSH Keys section (**My profile > SSH Keys**)

## Gotchas

The source notes that if unsure how to create SSH keys, GitHub's own tutorial on generating and adding an SSH key can be followed, since the PaaS Console SSH key setup uses the same mechanism.
