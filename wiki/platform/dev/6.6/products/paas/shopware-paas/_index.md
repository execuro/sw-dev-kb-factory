---
id: platform/dev/6.6/products/paas/shopware-paas/_index.md
title: Shopware PaaS
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/paas/shopware-paas/
sourceHash: c045e79d56ff7c8dd0284a749a420de15b207af8
keywords: ["Shopware PaaS", "PaaS CLI", "composer create-project", "composer req paas", "git push shopware", "project_id", "PaaS console", "PHP ext-amqp", "RabbitMQ", "deploy first project"]
summary: "Steps to deploy a first Shopware project to Shopware PaaS: create project, add composer package, git push to deploy."
lastBuilt: "2026-09-15"
---
## What it is

Introduces Shopware PaaS as a platform-as-a-service for hosting, deploying, and scaling a Shopware project, giving full code ownership while removing the need to build custom infrastructure, CI pipelines, or deployment automation.

## When to use

Use this page as the entry point for getting a first Shopware project running on Shopware PaaS, once you already have a PaaS account and an empty project's `project_id`, and have the PaaS CLI installed and PHP `ext-amqp` available (PaaS uses RabbitMQ instead of the regular DB to manage messages).

## Key steps / config

1. Create a local Shopware project:
   ```sh
   composer create-project shopware/production demo --no-interaction --ignore-platform-reqs
   ```
2. Enter the folder: `cd /demo`
3. Add the PaaS composer package: `composer req paas`
4. Initialize git: `git init`
5. Stage all files: `git add .`
6. Commit: `git commit -am "initial commit"`
7. Configure the CLI remote with the project id: `shopware project:set-remote PROJECT_ID`
8. Deploy by pushing: `git push shopware`

The detailed step-by-step flow continues across sub-pages: [PaaS CLI setup](platform/dev/6.6/products/paas/shopware-paas/cli-setup.md), repository setup, then [build & deploy](platform/dev/6.6/products/paas/shopware-paas/build-deploy.md). Optional add-ons include [Elasticsearch](platform/dev/6.6/products/paas/shopware-paas/elasticsearch.md), RabbitMQ, and Fastly, plus [Blackfire](platform/dev/6.6/products/paas/shopware-paas/blackfire.md) for monitoring response time and performance.

## Essential identifiers

- `composer create-project shopware/production`
- `composer req paas`
- `shopware project:set-remote PROJECT_ID`
- `git push shopware`
- PHP extension `ext-amqp`, RabbitMQ

## Gotchas

Shopware PaaS is available on request for Shopware merchants — it requires contacting Shopware Sales for access, and requires PHP `ext-amqp` since PaaS uses RabbitMQ rather than the regular database to manage messages.
