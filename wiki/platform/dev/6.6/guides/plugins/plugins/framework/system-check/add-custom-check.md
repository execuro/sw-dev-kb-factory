---
id: platform/dev/6.6/guides/plugins/plugins/framework/system-check/add-custom-check.md
title: Add custom check
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceHash: 8323c09e15fca99653c53f82fcf696600b2900f4
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/system-check/add-custom-check.html
keywords: ["system check", "SystemCheck", "BaseCheck", "LocalDiskSpaceCheck", "Category", "SystemCheckExecutionContext", "Result", "Status", "shopware.system_check", "custom check", "health check", "disk space check"]
summary: "Shows how to add a custom system check by extending BaseCheck and tagging it shopware.system_check in services.xml."
lastBuilt: "2026-09-15"
---
## What it is

A guide on building a custom system check that verifies a condition (in the example, whether the local system has enough disk space) and reports it through Shopware's system check framework.

## Key steps / config

1. Create a class extending `Shopware\Core\Framework\SystemCheck\BaseCheck` and implement the categorization methods:

```php
class LocalDiskSpaceCheck extends BaseCheck
{
    public function category(): Category { return Category::SYSTEM; }
    public function name(): string { return 'LocalDiskSpaceCheck'; }
    protected function allowedSystemCheckExecutionContexts(): array {
        return SystemCheckExecutionContext::longRunning();
    }
}
```

2. Implement the check logic in a `run(): Result` method, returning a `Result` with a `name`, `status` (`Status::SKIPPED`, `Status::WARNING`, or `Status::OK`), a `message`, and a `healthy` flag.
3. Register the check as a service tagged `shopware.system_check`:

```xml
<service id="%YourNameSpace%\LocalDiskSpaceCheck">
    <argument>%shopware.filesystem.public.type%</argument>
    <argument>%shopware.filesystem.public.config.root%</argument>
    <argument>%warning_threshold_in_mb%</argument>
    <tag name="shopware.system_check"/>
</service>
```

## Essential identifiers

- `Shopware\Core\Framework\SystemCheck\BaseCheck`
- `Category::SYSTEM`
- `SystemCheckExecutionContext::longRunning()`
- `Result`, `Status::SKIPPED`, `Status::WARNING`, `Status::OK`
- Service tag `shopware.system_check`

## Gotchas

The `healthy` flag on a `Result` is subjective: a shop-specific decision about whether the check's outcome still counts as "the system can operate normally" (e.g. a high disk-space warning threshold may still leave `healthy: true`, while a too-low threshold may mean `healthy: false`).
