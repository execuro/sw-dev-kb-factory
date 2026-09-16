---
id: platform/func/migration-en/Migrationprocess.md
title: Migrationprocess
docType: functional
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://docs.shopware.com/en/migration-en/Migrationprocess"
sourceHash: "1231de5737abc47f041b4bed1b17d2598a72e90c622da1aca94f39f74e4d7a05"
revision:
  current: true
  range: "6.6.0.0 - 6.6.10.14"
  swMin: "6.6.0.0"
  swMax: "6.6.10.14"
keywords: ["Migration Assistant", "migration connection", "Settings > Extensions > Migration", "API connection", "local connection", "DB-Host", "DB-Port", "DB-User", "DB-Password", "Installation Root", "custom fields", "migration overview", "metadata truncation"]
summary: "How to prepare a Shopware 5 to Shopware 6 migration: install the Migration Assistant extension and create/edit the connection."
lastBuilt: "2026-09-15"
---
## What it is

Describes preparing a data migration from Shopware 5 to Shopware 6: installing the Migration Assistant extension and creating the connection to the source shop.

## When to use

After Shopware 6 has been installed and before migrating data from an existing Shopware 5 shop.

## Key steps / config

1. Install the **Migration Assistant** extension in both the Shopware 6 target shop and the Shopware 5 source shop (this description refers to extension version **16.0.0**).
2. In the Shopware 6 administration, go to **Settings > Extensions > Migration** to create the connection to the Shopware 5 shop. The connection remains available for migrating data at any time until removed.
3. Do not use hyphens in the connection name — the Shopware 5 free-text fields are transferred as custom fields named after the connection, and a hyphen breaks their display in the storefront.
4. Depending on the chosen interface, fill in one of:
   - **API**: `API-Key` (from the Shopware 5 user, who must be in the `local_admins` group), `Username`, `Shopdomain` (including whether SSL is used).
   - **Local**: `DB-Host` (or `localhost`), `DB-Port` (default `3306`), `DB-User`, `DB-Password`, `DB-Name`, `Installation Root` (absolute path to the Shopware 5 install directory).
5. Some metadata is truncated during migration because the database type changes from `mediumtext` to `varchar(255)` (values cut after 255 characters); affected columns named in the source include `metadescription` and `metakeywords`.
6. After entering the connection details, the migration overview lets you review the connection, choose which data to migrate, and track previous migrations.

## Essential identifiers

- Menu path `Settings > Extensions > Migration`
- Extension version referenced: **16.0.0**
- Connection fields: `API-Key`, `Username`, `Shopdomain`, `DB-Host`, `DB-Port`, `DB-User`, `DB-Password`, `DB-Name`, `Installation Root`
- Truncated columns: `metadescription`, `metakeywords`

## Gotchas

- Hyphens in the connection name break custom-field display in the storefront.
- The API user must belong to the `local_admins` group in Shopware 5, or the connection cannot be created.
