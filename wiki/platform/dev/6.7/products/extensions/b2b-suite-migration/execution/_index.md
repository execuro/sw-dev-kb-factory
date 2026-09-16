---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/execution/_index.md
title: Execution
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/
sourceHash: 9bc21dea40cb9e65799471ad051d103f8f29c022
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite migration", "b2b commercial", "migration execution", "run migration", "backup", "queue worker", "console commands", "migration progress", "troubleshooting"]
summary: Overview of executing the B2B Suite to B2B Commercial migration - backup, active queue worker, console commands to start and monitor, error handling.
lastBuilt: 2026-09-15
---
## What it is

Overview section for executing the B2B Suite to B2B Commercial migration: preparing the environment, running the migration console commands, and troubleshooting.

## Key steps / config

- Back up data before starting.
- Make sure the message queue worker is active.
- Use the console commands to start and monitor the migration, then track progress and handle errors.

## Code check (6.7.13.0)
- unverified `b2b suite migration` — execution tooling ships with the Shopware Commercial extension, not under the installed vendor/shopware packages
