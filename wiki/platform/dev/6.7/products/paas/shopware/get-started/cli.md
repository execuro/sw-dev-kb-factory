---
id: platform/dev/6.7/products/paas/shopware/get-started/cli.md
title: CLI
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/get-started/cli.html
sourceHash: c8aed35f3051b713d738eaad559d0366375c3045
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-paas", "sw-paas auth", "sw-paas account whoami", "sw-paas account user add", "SW_PAAS_DIR", "paas cli", "install cli", "login", "authentication", "account admin", "roles", "aws cognito", "shopware business platform"]
summary: "Install the Shopware PaaS Native CLI (sw-paas), log in with sw-paas auth, check roles with sw-paas account whoami and add users as Account Admin."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/account.md"]
---
## What it is

The Shopware PaaS Native CLI, `sw-paas`, manages shops and resources on Shopware PaaS Native. This page covers prerequisites, installation, authentication, and role checks.

## When to use

When setting up a workstation (or CI) to work with Shopware PaaS Native for the first time, logging in, or adding users to your organization.

## Key steps / config

**Prerequisites:** a Shopware account. Identity is managed via AWS Cognito, and access is currently invite-only. After the organization is onboarded to the Shopware Business Platform (SBP) and users are added to PaaS Native, the first user gets the admin role and can assign roles to others.

1. Install (latest, or a specific version):

   ```sh
   curl -L https://install.sw-paas-cli.shopware.systems | sh
   curl -L https://install.sw-paas-cli.shopware.systems | sh -s 0.0.30
   ```

   The script downloads the release from GitHub, installs the binary to `~/.sw-paas/bin/sw-paas` and adds the directory to `PATH` if missing. Set `SW_PAAS_DIR` to change the install directory (default `~/.sw-paas`).

2. Log in (opens a browser; the token is saved automatically):

   ```sh
   sw-paas auth
   ```

3. Check your current role:

   ```sh
   sw-paas account whoami
   ```

4. As **Account Admin**, add a user: the new user gets their user ID with `sw-paas account whoami --output json`, then run:

   ```sh
   sw-paas account user add --sub "<user-id of the new user>"
   ```

5. Run `sw-paas` without arguments to list all commands and supported flags.

Project- and application-level access, membership requests, service accounts, and machine tokens for CI/CD are covered in the [account guide](platform/dev/6.7/products/paas/shopware/fundamentals/account.md).

## Essential identifiers

- `sw-paas`, `sw-paas auth`
- `sw-paas account whoami`, `sw-paas account whoami --output json`
- `sw-paas account user add --sub`
- `SW_PAAS_DIR`, `~/.sw-paas/bin/sw-paas`
- Role: **Account Admin**

## Gotchas

- Only users with the **Account Admin** role can assign roles to others.
- You must be invited to the platform before you can access any resources.
- Bugs and feedback go to the issue tracker at `https://github.com/shopware/sw-paas/issues`.

## Code check (6.7.13.0)
- unverified `sw-paas` — external PaaS CLI binary, no match in vendor/shopware core or storefront, out of scope
- unverified `SW_PAAS_DIR` — installer environment variable, not read by the installed Shopware code
- unverified `sw-paas auth` — external PaaS CLI command, out of scope
- unverified `sw-paas account whoami` — external PaaS CLI command, out of scope
- unverified `sw-paas account user add` — external PaaS CLI command, out of scope
