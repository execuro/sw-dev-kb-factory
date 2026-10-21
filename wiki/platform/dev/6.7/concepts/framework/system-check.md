---
id: platform/dev/6.7/concepts/framework/system-check.md
title: System Check
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/system-check.html
sourceHash: 0e12888a6cb517e6e2f1a2fe48a75ff69cfa25c0
codeCheckedAgainst: "6.7.15.1"
keywords: ["system check", "health check", "readiness check", "long running check", "BaseCheck", "Category", "Status", "SystemCheckExecutionContext", "PRE_ROLLOUT", "system:check", "monitoring", "SystemChecker"]
summary: "System checks: readiness/health/long-running types, Category (SYSTEM, FEATURE, EXTERNAL, AUXILIARY), Status values and SystemCheckExecutionContext."
lastBuilt: 2026-10-20
---
## What it is

System checks verify that a Shopware installation operates normally; each check covers one aspect (database connection, payment system, SMTP server, background tasks). A failing check indicates a problem with the system. The page defines the terminology: check types, categories, statuses and execution contexts.

## When to use

When writing or interpreting a system check, wiring Shopware into monitoring, or deciding in which context (web, CLI, pre-rollout, scheduled) a check should run.

## Key steps / config

**Types** (determined by the execution context):
- Readiness checks — run before the system serves traffic.
- Health checks — run periodically, manually or by monitoring systems.
- Long running checks — subset of health checks that take long and should always run in the background.

In code, `SystemCheckExecutionContext::readiness()` returns `[PRE_ROLLOUT]` and `SystemCheckExecutionContext::longRunning()` returns `[CLI, RECURRENT, PRE_ROLLOUT]`.

**Category** (`Shopware\Core\Framework\SystemCheck\Check\Category`) — what the check verifies:
- `SYSTEM` — backbone, e.g. database connection
- `FEATURE` — a feature, e.g. payment
- `EXTERNAL` — external services, e.g. SMTP
- `AUXILIARY` — auxiliary services, e.g. background tasks

**Status** (`Shopware\Core\Framework\SystemCheck\Check\Status`): `OK`, `SKIPPED` (criteria not met / not applicable), `UNKNOWN`, `WARNING` (works with non-error issues), `ERROR` (runtime errors, partly functional), `FAILURE` (irrecoverable).

**Execution context** (`Shopware\Core\Framework\SystemCheck\Check\SystemCheckExecutionContext`): `WEB`, `CLI`, `PRE_ROLLOUT`, `RECURRENT` (scheduled task).

A check extends `Shopware\Core\Framework\SystemCheck\BaseCheck` and declares:

```php
abstract public function run(): Result;
abstract public function category(): Category;
abstract public function name(): string;
abstract protected function allowedSystemCheckExecutionContexts(): array;
```

`allowedToRunIn($context)` filters by that list; checks are run by `SystemChecker::check($context)`, exposed on the CLI as `system:check`.

## Essential identifiers

- `BaseCheck`, `Result`, `SystemChecker`
- `Category`: `SYSTEM`, `FEATURE`, `EXTERNAL`, `AUXILIARY`
- `Status`: `OK`, `SKIPPED`, `UNKNOWN`, `WARNING`, `ERROR`, `FAILURE`
- `SystemCheckExecutionContext`: `WEB`, `CLI`, `PRE_ROLLOUT`, `RECURRENT`
- `system:check`

## Gotchas

- A check may be pointless in one context and essential in another: in an immutable environment a runtime-configuration check matters before roll-out but not after deployment. Restrict it via its allowed execution contexts.

## Code check (6.7.15.1)
- confirmed `BaseCheck::run()` — abstract, returns Result — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:13
- confirmed `BaseCheck::category()` — abstract, returns Category — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:15
- confirmed `BaseCheck::allowedSystemCheckExecutionContexts()` — abstract protected — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:27
- confirmed `Category` — int enum SYSTEM/FEATURE/EXTERNAL/AUXILIARY — vendor/shopware/core/Framework/SystemCheck/Check/Category.php:11
- confirmed `Status` — enum OK/UNKNOWN/SKIPPED/WARNING/ERROR/FAILURE — vendor/shopware/core/Framework/SystemCheck/Check/Status.php:11
- confirmed `SystemCheckExecutionContext` — string enum WEB/CLI/PRE_ROLLOUT/RECURRENT — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:11
- confirmed `SystemCheckExecutionContext::readiness()` — returns PRE_ROLLOUT only — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:24
- confirmed `SystemCheckExecutionContext::longRunning()` — CLI, RECURRENT, PRE_ROLLOUT — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:32
- confirmed `SystemChecker::check()` — runs checks for a context — vendor/shopware/core/Framework/SystemCheck/SystemChecker.php:29
- confirmed `system:check` — console command name — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:21
