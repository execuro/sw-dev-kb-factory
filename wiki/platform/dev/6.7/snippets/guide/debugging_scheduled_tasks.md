---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/snippets/guide/debugging_scheduled_tasks.md
sourceHash: 98e680ed8a013f596f6d55ca67c07ce5485d9a3e
sourceUrl: https://developer.shopware.com/docs/snippets/guide/debugging_scheduled_tasks.html
title: Debugging Scheduled Tasks
version: "6.7"
versions:
  - "6.7"
keywords: ["scheduled task", "scheduled-task:run-single", "scheduled-task:schedule", "scheduled-task:deactivate", "log_entry.cleanup", "RunSingleScheduledTaskCommand", "ScheduleScheduledTaskCommand", "DeactivateScheduledTaskCommand", "cron job", "debugging", "message queue", "bin/console"]
summary: "Run a single scheduled task without the queue (scheduled-task:run-single, 6.7.2.0+), or schedule/deactivate a task via bin/console."
lastBuilt: 2026-09-15
---
## What it is

CLI commands for debugging and controlling individual scheduled tasks: run one task directly (bypassing the message queue), schedule it, or deactivate it.

## When to use

When debugging a scheduled task, or when you need control over when and which tasks execute instead of waiting for the scheduler and queue worker.

## Key steps / config

Run a single task immediately, regardless of its schedule and without the queue:

```shell
bin/console scheduled-task:run-single log_entry.cleanup
```

Schedule a task, or deactivate its scheduling:

```shell
bin/console scheduled-task:schedule log_entry.cleanup
bin/console scheduled-task:deactivate log_entry.cleanup
```

All three commands take one required argument `taskName` (the task's name, e.g. `log_entry.cleanup`). Options in the installed code:

- `scheduled-task:schedule` — `--force` / `-f` (schedule even if the task is marked queued/running), `--immediately` / `-i` (set next execution time to now).
- `scheduled-task:deactivate` — `--force` / `-f` (deactivate even if queued/running).

## Essential identifiers

- `scheduled-task:run-single` — `Shopware\Core\Framework\MessageQueue\Command\RunSingleScheduledTaskCommand`
- `scheduled-task:schedule` — `Shopware\Core\Framework\MessageQueue\Command\ScheduleScheduledTaskCommand`
- `scheduled-task:deactivate` — `Shopware\Core\Framework\MessageQueue\Command\DeactivateScheduledTaskCommand`
- `log_entry.cleanup` — example task name

## Gotchas

- `scheduled-task:schedule` and `scheduled-task:deactivate` fail with a warning when the task is currently queued or running unless `--force` is passed.
- `scheduled-task:deactivate` does not cancel a task execution already running (e.g. in a queue worker); it only disables scheduling.

## Version notes

- `scheduled-task:run-single` is available starting with Shopware 6.7.2.0.

## Code check (6.7.13.0)
- confirmed `scheduled-task:run-single` — command name, runs task via TaskRunner — vendor/shopware/core/Framework/MessageQueue/Command/RunSingleScheduledTaskCommand.php:15
- confirmed `taskName` — required argument of run-single — vendor/shopware/core/Framework/MessageQueue/Command/RunSingleScheduledTaskCommand.php:31
- confirmed `TaskRunner::runSingleTask()` — executes the named task with a CLI context — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/Scheduler/TaskRunner.php:36
- confirmed `scheduled-task:schedule` — command name — vendor/shopware/core/Framework/MessageQueue/Command/ScheduleScheduledTaskCommand.php:17
- confirmed `immediately` — option `-i`, sets next execution to now — vendor/shopware/core/Framework/MessageQueue/Command/ScheduleScheduledTaskCommand.php:45
- confirmed `scheduled-task:deactivate` — command name — vendor/shopware/core/Framework/MessageQueue/Command/DeactivateScheduledTaskCommand.php:17
- confirmed `force` — option `-f` required when task is queued/running — vendor/shopware/core/Framework/MessageQueue/Command/DeactivateScheduledTaskCommand.php:43
- confirmed `log_entry.cleanup` — task name of LogCleanupTask — vendor/shopware/core/Framework/Log/ScheduledTask/LogCleanupTask.php:13
- unverified `6.7.2.0` — introduction version of run-single not determinable from installed code
