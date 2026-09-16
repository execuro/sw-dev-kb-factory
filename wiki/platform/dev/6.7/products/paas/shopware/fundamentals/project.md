---
id: platform/dev/6.7/products/paas/shopware/fundamentals/project.md
title: Projects
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/project.html
sourceHash: fd5a85eb76196cd42ec6f3220b00e0858f3113bf
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-paas project create", "sw-paas project list", "sw-paas", "paas project", "shopware paas native", "repository", "github", "gitlab", "bitbucket", "applications", "codebase", "organization"]
summary: "Shopware PaaS Native projects: a Git repository codebase holding many applications; create with sw-paas project create, list with sw-paas project list."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/guides/setting-up-repository-access.md"]
---
## What it is

In Shopware PaaS Native, a project represents a codebase in a GitHub, Bitbucket, or GitLab repository that is deployed to the platform. One project can contain many applications.

## When to use

When onboarding a repository to Shopware PaaS Native before creating applications from it, or when looking up which projects exist in your user's or organization's scope.

## Key steps / config

1. Grant Shopware PaaS Native access to the repository first, following [Setting up repository access](platform/dev/6.7/products/paas/shopware/guides/setting-up-repository-access.md).
2. Create the project in your organization; the command asks for its name, repository, and type:

   ```sh
   sw-paas project create
   ```

3. List all projects associated with your user or organization, including project name, type, and repository:

   ```sh
   sw-paas project list
   ```

## Essential identifiers

- `sw-paas project create`
- `sw-paas project list`

## Gotchas

- Project creation needs repository access to be set up; without it the platform cannot read the codebase.

## Code check (6.7.13.0)
- unverified `sw-paas project create` — external PaaS CLI command, no match in vendor/shopware core or storefront, out of scope
- unverified `sw-paas project list` — external PaaS CLI command, not part of the installed Shopware code
