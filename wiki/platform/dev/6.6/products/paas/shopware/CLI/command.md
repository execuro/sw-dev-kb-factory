---
id: platform/dev/6.6/products/paas/shopware/CLI/command.md
title: Managing commands
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/CLI/command.html"
sourceHash: "3f4f22c8b4537fc234ee49e306d72335a0dc7aed"
keywords: ["command command", "sw-paas command", "dedicated container", "CI/CD", "asynchronous execution", "command create", "command get", "command list", "command output", "exec command difference", "time-to-live", "TTL"]
summary: "The sw-paas command command creates and manages commands run asynchronously in dedicated, time-limited containers, ideal for CI/CD."
lastBuilt: "2026-09-15"
---

## What it is

The `command` command allows creating and managing commands that run in dedicated containers, useful for CI/CD environments or when a command needs to run asynchronously without waiting for completion.

## When to use

Use `sw-paas command` when a task should run in an isolated, purpose-built container rather than an interactive shell — for example CI/CD pipelines, asynchronous jobs, or automated processes where you don't need to wait for completion. Unlike `exec`, which provides an interactive shell session, `command` spins up a dedicated container for each invocation.

## Key steps / config

```sh
sw-paas command [command]
```

The default execution directory is `/var/www/html`. The container has a time-to-live (TTL) of 1 hour, so the command must complete within that timeframe.

Available sub-commands:

- `sw-paas command create [flags]` — creates a new command to run in a dedicated container.
- `sw-paas command get [flags]` — gets detailed information about a specific command.
- `sw-paas command list [flags]` — lists all available commands.
- `sw-paas command output [flags]` — gets the output of a specific command.

Examples:

```sh
sw-paas command create --project-id my-project --application-id my-app --script "bin/console cache:clear"
sw-paas command list
sw-paas command output --command-id abc123
```

Commands run in isolated containers, giving each execution a clean environment; status and output can be retrieved even after the command has finished.

## Essential identifiers

- `sw-paas command create`
- `sw-paas command get`
- `sw-paas command list`
- `sw-paas command output`
- `/var/www/html` (default execution directory)

## Gotchas

Each `command` container has a 1-hour TTL — the command must complete within that time. The documentation points to the FAQ section for the main difference between `exec` and `command`; the difference described is that `exec` is an interactive shell session while `command` runs in a dedicated, single-purpose container better suited to automated, non-interactive processes.
