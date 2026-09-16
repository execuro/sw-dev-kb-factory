---
id: platform/dev/6.6/products/paas/shopware/CLI/exec.md
title: Executing commands
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/CLI/exec.html"
sourceHash: "dca4d4134d94f3b8f457131350023690ef4de57b"
keywords: ["exec command", "sw-paas exec", "remote terminal session", "interactive shell", "new terminal session", "debugging", "application-id", "organization-id", "project-id", "command difference", "session management"]
summary: "The sw-paas exec command opens or reuses a remote interactive terminal session for an application, for debugging and maintenance."
lastBuilt: "2026-09-15"
---

## What it is

The `exec` command executes commands in a remote terminal session for an application, useful for debugging, maintenance, or running one-off commands directly on the application's environment.

## When to use

Use `sw-paas exec` when interactive access to an application's environment is needed. By default it shows existing terminal sessions if any exist, or starts a new one if none are found; the `--new` flag forces a fresh session even when one already exists.

## Key steps / config

```sh
sw-paas exec [flags]
```

Flags:

- `--application-id string` — the ID of the application to execute commands in.
- `--new` — force creation of a new terminal session.
- `--organization-id string` — the ID of the organization.
- `--project-id string` — the ID of the project.
- `-h, --help` — show help for the exec command.

Examples:

```sh
sw-paas exec
sw-paas exec --new
sw-paas exec --project-id my-project --application-id my-app
```

To exit the remote shell, type `exit` and press Enter. Existing terminal sessions can be reused instead of creating new ones each time, which is more efficient for ongoing work.

## Essential identifiers

- `sw-paas exec [flags]`
- `--application-id`
- `--new`
- `--organization-id`
- `--project-id`

## Gotchas

The documentation points to the FAQ section for the main difference between `exec` and `command`: `exec` provides an interactive shell session, while `command` runs work in dedicated, purpose-built containers. Without `--new`, `exec` reuses an existing session rather than starting a fresh one.
