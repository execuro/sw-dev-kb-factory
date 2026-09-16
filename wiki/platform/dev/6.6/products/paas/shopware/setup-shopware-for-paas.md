---
id: platform/dev/6.6/products/paas/shopware/setup-shopware-for-paas.md
title: Setup Shopware to be deployed to PaaS
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/setup-shopware-for-paas.html"
sourceHash: "7eef10587eee575b866e0643ca41ff482aedf85e"
keywords: ["setup Shopware PaaS", "application.yaml", "shopware/k8s-meta", "Shopware Operator", "composer create-project shopware/production", "operator.yaml", "high-availability", "stateless application instances", "ignore-platform-reqs", "Composer plugin management", "PHP version"]
summary: "Prepares a Shopware codebase for PaaS Native deployment: install k8s-meta, create application.yaml, and manage plugins via Composer only."
lastBuilt: "2026-09-15"
---

## What it is

This page describes how to prepare a Shopware application so it can be deployed to Shopware PaaS Native, covering local prerequisites, dependency setup, and the `application.yaml` deployment descriptor.

## When to use

Use this page before deploying a new or existing Shopware project to PaaS Native, since the platform runs a high-availability, clustered setup where all application instances must remain stateless and identical, and plugin management through the Shopware Administration interface is not supported.

## Key steps / config

macOS and Linux are the recommended local development environments; on Windows, Docker or WSL2 is advised. Local-environment operations are required for tasks that touch the file system directly: installing/upgrading plugins, adjusting system-level configuration, or applying custom code changes. Plugins must be installed or updated via Composer as part of the project's codebase, following the guidance on managing extensions with Composer; each plugin should also be checked for S3-based storage support before installation.

For a new project:

```sh
composer create-project shopware/production <folder-name>
```

For an existing project, `cd <your-project-folder>` and then install the Kubernetes metadata package required for the Shopware Operator:

```sh
composer require shopware/k8s-meta --ignore-platform-reqs
```

`--ignore-platform-reqs` ensures all necessary recipes install even if the local PHP version differs from the platform's required version. This installs configuration files needed to deploy via the Shopware Operator; after installation, verify `config/packages/operator.yaml` was created.

At the project root, create `application.yaml` to define deployment parameters such as PHP version and environment-specific configuration:

```yaml
app:
  php:
    version: "8.3"
  environment_variables: []
  hooks: {}
services:
  mysql:
    version: "8.0"
```

An advanced example adds a custom variable with a `scope` of `RUN` or `BUILD`:

```yaml
app:
  php:
    version: "8.3"
  environment_variables:
    - name: INSTALL_LOCALE
      value: fr-FR
      scope: RUN
  hooks: {}
services:
  mysql:
    version: "8.0"
```

## Essential identifiers

- `application.yaml`
- `composer require shopware/k8s-meta --ignore-platform-reqs`
- `config/packages/operator.yaml`
- `composer create-project shopware/production <folder-name>`

## Gotchas

Plugin management via the Shopware Administration interface is not supported, because instances must stay stateless and identical in the clustered setup; all plugin changes must go through Composer instead.
