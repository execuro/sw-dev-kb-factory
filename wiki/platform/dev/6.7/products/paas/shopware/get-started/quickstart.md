---
id: platform/dev/6.7/products/paas/shopware/get-started/quickstart.md
title: Quickstart
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/get-started/quickstart.html
sourceHash: f1874c76076dafe3783d0688b4066d7d55975557
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-paas project create", "sw-paas application create", "sw-paas watch", "sw-paas open storefront", "sw-paas version", "DEPLOYING_STORE_SUCCESS", "deploy key", "ssh key", "paas native", "first deployment", "quickstart"]
summary: "PaaS Native quickstart: install sw-paas, create a project with a repo deploy key, run sw-paas application create, watch for DEPLOYING_STORE_SUCCESS."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/get-started/_index.md"]
---
## What it is

A minimal walkthrough for deploying a first Shopware application on Shopware PaaS Native with the `sw-paas` CLI: install the CLI, create a project connected to a Git repository, then create and deploy an application.

## When to use

Use it once your Shopware codebase is prepared for PaaS (see the [Get started](platform/dev/6.7/products/paas/shopware/get-started/_index.md) section) and you want a running shop on PaaS Native.

## Key steps / config

Prerequisites: a Git repository with a PaaS-prepared Shopware application, terminal access, and Git installed locally.

1. **Install the CLI**
   `curl -L https://install.sw-paas-cli.shopware.systems | sh`
   Verify with `sw-paas version`.
2. **Create a project and connect the repository**
   Run `sw-paas project create`. The wizard asks for organization, project name and Git repository. Answer `y` when asked to create a project SSH key; the CLI shows the public key and waits until you add it as a deploy key:
   - GitHub: `Settings` → `Deploy keys` → `Add deploy key`
   - GitLab: `Settings` → `Repository` → `Deploy Keys`
   - Bitbucket: `Repository settings` → `Access keys`
   The key needs **read access**. Confirm in the wizard and the CLI finishes creating the project.
3. **Create and deploy the application**
   `sw-paas application create` creates, builds and deploys the application — no separate deploy step.
4. **Monitor** with `sw-paas watch` until the status is `DEPLOYING_STORE_SUCCESS`, then press `Ctrl+C`.
5. **Open the shop**: `sw-paas open storefront`.

## Essential identifiers

- `sw-paas version`
- `sw-paas project create`
- `sw-paas application create`
- `sw-paas watch`
- `sw-paas open storefront`
- `DEPLOYING_STORE_SUCCESS` — deployment status to wait for

## Gotchas

- `sw-paas watch` streams indefinitely and never exits by itself; stop it with `Ctrl+C` after the success status.
- The deploy key must have read access to the repository, otherwise project creation cannot complete.

## Code check (6.7.15.1)
- unverified `sw-paas` — standalone PaaS CLI, not part of vendor/shopware core, storefront or administration
- unverified `DEPLOYING_STORE_SUCCESS` — PaaS deployment status from the platform API, out of scope of the installed Shopware code
- unverified `sw-paas application create` — PaaS CLI subcommand, out of scope
