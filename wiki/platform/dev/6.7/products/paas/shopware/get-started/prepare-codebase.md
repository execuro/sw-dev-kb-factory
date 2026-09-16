---
id: platform/dev/6.7/products/paas/shopware/get-started/prepare-codebase.md
title: Prepare Shopware codebase
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/get-started/prepare-codebase.html
sourceHash: e687fbd5cad3cfa9aa55fa6bd59a138a1f0ac832
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware/k8s-meta", "application.yaml", "config/packages/operator.yaml", ".shopware-project.yml", "shopware/production", "--ignore-platform-reqs", "deployment helper", "paas native", "composer", "plugin uninstall", "s3 storage", "prepare project"]
summary: "Prepare a Shopware project for PaaS Native: install shopware/k8s-meta via Composer, add application.yaml, manage plugins via Composer and Deployment Helper."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/k8s-meta.md", "platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md"]
---
## What it is

Setup steps that make a new or existing Shopware project deployable on Shopware PaaS Native: installing the `shopware/k8s-meta` package, creating `application.yaml`, and handling plugins through Composer and the Deployment Helper instead of the Administration.

## When to use

Before the first deployment of a Shopware project to PaaS Native, or when installing, updating or removing extensions in a PaaS Native project. Local development is recommended on macOS or Linux; on Windows use Docker or WSL2.

## Key steps / config

1. New project: `composer create-project shopware/production <folder-name>`, then `cd` into it. Existing project: `cd <your-project-folder>`.
2. Install `shopware/k8s-meta` matching the Shopware version:

   | Shopware | k8s-meta |
   |---|---|
   | 6.6 | `^1.0` |
   | 6.7 | `^2.0` |

   ```sh
   composer require shopware/k8s-meta:^2.0 --ignore-platform-reqs
   ```
3. Verify that `config/packages/operator.yaml` was created (details and overrides: [K8s Meta Package](platform/dev/6.7/products/paas/shopware/fundamentals/k8s-meta.md)).
4. Create `application.yaml` in the project root (PHP version, environment variables, services):

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
   Full reference: [Application YAML Configuration](platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md).
5. Install or update plugins only via Composer as part of the codebase; check beforehand that each plugin supports S3-based storage.
6. Uninstall a plugin in two deployments: first set the extension state to `remove` in `.shopware-project.yml` and deploy; then remove the extension from the source code and deploy again.
7. Custom hooks run through the Deployment Helper; its configuration section documents them.

## Essential identifiers

- `shopware/k8s-meta` (`^1.0` for 6.6, `^2.0` for 6.7)
- `shopware/production`
- `--ignore-platform-reqs`
- `config/packages/operator.yaml`
- `application.yaml` (`app.php.version`, `app.environment_variables`, `services.mysql.version`, `services.opensearch.enabled`)
- `.shopware-project.yml` (extension state `remove`)

## Gotchas

- Plugin management through the Shopware Administration is not supported: the platform runs as a high-availability cluster where all instances must be stateless and identical.
- Not all extensions work with external file systems; verify S3 compatibility before installing.
- `--ignore-platform-reqs` makes sure all recipes are installed even if the local PHP version differs from the platform version.
- Removing an extension from the code before deploying the `remove` state skips the uninstall step; follow the two-deployment order.

## Code check (6.7.13.0)
- confirmed `php` — `application.yaml` PHP `"8.3"` is within core's constraint `~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0` — vendor/shopware/core/composer.json:51
- confirmed `amazon-s3` — core ships an S3 filesystem adapter type, relevant to the S3 compatibility requirement — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AwsS3v3Factory.php:43
- unverified `shopware/k8s-meta` — separate package, not in the installed core/storefront/administration roots
- unverified `config/packages/operator.yaml` — installed by the k8s-meta recipe, out of scope
- unverified `.shopware-project.yml` — read by the Deployment Helper package, out of scope
- unverified `application.yaml` — PaaS Native platform file, not read by Shopware core
