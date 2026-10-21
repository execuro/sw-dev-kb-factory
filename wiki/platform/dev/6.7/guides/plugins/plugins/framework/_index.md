---
id: platform/dev/6.7/guides/plugins/plugins/framework/_index.md
title: Framework
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/
sourceHash: 522d703468b09803a1c030fded1a14b3f50d974e
codeCheckedAgainst: "6.7.15.1"
keywords: ["framework", "extension points", "data abstraction layer", "custom fields", "events", "rules", "message queue", "filesystem", "flow", "rate limiter", "caching", "system check"]
summary: "Index of plugin guides for Shopware framework extension points: DAL, custom fields, events, rules, caching, message queue, filesystem, flow, rate limiter."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md", "platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/_index.md"]
---
## What it is

Section index for plugin guides on the core extension points of the Shopware framework — the underlying runtime systems: data abstraction, custom fields, events, rules, message queues, file systems, flows and rate limiters.

## When to use

Entry point when a plugin needs to hook into one of these runtime systems; pick the subsection:

- [Add Custom Rules](platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md)
- [Caching](platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md)
- [Custom Field](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md)
- [Data Handling](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/_index.md)
- [Event](platform/dev/6.7/guides/plugins/plugins/framework/event/_index.md)
- [Extension](platform/dev/6.7/guides/plugins/plugins/framework/extension/_index.md)
- [Filesystem](platform/dev/6.7/guides/plugins/plugins/framework/filesystem/_index.md)
- [Flow](platform/dev/6.7/guides/plugins/plugins/framework/flow/_index.md)
- [Message Queue](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/_index.md)
- [Rate Limiter](platform/dev/6.7/guides/plugins/plugins/framework/rate-limiter/_index.md)
- [System Check](platform/dev/6.7/guides/plugins/plugins/framework/system-check/_index.md)

## Code check (6.7.15.1)
- confirmed `Rule` — abstract base for rule conditions — vendor/shopware/core/Framework/Rule/Rule.php:10
- confirmed `EntityDefinition` — abstract DAL definition base — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:33
- confirmed `EntityExtension` — abstract base for extending entities — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:9
- confirmed `Extension` — abstract extension-point event base — vendor/shopware/core/Framework/Extensions/Extension.php:13
- confirmed `ScheduledTask` — message-queue scheduled task base — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTask.php:10
- confirmed `FlowAction` — abstract flow action base — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:9
- confirmed `RateLimiter` — core rate limiter service — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:8
- confirmed `SystemChecker` — system check runner — vendor/shopware/core/Framework/SystemCheck/SystemChecker.php:15
