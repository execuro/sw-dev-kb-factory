---
id: platform/dev/6.6/products/paas/shopware/CLI/organizations.md
title: Managing organizations
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/CLI/organizations.html"
sourceHash: "f042e4fe7c9735e74042863bdf8e6113fad98f64"
keywords: ["organization command", "sw-paas organization", "org alias", "organization create", "organization get", "organization list", "account commands", "top-level container", "Shopware PaaS Native", "admin users", "organization-id"]
summary: "The sw-paas organization command creates, retrieves and lists organizations, the top-level container for projects in Shopware PaaS Native."
lastBuilt: "2026-09-15"
---

## What it is

The `organization` command manages organizations, which serve as the top-level container representing a company or entity in Shopware PaaS Native. Each organization can contain multiple projects, and admin users within an organization can manage user access through the `account` commands.

## When to use

Use `sw-paas organization [command]` (or its alias `org`) when setting up a new company/entity container in Shopware PaaS Native, or when inspecting which organizations a user belongs to before creating projects inside one.

## Key steps / config

```sh
sw-paas organization [command]
```

Aliases: `organization`, `org`.

Sub-commands:

- `sw-paas organization create --name "Awesome GmbH"` — creates a new organization; only users with appropriate permissions can perform this action. The documentation recommends choosing a clear and distinct name, since it is visible across teams and projects.
- `sw-paas organization get --organization-id org-123` — fetches details of a specific organization by its unique identifier. Flag: `--organization-id`.
- `sw-paas organization list` — displays a list of all organizations the user is part of, including relevant metadata such as ID and name.

## Essential identifiers

- `sw-paas organization create`
- `sw-paas organization get`
- `sw-paas organization list`
- `--organization-id`
- `account` commands (user-access management within an organization)

## Gotchas

Creating an organization requires appropriate permissions; not every user account can perform `organization create`.
