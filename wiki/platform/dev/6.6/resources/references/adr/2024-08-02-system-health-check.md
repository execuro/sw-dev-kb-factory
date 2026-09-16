---
id: platform/dev/6.6/resources/references/adr/2024-08-02-system-health-check.md
title: System Health Checks in Shopware
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-08-02-system-health-check.html
sourceHash: 6d6188995ae7d7ee97318b27e4282c572ebc4850
keywords: ["BaseCheck", "Category", "Result", "Status", "SystemCheckExecutionContext", "health check", "readiness check", "allowedSystemCheckExecutionContexts", "SYSTEM", "FEATURE", "EXTERNAL", "AUXILIARY", "long running check"]
summary: "Defines Shopware's health-check abstractions (BaseCheck, Category, Status, SystemCheckExecutionContext) for readiness, health, long-running checks."
lastBuilt: 2026-09-15
---
## What it is

This ADR introduces a system health-check framework in Shopware to monitor system components and detect failures early, via an extensible set of custom checks.

## When to use

When implementing or reasoning about a check that verifies part of the running system — database connectivity, cache availability, storefront indices, external services, background tasks — for readiness gating, monitoring, or pre-rollout validation.

## Key steps / config

Core abstractions:

- `Shopware\Core\Framework\SystemCheck\BaseCheck` — base class for all checks; declares `protected function allowedSystemCheckExecutionContexts(): array`.
- `Shopware\Core\Framework\Health\Check\Category` — categories: `SYSTEM`, `FEATURE`, `EXTERNAL`, `AUXILIARY`.
- `Shopware\Core\Framework\SystemCheck\Check\Result` — outcome state of a check.
- `Shopware\Core\Framework\SystemCheck\Check\Status` — statuses, in severity order: `OK`, `SKIPPED`, `UNKNOWN`, `WARNING`, `ERROR`, `FAILURE`.
- `Shopware\Core\Framework\SystemCheck\Check\SystemCheckExecutionContext` — contexts: `WEB`, `CLI`, `PRE_ROLLOUT`, `RECURRENT`.

A check declares its allowed contexts by overriding `allowedSystemCheckExecutionContexts()`:

- Readiness checks — return `SystemCheckExecutionContext::readiness()`; check critical paths (config, storefront indices opening); no speed requirement.
- Health checks — return `SystemCheckExecutionContext::cases()`; must be fast, inexpensive, non-blocking.
- Long running checks — return `SystemCheckExecutionContext::longRunning()`; CLI-only, run sparingly (e.g. scanning log files for issues).
- Other/custom — return an arbitrary array, e.g. `[SystemCheckExecutionContext::CRON, SystemCheckExecutionContext::WEB]`.

## Essential identifiers

- `Shopware\Core\Framework\SystemCheck\BaseCheck`
- `Shopware\Core\Framework\Health\Check\Category`
- `Shopware\Core\Framework\SystemCheck\Check\Result`
- `Shopware\Core\Framework\SystemCheck\Check\Status`
- `Shopware\Core\Framework\SystemCheck\Check\SystemCheckExecutionContext`

## Gotchas

Health checks must stay fast and non-blocking; long running checks are only allowed to run on CLI and should be used sparingly given their cost.
