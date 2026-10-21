---
id: platform/dev/6.7/guides/plugins/plugins/framework/system-check/add-custom-check.md
title: Add Custom Check
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/system-check/add-custom-check.html
sourceHash: f08f987ab3e4d1d3125a36bac804fb9f1d6e61e6
codeCheckedAgainst: "6.7.15.1"
keywords: ["custom system check", "health check", "BaseCheck", "LocalDiskSpaceCheck", "shopware.system_check", "Category::SYSTEM", "SystemCheckExecutionContext::longRunning", "Result", "Status", "allowedSystemCheckExecutionContexts", "disk space check", "healthy flag"]
summary: Add a custom system health check by extending BaseCheck (run, category, name, allowed contexts) and tagging the service shopware.system_check.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/system-check/_index.md"]
---
## What it is

Walkthrough for a custom system check, using a dummy `LocalDiskSpaceCheck` that warns when free disk space drops below a threshold. The check plugs into the system check collection run by `system:check` and the health endpoint (see [System Checks](platform/dev/6.7/guides/plugins/plugins/framework/system-check/_index.md)).

## When to use

You want Shopware's health check run to cover a plugin-specific or infrastructure condition (disk space, external service, feature prerequisite).

## Key steps / config

1. Extend `Shopware\Core\Framework\SystemCheck\BaseCheck`. It obliges four members: `run(): Result`, `category(): Category`, `name(): string` (all public) and `protected allowedSystemCheckExecutionContexts(): array`.

```php
class LocalDiskSpaceCheck extends BaseCheck
{
    public function __construct(private readonly string $adapterType, private readonly string $installationPath, private readonly int $warningThresholdInMb) {}
    public function category(): Category { return Category::SYSTEM; }
    public function name(): string { return 'LocalDiskSpaceCheck'; }
    protected function allowedSystemCheckExecutionContexts(): array { return SystemCheckExecutionContext::longRunning(); }
    public function run(): Result
    {
        if ($this->adapterType !== 'local') {
            return new Result(name: $this->name(), status: Status::SKIPPED, message: '...', healthy: true);
        }
        /* return Status::WARNING below the threshold, otherwise Status::OK */
    }
}
```

2. Categories (`Shopware\Core\Framework\SystemCheck\Check\Category`): `SYSTEM`, `FEATURE`, `EXTERNAL`, `AUXILIARY`. Contexts (`SystemCheckExecutionContext`): `WEB`, `CLI`, `PRE_ROLLOUT`, `RECURRENT`; helper `longRunning()` returns CLI, RECURRENT and PRE_ROLLOUT (use it for IO-heavy checks), `readiness()` returns PRE_ROLLOUT.
3. `Result` arguments: `name`, `status` (`Status::OK|UNKNOWN|SKIPPED|WARNING|ERROR|FAILURE`), `message`, optional `healthy` (`?bool`), optional `extra` array.
4. Register the service and tag it:

```php
$services->set(YourNameSpace\LocalDiskSpaceCheck::class)
    ->args([
        '%shopware.filesystem.public.type%',
        '%shopware.filesystem.public.config.root%',
        '%warning_threshold_in_mb%',
    ])
    ->tag('shopware.system_check');
```

## Essential identifiers

- `Shopware\Core\Framework\SystemCheck\BaseCheck`
- `Shopware\Core\Framework\SystemCheck\Check\Result`, `Status`, `Category`, `SystemCheckExecutionContext`
- `BaseCheck::allowedToRunIn()` — concrete method checking the context against `allowedSystemCheckExecutionContexts()`
- tag `shopware.system_check`

## Gotchas

- `healthy` is subjective: a warning-level result can still be `healthy: true` if the shop functions normally. A `SYSTEM`-category check returning a non-true `healthy` stops all later categories and makes `system:check` exit non-zero.
- An exception thrown in `run()` is converted to a `FAILURE` result by the checker.
- The source snippet's `getFreeDiskSpaceInMegaBytes()` subtracts free from total space, i.e. computes used space; fix this in a real check.
- `%warning_threshold_in_mb%` is not a Shopware parameter; define it yourself.

## Code check (6.7.15.1)
- confirmed `BaseCheck::run()` — abstract, returns Result — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:13
- confirmed `BaseCheck::category()` — abstract, returns Category — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:15
- confirmed `BaseCheck::name()` — abstract, returns string — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:17
- confirmed `BaseCheck::allowedSystemCheckExecutionContexts()` — abstract protected, returns array — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:27
- confirmed `SystemCheckExecutionContext::longRunning()` — CLI, RECURRENT, PRE_ROLLOUT — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:32
- confirmed `Category::SYSTEM` — value 0, run first — vendor/shopware/core/Framework/SystemCheck/Check/Category.php:13
- confirmed `Status::SKIPPED` — enum case alongside OK/WARNING — vendor/shopware/core/Framework/SystemCheck/Check/Status.php:15
- confirmed `Result::__construct()` — name, status, message, healthy, extra — vendor/shopware/core/Framework/SystemCheck/Check/Result.php:17
- confirmed `shopware.system_check` — tag used for core checks — vendor/shopware/core/System/DependencyInjection/locale.php:39
- unverified `shopware.filesystem.public.config.root` — flattened container parameter, not found as a literal
