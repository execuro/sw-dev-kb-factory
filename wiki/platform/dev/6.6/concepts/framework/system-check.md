---
id: platform/dev/6.6/concepts/framework/system-check.md
title: System Check
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/framework/system-check.html
sourceHash: 0e12888a6cb517e6e2f1a2fe48a75ff69cfa25c0
keywords: ["system check", "system checks", "Readiness Checks", "Health Checks", "Long running Checks", "SystemCheckExecutionContext", "SYSTEM", "FEATURE", "EXTERNAL", "AUXILIARY", "health check status", "readiness probe"]
summary: "System checks verify components (database, payment, SMTP) and report a category, status and execution context to detect issues."
lastBuilt: "2026-09-15"
---
## What it is

System checks are a way to ensure that a Shopware installation is operating normally: each check verifies a specific aspect of functionality (e.g. the database connection, the payment system, the SMTP server), and a failing check indicates something is wrong with the system.

## When to use

Use system checks to monitor whether individual components of a Shopware installation (internal code, external providers, or plugins) are working correctly, either before the system serves traffic or on a recurring/scheduled basis.

## Key steps / config

System checks are organized around three concepts:

- **Types**: `Readiness Checks` run before the system is ready to serve traffic; `Health Checks` run periodically (manually or via monitoring); `Long running Checks` are a subset of `Health Checks` that can take a long time and should always run in the background.
- **Category** (clusters what is verified): `SYSTEM` (backbone functionality, e.g. database connection), `FEATURE` (a specific feature, e.g. payment system), `EXTERNAL` (external services, e.g. SMTP), `AUXILIARY` (auxiliary services, e.g. background tasks).
- **Status** (outcome of a check): `OK`, `SKIPPED`, `UNKNOWN`, `WARNING`, `ERROR`, `FAILURE`.
- **Execution context** (`SystemCheckExecutionContext`), which determines when a check type applies: `WEB`, `CLI`, `PRE_ROLLOUT`, `RECURRENT`.

## Essential identifiers

- `SystemCheckExecutionContext`
- Types: `Readiness Checks`, `Health Checks`, `Long running Checks`
- Categories: `SYSTEM`, `FEATURE`, `EXTERNAL`, `AUXILIARY`
- Statuses: `OK`, `SKIPPED`, `UNKNOWN`, `WARNING`, `ERROR`, `FAILURE`
- Contexts: `WEB`, `CLI`, `PRE_ROLLOUT`, `RECURRENT`
