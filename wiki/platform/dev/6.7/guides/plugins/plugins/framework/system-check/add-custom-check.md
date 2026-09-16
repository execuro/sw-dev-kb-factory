---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/framework/system-check/add-custom-check.md
sourceHash: f08f987ab3e4d1d3125a36bac804fb9f1d6e61e6
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/system-check/add-custom-check.html
title: Add Custom Check
version: "6.7"
versions:
  - "6.7"
keywords: ["custom system check", "health check", "BaseCheck", "LocalDiskSpaceCheck", "shopware.system_check", "Category", "SystemCheckExecutionContext", "longRunning", "Result", "Status", "allowedSystemCheckExecutionContexts", "disk space check"]
summary: Custom system check - extend BaseCheck with run(), category(), name(), allowedSystemCheckExecutionContexts(), return a Result, tag shopware.system_check.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/system-check/_index.md"]
---
## What it is

How to add a custom system health check, using a dummy `LocalDiskSpaceCheck` that warns when disk space on a local filesystem falls below a threshold.

## When to use

You want your own condition to be reported by `system:check` and the system health check endpoint (see [System Checks](platform/dev/6.7/guides/plugins/plugins/framework/system-check/_index.md)).

## Key steps / config

1. Extend `Shopware\Core\Framework\SystemCheck\BaseCheck`. The base class has four abstract members, all of which must be declared:

   ```php
   class LocalDiskSpaceCheck extends BaseCheck
   {
       public function __construct(private readonly string $adapterType, private readonly string $installationPath, private readonly int $warningThresholdInMb) {}

       public function category(): Category { return Category::SYSTEM; } // crucial for the system to function

       public function name(): string { return 'LocalDiskSpaceCheck'; }

       protected function allowedSystemCheckExecutionContexts(): array { return SystemCheckExecutionContext::longRunning(); } // IO, potentially slow

       public function run(): Result { /* see step 2 */ }
   }
   ```

2. Implement `run()` returning `Shopware\Core\Framework\SystemCheck\Check\Result` (constructor `name`, `status`, `message`, `healthy` = `null` by default, `extra` = `[]`):
   - adapter type not `local` → `new Result(name: $this->name(), status: Status::SKIPPED, message: '...', healthy: true)`
   - space below threshold → `Status::WARNING`, `healthy: true`
   - otherwise → `Status::OK`, `healthy: true`

3. Register the service with the tag `shopware.system_check`:

   ```php
   $services->set(YourNameSpace\LocalDiskSpaceCheck::class)
       ->args([
           '%shopware.filesystem.public.type%',
           '%shopware.filesystem.public.config.root%',
           '%warning_threshold_in_mb%',
       ])
       ->tag('shopware.system_check');
   ```

4. Trigger via the normal system check flow; the check joins the tagged collection.

Available enums: `Category` — `SYSTEM`, `FEATURE`, `EXTERNAL`, `AUXILIARY`; `Status` — `OK`, `UNKNOWN`, `SKIPPED`, `WARNING`, `ERROR`, `FAILURE`; `SystemCheckExecutionContext` — `WEB`, `CLI`, `PRE_ROLLOUT`, `RECURRENT`, with helpers `longRunning()` (CLI, RECURRENT, PRE_ROLLOUT) and `readiness()` (PRE_ROLLOUT).

## Essential identifiers

- `Shopware\Core\Framework\SystemCheck\BaseCheck` (`run()`, `category()`, `name()`, `allowedSystemCheckExecutionContexts()`)
- `Shopware\Core\Framework\SystemCheck\Check\Result`, `Status`, `Category`, `SystemCheckExecutionContext`
- `shopware.system_check`
- `%shopware.filesystem.public.type%`, `%shopware.filesystem.public.config.root%`

## Gotchas

- `healthy` is subjective: a low threshold that still allows normal operation can stay `true`; set `false` only if the shop cannot function. Leaving it `null` counts as failure for the `system:check` exit code, and an unhealthy `Category::SYSTEM` check stops all later categories.
- `allowedSystemCheckExecutionContexts()` is `protected`; `BaseCheck::allowedToRunIn()` uses it, and checks not allowed in a context are reported as `SKIPPED`.
- An exception thrown from `run()` is converted to a `Status::FAILURE` result.
- `%warning_threshold_in_mb%` is not a Shopware parameter — the plugin must define it.
- The source snippet's disk helper computes `disk_total_space - disk_free_space`, i.e. used space, and one `return` misses a semicolon; fix both when copying.

## Code check (6.7.13.0)
- confirmed `BaseCheck::run()` — abstract, returns Result — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:13
- confirmed `BaseCheck::category()` — abstract — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:15
- confirmed `BaseCheck::name()` — abstract — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:17
- confirmed `BaseCheck::allowedSystemCheckExecutionContexts()` — abstract protected — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:27
- confirmed `Result::__construct()` — name, status, message, healthy (default null), extra — vendor/shopware/core/Framework/SystemCheck/Check/Result.php:17
- confirmed `SystemCheckExecutionContext::longRunning()` — CLI, RECURRENT, PRE_ROLLOUT — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:32
- confirmed `Category::SYSTEM` — value 0 — vendor/shopware/core/Framework/SystemCheck/Check/Category.php:13
- confirmed `shopware.system_check` — tag collected by SystemChecker — vendor/shopware/core/Framework/DependencyInjection/health.xml:14
- confirmed `shopware.filesystem.public.type` — container parameter referenced by core — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/FilesystemConfigMigrationCompilerPass.php:34
- confirmed `filesystem.public.config.root` — nested config key, default `%kernel.project_dir%/public`, flattened into parameters — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:186
