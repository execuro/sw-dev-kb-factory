---
id: platform/dev/6.7/products/paas/shopware-paas/_index.md
title: Shopware PaaS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/
sourceHash: c18ffd4ad1f74439bfbf7743836ccfdf412882cb
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware paas", "paas", "shopware/paas-meta", "shopware project:set-remote", "git push shopware", "composer create-project shopware/production", "ext-amqp", "rabbitmq", "deploy", "paas cli", "hosting"]
summary: Shopware PaaS quick start - prerequisites (account, project_id, PaaS CLI, ext-amqp) and the steps to create, commit and push a first project.
lastBuilt: 2026-09-15
---
## What it is

Shopware PaaS is a platform-as-a-service to host, deploy and scale an individual Shopware project, keeping the code ownership of a self-hosted project while removing custom infrastructure, build/test pipelines and deployment automation work. This page gives the first-deployment quick start and points to the detailed sub-guides.

## When to use

Deploying a new Shopware project to Shopware PaaS for the first time. PaaS is available on request for Shopware merchants via Shopware Sales.

## Key steps / config

Prerequisites:

- A Shopware PaaS account (register via the authentication form at `console.shopware.com`)
- The `project_id` of an empty project created on Shopware PaaS
- The Shopware PaaS CLI installed locally
- PHP `ext-amqp` installed (PaaS uses RabbitMQ instead of the regular database to manage messages)

Steps:

```sh
composer create-project shopware/production demo --no-interaction --ignore-platform-reqs
cd /demo
composer req shopware/paas-meta
git init
git add .
git commit -am "initial commit"
shopware project:set-remote PROJECT_ID
git push shopware
```

`PROJECT_ID` is the `project_id` of the empty PaaS project; `git push shopware` pushes the code to Shopware PaaS.

Detailed guide order in the sub-pages: CLI setup, repository setup, build and deploy, then optional Elasticsearch, RabbitMQ and Fastly; every project includes Blackfire for response-time monitoring and performance investigation.

## Essential identifiers

- `composer req shopware/paas-meta`
- `shopware project:set-remote PROJECT_ID`
- `git push shopware`
- `ext-amqp`
- `MESSENGER_TRANSPORT_DSN` (message transport env var in core)

## Gotchas

- The `ext-amqp` requirement exists because PaaS runs messages over RabbitMQ; installed core defaults `MESSENGER_TRANSPORT_DSN` to `doctrine://default?auto_setup=false` (the regular database), and its installer env template lists an `amqp://` DSN as an alternative.
- `composer create-project` uses `--ignore-platform-reqs`, so missing local PHP extensions are not reported at that step.

## Code check (6.7.13.0)
- confirmed `MESSENGER_TRANSPORT_DSN` — defaults to the doctrine transport in core — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:3
- confirmed `amqp://` — AMQP DSN offered as an alternative transport in the installer env template — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:30
- unverified `shopware/paas-meta` — separate composer package, not in installed shopware roots
- unverified `shopware project:set-remote` — PaaS CLI command, external tool
- unverified `ext-amqp` — PHP extension, out of scope of vendor/shopware
