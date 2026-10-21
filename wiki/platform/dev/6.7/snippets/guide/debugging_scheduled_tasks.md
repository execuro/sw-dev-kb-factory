---
id: platform/dev/6.7/snippets/guide/debugging_scheduled_tasks.md
title: Debugging Scheduled Tasks
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/snippets/guide/debugging_scheduled_tasks.html
sourceHash: 98e680ed8a013f596f6d55ca67c07ce5485d9a3e
codeCheckedAgainst: "6.7.15.1"
keywords: ["scheduled task", "cron", "debugging", "scheduled-task:run-single", "scheduled-task:schedule", "scheduled-task:deactivate", "log_entry.cleanup", "taskName", "run task manually", "message queue", "--force", "--immediately"]
summary: CLI commands to run one scheduled task directly without the queue (scheduled-task:run-single, 6.7.2.0+) and to schedule or deactivate a task.
lastBuilt: 2026-10-21
---
## What it is

Console commands for debugging scheduled tasks: run a single task directly, bypassing the message queue, and manually schedule or deactivate a task by its name.

## When to use

When you need to debug a scheduled task or control exactly when and which task executes, instead of waiting for the scheduler and queue worker.

## Key steps / config

Run one task immediately, regardless of its schedule (argument `taskName`, required):

```shell
bin/console scheduled-task:run-single log_entry.cleanup
```

Schedule or deactivate a task:

```shell
bin/console scheduled-task:schedule log_entry.cleanup
bin/console scheduled-task:deactivate log_entry.cleanup
```

Options per the installed code:
- `scheduled-task:schedule`: `--force`/`-f` (schedule even if the task is queued or running), `--immediately`/`-i` (set next execution time to now).
- `scheduled-task:deactivate`: `--force`/`-f` (deactivate even if queued or running).

## Essential identifiers

`scheduled-task:run-single`, `scheduled-task:schedule`, `scheduled-task:deactivate`, `log_entry.cleanup`, `RunSingleScheduledTaskCommand`, `ScheduleScheduledTaskCommand`, `DeactivateScheduledTaskCommand`

## Gotchas

- Without `--force`, schedule and deactivate fail when the task is currently queued or running.
- Deactivating only stops future scheduling; it does not cancel an execution already running via the queue worker.

## Version notes

- `scheduled-task:run-single` is available starting with Shopware 6.7.2.0.

## Code check (6.7.15.1)
- confirmed `scheduled-task:run-single` — command name of RunSingleScheduledTaskCommand — vendor/shopware/core/Framework/MessageQueue/Command/RunSingleScheduledTaskCommand.php:16
- confirmed `taskName` — required argument, e.g. log_entry.cleanup — vendor/shopware/core/Framework/MessageQueue/Command/RunSingleScheduledTaskCommand.php:31
- confirmed `scheduled-task:schedule` — command name of ScheduleScheduledTaskCommand — vendor/shopware/core/Framework/MessageQueue/Command/ScheduleScheduledTaskCommand.php:18
- confirmed `immediately` — option `-i` sets next execution time to now — vendor/shopware/core/Framework/MessageQueue/Command/ScheduleScheduledTaskCommand.php:45
- confirmed `scheduled-task:deactivate` — command name of DeactivateScheduledTaskCommand — vendor/shopware/core/Framework/MessageQueue/Command/DeactivateScheduledTaskCommand.php:18
- confirmed `force` — option `-f` needed when task is queued/running — vendor/shopware/core/Framework/MessageQueue/Command/DeactivateScheduledTaskCommand.php:43
- confirmed `log_entry.cleanup` — task name returned by LogCleanupTask — vendor/shopware/core/Framework/Log/ScheduledTask/LogCleanupTask.php:13
