---
id: platform/dev/6.7/products/paas/shopware/fundamentals/k8s-meta.md
title: K8s Meta Package
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/k8s-meta.html
sourceHash: c75110503ee70cd68ce56eab35de5edfc6270907
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware/k8s-meta", "composer require shopware/k8s-meta", "operator.yaml", "config/packages/prod", "cluster_setup", "runtime_extension_management", "stale_while_revalidate", "stale_if_error", "symfony flex recipe", "paas native", "kubernetes", "metapackage"]
summary: shopware/k8s-meta Composer metapackage for PaaS Native - version mapping, the operator.yaml it installs and how to override its config.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/guides/message-queues.md"]
---
## What it is

`shopware/k8s-meta` is a Composer metapackage that prepares a Shopware project for Shopware PaaS Native. It installs the required dependencies and, via a Symfony Flex recipe, the configuration files the platform expects.

## When to use

When setting up or migrating a Shopware project to run on Shopware PaaS Native (Kubernetes), or when you need to know which defaults the package applies and how to override them.

## Key steps / config

1. Install (no version constraint needed):

```sh
composer require shopware/k8s-meta --ignore-platform-reqs
```

   Composer picks the version from the installed `shopware/core`, enforced through `shopware/conflicts`:

   | Shopware | k8s-meta |
   |---|---|
   | 6.6 | `^1.0` |
   | 6.7 (or higher) | `^2.0` |

   `--ignore-platform-reqs` makes sure all recipes install even if your local PHP version differs from the platform's.

2. Verify that `config/packages/operator.yaml` exists. It configures:
   - S3 object storage for the public, private, theme and sitemap filesystems
   - Redis for application cache and session storage
   - cluster mode: `cluster_setup: true`, `runtime_extension_management: false`
   - the admin worker disabled (queues are processed externally)
   - Elasticsearch/OpenSearch replica and shard settings
   - Monolog logging to stderr in JSON format

3. Production files in `config/packages/prod/`: `fastly.yaml` (Fastly reverse proxy and cache purging), `monolog.yaml` (error-level logging to stderr as JSON), `opentelemetry.yaml` (OpenTelemetry profiler integration).

4. To override a value from `operator.yaml`, place a YAML file in `config/packages/prod/` with the same keys; Symfony's config merging gives it precedence. Example, `config/packages/prod/shopware.yaml` for soft purge with stale serving:

```yaml
shopware:
    http_cache:
        stale_while_revalidate: 300
        stale_if_error: 3600
```

5. For extra Messenger transports (e.g. a dedicated mail queue), see [Split message queues](platform/dev/6.7/products/paas/shopware/guides/message-queues.md).

## Essential identifiers

- `shopware/k8s-meta`, `shopware/conflicts`
- `config/packages/operator.yaml`, `config/packages/prod/`
- `shopware.deployment.cluster_setup`, `shopware.deployment.runtime_extension_management`
- `shopware.http_cache.stale_while_revalidate`, `shopware.http_cache.stale_if_error`

## Gotchas

- The defaults are tuned for the PaaS Native infrastructure; changing them can break the application. Override only with a clear reason.
- Core's own defaults differ from `operator.yaml`: `cluster_setup` is `false` and `runtime_extension_management` defaults to `true` in core, so the package's file is what switches cluster mode on.

## Version notes

Shopware 6.6 uses `shopware/k8s-meta` `^1.0`; Shopware 6.7 and higher use `^2.0`.

## Code check (6.7.15.1)
- confirmed `shopware.deployment.cluster_setup` — boolean node in the deployment section — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:351
- confirmed `cluster_setup` — core default false — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:445
- confirmed `shopware.deployment.runtime_extension_management` — boolean node, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:352
- confirmed `shopware.http_cache.stale_while_revalidate` — scalar node, default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1342
- confirmed `shopware.http_cache.stale_if_error` — scalar node, default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1343
- confirmed `enable_admin_worker` — admin worker enabled by default in core, which operator.yaml turns off — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:416
- unverified `shopware/k8s-meta` — Composer package and Flex recipe, not in vendor/shopware
- unverified `operator.yaml` — installed by the recipe, not part of core
