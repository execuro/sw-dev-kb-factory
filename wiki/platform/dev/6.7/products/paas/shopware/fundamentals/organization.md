---
id: platform/dev/6.7/products/paas/shopware/fundamentals/organization.md
title: Organizations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/organization.html
sourceHash: dafb2d7e09b6e33720e3772977f3bc704c909262
codeCheckedAgainst: "6.7.13.0"
keywords: ["organization", "paas native", "sw-paas organization create", "organization members", "roles", "read-only", "developer", "project-admin", "account-admin", "sw-paas account whoami", "sw-paas account user add", "sw-paas account user remove", "sub id", "user management"]
summary: "PaaS Native organizations: sw-paas organization create, roles read-only/developer/project-admin/account-admin, and sw-paas account user add/remove by sub ID."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/account.md"]
---
## What it is

An organization is the top-level logical unit in Shopware PaaS Native representing a company or entity. It encompasses all resources, projects and users of that entity. The initial admin user is added to an organization by default and can add more users. Organizations are long-lived and do not expire automatically.

## When to use

When creating additional organizations, assigning roles to organization members, or adding/removing users via the `sw-paas` CLI.

## Key steps / config

Create an additional organization:

```sh
sw-paas organization create
```

Roles for organization members (assigned by organization administrators):

| Role | Access |
|---|---|
| `read-only` | Projects and applications; only `get` and `list` actions |
| `developer` | Projects and applications; all actions |
| `project-admin` | Projects and applications; all actions |
| `account-admin` | Account management; user-management actions |

Add a user (requires `account-admin`):

1. The user retrieves their user ID (sub-id):

   ```sh
   sw-paas account whoami --output json
   sw-paas account whoami --output json | jq ".sub"
   ```

2. They share the `sub` value; add them with the appropriate role:

   ```sh
   sw-paas account user add
   ```

Remove a user:

```sh
sw-paas account user remove
```

Project-level and application-level memberships, membership requests, service accounts and tokens are covered in platform/dev/6.7/products/paas/shopware/fundamentals/account.md.

## Essential identifiers

- `sw-paas organization create`
- `sw-paas account whoami --output json`
- `sw-paas account user add`, `sw-paas account user remove`
- Roles `read-only`, `developer`, `project-admin`, `account-admin`

## Gotchas

- Only a user holding `account-admin` can add users to the organization; the new user's `sub` (subject ID) is required.
- `developer` and `project-admin` are both documented as allowing all actions on projects and applications.

## Code check (6.7.13.0)
- unverified `sw-paas organization create` — sw-paas CLI, out of scope of vendor/shopware
- unverified `sw-paas account whoami` — sw-paas CLI, out of scope of vendor/shopware
- unverified `sw-paas account user add` — sw-paas CLI, out of scope of vendor/shopware
- unverified `sw-paas account user remove` — sw-paas CLI, out of scope of vendor/shopware
- unverified `account-admin` — PaaS Native role, not defined in vendor/shopware
