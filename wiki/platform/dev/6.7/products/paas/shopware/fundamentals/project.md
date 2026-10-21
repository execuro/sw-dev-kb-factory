---
id: platform/dev/6.7/products/paas/shopware/fundamentals/project.md
title: Projects
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/project.html
sourceHash: fd5a85eb76196cd42ec6f3220b00e0858f3113bf
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-paas project create", "sw-paas project list", "project", "paas native", "repository", "github", "bitbucket", "gitlab", "applications", "codebase", "sw-paas cli"]
summary: Shopware PaaS Native projects map a GitHub/Bitbucket/GitLab repo to deployable apps; create with sw-paas project create, list with sw-paas project list.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/guides/setting-up-repository-access.md"]
---
## What it is

In Shopware PaaS Native, a project represents a codebase in a GitHub, Bitbucket, or GitLab repository that is deployed to the platform. One project can contain many applications.

## When to use

When onboarding a new codebase into an organization on Shopware PaaS Native, or when looking up which projects (with their type and repository) exist for your user or organization.

## Key steps / config

1. Create a project in your organization by specifying its name, repository, and type:

   ```sh
   sw-paas project create
   ```

2. Make sure Shopware PaaS Native can access the repository — see [Setting up repository access](platform/dev/6.7/products/paas/shopware/guides/setting-up-repository-access.md).
3. List all projects associated with your user or organization, including project name, type, and repository:

   ```sh
   sw-paas project list
   ```

## Essential identifiers

- `sw-paas project create` — initialize a new project (name, repository, type)
- `sw-paas project list` — show all projects with key metadata

## Gotchas

- Creating the project does not by itself grant repository access; the repository access setup is a separate step.

## Code check (6.7.15.1)
- unverified `sw-paas project create` — Shopware PaaS CLI command, not part of the installed Shopware packages
- unverified `sw-paas project list` — Shopware PaaS CLI command, not part of the installed Shopware packages
