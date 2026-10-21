---
id: platform/dev/6.7/products/paas/shopware/guides/adding-users.md
title: Adding users to the Organization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/adding-users.html
sourceHash: d6a3543fb64db5a14946f131c5b1e184a671ddd2
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-paas account whoami", "sw-paas account user add", "sw-paas account user list", "sw-paas organization get", "sw-paas account user request", "sw-paas account user requests resolve", "sw-paas account user remove", "account-admin", "sub", "organization-id", "add user", "access request"]
summary: "Add users to a PaaS Native organization: share the sub ID for sw-paas account user add, or request access by organization-id; approve or remove users."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/account.md"]
---
## What it is

How to give a person access to a Shopware PaaS Native organization with the `sw-paas` CLI. Two people are always involved: the **requester** (wants access) and the **account-admin** (an organization member with the `account-admin` role who grants it).

## When to use

Use it when onboarding a colleague to a PaaS Native organization, when someone requests access, or when access must be revoked.

## Key steps / config

### Method 1: add via user ID (recommended)

1. Requester runs `sw-paas account whoami` and copies the printed `sub` (subject ID).
2. Requester sends the `sub` value to the account-admin (chat, email, etc.).
3. Account-admin runs `sw-paas account user add --sub "<user-id of the new user>"`; the CLI grants access at the chosen level.
4. Account-admin confirms with `sw-paas account user list` — the new user should be listed.

### Method 2: request access via organization-id

Use when the requester should ask and the admin approves. The requester does not know the `organization-id`, so the admin shares it first.

1. Account-admin runs `sw-paas organization get`, copies the `organization-id`, sends it to the requester.
2. Requester runs `sw-paas account user request` and enters the `organization-id` when prompted.
3. Account-admin runs `sw-paas account user requests resolve`, picks the pending request and approves it; access is then active.
4. Requester can check the request status any time with `sw-paas account user requests list`.

### Removing a user

Account-admin runs `sw-paas account user remove`.

More on accounts and roles: [account guide](platform/dev/6.7/products/paas/shopware/fundamentals/account.md).

## Essential identifiers

- `account-admin` — role required to grant, approve and remove access
- `sub` — user (subject) ID from `sw-paas account whoami`
- `organization-id` — from `sw-paas organization get`
- `sw-paas account user add --sub`, `sw-paas account user list`, `sw-paas account user remove`
- `sw-paas account user request`, `sw-paas account user requests resolve`, `sw-paas account user requests list`

## Gotchas

- Only a member with the `account-admin` role can add users, approve requests or remove users.
- In Method 2 the requester cannot proceed without the `organization-id` from the admin.

## Code check (6.7.15.1)
- unverified `sw-paas account user add` — PaaS CLI subcommand, not part of vendor/shopware core, storefront or administration
- unverified `account-admin` — PaaS organization role, not a Shopware ACL role in the installed code
- unverified `organization-id` — PaaS platform identifier, out of scope of the installed Shopware code
