---
id: platform/dev/6.7/concepts/framework/system-check.md
title: System Check
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/system-check.html
sourceHash: 0e12888a6cb517e6e2f1a2fe48a75ff69cfa25c0
codeCheckedAgainst: "6.7.13.0"
keywords: ["system check", "health check", "readiness check", "SystemCheckExecutionContext", "BaseCheck", "Category", "Status", "SystemChecker", "system:check", "shopware.system_check", "monitoring", "pre_rollout"]
summary: "System checks: types, Category and Status enums, SystemCheckExecutionContext (WEB, CLI, PRE_ROLLOUT, RECURRENT), BaseCheck and system:check."
lastBuilt: 2026-09-15
---
## What it is

System checks verify that a Shopware installation operates normally; each check verifies one aspect (database connection, payment system, SMTP server, background tasks). A failing check indicates something is wrong. The page defines the terminology: check types, categories, statuses and execution contexts.

## When to use

When monitoring an installation, gating a roll-out on readiness, or writing your own check for a component (internal code, external provider or plugin).

## Key steps / config

Check types (logical guideline; the execution context largely determines the type):

- **Readiness checks** — run before the system is ready to serve traffic.
- **Health checks** — run periodically, manually or by monitoring systems.
- **Long running checks** — a subset of health checks that can take long and should always run in the background.

Categories (`Shopware\Core\Framework\SystemCheck\Check\Category`, int-backed enum) cluster *what* is verified:

- `SYSTEM` (0) — backbone, e.g. database connection.
- `FEATURE` (8) — a specific feature, e.g. payment.
- `EXTERNAL` (32) — external services, e.g. SMTP server.
- `AUXILIARY` (128) — auxiliary services, e.g. background tasks.

Statuses (`Shopware\Core\Framework\SystemCheck\Check\Status`): `OK`, `SKIPPED` (criteria not met / not applicable), `UNKNOWN`, `WARNING` (working with non-error issues), `ERROR` (runtime errors, partly functioning), `FAILURE` (irrecoverable).

Execution contexts (`Shopware\Core\Framework\SystemCheck\Check\SystemCheckExecutionContext`, string-backed): `WEB` (`web`), `CLI` (`cli`), `PRE_ROLLOUT` (`pre_rollout`, before a roll-out), `RECURRENT` (`recurrent`, scheduled task). A check may be unnecessary in one context and vital in another — e.g. a runtime-config check matters before roll-out in an immutable environment, not afterwards.

In the installed code, a check extends `Shopware\Core\Framework\SystemCheck\BaseCheck` and is collected via the DI tag `shopware.system_check`:

```php
class MyCheck extends BaseCheck
{
    public function run(): Result { /* ... */ }
    public function category(): Category { /* ... */ }
    public function name(): string { /* ... */ }
    protected function allowedSystemCheckExecutionContexts(): array { /* ... */ }
}
```

`Result` takes `name`, `status`, `message`, optional `healthy` and `extra`. Run checks via `bin/console system:check --context=<context> --format=<table|json>` (default context `cli`, default format `table`).

## Essential identifiers

- `Shopware\Core\Framework\SystemCheck\BaseCheck`
- `Shopware\Core\Framework\SystemCheck\Check\SystemCheckExecutionContext`
- `Shopware\Core\Framework\SystemCheck\Check\Category`
- `Shopware\Core\Framework\SystemCheck\Check\Status`
- `Shopware\Core\Framework\SystemCheck\Check\Result`
- `shopware.system_check` (DI tag), `system:check` (CLI)

## Gotchas

- Checks run grouped by category in ascending value order; if any `SYSTEM` check is not healthy, checks of all later categories are reported `SKIPPED` (code behaviour, not stated in the doc).
- Checks not allowed in the requested context are returned as `SKIPPED`; a check that throws becomes `FAILURE`.
- The `--context` option suggests only the long-running contexts `cli`, `recurrent`, `pre_rollout`; `SystemCheckExecutionContext::readiness()` returns only `PRE_ROLLOUT`.

## Code check (6.7.13.0)
- confirmed `SystemCheckExecutionContext` — enum with WEB, CLI, PRE_ROLLOUT, RECURRENT — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:11
- confirmed `Category` — int enum SYSTEM, FEATURE, EXTERNAL, AUXILIARY — vendor/shopware/core/Framework/SystemCheck/Check/Category.php:11
- confirmed `Status` — enum OK, UNKNOWN, SKIPPED, WARNING, ERROR, FAILURE — vendor/shopware/core/Framework/SystemCheck/Check/Status.php:11
- confirmed `BaseCheck::allowedSystemCheckExecutionContexts()` — abstract; with run(), category(), name() — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:27
- confirmed `shopware.system_check` — tagged iterator injected into SystemChecker — vendor/shopware/core/Framework/DependencyInjection/health.xml:14
- confirmed `SystemChecker::shouldStopRunning()` — unhealthy SYSTEM result skips later categories — vendor/shopware/core/Framework/SystemCheck/SystemChecker.php:115
- confirmed `system:check` — console command — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:20
- confirmed `SystemCheckExecutionContext::longRunning()` — CLI, RECURRENT, PRE_ROLLOUT — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:32
- confirmed `Result::$healthy` — nullable bool constructor property — vendor/shopware/core/Framework/SystemCheck/Check/Result.php:21
