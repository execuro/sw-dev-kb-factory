---
id: platform/dev/6.7/products/paas/shopware/guides/adding-users.md
title: Adding users to the Organization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/adding-users.html
sourceHash: d6a3543fb64db5a14946f131c5b1e184a671ddd2
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-paas account whoami", "sw-paas account user add", "sw-paas account user list", "sw-paas organization get", "sw-paas account user request", "sw-paas account user requests resolve", "sw-paas account user remove", "account-admin", "sub", "organization-id", "add user", "access request"]
summary: "Grant PaaS Native organization access: add a user by sub ID or approve an organization-id access request with sw-paas account commands; remove users."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/account.md"]
---
## What it is

The two ways to give a person access to a Shopware PaaS Native organization with the `sw-paas` CLI, plus how to revoke it. Always two people are involved: the requester, and an account-admin (member with the `account-admin` role) who grants access.

## When to use

When onboarding a new team member to a PaaS Native organization, or removing one. Roles and accounts are covered in the [account guide](platform/dev/6.7/products/paas/shopware/fundamentals/account.md).

## Key steps / config

### Method 1: add by user ID (recommended)

1. Requester runs `sw-paas account whoami` and copies the `sub` (subject ID) value.
2. Requester sends the `sub` to the account-admin.
3. Account-admin adds the user:
   ```sh
   sw-paas account user add --sub "<user-id of the new user>"
   ```
   The CLI grants access at the chosen level.
4. Account-admin checks with `sw-paas account user list`.

### Method 2: request access via organization-id

1. Account-admin runs `sw-paas organization get` and sends the `organization-id` to the requester.
2. Requester runs `sw-paas account user request` and enters the `organization-id` when asked.
3. Account-admin runs `sw-paas account user requests resolve`, picks the pending request and approves it; access is then active.
4. Requester can check status any time with `sw-paas account user requests list`.

### Remove a user

Account-admin runs `sw-paas account user remove`.

## Essential identifiers

- `account-admin` role
- `sub` (user/subject ID), `organization-id`
- `sw-paas account whoami`
- `sw-paas account user add --sub`
- `sw-paas account user list`
- `sw-paas organization get`
- `sw-paas account user request`
- `sw-paas account user requests resolve` / `sw-paas account user requests list`
- `sw-paas account user remove`

## Gotchas

- In Method 2 the requester does not know the `organization-id`; the account-admin must share it first.

## Code check (6.7.13.0)
- unverified `sw-paas account user add` — external PaaS CLI command, not part of vendor/shopware
- unverified `account-admin` — PaaS organization role, not a Shopware core ACL role; out of scope
