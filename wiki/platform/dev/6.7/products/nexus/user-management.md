---
id: platform/dev/6.7/products/nexus/user-management.md
title: User Management
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/nexus/user-management.html
sourceHash: 996a73cf72ee418b2f823874fb6263f9021b4515
codeCheckedAgainst: "6.7.13.0"
keywords: ["nexus", "shopware nexus", "user management", "roles", "permissions", "admin", "builder", "viewer", "invitation", "invite user", "pending", "company"]
summary: Shopware Nexus company users and roles (Admin, Builder, Viewer), inviting, changing and removing users, and pending invitation handling.
lastBuilt: 2026-09-15
---
## What it is

How access to Shopware Nexus is managed: access is scoped to a company, and every user in the company has one role that controls what they can see and do. This is Nexus (SaaS) user management, not Shopware Administration ACL.

## When to use

- Deciding which Nexus role to give a colleague.
- Inviting, re-assigning or removing Nexus users, or dealing with invitations that stay pending.

## Key steps / config

Roles:

| Role | Access |
|---|---|
| Admin | Full access; manages users, settings and all workflows |
| Builder | Creates and edits workflows; cannot manage users or settings |
| Viewer | Read-only; views workflows and execution results |

Managing users (Admins only), from the **User management** screen, which lists every company user with role and status (Active, Inactive, Pending):

1. **Invite** a new user by email and assign an initial role.
2. **Change permission** to move a user between roles.
3. **Remove** a user from the company.

Invitations:

- Invited users show as **Pending** until they accept.
- Admins can resend or revoke a pending invitation at any time.
- On acceptance the user becomes **Active** with the assigned role.

## Essential identifiers

- Roles: Admin, Builder, Viewer
- User statuses: Active, Inactive, Pending
- Actions: Invite, Change permission, Remove

## Gotchas

- You cannot change your own role.
- The last remaining Admin of a company cannot be demoted, so a company is never locked out.

## Code check (6.7.13.0)
- unverified `Admin` — Nexus role, managed in the external Nexus service, not in installed code
- unverified `Builder` — Nexus role, not in installed code
- unverified `Viewer` — Nexus role, not in installed code
- unverified `Pending` — Nexus invitation status, not in installed code
