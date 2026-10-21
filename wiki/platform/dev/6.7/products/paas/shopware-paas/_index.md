---
id: platform/dev/6.7/products/paas/shopware-paas/_index.md
title: Shopware PaaS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/
sourceHash: c18ffd4ad1f74439bfbf7743836ccfdf412882cb
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware paas", "paas", "shopware/paas-meta", "shopware/production", "project:set-remote", "git push shopware", "paas cli", "ext-amqp", "rabbitmq", "MESSENGER_TRANSPORT_DSN", "deploy first project", "hosting"]
summary: Shopware PaaS quickstart - prerequisites (PaaS CLI, project_id, ext-amqp) and the composer/git steps to push a first Shopware project to PaaS.
lastBuilt: 2026-10-21
---
## What it is

Shopware PaaS is a platform-as-a-service to host, deploy and scale an individual Shopware project. It keeps the full flexibility and code ownership of a self-hosted project, but removes the need to build custom infrastructure, build/test pipelines or deployment automation. Available on request for Shopware merchants via Shopware Sales.

## When to use

When deploying a Shopware project to Shopware PaaS for the first time, or when you need the overview of the setup sub-pages (CLI, repository, build/deploy, Elasticsearch, RabbitMQ, Fastly, Blackfire).

## Key steps / config

Prerequisites:

- A Shopware PaaS account (register via `https://console.shopware.com`).
- The `project_id` of an empty project created on Shopware PaaS.
- The Shopware PaaS CLI installed (see `https://developer.shopware.com/docs/products/paas/shopware-paas/cli-setup.html`).
- PHP `ext-amqp` installed: PaaS uses RabbitMQ instead of the database for messages.

Deploy a first project:

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

`PROJECT_ID` is the `project_id` of your empty project; `git push shopware` pushes the code to Shopware PaaS.

Detailed path (sub-pages): set up the PaaS CLI → set up the project repository → push and deploy → optionally add Elasticsearch, RabbitMQ and/or Fastly for performance → use the bundled Blackfire to monitor response times and investigate performance issues.

## Essential identifiers

- `shopware/production`, `shopware/paas-meta` (composer packages)
- `shopware project:set-remote PROJECT_ID`, `git push shopware`
- `ext-amqp`, `MESSENGER_TRANSPORT_DSN`

## Gotchas

- `ext-amqp` is needed because PaaS moves messaging to RabbitMQ; core's own default message transport is the database (`doctrine://default?auto_setup=false` for `MESSENGER_TRANSPORT_DSN`), with an `amqp://` DSN as the RabbitMQ alternative.

## Code check (6.7.15.1)
- confirmed `MESSENGER_TRANSPORT_DSN` — core default is `doctrine://default?auto_setup=false` (database transport) — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:3
- confirmed `MESSENGER_TRANSPORT_DSN` — default messenger transport DSN is read from this env var — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:70
- confirmed `amqp` — installer env template lists an `amqp://` DSN as a transport option — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:29
- unverified `shopware/paas-meta` — composer meta package, not part of the installed core/storefront/administration packages
- unverified `project:set-remote` — PaaS CLI command, outside the installed code
