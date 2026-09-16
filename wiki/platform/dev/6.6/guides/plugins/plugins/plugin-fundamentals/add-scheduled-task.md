---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md
title: Add scheduled task
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceHash: 393f3e433ef4c314171b52f27d7e0fdb03bf14b2
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.html
keywords: ["ScheduledTask", "ScheduledTaskHandler", "shopware.scheduled.task", "messenger.message_handler", "getTaskName", "getDefaultInterval", "AsMessageHandler", "scheduled-task:register", "scheduled-task:run", "messenger:consume", "cronjob"]
summary: "Register a recurring background task via a ScheduledTask/ScheduledTaskHandler pair tagged in services.xml."
lastBuilt: "2026-09-15"
---
## What it is

A guide on adding a `ScheduledTask` (Shopware's cronjob-like mechanism) and its handler from a plugin.

## When to use

Use this to run code on a regular interval, e.g. cleaning up old entries automatically.

## Key steps / config

1. Register the task and handler in `services.xml` at `<plugin root>/src/Resources/config/services.xml`:

```xml
<services>
    <service id="Swag\BasicExample\Service\ScheduledTask\ExampleTask">
        <tag name="shopware.scheduled.task" />
    </service>
    <service id="Swag\BasicExample\Service\ScheduledTask\ExampleTaskHandler">
        <argument type="service" id="scheduled_task.repository" />
        <tag name="messenger.message_handler" />
    </service>
</services>
```

2. Task class extends `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTask` and must implement `getTaskName(): string` and `getDefaultInterval(): int`:

```php
class ExampleTask extends ScheduledTask
{
    public static function getTaskName(): string { return 'swag.example_task'; }
    public static function getDefaultInterval(): int { return 300; }
}
```

3. Handler class extends `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskHandler`, uses `#[AsMessageHandler(handles: ExampleTask::class)]`, and implements `run(): void`.
4. Run manually with `bin/console scheduled-task:register`, then `bin/console scheduled-task:run`, and `bin/console messenger:consume` to execute dispatched messages.

## Essential identifiers

- `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTask`
- `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskHandler`
- Tags: `shopware.scheduled.task`, `messenger.message_handler`
- `#[AsMessageHandler(handles: ...)]`
- `getTaskName()`, `getDefaultInterval()`, `run()`
- `bin/console scheduled-task:register`, `bin/console scheduled-task:run`, `bin/console messenger:consume`

## Gotchas

Add a vendor prefix to the task name to prevent collisions with other plugins' scheduled tasks; the scheduled task's `status` must be `scheduled` in the `scheduled_task` table for it to run, unless the admin worker is used.
