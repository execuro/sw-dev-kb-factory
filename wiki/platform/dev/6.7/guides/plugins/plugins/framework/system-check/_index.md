---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/framework/system-check/_index.md
sourceHash: b7e54e229642eb4d089b74aa645e3c1ef0676ac4
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/system-check/
title: System Checks
version: "6.7"
versions:
  - "6.7"
keywords: ["system check", "health check", "system:check", "/api/_info/system-health-check", "SystemChecker", "SystemCheckExecutionContext", "shopware.system_check", "Result", "healthy flag", "Category", "shopware.api.static_token.health_check", "monitoring"]
summary: System health checks - system:check CLI and /api/_info/system-health-check, execution contexts, SystemChecker run order, shopware.system_check tag, Result.
lastBuilt: 2026-09-15
---
## What it is

Shopware's system health checks monitor the installation and detect failures early. This page covers how checks are triggered, how the default runner orders and stops them, how to build a custom runner, and how to read a check `Result`.

## When to use

You want to run health checks in deployment pipelines (pre-rollout), recurring monitoring, or from your own code, or need to interpret check output.

## Key steps / config

**Triggering**

- CLI: `bin/console system:check` — options `--context` (default `cli`; allowed `cli`, `recurrent`, `pre_rollout`) and `--format` (`table` or `json`). Exit code `0` when every check has `healthy === true`, `1` when any check is not `true` (so `null` also fails), `2` for an invalid context/format.
- HTTP: `GET /api/_info/system-health-check` returns `{"checks": [...]}`. Context comes from the `context` query parameter, default `web`. The HTTP status reflects only the request, not the checks. Requires either an Admin API OAuth token or an `Authorization: Static ...` header matching `shopware.api.static_token.health_check` (default empty = static auth disabled).

**Default flow** — `Shopware\Core\Framework\SystemCheck\SystemChecker::check(SystemCheckExecutionContext $context)`:

1. Checks not allowed in the context are returned as `SKIPPED`.
2. Allowed checks are grouped by `Category` and run in ascending order: `SYSTEM` (0), `FEATURE` (8), `EXTERNAL` (32), `AUXILIARY` (128).
3. A check that throws yields a `FAILURE` result.
4. If any `SYSTEM` result is not healthy, all later categories are skipped.

**Custom flow** — all checks carry the tag `shopware.system_check`:

```php
$services->set(YourNamespace\CustomSystemChecker::class)
    ->args([tagged_iterator('shopware.system_check')]);
```

Your class receives `iterable $checks` (each a `BaseCheck`) and runs them in its own logic.

**Result** — `Shopware\Core\Framework\SystemCheck\Check\Result` with readonly `name`, `status` (`Status`: `OK`, `UNKNOWN`, `SKIPPED`, `WARNING`, `ERROR`, `FAILURE`), `message`, `healthy` (`?bool`, default `null`), `extra` (array). Set `healthy` to `true` if the system still functions normally, `false` if not, `null` if undeterminable; the other fields are objective.

## Essential identifiers

- `system:check`, `/api/_info/system-health-check`
- `Shopware\Core\Framework\SystemCheck\SystemChecker`
- `Shopware\Core\Framework\SystemCheck\Check\SystemCheckExecutionContext` (`WEB`, `CLI`, `PRE_ROLLOUT`, `RECURRENT`)
- `Shopware\Core\Framework\SystemCheck\Check\Result`, `Status`, `Category`
- `shopware.system_check`

## Gotchas

- The docs write the context as `pre-rollout`; the enum value is `pre_rollout`.
- The docs say the HTTP context is always `web`; the controller accepts a `context` query parameter and only defaults to `web`. The CLI does not accept `web`.
- `SystemChecker` is marked `@internal`; injecting it (`$systemChecker->check(SystemCheckExecutionContext::WEB)`) works but is not covered by the backward-compatibility promise — the tagged iterator is the safer extension point.

## Code check (6.7.13.0)
- confirmed `system:check` — console command — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:20
- corrected `PRE_ROLLOUT` — docs: `pre-rollout`; enum value is `pre_rollout` — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:17
- confirmed `SystemCheckExecutionContext::longRunning()` — CLI allowed contexts: cli, recurrent, pre_rollout — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:87
- corrected `/api/_info/system-health-check` — docs: context always web; reads `context` query, default web — vendor/shopware/core/Framework/Api/Controller/HealthCheckController.php:56
- confirmed `shopware.api.static_token.health_check` — static token argument of the controller — vendor/shopware/core/Framework/DependencyInjection/api.xml:63
- confirmed `shopware.system_check` — tagged iterator injected into SystemChecker — vendor/shopware/core/Framework/DependencyInjection/health.xml:14
- confirmed `SystemChecker::check()` — groups by permission then category — vendor/shopware/core/Framework/SystemCheck/SystemChecker.php:29
- confirmed `Category::SYSTEM` — unhealthy SYSTEM result stops later categories — vendor/shopware/core/Framework/SystemCheck/SystemChecker.php:117
- confirmed `Result::$healthy` — `?bool`, default null — vendor/shopware/core/Framework/SystemCheck/Check/Result.php:21
- confirmed `Command::FAILURE` — returned when any check healthy is not true — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:75
