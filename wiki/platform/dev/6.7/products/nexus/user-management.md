---
id: platform/dev/6.7/products/nexus/user-management.md
title: User Management
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/nexus/user-management.html
sourceHash: 996a73cf72ee418b2f823874fb6263f9021b4515
codeCheckedAgainst: "6.7.15.1"
keywords: ["nexus", "shopware nexus", "user management", "roles", "permissions", "Admin", "Builder", "Viewer", "invitation", "invite user", "pending", "company access"]
summary: Shopware Nexus user roles (Admin, Builder, Viewer), company-scoped access, inviting, changing and removing users, and pending invitations.
lastBuilt: 2026-10-21
---
## What it is

Access control for Shopware Nexus, the workflow automation product. Access is scoped to a company: every user who belongs to the company is assigned one role, and that role controls what the user can see and do in Nexus.

## When to use

When you need to give a colleague access to Nexus workflows, restrict someone to read-only access, or understand why a role change or removal is refused.

## Key steps / config

Roles:

| Role | Access |
|---|---|
| Admin | Full access: manage users, settings and all workflows |
| Builder | Create and edit workflows; cannot manage users or settings |
| Viewer | Read-only: view workflows and execution results |

Managing users (Admins only), from the **User management** screen. The screen lists everyone in the company with their role and status (`Active`, `Inactive`, `Pending`). From there an Admin can:

1. **Invite** a new user by email and assign an initial role.
2. **Change permission** to move a user between roles.
3. **Remove** a user from the company.

Invitations:

- An invited user shows as **Pending** until they accept.
- Admins can resend or revoke a pending invitation at any time.
- Once accepted, the user becomes **Active** with the role assigned at invitation.

## Essential identifiers

- Roles: `Admin`, `Builder`, `Viewer`
- User statuses: `Active`, `Inactive`, `Pending`
- Screen: **User management**; actions **Invite**, **Change permission**, **Remove**

## Gotchas

- You cannot change your own role.
- The last remaining Admin of a company cannot be demoted. Both rules exist so a company cannot lock itself out.
- Only Admins can manage users or settings; a Builder can edit workflows but cannot invite anyone.

## Code check (6.7.15.1)
- unverified `Admin` — Nexus role model belongs to the hosted Nexus service, not to the installed Shopware core/storefront/administration packages
- unverified `Builder` — Nexus role, not present in the installed Shopware packages
- unverified `Viewer` — Nexus role, not present in the installed Shopware packages
- unverified `Pending` — Nexus invitation status, hosted-service behaviour outside the installed code
