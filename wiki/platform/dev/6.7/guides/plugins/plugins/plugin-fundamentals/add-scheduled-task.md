---
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md
title: Add Scheduled Task
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.html
sourceHash: a0e29ebe2decce755740cfa9f29b7a6aa5506049
codeCheckedAgainst: "6.7.13.0"
keywords: ["ScheduledTask", "ScheduledTaskHandler", "DynamicallyScheduledTaskHandler", "shopware.scheduled.task", "messenger.message_handler", "getNextExecutionTime", "scheduled-task:register", "scheduled-task:run", "messenger:consume", "cronjob", "cron", "recurring task", "background job"]
summary: "Plugin scheduled task: ScheduledTask and handler classes, service tags, DynamicallyScheduledTaskHandler, register/run/consume commands."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md"]
---
## What it is

Shopware's cronjob equivalent: a `ScheduledTask` class defines the task name and interval, and a `ScheduledTaskHandler` (a Messenger handler) executes `run()` when the task is dispatched to the message bus.

## When to use

For recurring background work in a plugin, e.g. periodically cleaning up old entries. For manual CLI work, use a [custom command](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md).

## Key steps / config

1. Register both services in `<plugin root>/src/Resources/config/services.php`:

```php
$services->set(ExampleTask::class)
    ->tag('shopware.scheduled.task');

$services->set(ExampleTaskHandler::class)
    ->args([service('scheduled_task.repository'), service('logger')])
    ->tag('messenger.message_handler');
```

The handler arguments map to the base constructor `(EntityRepository $scheduledTaskRepository, LoggerInterface $exceptionLogger)`. The task is saved to the database once the plugin is activated.

2. Task class — extend `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTask` and implement both abstract static methods:

```php
class ExampleTask extends ScheduledTask
{
    public static function getTaskName(): string { return 'swag.example_task'; }
    public static function getDefaultInterval(): int { return 300; } // seconds
}
```

3. Handler — extend `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskHandler`, implement `run()`, mark with `#[AsMessageHandler(handles: ExampleTask::class)]`. Optionally implement `Shopware\Core\Framework\MessageQueue\ScheduledTask\DynamicallyScheduledTaskHandler` to compute the next run:

```php
#[AsMessageHandler(handles: ExampleTask::class)]
class ExampleTaskHandler extends ScheduledTaskHandler implements DynamicallyScheduledTaskHandler
{
    public function run(): void { /* ... */ }

    public function getNextExecutionTime(ScheduledTask $task, ScheduledTaskEntity $taskEntity): ?\DateTimeInterface
    { return $this->resolveNextPendingTimestamp(); } // null = default schedule
}
```

4. Default rescheduling after a run: `nextExecutionTime + runInterval`, capped to now if in the past; status set to `scheduled`. With `DynamicallyScheduledTaskHandler`, `getNextExecutionTime()` is called after `run()`; `null` falls back to the default, a past time is capped to now so the task runs again as soon as possible.
5. Run locally:
   - `bin/console scheduled-task:register` — register tasks without reinstalling the plugin
   - `bin/console scheduled-task:run` — starts the `ScheduledTaskRunner`, dispatches due tasks
   - `bin/console messenger:consume` — executes the dispatched messages

## Essential identifiers

- `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTask` — `getTaskName()`, `getDefaultInterval()`
- `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskHandler` — `run()`
- `Shopware\Core\Framework\MessageQueue\ScheduledTask\DynamicallyScheduledTaskHandler` — `getNextExecutionTime()`
- `shopware.scheduled.task`, `messenger.message_handler` — service tags
- `scheduled_task.repository`, table `scheduled_task`
- `scheduled-task:register`, `scheduled-task:run`, `messenger:consume`

## Gotchas

- Prefix the task name with your vendor (`swag.`) to avoid collisions.
- A task only runs when its `status` in `scheduled_task` is `scheduled` (not needed with the admin worker).
- Tag the handler `messenger.message_handler`: the core compiler pass only injects the `ScheduledTaskExecutor` into handlers carrying that tag; otherwise the handler falls back to a deprecated inline execution path that throws once `v6.8.0.0` is active.
- Handler service and task service are separate: registering the task makes it persistable and schedulable; only the handler actually executes `run()`.

## Version notes

- `DynamicallyScheduledTaskHandler` is available since 6.7.13.0. The older approach of overriding `ScheduledTaskHandler::rescheduleTask()` is deprecated for 6.8.0.

## Code check (6.7.13.0)
- confirmed `ScheduledTask::getTaskName()` — abstract static — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTask.php:37
- confirmed `ScheduledTask::getDefaultInterval()` — abstract static int — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTask.php:42
- confirmed `ScheduledTaskHandler::run()` — abstract — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:55
- confirmed `ScheduledTaskHandler::__construct()` — scheduledTaskRepository, exceptionLogger args — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:26
- confirmed `DynamicallyScheduledTaskHandler::getNextExecutionTime()` — nullable DateTimeInterface — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/DynamicallyScheduledTaskHandler.php:20
- confirmed `persistNextExecutionTime` — null uses runInterval, past capped to now, status scheduled — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskExecutor.php:114
- confirmed `messenger.message_handler` — executor injected only into tagged handlers — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/ScheduledTaskExecutorCompilerPass.php:29
- confirmed `shopware.scheduled.task` — autoconfigured for ScheduledTask subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:90
- confirmed `scheduled-task:run` — ScheduledTaskRunner command — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:19
- deprecated `ScheduledTaskHandler::rescheduleTask()` — deprecated tag:v6.8.0 — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:109
