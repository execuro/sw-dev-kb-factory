---
id: platform/dev/6.6/products/paas/shopware/CLI/applications.md
title: Manage Applications
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/CLI/applications.html"
sourceHash: "c28cce94e4c22f2f4a8203726d3d2fab56d84ee8"
keywords: ["application command", "sw-paas application", "create application", "update application", "list applications", "check applications", "build list", "build logs", "build start", "delete application", "commit-sha", "Shopware PaaS Native deployments"]
summary: "The sw-paas application command creates, updates, lists, checks, builds and deletes application deployments in Shopware PaaS Native."
lastBuilt: "2026-09-15"
---

## What it is

The `application` command manages deployments in Shopware PaaS Native. Each application represents a deployment of the codebase within a project; a project can contain multiple applications, for example staging and production.

## When to use

Use `sw-paas application [command]` to create, update, list, check, build, or delete an application deployment inside a Shopware PaaS Native project.

## Key steps / config

Application management commands:

- `sw-paas application create [flags]` — deploys a new application to a project. Flags: `--project-id`, `--name`, `--commit-sha`, `--help`. If `--project-id` is omitted, the CLI tries to fetch it from the repository; if `--name` or `--commit-sha` are omitted, the CLI prompts for them.
- `sw-paas application update [flags]` — updates an existing application with a new commit SHA. Flags: `--project-id`, `--application-id`, `--commit-sha`, `--help`.
- `sw-paas application list [flags]` — lists applications for a project. Flags: `--project-id`, `--help`.
- `sw-paas application check [flags]` — checks the status of applications. Flags: `--project-id`, `--application-id`, `--help`.

Build sub-commands:

- `sw-paas application build list [flags]` — lists builds for an application. Flags: `--application-id`, `--organization-id`, `--project-id`, `--help`.
- `sw-paas application build logs [flags]` — displays logs of a specific build. Flags: `--application-id`, `--application-build-id`, `--organization-id`, `--project-id`, `--help`.
- `sw-paas application build start [flags]` — triggers a new build for the specified application. Flags: `--application-id`, `--organization-id`, `--project-id`, `--help`.
- `sw-paas application delete [flags]` — deletes an existing application from a project. Flags: `--application-id` (required), `--project-id` (optional, fetched if omitted), `--help`.

Example creating an application:

```sh
sw-paas application create --project-id "proj-1" --name "my-app" --commit-sha "abcdef123456"
```

## Essential identifiers

- `sw-paas application create`
- `sw-paas application update`
- `sw-paas application list`
- `sw-paas application check`
- `sw-paas application build list`
- `sw-paas application build logs`
- `sw-paas application build start`
- `sw-paas application delete`

## Gotchas

`--application-id` is required for `application delete`, while `--project-id` for that command is optional and will be fetched automatically if not supplied.
