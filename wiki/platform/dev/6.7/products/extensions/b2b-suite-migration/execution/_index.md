---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-suite-migration/execution/_index.md
sourceHash: 9bc21dea40cb9e65799471ad051d103f8f29c022
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/
title: Execution
version: "6.7"
versions:
  - "6.7"
keywords: ["b2b suite migration", "b2b commercial", "migration execution", "run migration", "backup", "queue worker", "message queue", "console commands", "monitor progress", "troubleshooting"]
summary: Overview of executing the B2B Suite to B2B Commercial migration - environment preparation, backup, queue worker, console commands, progress and errors.
lastBuilt: 2026-10-21
---
## What it is

Overview section for executing the B2B Suite to B2B Commercial migration. Execution covers preparing the environment, running the migration console commands, and troubleshooting problems along the way.

## Key steps / config

- Back up your data before starting.
- Make sure the message queue worker is active, since the migration runs through it.
- Use the console commands to start the migration and to monitor it, so you can track progress and handle errors as they occur.

The detailed instructions live in the child pages of this section (prerequisites and running the migration).

## Code check (6.7.15.1)
- unverified `b2b:migrate:commercial` — migration commands belong to the Shopware Commercial plugin, out of scope of the checked core/storefront/administration code
