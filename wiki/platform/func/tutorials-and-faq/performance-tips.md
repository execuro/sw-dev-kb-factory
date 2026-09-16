---
id: platform/func/tutorials-and-faq/performance-tips.md
title: "Performance Tips"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/performance-tips"
sourceHash: "a08f83cbf3616cea8e1cf6b93640561846a3295c81a464f87d0c4c8ce607ff6b"
revision:
  current: true
  range: "current"
  swMin: null
  swMax: null
keywords: ["PHP-FPM", "bytecode cache", "MySQL", "NGINX", "mysqltuner", "Admin Worker", "CLI Worker", "enable_admin_worker", "messenger:consume", "scheduled-task:run", "Elasticsearch", "Redis session storage", "Flysystem", "Apache Benchmark"]
summary: "Performance tuning tips for Shopware 6: recommended stack, hosting choice, benchmarking, MySQL tuning, and disabling the Admin Worker for the CLI Worker."
lastBuilt: "2026-09-15"
---
## What it is

This how-to collects performance tuning tips for Shopware 6 stores: recommended stack choices, hosting selection, benchmarking methods, MySQL tuning, disabling the Admin Worker in favor of the CLI Worker, and pointers to advanced performance features.

## When to use

Use these tips when a store feels slow and you want a structured way to identify bottlenecks and apply standard performance improvements before diving into advanced tuning.

## Key steps / config

- Recommended stack: PHP-FPM over plain PHP; a bytecode cache (ZendOpcache + APCu) — installing one correctly can speed up PHP execution by up to 25%; MySQL >= 8 (preferred over MariaDB unless Elastic/OpenSearch is used, due to JSON field handling); NGINX over Apache for high-traffic stores. Avoid running profiling tools (xDebug, XhProf) or the Shopware Debug & Benchmark plugins in production.
- Choosing a hoster: match the software stack recommendations above, confirm Shopware experience/reference stores, and prefer a certified Shopware hosting partner with an upgrade path.
- Measuring performance: in a test system, deactivate all third-party extensions, assign the standard Responsive Theme, empty and warm up the cache, then check performance; use the browser's network console to time the start page, listing and detail page loads (5-10 runs each, then average), or benchmark a URL with Apache Benchmark, e.g. `ab -n 10 -c 1 <url>`, taking the median total connection time.
- Optimize MySQL: run the community `mysqltuner.pl` script against the database to get configuration recommendations.
- CLI Worker: disable the Admin Worker for production by setting `enable_admin_worker: false` under `shopware.admin_worker` in `config/packages/shopware.yaml` (create it first if only `lock.yaml` exists there), then run the queue and scheduled tasks from the CLI — `bin/console messenger:consume default --time-limit=60` and `bin/console scheduled-task:run --time-limit=60`, e.g. via a cron job or a server service, using `--time-limit=60` (or `--memory-limit=512M`) so each run terminates and is re-triggered regularly.
- Advanced settings (specialist, high-traffic systems): Elasticsearch/OpenSearch for search, Redis for session storage instead of the filesystem, and Flysystem for offloading file storage.

## Essential identifiers

- `enable_admin_worker` (`shopware.admin_worker`, `config/packages/shopware.yaml`)
- `bin/console messenger:consume`
- `bin/console scheduled-task:run`
- `--time-limit` / `--memory-limit`
- `mysqltuner.pl`

## Gotchas

Disabling the Admin Worker requires the CLI Worker commands to run continuously (e.g. every 60 seconds) via cron or a server-managed service, or the message queue and scheduled tasks stop being processed. Never run profiling tools or the Shopware Debug & Benchmark plugins on a production server — they significantly reduce PHP execution speed.
