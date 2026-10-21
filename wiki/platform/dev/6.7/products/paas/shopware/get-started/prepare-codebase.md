---
id: platform/dev/6.7/products/paas/shopware/get-started/prepare-codebase.md
title: Prepare Shopware codebase
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/get-started/prepare-codebase.html
sourceHash: b94bfc14cc20f162586c25aba61d6a13ea464e9a
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware/k8s-meta", "application.yaml", "operator.yaml", "shopware/production", ".config/shopware-project.yml", "--ignore-platform-reqs", "deployment helper", "paas native", "composer plugins", "uninstall extension", "s3 storage", "prepare project"]
summary: "Prepare a Shopware project for PaaS Native: Composer-only plugins, shopware/k8s-meta (^2.0 for 6.7), application.yaml, extension removal."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/k8s-meta.md", "platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md", "platform/dev/6.7/products/paas/shopware/guides/monorepo.md"]
---
## What it is

The steps to make a new or existing Shopware project deployable on Shopware PaaS Native: managing plugins through Composer, installing the `shopware/k8s-meta` package, creating `application.yaml`, and removing extensions through the Deployment Helper.

## When to use

Use it before your first PaaS Native deployment, when you migrate an existing project to PaaS Native, or when you need to install, update or uninstall a plugin in a PaaS project.

## Key steps / config

Local environment: macOS or Linux are recommended; on Windows use Docker or WSL2. Tasks that touch the file system (installing/upgrading plugins, system-level configuration such as language or environment, custom code) must be done locally and committed.

Plugins: install and update them **via Composer** as part of the codebase (see https://developer.shopware.com/docs/guides/hosting/installation-updates/extension-managment.html#installing-extensions-with-composer). Before installing, verify each plugin supports S3-based storage.

Uninstall a plugin with the Deployment Helper, in two deployments:
1. Set the extension state to `remove` in `.config/shopware-project.yml` and deploy.
2. Remove the extension from the source code and deploy again.

New project:
`composer create-project shopware/production <folder-name>`, then `cd` into it.

Existing project: `cd <your-project-folder>`.

Install `shopware/k8s-meta` matching your Shopware version:

| Shopware | k8s-meta |
|---|---|
| 6.6 | `^1.0` |
| 6.7 | `^2.0` |

- `composer require shopware/k8s-meta:^1.0 --ignore-platform-reqs` (6.6)
- `composer require shopware/k8s-meta:^2.0 --ignore-platform-reqs` (6.7)

Afterwards verify that `config/packages/operator.yaml` exists; package contents and overrides are on the [K8s Meta Package](platform/dev/6.7/products/paas/shopware/fundamentals/k8s-meta.md) page.

Create `application.yaml` at the project root (PHP version, environment variables, services):

```yaml
app:
  php:
    version: "8.3"
  environment_variables: []
services:
  mysql:
    version: "8.0"
  opensearch:
    enabled: false
```

Full reference: [Application YAML Configuration](platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md). In a repository with several projects, `application.yaml` can live in a sub-directory — see [Deploy from a monorepo](platform/dev/6.7/products/paas/shopware/guides/monorepo.md).

Custom hooks run through the Deployment Helper; its configuration is described in the Deployment Helper documentation.

## Essential identifiers

- `shopware/k8s-meta` — `^1.0` (6.6), `^2.0` (6.7)
- `config/packages/operator.yaml`
- `application.yaml` — `app.php.version`, `app.environment_variables`, `services.mysql.version`, `services.opensearch.enabled`
- `.config/shopware-project.yml` — extension state `remove`
- `composer create-project shopware/production`
- `--ignore-platform-reqs`

## Gotchas

- Plugin management via the Administration is **not supported**: the platform runs as a high-availability clustered setup where all instances must stay stateless and identical.
- Not every extension works with an external file system — check S3 compatibility first.
- `--ignore-platform-reqs` makes sure all recipes install even when your local PHP version differs from the platform's.
- Removing an extension takes two deployments: mark it `remove` first, delete the code afterwards.

## Version notes

- Shopware 6.6 uses `shopware/k8s-meta:^1.0`; Shopware 6.7 uses `shopware/k8s-meta:^2.0`.

## Code check (6.7.15.1)
- unverified `shopware/k8s-meta` — separate Composer package, not in vendor/shopware core, storefront or administration
- unverified `config/packages/operator.yaml` — created by the k8s-meta recipe, not present in the Shopware code roots
- unverified `.config/shopware-project.yml` — read by the Deployment Helper package, out of scope
- unverified `application.yaml` — PaaS Native deployment file, not read by Shopware core
- confirmed `amazon-s3` — core ships an S3 filesystem adapter type for external storage — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AwsS3v3Factory.php:43
- confirmed `plugin:install` — core CLI lifecycle command exists; on PaaS the docs require Composer plus Deployment Helper instead of Administration plugin management — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `php` — shopware/core 6.7.15.1 allows PHP ~8.2 to ~8.5, so the example "8.3" is supported — vendor/shopware/core/composer.json:36
