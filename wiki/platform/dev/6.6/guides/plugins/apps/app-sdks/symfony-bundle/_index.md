---
docType: developer
id: platform/dev/6.6/guides/plugins/apps/app-sdks/symfony-bundle/_index.md
sourceHash: 27cd776889df9aa7433fc6ac12e284341c518c0f
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/symfony-bundle/
title: Official Symfony bundle
version: "6.6"
versions:
  - "6.6"
keywords: ["App Bundle", "app-bundle-symfony", "shopware/app-bundle", "Symfony bundle", "App PHP SDK", "webhook", "AsEventListener", "WebhookAction", "app manifest", "lifecycle routes", "Doctrine", "DynamoDB"]
summary: "Official Symfony bundle wrapping the App PHP SDK; provides lifecycle routes and a webhook-to-Symfony-event bridge."
lastBuilt: 2026-09-15
---
## What it is

App Bundle is Shopware's official Symfony bundle integrating the PHP App SDK for Symfony-based app backends, hosted at the `app-bundle-symfony` GitHub repository.

## When to use

When building a Shopware app backend as a Symfony project and preferring a ready-made bundle over wiring the raw App PHP SDK by hand.

## Key steps / config

Install with SQL storage (Doctrine):

```bash
composer require shopware/app-bundle doctrine/orm symfony/doctrine-bridge
```

Or with NoSQL storage (DynamoDB):

```bash
composer require shopware/app-bundle async-aws/async-aws-bundle async-aws/dynamo-db
```

Quick start: create a new project (`composer create-project symfony/skeleton:"6.2.*" my-app`), install the bundle, optionally add logging (`composer require logger`), and provide an app manifest validated against `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-2.0.xsd` with `<meta>`, `<setup>` (registration URL and secret) and `<webhooks>` sections. Match the app name/secret to the environment variables in your `.env` file.

By default these routes are registered (prefix configurable via `config/routes/shopware_app.yaml`):

- `/app/lifecycle/register`
- `/app/lifecycle/activate`
- `/app/lifecycle/deactivate`
- `/app/lifecycle/delete`

The bundle also registers a generic webhook controller (default endpoint `/app/webhook`) that dispatches each webhook you register as a Symfony event, consumable via `#[AsEventListener(event: 'webhook.product.written')]` with a `WebhookAction` argument.

## Essential identifiers

- `shopware/app-bundle` (composer package)
- `/app/lifecycle/register`, `/app/lifecycle/activate`, `/app/lifecycle/deactivate`, `/app/lifecycle/delete`
- `config/routes/shopware_app.yaml`
- `/app/webhook`
- `AsEventListener`, `WebhookAction`

## Gotchas

Registration also dispatches lifecycle events to react to; consult the App SDK documentation for handling them.
