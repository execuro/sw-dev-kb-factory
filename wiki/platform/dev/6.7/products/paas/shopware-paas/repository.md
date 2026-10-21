---
id: platform/dev/6.7/products/paas/shopware-paas/repository.md
title: Repository
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/repository.html
sourceHash: 2137d9e221d74cef2e90f4bbab8d23ab22ea9204
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware paas", "upsun", "platform.sh", "composer create-project shopware/production", "shopware/paas-meta", "composer recipes:update", "shopware projects", "shopware project:set-remote", "git remote", ".platform/applications.yaml", "queuerabbit", "searchelastic", "opensearch", "symfony flex"]
summary: Git repository setup for Shopware PaaS - shopware/production, shopware/paas-meta, the shopware remote, and migrating the old template.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware-paas/setup-template.md", "platform/dev/6.7/guides/installation/project-overview.md", "platform/dev/6.7/products/tools/cli/project-commands/autofix.md"]
---
## What it is

How to set up the git-based VCS repository that holds a Shopware PaaS project's source code, and how to add the PaaS remote whose pushes trigger deployments. Platform.sh is now Upsun. References to Platform.sh in code, docs or older material mean Upsun. The guide uses GitHub, but Bitbucket and GitLab can also be integrated through Upsun source integrations.

## When to use

When you start a new Shopware PaaS project, connect a local repository to a PaaS environment, update the PaaS template recipe, or migrate from the old PaaS template (shopwareArchive/paas) to the Symfony Flex structure.

## Key steps / config

1. Create the project from the Symfony Flex template (see [project overview](platform/dev/6.7/guides/installation/project-overview.md)):
   `composer create-project shopware/production <folder-name>`
2. Change into the folder and require the PaaS configuration: `composer req shopware/paas-meta`. This installs the [setup template](platform/dev/6.7/products/paas/shopware-paas/setup-template.md).
3. Create a new Git repository and push it to your Git hosting service (remote `origin`).
4. Find the project ID with `shopware projects`. It lists ID, Title, Region and Organization.
5. Add the PaaS remote: `shopware project:set-remote <project-id>`.

Result of `git remote -v`:

| Remote | Function | Description |
|---|---|---|
| `origin` | Project Code | All project-specific source code |
| `shopware` | PaaS Environment | Pushes are synced with the PaaS environment |

Updating the recipe: run `composer recipes:update`. Check every change it proposes for the PaaS package by hand, because some changes to the `.platform` YAML files need extra manual steps.

## Essential identifiers

- `composer create-project shopware/production <folder-name>`
- `composer req shopware/paas-meta`
- `composer recipes:update`
- `shopware projects`, `shopware project:set-remote`
- Remotes `origin`, `shopware`
- `.platform/applications.yaml`

## Gotchas

- Treat every PaaS recipe update as breaking and validate it before you apply it. Some changes cannot be migrated automatically. For example, if a mount switches from a "local mount" to a "service mount", the existing data does not move into the new mount.
- Migrating from the old template: first follow the [Symfony Flex migration](platform/dev/6.7/products/tools/cli/project-commands/autofix.md), then do these extra tasks:
  - The root `.platform.app.yml` moved to `.platform/applications.yaml`.
  - Services were renamed: `queuerabbit` became `rabbitmq` and `searchelastic` became `opensearch`.
- A renamed service is created as a completely new service. You have three options:
  - Rename the services back.
  - Start with the new service and re-index Elasticsearch.
  - Run the old and new services in parallel for a while as a transitional upgrade (see the Upsun OpenSearch upgrade docs).

## Code check (6.7.15.1)
- unverified `shopware/production` — Composer project template, a separate repository, not in the core packages
- unverified `shopware/paas-meta` — Composer recipe package, not in the core packages
- unverified `shopware project:set-remote` — Shopware PaaS CLI command, not part of the core packages
- unverified `shopware projects` — Shopware PaaS CLI command, not part of the core packages
- unverified `.platform/applications.yaml` — PaaS infrastructure file from the recipe, not in the core packages
