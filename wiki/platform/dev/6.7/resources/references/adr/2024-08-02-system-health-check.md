---
id: platform/dev/6.7/resources/references/adr/2024-08-02-system-health-check.md
title: System Health Checks in Shopware
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-08-02-system-health-check.html
sourceHash: 6d6188995ae7d7ee97318b27e4282c572ebc4850
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware\\Core\\Framework\\SystemCheck\\BaseCheck", "Shopware\\Core\\Framework\\SystemCheck\\Check\\Category", "Shopware\\Core\\Framework\\SystemCheck\\Check\\Result", "Shopware\\Core\\Framework\\SystemCheck\\Check\\Status", "SystemCheckExecutionContext", "allowedSystemCheckExecutionContexts", "shopware.system_check", "system:check", "health check", "readiness check", "monitoring", "pre rollout"]
summary: "System health checks: extend BaseCheck (run, category, name, allowed contexts), tag shopware.system_check, run via system:check."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2024-08-02, area core) introducing extensible system health checks, so failures in parts of a Shopware system (database, payment, SMTP, background tasks) are detected early — including before a rollout goes live. A system can be healthy overall even if some components are not.

## When to use

- You want to add a custom check (e.g. for an external service your plugin depends on).
- You run readiness checks before rollout or health checks from monitoring and need to know which checks run in which context.

## Key steps / config

1. Extend `Shopware\Core\Framework\SystemCheck\BaseCheck` and implement all its abstract members:

```php
class MyCheck extends BaseCheck
{
    public function run(): Result { /* ... */ }
    public function category(): Category { /* ... */ }
    public function name(): string { /* ... */ }
    protected function allowedSystemCheckExecutionContexts(): array { /* ... */ }
}
```

2. Tag the service `shopware.system_check` (core injects that tagged iterator into `SystemChecker`); run checks with `bin/console system:check`.
3. `Shopware\Core\Framework\SystemCheck\Check\Category` (int enum): `SYSTEM` (backbone, e.g. DB), `FEATURE` (e.g. payment), `EXTERNAL` (e.g. SMTP), `AUXILIARY` (e.g. background tasks).
4. `Shopware\Core\Framework\SystemCheck\Check\Result` carries `name`, `status`, `message`, `healthy`, `extra`; `Shopware\Core\Framework\SystemCheck\Check\Status` cases: `OK`, `UNKNOWN`, `SKIPPED`, `WARNING`, `ERROR`, `FAILURE`.
5. `Shopware\Core\Framework\SystemCheck\Check\SystemCheckExecutionContext` cases: `WEB`, `CLI`, `PRE_ROLLOUT`, `RECURRENT`. Pick the return value of `allowedSystemCheckExecutionContexts()` by check type:
   - Readiness (critical paths, no speed requirement): `SystemCheckExecutionContext::readiness()` → `[PRE_ROLLOUT]`.
   - Health (fast, cheap, non-blocking): `SystemCheckExecutionContext::cases()` → all contexts.
   - Long running (e.g. scanning log files, CLI only per ADR): `SystemCheckExecutionContext::longRunning()` → `[CLI, RECURRENT, PRE_ROLLOUT]`.
   - Other: any custom list, e.g. `[SystemCheckExecutionContext::RECURRENT, SystemCheckExecutionContext::WEB]`.

## Essential identifiers

- `Shopware\Core\Framework\SystemCheck\BaseCheck` (`run()`, `category()`, `name()`, `allowedSystemCheckExecutionContexts()`, `allowedToRunIn()`)
- `Shopware\Core\Framework\SystemCheck\Check\Category`, `...\Check\Result`, `...\Check\Status`, `...\Check\SystemCheckExecutionContext`
- `shopware.system_check`, `system:check`

## Gotchas

- The ADR names the category enum `Shopware\Core\Framework\Health\Check\Category`; the installed class is `Shopware\Core\Framework\SystemCheck\Check\Category`.
- The ADR's "Other" example uses `SystemCheckExecutionContext::CRON`, which does not exist; the scheduled-task context is `RECURRENT`.
- Checks not allowed in the current context are returned as `SKIPPED`; a check that throws becomes `FAILURE`.
- Checks run grouped by category in ascending order; an unhealthy result in `SYSTEM` skips all later categories.
- `longRunning()` includes `RECURRENT` and `PRE_ROLLOUT`, not only CLI as the ADR's prose suggests.

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\Health\Check\Category` — real enum is Shopware\Core\Framework\SystemCheck\Check\Category
- absent `CRON` — no such SystemCheckExecutionContext case; use RECURRENT
- confirmed `BaseCheck::allowedSystemCheckExecutionContexts()` — abstract protected, returns array of contexts — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:27
- confirmed `BaseCheck::run()` — abstract, plus category() and name() — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:13
- confirmed `Category` — int enum SYSTEM, FEATURE, EXTERNAL, AUXILIARY — vendor/shopware/core/Framework/SystemCheck/Check/Category.php:11
- corrected `Status` — docs: order OK, SKIPPED, UNKNOWN; code declares OK, UNKNOWN, SKIPPED — vendor/shopware/core/Framework/SystemCheck/Check/Status.php:11
- confirmed `SystemCheckExecutionContext::readiness()` — returns PRE_ROLLOUT only — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:24
- corrected `SystemCheckExecutionContext::longRunning()` — docs: CLI only; returns CLI, RECURRENT, PRE_ROLLOUT — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:32
- confirmed `shopware.system_check` — tagged iterator injected into SystemChecker — vendor/shopware/core/Framework/DependencyInjection/health.xml:14
- confirmed `system:check` — console command name — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:20
