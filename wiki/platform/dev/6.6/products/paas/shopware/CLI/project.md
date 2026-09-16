---
id: platform/dev/6.6/products/paas/shopware/CLI/project.md
title: Managing project
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/CLI/project.html"
sourceHash: "e46e91e08d646abae340401cdf0963b2c0bd5881"
relatedPages:
  - platform/dev/6.6/products/paas/shopware/CLI/repository.md
keywords: ["project command", "sw-paas project", "project create", "project list", "SSH deploy keys", "repository URL", "shopware type", "blackbox type", "application instances", "codebase repository", "context command", "Shopware PaaS Native"]
summary: "The sw-paas project command creates and lists projects, the logical unit linking a codebase repository to staging/production application instances."
lastBuilt: "2026-09-15"
---

## What it is

The `project` command manages and organizes projects within Shopware PaaS Native. A project is a logical entity that encapsulates application environments such as staging and production, and is linked to a specific codebase repository. Projects serve as the foundational unit for deployments, defining the application code source (Git repository), the project type, and associated resources.

## When to use

Use `sw-paas project [command]` when creating a new deployable Shopware (or blackbox) codebase on PaaS Native, or when listing the projects already available to the current user or organization. Each project supports multiple application instances and shares infrastructure settings within the same organization.

## Key steps / config

```sh
sw-paas project [command]
```

Sub-commands:

- `sw-paas project create [flags]` — initializes a new project by specifying its name, repository, and type. To fetch code securely from private repositories during deployments, Shopware PaaS Native uses SSH deploy keys; see the guide on configuring deploy keys. Flags: `--name`, `--repository`, `--type` (`shopware`, `blackbox`).
- `sw-paas project list` — displays all projects associated with the current user or organization, along with metadata such as project name, type, and repository.

Example:

```sh
sw-paas project create --name "myproject" --repository "https://github.com/example/repo.git" --type shopware
```

This creates a Shopware project named `myproject` linked to the specified Git repository.

## Essential identifiers

- `sw-paas project create`
- `sw-paas project list`
- `--name`, `--repository`, `--type` (`shopware`/`blackbox`)

## Gotchas

To avoid repeatedly specifying `organization-id`, the documentation recommends using the `context` command to set it persistently, or running the CLI in interactive mode for guided input. Configuring SSH deploy keys is required for secure code fetching from private repositories during deployment.
