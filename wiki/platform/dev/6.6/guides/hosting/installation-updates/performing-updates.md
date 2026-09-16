---
docType: developer
id: platform/dev/6.6/guides/hosting/installation-updates/performing-updates.md
sourceHash: e57d7b9fbe30e1b102bb5681ed9d5e4031b84ba5
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/installation-updates/performing-updates.html
title: Performing Shopware Updates
version: "6.6"
versions: ["6.6"]
keywords: ["Shopware updates", "Update Manager", "sales-channel:maintenance:enable", "sales-channel:maintenance:disable", "blue-green deployment", "backward compatibility promise", "Rector", "Codemods", "Twig Block Versioning", "UPGRADE.md", "major update", "minor update", "maintenance mode"]
summary: "Recommendations and steps for updating Shopware: preparation, maintenance mode, minor vs major update handling, and final checks."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/resources/guidelines/code/backward-compatibility.md", "platform/dev/6.6/guides/installation/requirements.md"]
---
## What it is

This page covers when and how to perform Shopware updates, including preparation, minor vs. major update handling, and final verification.

## When to use

Use it when planning to update Shopware core and its extensions, deciding update cadence, or preparing for a breaking major update.

## Key steps / config

Preparation: check extension compatibility in the Administration's Update Manager, schedule a maintenance window, back up database and files, and set Sales Channels to maintenance mode:

```
bin/console sales-channel:maintenance:enable --all
```

Manage extensions via Composer for reliable version resolution. Use Twig Block Versioning (a PHPStorm plugin feature) to track overwritten theme blocks needing changes. Tools like Rector (PHP) and Codemods (Administration JavaScript) can help automate upgrades but still require manual verification; keep code under Git so changes can be rolled back.

Update types: minor/patch updates (non-breaking, monthly) vs. major updates (breaking, yearly). For major updates: update Store extensions to compatible versions first, then Shopware, then extensions again; update PHP to the new minimum version beforehand since Shopware supports an overlapping PHP range; consult `UPGRADE.md` in the shopware/shopware repo for breaking changes.

Final steps before disabling maintenance mode: check Administration, Storefront/Sales Channels, extensions, performance, and logs, then:

```
bin/console sales-channel:maintenance:disable --all
```

## Essential identifiers

- `bin/console sales-channel:maintenance:enable --all`
- `bin/console sales-channel:maintenance:disable --all`
- `UPGRADE.md`
- Update Manager (Administration)

## Gotchas

If blue-green deployment is enabled, you can roll back without restoring the database backup — but only when Shopware itself, and not extensions, was updated. Minor/patch updates only need special attention if extensions use internal/experimental APIs.
