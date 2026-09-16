---
id: platform/dev/6.6/guides/hosting/installation-updates/cluster-setup.md
title: Cluster Setup
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/installation-updates/cluster-setup.html
sourceHash: 0be2812056beaf406fdcc5d1b0d14d2bf5f10fde
keywords: ["cluster setup", "shopware.deployment.cluster_setup", "symfony flex template", "redis.clusters.cache_slots", "shopware.auto_update.enabled", "health check api", "security plugin", "composer audit", "composer update", "high-scaling", "multi-app-server"]
summary: "Guidance for cluster-safe config, Redis sizing, database clustering, filesystem sharing, and health checks in high-scale deployments."
lastBuilt: 2026-09-15
---
## What it is
Guidance for operating Shopware in a custom, high-scaling cluster setup: Shopware configuration, Redis sizing, database clustering, filesystem sharing, updates, and monitoring recommendations.

## When to use
Use it when planning or operating a multi-app-server Shopware deployment that needs cluster-safe configuration and dedicated infrastructure for cache, sessions, and queues.

## Key steps / config
- Enable cluster-safe behavior (since Shopware 6.5.6.0) in `shopware.yaml`:
```yaml
shopware:
    deployment:
        cluster_setup: true
```
This stops Shopware from running node-local operations (e.g. clearing Symfony cache files at runtime) that could desync cluster nodes.
- Use the Symfony Flex production template and pin Shopware versions in `composer.json`. Project sources live in `/src`, config in `/config`, with bundles registered in `/config/bundles.php`.
- Recommended: at least 5 dedicated Redis servers for session+cart, object cache, lock+increment storage, number ranges, and message queue. The PHP Redis extension (preferred over Predis) supports persistent connections; when using a Redis cluster, set `redis.clusters.cache_slots=1` in `php.ini` to skip cluster node lookup per connection.
- Use a database cluster and an S3-compatible bucket for shared filesystem storage (assets, theme, private/public files).
- Disable Shopware's built-in auto-update, which is not multi-app-server compatible:
```yaml
shopware:
    auto_update:
        enabled: false
```
- For security fixes without full version upgrades, Shopware offers a dedicated Security plugin. Update individual dependencies with `composer update <dependency-name>` and audit them with `composer audit`.
- Run the message queue via CLI workers, not the Admin worker, and consider a dedicated queue for your own processes.
- Health Check API (since Shopware 6.5.5.0): `/api/_info/health-check`, returns HTTP `200` when healthy and `50x` otherwise, e.g. for a Docker `HEALTHCHECK`.

## Essential identifiers
- `shopware.deployment.cluster_setup`
- `redis.clusters.cache_slots`
- `shopware.auto_update.enabled`
- `/api/_info/health-check`
- `composer update <dependency-name>`, `composer audit`

## Gotchas
Auto-update must be disabled explicitly and controlled via deployment in multi-app-server setups, since it is not compatible with clustering.

## Version notes
`shopware.deployment.cluster_setup` is available starting with Shopware 6.5.6.0; the Health Check API since 6.5.5.0.
