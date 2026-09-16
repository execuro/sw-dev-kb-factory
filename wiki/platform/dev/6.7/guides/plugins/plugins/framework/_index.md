---
id: platform/dev/6.7/guides/plugins/plugins/framework/_index.md
title: Framework
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/
sourceHash: 522d703468b09803a1c030fded1a14b3f50d974e
codeCheckedAgainst: "6.7.13.0"
keywords: ["framework", "extension points", "data abstraction layer", "custom fields", "events", "rules", "message queue", "filesystem", "flow builder", "rate limiter", "system check", "caching", "runtime systems"]
summary: "Index of plugin guides for Shopware framework extension points: rules, caching, custom fields, DAL, events, flow, message queue, rate limiter."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/data-handling/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/_index.md"]
---
## What it is

Overview page for the plugin guides that cover core extension points of the Shopware framework: the underlying runtime systems for data abstraction, custom fields, events, rules, message queues, file systems, flows and rate limiters.

## When to use

Start here when a plugin must hook into a runtime system of Shopware core rather than into the Storefront or Administration UI, and you need the guide for that subsystem.

## Key steps / config

Pick the sub-guide for the subsystem you extend:

- [Add Custom Rules](platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md) — custom rule conditions.
- [Caching](platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md) — HTTP cache and object cache handling.
- [Custom Field](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md) — additional data fields on entities.
- [Data Handling](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/_index.md) — data abstraction layer.
- [Event](platform/dev/6.7/guides/plugins/plugins/framework/event/_index.md) — events.
- [Extension](platform/dev/6.7/guides/plugins/plugins/framework/extension/_index.md) — extension points.
- [Filesystem](platform/dev/6.7/guides/plugins/plugins/framework/filesystem/_index.md) — file systems.
- [Flow](platform/dev/6.7/guides/plugins/plugins/framework/flow/_index.md) — flows.
- [Message Queue](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/_index.md) — message queues.
- [Rate Limiter](platform/dev/6.7/guides/plugins/plugins/framework/rate-limiter/_index.md) — rate limiters.
- [System Check](platform/dev/6.7/guides/plugins/plugins/framework/system-check/_index.md) — system checks.

## Essential identifiers

Base types in the installed core that these subsystems are built on:

- `Shopware\Core\Framework\Rule\Rule` (custom rules)
- `Shopware\Core\Framework\Adapter\Cache\CacheInvalidator` (caching)
- `Shopware\Core\System\CustomField\CustomFieldDefinition` (custom fields)
- `Shopware\Core\Framework\DataAbstractionLayer\EntityExtension` (data handling)
- `Shopware\Core\Framework\Extensions\Extension` (extension points)
- `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction` (flow)
- `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface` (message queue)
- `Shopware\Core\Framework\RateLimiter\RateLimiter` (rate limiter)
- `Shopware\Core\Framework\SystemCheck\BaseCheck` (system check)

## Code check (6.7.13.0)
- confirmed `Rule` — abstract base for rule conditions — vendor/shopware/core/Framework/Rule/Rule.php:10
- confirmed `CacheInvalidator` — cache invalidation service class — vendor/shopware/core/Framework/Adapter/Cache/CacheInvalidator.php:25
- confirmed `CustomFieldDefinition` — custom_field entity definition — vendor/shopware/core/System/CustomField/CustomFieldDefinition.php:23
- confirmed `EntityExtension` — abstract base for extending entity definitions — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:9
- confirmed `Extension` — abstract base for extension points — vendor/shopware/core/Framework/Extensions/Extension.php:13
- confirmed `FlowAction` — abstract base for flow actions — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:9
- confirmed `AsyncMessageInterface` — marker for async queue messages — vendor/shopware/core/Framework/MessageQueue/AsyncMessageInterface.php:8
- confirmed `RateLimiter` — rate limiter service class — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:8
- confirmed `BaseCheck` — abstract base for system checks — vendor/shopware/core/Framework/SystemCheck/BaseCheck.php:11
