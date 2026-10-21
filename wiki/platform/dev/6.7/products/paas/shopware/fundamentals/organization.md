---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/paas/shopware/fundamentals/organization.md
relatedPages:
  - platform/dev/6.7/products/paas/shopware/fundamentals/account.md
sourceHash: dafb2d7e09b6e33720e3772977f3bc704c909262
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/organization.html
title: Organizations
version: "6.7"
versions:
  - "6.7"
keywords: ["sw-paas organization create", "sw-paas account whoami", "sw-paas account user add", "sw-paas account user remove", "read-only", "developer", "project-admin", "account-admin", "organization", "members", "roles", "sub id", "paas native"]
summary: "PaaS Native organizations: top-level unit for projects and users, member roles (read-only, developer, project-admin, account-admin) and sw-paas user commands."
lastBuilt: 2026-10-21
---
## What it is

An organization is the top-level logical unit in Shopware PaaS Native representing a company or entity. It contains all resources, projects and users of that business entity. The initial admin user is added to an organization by default and can add further users. Organizations are long-lived and do not expire automatically.

## When to use

When creating an additional organization, assigning roles to members, or adding and removing users from an organization.

## Key steps / config

1. Create another organization: `sw-paas organization create`.
2. Have the new user look up their user ID (sub-id): `sw-paas account whoami --output json`, or with `jq`: `sw-paas account whoami --output json | jq ".sub"`.
3. As an `account-admin`, add the user with the appropriate role using their `sub`: `sw-paas account user add`.
4. Remove a user from the organization: `sw-paas account user remove`.

Roles, assigned by organization administrators:

| Role | Scope | Allowed actions |
|---|---|---|
| `read-only` | projects and applications | only `get` and `list` |
| `developer` | projects and applications | all |
| `project-admin` | projects and applications | all |
| `account-admin` | account management | managing users |

Project- and application-level memberships, membership requests, service accounts and tokens are covered in the [account guide](platform/dev/6.7/products/paas/shopware/fundamentals/account.md).

## Essential identifiers

- `sw-paas organization create`
- `sw-paas account whoami --output json`, `sub`
- `sw-paas account user add`, `sw-paas account user remove`
- Roles: `read-only`, `developer`, `project-admin`, `account-admin`

## Code check (6.7.15.1)
- unverified `sw-paas organization create` — PaaS CLI, not part of the Shopware code roots
- unverified `sw-paas account user add` — PaaS CLI, out of scope
- unverified `account-admin` — PaaS platform role, not a Shopware ACL role in core
- unverified `read-only` — PaaS platform role, out of scope
