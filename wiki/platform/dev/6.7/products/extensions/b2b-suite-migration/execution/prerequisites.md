---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-suite-migration/execution/prerequisites.md
sourceHash: 29415ac8b4d5424608ed243dbeca9d8765485003
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/prerequisites.html
title: Prerequisites
version: "6.7"
versions:
  - "6.7"
keywords: ["b2b suite migration", "b2b commercial", "prerequisites", "database backup", "queue worker", "message queue", "b2b suite 4.9.3", "commercial 7.6.0", "budget management", "organization unit"]
summary: "Before migrating B2B Suite to B2B Commercial: back up the DB, run the queue worker, B2B Suite >= 4.9.3, Commercial >= 7.6.0 for budgets."
lastBuilt: 2026-10-21
---
## What it is

The checklist to complete before starting the B2B Suite to B2B Commercial migration: data backup, a running queue worker, minimum extension versions, and per-component requirements.

## When to use

Before running the migration commands for the first time, especially on a shop that already holds B2B Commercial data.

## Key steps / config

1. **Back up the database** if you already use B2B Commercial and have data in it. The migration adds data to B2B Commercial and does not remove data from B2B Suite; the backup lets you restore if something goes wrong.
2. **Queue worker**: ensure the message queue worker is running so it can process the migration tasks.
3. **Extension version**: B2B Suite must be `4.9.3` or above.
4. **Component requirements**:
   - Budget Management requires B2B Commercial `7.6.0` or above.

## Gotchas

- After migration, the Organization Unit of each budget is empty and has to be assigned manually in B2B Commercial.

## Code check (6.7.15.1)
- unverified `4.9.3` — B2B Suite version constraint, the plugin is out of scope of the checked core/storefront/administration code
- unverified `7.6.0` — B2B Commercial version constraint for Budget Management, Commercial plugin out of scope
