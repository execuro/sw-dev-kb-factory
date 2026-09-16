---
docType: developer
id: platform/dev/6.6/guides/plugins/plugins/framework/system-check/_index.md
sourceHash: 5708525f3a09e01119f946dfc183eb62dc7f49c2
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/system-check/
title: System Checks
version: "6.6"
versions:
  - "6.6"
keywords: ["system checks", "system health check", "SystemChecker", "system:check", "shopware.system_check", "SystemCheckExecutionContext", "Result class", "healthy flag", "api/_info/system-health-check"]
summary: "How to trigger, extend, and interpret Shopware's system health checks via CLI, HTTP API, or a custom checker."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/concepts/framework/system-check.md"]
---
## What it is
System health checks monitor the health of a Shopware system and detect failures early; this page documents how to trigger them, add custom checks/triggers, and interpret results.

## When to use
When you need to run or extend Shopware's health checks — e.g. wiring a custom monitoring flow, adding your own check, or interpreting the CLI/API results.

## Key steps / config
- Trigger via HTTP: `GET /api/_info/system-health-check` — the HTTP response code only reflects the request status, not the checks' status; execution context is always `web`.
- Trigger via CLI: `system:check` — returns exit status `0` if all checks are healthy, `1` if any check is unhealthy, `2` if the call is invalid. Defaults to the `cli` execution context; change it with `--context` (`cli`, `pre-rollout`, `recurrent`).
- Default flow is driven by `Shopware\Core\Framework\SystemCheck\SystemChecker`, which runs registered checks in order grouped by type, skips checks not allowed to run, and stops running further checks in the `SYSTEM` type group once one is `healthy = false`.
- All checks are tagged `shopware.system_check`; fetch them via the Symfony tagged iterator to build a custom flow:
```xml
<service id="YourNamepace\CustomSystemChecker">
    <argument type="tagged_iterator" tag="shopware.system_check"/>
</service>
```
- For custom triggers, inject `Shopware\Core\Framework\SystemCheck\SystemChecker` and call `$systemChecker->check(SystemCheckExecutionContext::WEB)` (or run custom logic separately).
- Results are represented by `Shopware\Core\Framework\SystemCheck\Check\Result`. Its `healthy` flag is the only subjective field: `true` if the system can still function normally, `false` if it cannot, `null` if undetermined.

## Essential identifiers
- `/api/_info/system-health-check`
- CLI command `system:check`, option `--context` (`cli`, `pre-rollout`, `recurrent`)
- `Shopware\Core\Framework\SystemCheck\SystemChecker`
- Tag `shopware.system_check`
- `Shopware\Core\Framework\SystemCheck\Check\Result`, `SystemCheckExecutionContext::WEB`

## Gotchas
- The HTTP endpoint's status code communicates only the request's own success, not whether the underlying checks are healthy — inspect the response body/`Result` objects instead.
- A `SYSTEM`-type check marked `healthy = false` stops the default flow from running further checks, so later checks may simply not have run.
