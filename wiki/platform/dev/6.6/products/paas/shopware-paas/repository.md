---
id: platform/dev/6.6/products/paas/shopware-paas/repository.md
title: Repository
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware-paas/repository.html"
sourceHash: "a24a7ad3541830910866d82c06ef50bd990cf29f"
keywords: ["repository", "shopware paas", "git", "composer create-project", "symfony flex", "composer req paas", "composer recipes:update", "project remote", "shopware projects", "project:set-remote", "opensearch migration", "rabbitmq rename"]
summary: Setting up the git repository for a Shopware PaaS project, adding the PaaS remote, and migrating from the old template.
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/installation/template.md"]
---
## What it is

This page describes setting up the git-based source repository for a Shopware PaaS project, using the Symfony Flex template, and adding the PaaS deployment remote.

## When to use

Use this when creating a new Shopware PaaS project's repository, updating the PaaS template recipe, or migrating a project from the old (pre-Symfony-Flex) PaaS template to the new structure.

## Key steps / config

1. Create a new project: `composer create-project shopware/production <folder-name>` using the Symfony Flex template (see [Setup Template](platform/dev/6.6/guides/installation/template.md)).
2. Require the PaaS configuration: `composer req paas`.
3. Create a new Git repository and push it to a Git hosting service.
4. Update the recipe later with `composer recipes:update` — every PaaS recipe update should be treated as a breaking update and validated before applying.
5. List projects to get the project ID:

```
$ shopware projects
```

6. Add the PaaS remote: `shopware project:set-remote 7xasjkyld189e` (replace with the actual project ID).

After setup, the repository has two remotes: `origin` (project source code) and `shopware` (synced with the PaaS environment).

## Essential identifiers

- `composer create-project shopware/production <folder-name>`
- `composer req paas`
- `composer recipes:update`
- `shopware projects`
- `shopware project:set-remote`

## Gotchas

Migrating from the old template requires manual work: the root `.platform.app.yml` moves to `.platform/applications.yaml`, and services are renamed (`queuerabbit` to `rabbitmq`, `searchelastic` to `opensearch`). Since renamed services are recreated, either rename the services back, start fresh and re-index Elasticsearch, or run both old and new services in parallel during a transitional upgrade.
