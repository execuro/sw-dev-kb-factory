---
id: platform/dev/6.7/products/paas/shopware/get-started/cli.md
title: CLI
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/get-started/cli.html
sourceHash: c8aed35f3051b713d738eaad559d0366375c3045
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-paas", "sw-paas auth", "sw-paas account whoami", "sw-paas account user add", "SW_PAAS_DIR", "paas native cli", "shopware paas", "install cli", "login", "account admin", "aws cognito", "roles"]
summary: Install the Shopware PaaS Native CLI (sw-paas), log in with sw-paas auth, check your role and add users to the organization.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/account.md"]
---
## What it is

The Shopware PaaS Native CLI (`sw-paas`) is the command-line tool for managing shops and resources on Shopware PaaS Native. This page covers prerequisites, installation, authentication, role checks and adding users.

## When to use

Use it when you start working with Shopware PaaS Native and need the CLI installed and authenticated, or when an Account Admin needs to grant a colleague access to the organization.

## Key steps / config

Prerequisites: a Shopware account. Identity is managed through AWS Cognito, and access is currently invite-only. Once the organization is onboarded to the Shopware Business Platform (SBP) and users are added to PaaS Native, the first user gets the admin role and can assign roles to others.

1. Install the latest CLI:
   `curl -L https://install.sw-paas-cli.shopware.systems | sh`
   The script downloads the release from GitHub releases, installs the binary to `~/.sw-paas/bin/sw-paas`, and adds the install directory to `PATH` if missing. Set `SW_PAAS_DIR` to change the install directory (default `~/.sw-paas`).
2. Install a specific version instead:
   `curl -L https://install.sw-paas-cli.shopware.systems | sh -s 0.0.30`
3. Log in: `sw-paas auth` opens a browser window; the authentication token is saved automatically.
4. Check your current role: `sw-paas account whoami`.
5. Add a user (Account Admin only): the new user runs `sw-paas account whoami --output json` to get their user ID, then the admin runs `sw-paas account user add --sub "<user-id of the new user>"`.
6. List all commands and supported flags: run `sw-paas` with no arguments.

Project-level and application-level access, membership requests, service accounts and machine tokens for CI/CD are covered in the [account guide](platform/dev/6.7/products/paas/shopware/fundamentals/account.md).

## Essential identifiers

- `sw-paas` — CLI binary (`~/.sw-paas/bin/sw-paas`)
- `SW_PAAS_DIR` — install directory override
- `sw-paas auth`
- `sw-paas account whoami` / `--output json`
- `sw-paas account user add --sub`
- Role: **Account Admin**

## Gotchas

- Only users with the **Account Admin** role can assign roles to other users.
- You must be invited to the platform before you can access any resources.
- Package-manager installation is announced but not yet available; use the install script.
- Bugs and feedback go to the issue tracker at https://github.com/shopware/sw-paas/issues.

## Code check (6.7.15.1)
- unverified `sw-paas` — standalone PaaS CLI binary, not part of vendor/shopware core, storefront or administration
- unverified `SW_PAAS_DIR` — install-script environment variable, outside the Shopware code roots
- unverified `sw-paas account user add` — PaaS CLI subcommand, out of scope of the installed Shopware code
