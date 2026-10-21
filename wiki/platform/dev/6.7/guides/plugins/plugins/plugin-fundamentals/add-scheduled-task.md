---
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md
title: Add Scheduled Task
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.html
sourceHash: a0e29ebe2decce755740cfa9f29b7a6aa5506049
codeCheckedAgainst: "6.7.15.1"
keywords: ["ScheduledTask", "ScheduledTaskHandler", "DynamicallyScheduledTaskHandler", "getNextExecutionTime", "shopware.scheduled.task", "messenger.message_handler", "AsMessageHandler", "scheduled-task:register", "scheduled-task:run", "messenger:consume", "scheduled_task", "cronjob", "cron"]
summary: Create a ScheduledTask plus ScheduledTaskHandler in a plugin, tag them, optionally reschedule dynamically, and run them via scheduled-task:run.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md"]
---
## What it is

Shopware's cronjob mechanism: a `ScheduledTask` message class defines the task name and interval, and a `ScheduledTaskHandler` (a Messenger handler) executes the work when the task is dispatched.

## When to use

Code must run periodically, e.g. cleaning up old entries, from a plugin.

## Key steps / config

1. Register both classes in `<plugin root>/src/Resources/config/services.php` (see [Dependency Injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md)):

```php
$services->set(ExampleTask::class)
    ->tag('shopware.scheduled.task');

$services->set(ExampleTaskHandler::class)
    ->args([service('scheduled_task.repository'), service('logger')])
    ->tag('messenger.message_handler');
```

The handler constructor takes the `scheduled_task` repository and a logger. The task is saved to the database when the plugin is activated.

2. Task class extends `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTask` and implements both abstract static methods:

```php
class ExampleTask extends ScheduledTask
{
    public static function getTaskName(): string { return 'swag.example_task'; }
    public static function getDefaultInterval(): int { return 300; } // seconds
}
```

Prefix the task name with your vendor (`swag.`) to avoid collisions.

3. Handler extends `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskHandler`, is marked `#[AsMessageHandler(handles: ExampleTask::class)]`, and implements `run(): void`.

4. Optional dynamic rescheduling (6.7.13.0+): also implement `Shopware\Core\Framework\MessageQueue\ScheduledTask\DynamicallyScheduledTaskHandler`:

```php
class ExampleTaskHandler extends ScheduledTaskHandler implements DynamicallyScheduledTaskHandler
{
    public function run(): void { /* ... */ }
    public function getNextExecutionTime(ScheduledTask $task, ScheduledTaskEntity $taskEntity): ?\DateTimeInterface
    { /* ... */ }
}
```

Called after `run()`; `null` falls back to the default `nextExecutionTime + runInterval` (capped to now); a past time runs the task again as soon as possible.

5. Execute: `bin/console scheduled-task:register` (register without reinstalling), `bin/console scheduled-task:run` (starts `ScheduledTaskRunner`, dispatches due tasks), `bin/console messenger:consume` (executes dispatched messages). The admin worker replaces the manual consume.

## Essential identifiers

- `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTask` — `getTaskName()`, `getDefaultInterval()`
- `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskHandler` — `run()`
- `Shopware\Core\Framework\MessageQueue\ScheduledTask\DynamicallyScheduledTaskHandler` — `getNextExecutionTime()`
- Tags `shopware.scheduled.task`, `messenger.message_handler`; service `scheduled_task.repository`
- `scheduled-task:register`, `scheduled-task:run`, `messenger:consume`; table `scheduled_task`

## Gotchas

- A task only runs while its `status` in `scheduled_task` is `scheduled`.
- In 6.7.15.1 the `ScheduledTaskExecutor` is injected only into services tagged `messenger.message_handler`; a handler invoked without it falls back to deprecated inline execution, which throws once the `v6.8.0.0` flag is active.
- Do not override `rescheduleTask()` for custom timing — it is deprecated for 6.8; implement `DynamicallyScheduledTaskHandler` instead.
- Any `ScheduledTask` subclass is autoconfigured with `shopware.scheduled.task`; the explicit tag is still harmless.

## Version notes

- `DynamicallyScheduledTaskHandler` is available since 6.7.13.0.

## Code check (6.7.15.1)
- confirmed `ScheduledTask::getTaskName()` — abstract static, must be implemented — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTask.php:37
- confirmed `ScheduledTask::getDefaultInterval()` — abstract static, interval in seconds — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTask.php:42
- confirmed `ScheduledTaskHandler::run()` — abstract, must be implemented — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:55
- confirmed `DynamicallyScheduledTaskHandler::getNextExecutionTime()` — returns nullable DateTimeInterface — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/DynamicallyScheduledTaskHandler.php:20
- confirmed `shopware.scheduled.task` — autoconfigured for ScheduledTask subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:91
- confirmed `messenger.message_handler` — executor injected into handlers with this tag — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/ScheduledTaskExecutorCompilerPass.php:29
- confirmed `scheduled-task:register` — command name — vendor/shopware/core/Framework/MessageQueue/Command/RegisterScheduledTasksCommand.php:14
- confirmed `scheduled-task:run` — command name of ScheduledTaskRunner — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:20
- confirmed `ScheduledTaskDefinition::STATUS_SCHEDULED` — value `scheduled` — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskDefinition.php:24
- deprecated `ScheduledTaskHandler::rescheduleTask()` — removed in v6.8.0, use DynamicallyScheduledTaskHandler — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:114
