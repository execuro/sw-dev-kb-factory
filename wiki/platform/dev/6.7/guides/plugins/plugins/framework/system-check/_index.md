---
id: platform/dev/6.7/guides/plugins/plugins/framework/system-check/_index.md
title: System Checks
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/system-check/
sourceHash: b7e54e229642eb4d089b74aa645e3c1ef0676ac4
codeCheckedAgainst: "6.7.15.1"
keywords: ["system check", "health check", "system:check", "/api/_info/system-health-check", "SystemChecker", "shopware.system_check", "SystemCheckExecutionContext", "Result", "healthy flag", "pre_rollout", "monitoring", "readiness"]
summary: Run Shopware system health checks via system:check or /api/_info/system-health-check, execution contexts, SystemChecker flow and the Result healthy flag.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/system-check.md"]
---
## What it is

Guide to Shopware's system health checks: how to trigger them (CLI or HTTP), how the default `SystemChecker` runs them, how to build a custom flow over the tagged checks, and how to read a check `Result`. Concepts are in [System Checks](platform/dev/6.7/concepts/framework/system-check.md).

## When to use

Monitoring a shop, gating a deployment (pre-rollout), or running recurrent health probes; or building your own runner over all registered checks.

## Key steps / config

**Trigger checks**

- HTTP: `GET /api/_info/system-health-check` (route `api.info.system-health.check`). Requires a static or OAuth authorization header. Optional query parameter `context` (default `web`). The response is `{"checks": [...]}`; the HTTP status reflects only the request, not the checks.
- CLI: `bin/console system:check` with `--context` (`-c`, default `cli`; allowed values `cli`, `recurrent`, `pre_rollout`) and `--format` (`table` or `json`). Exit code `0` = all checks healthy, `1` = any check not healthy (including `healthy` = `null`), `2` = invalid context/format.

**Default flow** — `Shopware\Core\Framework\SystemCheck\SystemChecker::check(SystemCheckExecutionContext $context)`:

- Checks not allowed in the context are returned as `SKIPPED`.
- Allowed checks are grouped by `category()` and run in ascending order (`SYSTEM`=0, `FEATURE`=8, `EXTERNAL`=32, `AUXILIARY`=128).
- If any `SYSTEM` check is not healthy, the remaining categories are skipped. An exception in a check produces a `FAILURE` result.

**Custom flow** — all checks are tagged `shopware.system_check`:

```php
$services->set(YourNamepace\CustomSystemChecker::class)
    ->args([tagged_iterator('shopware.system_check')]);
```

**Custom trigger** — `$systemChecker->check(SystemCheckExecutionContext::WEB);`

**Result** — `Shopware\Core\Framework\SystemCheck\Check\Result(name, status, message, healthy = null, extra = [])`. Set `healthy` to `true` if the system can still function normally, `false` if it cannot, `null` if undetermined; the other properties are objective.

## Essential identifiers

- `system:check`, `--context`, `--format`
- `/api/_info/system-health-check`
- `Shopware\Core\Framework\SystemCheck\SystemChecker`
- `Shopware\Core\Framework\SystemCheck\Check\SystemCheckExecutionContext` (`WEB`, `CLI`, `PRE_ROLLOUT`, `RECURRENT`)
- `Shopware\Core\Framework\SystemCheck\Check\Result`, `Status`, `Category`
- tag `shopware.system_check`

## Gotchas

- The docs list the context option value as `pre-rollout`; the code value is `pre_rollout`.
- The docs say the HTTP endpoint always uses `web`; the code accepts a `context` query parameter and only defaults to `web`.
- The CLI accepts only the long-running contexts; `web` is rejected.
- `SystemChecker` is marked `@internal`.

## Code check (6.7.15.1)
- confirmed `system:check` — console command name — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:21
- corrected `context` — docs: options `cli`, `pre-rollout`, `recurrent`; code allows longRunning() values, default cli — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:39
- corrected `PRE_ROLLOUT` — docs: `pre-rollout`; enum value is `pre_rollout` — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:17
- confirmed `Command::FAILURE` — returned when any check healthy !== true — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:75
- corrected `/api/_info/system-health-check` — docs: context always web; code reads `context` query, default web — vendor/shopware/core/Framework/Api/Controller/HealthCheckController.php:54
- confirmed `SystemChecker::check()` — runs by category, skips disallowed checks — vendor/shopware/core/Framework/SystemCheck/SystemChecker.php:29
- confirmed `SystemChecker::shouldStopRunning()` — non-healthy SYSTEM check stops further categories — vendor/shopware/core/Framework/SystemCheck/SystemChecker.php:115
- confirmed `shopware.system_check` — tagged_iterator injected into SystemChecker — vendor/shopware/core/Framework/DependencyInjection/health.php:23
- confirmed `Result::$healthy` — nullable bool, default null — vendor/shopware/core/Framework/SystemCheck/Check/Result.php:21
