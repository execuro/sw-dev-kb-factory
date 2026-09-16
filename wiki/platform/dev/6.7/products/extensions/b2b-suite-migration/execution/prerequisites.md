---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/execution/prerequisites.md
title: Prerequisites
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/prerequisites.html
sourceHash: 29415ac8b4d5424608ed243dbeca9d8765485003
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite migration", "b2b commercial", "prerequisites", "database backup", "message queue worker", "b2b suite 4.9.3", "budget management", "b2b commercial 7.6.0", "organization unit"]
summary: B2B Suite to Commercial migration prerequisites - DB backup, running queue worker, B2B Suite 4.9.3+, Budget Management needs B2B Commercial 7.6.0+.
lastBuilt: 2026-09-15
---
## What it is

The checklist to complete before starting the B2B Suite to B2B Commercial migration.

## When to use

Before running the migration commands, to confirm the environment and extension versions are suitable.

## Key steps / config

1. Back up the database if B2B Commercial already contains data. The migration adds data to B2B Commercial and does not remove data from B2B Suite; the backup allows restoring on problems.
2. Ensure the message queue worker is running — it processes the migration tasks.
3. Ensure B2B Suite is version `4.9.3` or above.
4. Component requirement — Budget Management: requires B2B Commercial `7.6.0` or above.

## Gotchas

- After migration, the Organization Unit of migrated budgets is empty and must be assigned manually in B2B Commercial.

## Code check (6.7.13.0)
- unverified `4.9.3` — B2B Suite version constraint, extension not under the installed vendor/shopware packages
- unverified `7.6.0` — B2B Commercial version constraint for Budget Management, out of scope
