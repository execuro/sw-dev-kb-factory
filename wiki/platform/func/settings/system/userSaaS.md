---
id: platform/func/settings/system/userSaaS.md
title: "UserSaaS"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/system/userSaaS"
sourceHash: "3815d158c14fbaada0611820bee564ce12b9562bddf257bb225d411a9194d890"
revision:
  current: true
  range: "current"
  swMin: null
  swMax: null
keywords: ["Users & Permissions", "admin users", "roles", "permissions", "View", "Edit", "Create", "Delete", "Administrator", "Detailed permissions", "Basic configurations", "Invite user", "role-based access", "Settings > System"]
summary: "Manages Shopware admin users, invites, and role-based permissions (View/Edit/Create/Delete) under Settings > System > Users & Permissions."
lastBuilt: "2026-09-15"
---
## What it is

The Users & Permissions area (Settings > System > Users & Permissions) manages administration users, letting you invite users, edit their profile settings, and define roles with granular permissions per admin area.

## When to use

Use this page to add or remove administration users, grant/revoke administrator status, assign roles with specific permissions, or diagnose a permission error a user hits in the admin.

## Key steps / config

- Users: overview of all created users (name, e-mail, status); use "Invite user" to send an invite, entering an e-mail address and the user interface language; use the row's context menu to edit or remove a user.
- Edit user: general information (first name, surname, e-mail) is fixed and can only be changed via the Shopware account; Administrator status grants all rights and cannot be self-assigned or self-removed; Time zone applies to all time entries in the admin; Roles can be assigned when Administrator status is not set.
- Roles: overview of created roles; "Create new role" opens a mask for Name and Description, followed by the Authorisations area.
- Authorisations: every admin area (and sub-area) can be granted **View**, **Edit**, **Create**, **Delete**, or **All**. Permissions build left to right — Edit implies View; Create implies Edit and View; Delete only implies View.
- Additional permissions (not tied to one area): Basic configurations, Run Updates, Maintain extensions, Upload extensions, Logging, Clear cache, Import/Export, Shopware Store, Update own profile, Create discounts, Apps.
- Detailed permissions: exposes technical, per-function permissions (**read**, **write**, **create**, **delete**) for exceptional cases, e.g. extensions that add records without assigning admin-area privileges for them.

## Essential identifiers

- Settings > System > Users & Permissions
- Permission levels: View, Edit, Create, Delete, All
- Detailed permission actions: read, write, create, delete
- Additional permissions: Basic configurations, Run Updates, Maintain extensions, Upload extensions, Logging, Clear cache, Import/Export, Shopware Store, Update own profile, Create discounts, Apps

## Gotchas

- A user cannot grant or remove their own Administrator status.
- If a role's permissions were set incorrectly (common with extensions), the resulting admin error message usually names the missing permission — use Detailed permissions to grant it precisely.
- Admin search results are scoped by user: an admin area (e.g. Promotion) is only searchable if the user's role allows suggestions from that area.
