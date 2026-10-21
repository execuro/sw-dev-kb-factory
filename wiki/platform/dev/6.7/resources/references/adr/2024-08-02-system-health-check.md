---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2024-08-02-system-health-check.md
sourceHash: 6d6188995ae7d7ee97318b27e4282c572ebc4850
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-08-02-system-health-check.html
title: System Health Checks in Shopware
version: "6.7"
versions:
  - "6.7"
keywords: ["BaseCheck", "SystemCheckExecutionContext", "allowedSystemCheckExecutionContexts", "Result", "Status", "SystemChecker", "system:check", "shopware.system_check", "health check", "readiness check", "monitoring", "pre-rollout check", "long running check"]
summary: "ADR on Shopware system health checks: BaseCheck, categories, Status values, execution contexts and readiness/long-running presets."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2024-08-02, area core) introducing an extensible system health check framework. Its motivation: rollouts went live with broken functionality that was not detected beforehand. A system can be healthy overall while some components are degraded, so checks are categorised, report a graded status, and declare in which execution contexts they may run.

## When to use

You want to add a custom health/readiness check (database, payment, SMTP, background tasks, log files, ...) that infrastructure or monitoring can run, or you need to know which context a check runs in before a rollout, from CLI, or recurrently.

## Key steps / config

1. Extend `Shopware\Core\Framework\SystemCheck\BaseCheck`. The installed class declares four abstract methods, all of which a check must implement:

```php
class MyCheck extends BaseCheck
{
    public function run(): Result { /* ... */ }
    public function category(): /* enum from Shopware\Core\Framework\SystemCheck\Check */ { /* ... */ }
    public function name(): string { /* ... */ }
    protected function allowedSystemCheckExecutionContexts(): array { /* ... */ }
}
```

2. Pick the check's category from the category enum in `Shopware\Core\Framework\SystemCheck\Check`: `SYSTEM` (backbone, e.g. database connection), `FEATURE` (a specific feature, e.g. payment), `EXTERNAL` (external services, e.g. SMTP server online), `AUXILIARY` (auxiliary services, e.g. background tasks running).
3. Return a `Shopware\Core\Framework\SystemCheck\Check\Result` (constructor: `name`, `status`, `message`, optional `healthy`, `extra`) with a `Shopware\Core\Framework\SystemCheck\Check\Status`: `OK`, `UNKNOWN`, `SKIPPED`, `WARNING`, `ERROR`, `FAILURE`.
4. Choose the allowed contexts from `Shopware\Core\Framework\SystemCheck\Check\SystemCheckExecutionContext` (`WEB`, `CLI`, `PRE_ROLLOUT`, `RECURRENT`):
   - Readiness checks (critical paths, config, storefront indices; need not be fast): `SystemCheckExecutionContext::readiness()` — returns `[PRE_ROLLOUT]`.
   - Health checks (fast, inexpensive, non-blocking; e.g. database connectivity, cache): `SystemCheckExecutionContext::cases()` — all contexts.
   - Long-running checks (e.g. scanning log files): `SystemCheckExecutionContext::longRunning()` — returns `[CLI, RECURRENT, PRE_ROLLOUT]`.
   - Other: return any explicit list, e.g. `[SystemCheckExecutionContext::RECURRENT, SystemCheckExecutionContext::WEB]`.
5. Register the check as a service tagged `shopware.system_check`; `Shopware\Core\Framework\SystemCheck\SystemChecker` receives all tagged checks.
6. Run checks with `bin/console system:check` — options `--context`/`-c` (default `cli`; allowed values `cli`, `recurrent`, `pre_rollout`) and `--format` (`table` or `json`). The command exits with failure if any result's `healthy` is not `true`.

## Essential identifiers

- `Shopware\Core\Framework\SystemCheck\BaseCheck`, `BaseCheck::allowedToRunIn()`
- `Shopware\Core\Framework\SystemCheck\Check\Result`
- `Shopware\Core\Framework\SystemCheck\Check\Status`
- `Shopware\Core\Framework\SystemCheck\Check\SystemCheckExecutionContext` — `readiness()`, `longRunning()`, `cases()`
- `Shopware\Core\Framework\SystemCheck\SystemChecker`
- service tag `shopware.system_check`; CLI `system:check`

## Gotchas

- The ADR places the category enum at `Shopware\Core\Framework\Health\Check\Category`; that namespace does not exist — the enum lives in `Shopware\Core\Framework\SystemCheck\Check`.
- The ADR's "Other" example uses `SystemCheckExecutionContext::CRON`, which is not a case of the enum; the scheduled-task context is `RECURRENT`.
- The ADR says long-running checks may only run on CLI, but `longRunning()` also includes `RECURRENT` and `PRE_ROLLOUT`.
- The ADR lists statuses "in order of severity" with `SKIPPED` before `UNKNOWN`; the enum declares `UNKNOWN` before `SKIPPED`.

## Code check (6.7.15.1)
- absent `Shopware\Core\Framework\Health\Check\Category` — wrong namespace in the ADR; real enum is in SystemCheck\Check
- absent `CRON` — not a case of SystemCheckExecutionContext; use RECURRENT
- confirmed `BaseCheck` — abstract base with run(), category(), name(), allowedSystemCheckExecutionContexts() — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:11
- confirmed `BaseCheck::allowedSystemCheckExecutionContexts()` — abstract protected, returns array of contexts — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:27
- confirmed `SYSTEM` — first case of the category enum (also FEATURE, EXTERNAL, AUXILIARY) — vendor/shopware/core/Framework/SystemCheck/Check/Category.php:13
- confirmed `SystemCheckExecutionContext::readiness()` — returns PRE_ROLLOUT only — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:24
- corrected `SystemCheckExecutionContext::longRunning()` — docs: CLI only; code returns CLI, RECURRENT, PRE_ROLLOUT — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:32
- corrected `UNKNOWN` — docs: listed after SKIPPED; declared before SKIPPED in Status — vendor/shopware/core/Framework/SystemCheck/Check/Status.php:14
- confirmed `shopware.system_check` — tag collected by SystemChecker — vendor/shopware/core/Framework/DependencyInjection/health.php:23
- confirmed `system:check` — console command with --context and --format options — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:21
