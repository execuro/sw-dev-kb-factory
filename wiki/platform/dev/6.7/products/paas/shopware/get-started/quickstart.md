---
id: platform/dev/6.7/products/paas/shopware/get-started/quickstart.md
title: Quickstart
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/get-started/quickstart.html
sourceHash: 6c247b66b9369b5e6ed5eef41dc9bd311bb67ab6
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-paas", "sw-paas project create", "sw-paas application create", "sw-paas application deploy create", "sw-paas watch", "sw-paas version", "paas cli", "deploy key", "ssh key", "first deployment", "paas native"]
summary: "Shopware PaaS Native quickstart: install the sw-paas CLI, create a project with a repository deploy key, create an application, deploy and watch progress."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/get-started/_index.md"]
---
## What it is

The minimal command sequence to deploy a first Shopware application on Shopware PaaS Native with the `sw-paas` CLI.

## When to use

When a Git repository with a Shopware application already prepared for PaaS exists (see [Get started](platform/dev/6.7/products/paas/shopware/get-started/_index.md)), Git is installed, and a terminal is available.

## Key steps / config

1. Install the CLI and verify it:
   ```sh
   curl -L https://install.sw-paas-cli.shopware.systems | sh
   sw-paas version
   ```
2. Create the project and connect the repository with `sw-paas project create`. The wizard asks for organization, project name and Git repository. Answer `y` when asked to create a project SSH key; the CLI prints the public key and waits until it is added to the repository:
   - GitHub: `Settings` → `Deploy keys` → `Add deploy key`
   - GitLab: `Settings` → `Repository` → `Deploy Keys`
   - Bitbucket: `Repository settings` → `Access keys`
   
   Give the key read access, then confirm in the wizard.
3. Create the application: `sw-paas application create`.
4. Deploy: `sw-paas application deploy create`.
5. Monitor: `sw-paas watch`.

## Essential identifiers

- `sw-paas version`
- `sw-paas project create`
- `sw-paas application create`
- `sw-paas application deploy create`
- `sw-paas watch`

## Gotchas

- The deploy key only needs read access to the repository; the wizard does not complete project creation until you confirm the key was added.

## Code check (6.7.13.0)
- unverified `sw-paas` — external PaaS CLI, not part of the installed Shopware core/storefront/administration code
- unverified `sw-paas application deploy create` — CLI subcommand, out of scope of vendor/shopware
