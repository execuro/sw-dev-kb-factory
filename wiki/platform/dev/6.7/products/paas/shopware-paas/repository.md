---
id: platform/dev/6.7/products/paas/shopware-paas/repository.md
title: Repository
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/repository.html
sourceHash: 2137d9e221d74cef2e90f4bbab8d23ab22ea9204
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware paas", "upsun", "platform.sh", "git repository", "git remote", "shopware/production", "shopware/paas-meta", "composer create-project", "composer recipes:update", "shopware projects", "shopware project:set-remote", ".platform/applications.yaml", "symfony flex"]
summary: "Set up a Shopware PaaS repo: composer create-project shopware/production, require shopware/paas-meta, add the shopware remote via project:set-remote."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware-paas/setup-template.md", "platform/dev/6.7/guides/installation/project-overview.md", "platform/dev/6.7/products/tools/cli/project-commands/autofix.md"]
---
## What it is

How to set up the git repository for a Shopware PaaS (Upsun, formerly Platform.sh) project: create a Symfony Flex Shopware project, add the PaaS configuration package, push to a git host, and add a second remote that deploys to the PaaS environment. The guide uses GitHub; Bitbucket and GitLab integrations also work.

## When to use

When starting a new Shopware PaaS project, updating the PaaS template recipe, or migrating a project from the old PaaS template to the Flex-based structure.

## Key steps / config

1. Create the project from the Symfony Flex template (see [project overview](platform/dev/6.7/guides/installation/project-overview.md)):
   `composer create-project shopware/production <folder-name>`
2. Change into the folder and require the PaaS configuration: `composer req shopware/paas-meta` (installs the [setup template](platform/dev/6.7/products/paas/shopware-paas/setup-template.md)).
3. Create a git repository and push it to your git hosting service (`origin`).
4. Look up the project ID with `shopware projects`.
5. Add the PaaS remote: `shopware project:set-remote <project-id>`.

Result of `git remote -v`:

| Remote | Function | Description |
|---|---|---|
| `origin` | Project Code | All project-specific source code |
| `shopware` | PaaS Environment | Pushes here sync with the PaaS environment and trigger deployment |

Update the PaaS recipe with `composer recipes:update`.

## Essential identifiers

- `composer create-project shopware/production <folder-name>`
- `composer req shopware/paas-meta`
- `shopware projects`, `shopware project:set-remote <id>`
- `composer recipes:update`
- remotes `origin` and `shopware`
- `.platform/applications.yaml`

## Gotchas

- Treat every PaaS recipe update as **breaking**: review all changes proposed by `recipes:update` for the PaaS package before applying. Some `.platform` YAML changes need manual action — e.g. switching a file mount from a "local mount" to a "service mount" cannot migrate existing data automatically.
- Migrating from the old PaaS template (shopwareArchive/paas): first follow the Flex migration in [autofix](platform/dev/6.7/products/tools/cli/project-commands/autofix.md), then additionally:
  - root `.platform.app.yml` moved to `.platform/applications.yaml`;
  - services renamed: `queuerabbit` to `rabbitmq`, `searchelastic` to `opensearch`.
- Renamed services are created as completely new services. Options: rename the services back, start with a new service and re-index Elasticsearch, or run a transitional upgrade with both services in parallel for a while.

## Code check (6.7.13.0)
- unverified `shopware/production` — project template package, outside the checked vendor roots
- unverified `shopware/paas-meta` — Flex recipe package, outside the checked vendor roots
- unverified `shopware project:set-remote` — Shopware PaaS CLI command, not part of shopware/core
- unverified `composer recipes:update` — Symfony Flex command, outside vendor/shopware scope
- unverified `.platform/applications.yaml` — PaaS infrastructure file, outside vendor scope
