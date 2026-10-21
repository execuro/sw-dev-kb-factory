---
id: platform/dev/6.7/guides/hosting/installation-updates/cluster-setup.md
title: Cluster Setup
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/cluster-setup.html
sourceHash: 9a0cba87e7bda44b1a6d9c306ea007b0511a7189
codeCheckedAgainst: "6.7.15.1"
keywords: ["cluster setup", "shopware.deployment.cluster_setup", "COMPOSER_PLUGIN_LOADER", "composer plugin loader", "plugin:install --activate", "shopware.auto_update.enabled", "/api/_info/health-check", "redis", "multi app server", "shared filesystem", "var/services", "high scaling", "horizontal scaling"]
summary: Cluster/multi-app-server Shopware setup - cluster_setup flag, Composer plugin loader, Redis split, shared storage, auto-update off, health-check.
lastBuilt: 2026-10-21
---
## What it is

Recommendations for running Shopware on several app servers (high-scaling, fully customized stores): the cluster configuration flag, plugin loading, Redis, shared filesystems, updates, message queue workers, monitoring and health checks.

## When to use

When planning or operating a Shopware project behind multiple app servers, or reviewing an existing multi-node deployment for state that can diverge between nodes.

## Key steps / config

1. Enable cluster mode (since 6.5.6.0) in `shopware.yaml`; default is `false`:
   ```yaml
   shopware:
       deployment:
           cluster_setup: true
   ```
   It stops Shopware from running node-local operations that can let nodes diverge (e.g. clearing Symfony cache files at runtime; in code it also skips Composer require/remove of plugin dependencies).
2. Use the [Symfony Flex template](https://github.com/shopware/template) and pin Shopware versions in `composer.json` to avoid unwanted updates when deploying without a `composer.lock`. Project code goes in `/src`, config in `/config`, bundles in `/config/bundles.php`.
3. Prefer plugins as Composer packages. Enable the Composer plugin loader with `COMPOSER_PLUGIN_LOADER=1` in `.env`: plugin state comes from Composer, so an installed plugin counts as enabled. Install during deployment with `bin/console plugin:install --activate <name>`.
4. Redis: at least five servers — (1) session + cart, (2) `cache.object`, (3) lock + increment storage, (4) number ranges, (5) message queue. Use the PHP Redis extension (persistent connections) rather than Predis. For Redis cluster set `redis.clusters.cache_slots=1` in `php.ini`.
5. Filesystem: share assets, theme files and private/public filesystems, preferably via an S3-compatible bucket. Also share `<project-root>/var/services/` (installed service sources, must be writable).
6. Disable the integrated auto-update (not multi-app-server compatible):
   ```yaml
   shopware:
       auto_update:
           enabled: false
   ```
7. Process the message queue with CLI workers (multiple `messenger:consume`, supervised by systemd/supervisor) instead of the Admin worker; consider an own queue for your processes.
8. Configure static theme compilation, since deployments usually have no database connection.
9. Monitor app servers with `/api/_info/health-check` — HTTP `200` when the application works, `50x` when not. In Docker, a `HEALTHCHECK CMD curl --fail <app-url>/api/_info/health-check || exit 1` works.

Security: use the Security plugin (install via Composer in clusters) for fixes without upgrades; update affected dependencies with `composer update <dependency-name>` and run `composer audit` regularly.

## Essential identifiers

- `shopware.deployment.cluster_setup`
- `shopware.auto_update.enabled`
- `COMPOSER_PLUGIN_LOADER`
- `plugin:install --activate`
- `redis.clusters.cache_slots`
- `/api/_info/health-check`
- `var/services`

## Gotchas

- Without a shared `var/services`, other nodes re-download service sources from the service registry on first need (e.g. compiling a service-managed theme, rotating the app secret) — correct, but redundant.
- `shopware.auto_update.enabled` defaults to enabled unless `SHOPWARE_DISABLE_UPDATE_CHECK` is set, so set it explicitly.
- Keep local development environments close to production (Redis, Elasticsearch); prefer strong CPUs on all servers.

## Code check (6.7.15.1)
- confirmed `cluster_setup` — boolean config node under shopware.deployment — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:351
- confirmed `deployment.cluster_setup` — default `false` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:445
- confirmed `shopware.deployment.cluster_setup` — skips plugin Composer dependency removal when true — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:551
- confirmed `auto_update.enabled` — default from `SHOPWARE_DISABLE_UPDATE_CHECK` env — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:425
- confirmed `plugin:install` — command name — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `activate` — option of plugin:install — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:52
- confirmed `ComposerPluginLoader` — Composer-based kernel plugin loader class — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:15
- confirmed `/api/_info/health-check` — GET route, auth not required — vendor/shopware/core/Framework/Api/Controller/HealthCheckController.php:42
- unverified `COMPOSER_PLUGIN_LOADER` — env var not referenced in the checked package roots
- unverified `redis.clusters.cache_slots` — PHP Redis extension ini setting, outside Shopware code
