---
id: platform/dev/6.7/products/paas/shopware/fundamentals/k8s-meta.md
title: K8s Meta Package
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/k8s-meta.html
sourceHash: 6fbf24454b8907bb1a58f9316695b3a95733df85
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware/k8s-meta", "k8s meta package", "kubernetes", "paas native", "operator.yaml", "config/packages/prod", "symfony flex recipe", "cluster_setup", "runtime_extension_management", "enable_admin_worker", "http_cache", "stale_while_revalidate", "stale_if_error", "fastly.yaml", "--ignore-platform-reqs"]
summary: "shopware/k8s-meta for PaaS Native: ^1.0 for 6.6, ^2.0 for 6.7; Flex recipe creates config/packages/operator.yaml; override in config/packages/prod/."
lastBuilt: 2026-09-15
---
## What it is

`shopware/k8s-meta` is a Composer metapackage that prepares a Shopware project for Shopware PaaS Native. It installs the required dependencies and, via a Symfony Flex recipe, the infrastructure configuration files.

## When to use

When onboarding a Shopware project to PaaS Native, checking which k8s-meta major matches the installed Shopware, or when overriding the infrastructure defaults the package ships.

## Key steps / config

1. Install (no version constraint needed):

   ```sh
   composer require shopware/k8s-meta --ignore-platform-reqs
   ```

   Composer picks the major from the installed `shopware/core`, enforced via `shopware/conflicts`:

   | Shopware | k8s-meta |
   |---|---|
   | 6.6 | `^1.0` |
   | 6.7 (or higher) | `^2.0` |

   `--ignore-platform-reqs` makes sure all recipes are installed even if the local PHP version differs from the platform version.

2. Verify that the recipe created `config/packages/operator.yaml`. It configures:
   - S3 object storage for the public, private, theme and sitemap filesystems
   - Redis for application cache and session storage
   - cluster mode: `cluster_setup: true`, `runtime_extension_management: false` (core keys `shopware.deployment.cluster_setup` / `shopware.deployment.runtime_extension_management`)
   - admin worker disabled (queues processed externally; core key `shopware.admin_worker.enable_admin_worker`, default `true`)
   - Elasticsearch/OpenSearch replica and shard settings
   - Monolog logging to stderr as JSON

3. Production files in `config/packages/prod/`:

   | File | Purpose |
   |---|---|
   | `fastly.yaml` | Fastly reverse proxy and cache purging |
   | `monolog.yaml` | Error-level logging to stderr, JSON |
   | `opentelemetry.yaml` | OpenTelemetry profiler integration |

4. Override any `operator.yaml` value with the standard Symfony config override: put a YAML file with the same keys in `config/packages/prod/`. Example (soft purge with stale serving):

   ```yaml
   # config/packages/prod/shopware.yaml
   shopware:
       http_cache:
           stale_while_revalidate: 300
           stale_if_error: 3600
   ```

## Essential identifiers

- `shopware/k8s-meta`, `shopware/conflicts`
- `config/packages/operator.yaml`, `config/packages/prod/`
- `shopware.deployment.cluster_setup`, `shopware.deployment.runtime_extension_management`
- `shopware.admin_worker.enable_admin_worker`
- `shopware.http_cache.stale_while_revalidate`, `shopware.http_cache.stale_if_error`

## Gotchas

- Defaults are tuned for PaaS Native infrastructure; changing them can break the application. Override only with a clear reason.
- In core, `runtime_extension_management` defaults to `true` and `enable_admin_worker` defaults to `true`; the values from `operator.yaml` are what turn them off on PaaS Native, so do not drop that file.
- Full dependency list lives in the `shopware/k8s-meta` repository on GitHub, not on this page.

## Version notes

- Shopware 6.6 uses `shopware/k8s-meta` `^1.0`; Shopware 6.7+ uses `^2.0`.

## Code check (6.7.13.0)
- confirmed `deployment.cluster_setup` — boolean node, no default — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:330
- confirmed `deployment.runtime_extension_management` — boolean, core default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:331
- confirmed `admin_worker.enable_admin_worker` — boolean, core default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:243
- confirmed `http_cache.stale_while_revalidate` — scalar, default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1306
- confirmed `http_cache.stale_if_error` — scalar, default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1307
- confirmed `filesystem.sitemap` — sitemap filesystem node exists alongside public/private/theme — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:118
- unverified `shopware/k8s-meta` — separate Composer package, not installed under vendor/shopware core roots
- unverified `config/packages/operator.yaml` — created by the Flex recipe, outside vendor/shopware
