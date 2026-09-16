---
id: platform/dev/6.6/snippets/guide/debugging_scheduled_tasks.md
title: Debugging Scheduled Tasks
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/snippets/guide/debugging_scheduled_tasks.html
sourceHash: b2e35f2b3200a0003edb789757cb888cc72326bb
keywords: ["scheduled task", "debugging scheduled tasks", "scheduled-task:run-single", "bin/console", "task queue", "log_entry.cleanup", "CLI", "console command", "run single task"]
summary: "Use bin/console scheduled-task:run-single <task-name> to run one scheduled task directly, bypassing the queue, for debugging."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to run a single scheduled task directly, without going through the queue, for debugging or controlled execution.

## When to use
When debugging a specific scheduled task or needing precise control over which task runs and when, instead of relying on the queue-driven scheduler.

## Key steps / config
Run the task directly with:

```shell
bin/console scheduled-task:run-single log_entry.cleanup
```

Replace `log_entry.cleanup` with the target task name.

## Essential identifiers
- `bin/console scheduled-task:run-single <task-name>`
