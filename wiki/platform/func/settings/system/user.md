---
id: platform/func/settings/system/user.md
title: User
docType: functional
version: "6.5"
versions:
  - "6.5"
  - "6.6"
  - "6.7"
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/system/user
sourceHash: 2028f7d8da837fea219ec381f35080239ecde48219cb254d1a3e20782a3b247e
revision:
  current: true
  range: "6.4.3.1 - 6.4.4.1"
  swMin: "6.4.3.1"
  swMax: "6.4.4.1"
keywords: ["users and permissions", "roles", "administrator", "authorisations", "view edit create delete", "detailed permissions", "New Access Key", "searchable elements", "Settings > System > Users & Permissions", "create discounts", "run updates", "maintain extensions"]
summary: "Manages admin users, roles and permissions (View/Edit/Create/Delete plus additional and detailed rights) under Settings > System > Users & Permissions."
lastBuilt: "2026-09-15"
---

## What it is

Users & Permissions, under **Settings > System > Users & Permissions**, administers all Shopware Administration users: creating users, assigning roles, and configuring permissions.

## When to use

Use it to create/edit/remove admin users, define reusable roles with granular per-area permissions, issue API keys per user, or diagnose missing permissions via detailed privileges.

## Key steps / config

- **User**: overview of created users; **Create new user** opens the creation mask (First/Last name, E-mail address, Username, Password, User interface language, Job title, Profile picture, Administrator flag, Time zone, Roles). Administrators get all permissions and cannot be assigned roles; a user cannot self-assign/revoke Admin status.
  - **Integrations** sub-area: **New Access Key** creates an access ID + security key for API access (key shown only once); manage via the context menu.
- **Roles**: overview with **Create new role** (Name + description). **Authorisations** grants per-area rights **View**, **Edit**, **Create**, **Delete**, **All** — rights build left to right (Edit implies View; Create implies Edit+View); Delete only implies View.
- **Additional permissions** (single edit right each, no view/edit/create/delete split): Basic configurations, Run Updates, Maintain extensions, Upload extensions, Logging, Clear cache, Import/Export, Shopware Store, Update own profile, Create discounts, Apps.
- **Detailed permissions**: technical-name-level read/write/create/delete rights, for cases where an extension adds records without matching privileges in the general tab.
- **Searchable elements**: per-user configuration of which areas (e.g. Promotion) are suggested by the admin search.

## Essential identifiers

- Menu path: **Settings > System > Users & Permissions**
- Rights: View, Edit, Create, Delete, All
- Additional permissions: Basic configurations, Run Updates, Maintain extensions, Upload extensions, Logging, Clear cache, Import/Export, Shopware Store, Update own profile, Create discounts, Apps

## Gotchas

Basic configurations covers Settings > Shop areas (Addresses, Login/Registration, Products, SEO, Sitemap, Master Data, Shopping Cart) and Settings > System areas Mailer and Shopware Account. Create discounts permits creating voucher items when editing an existing order.
