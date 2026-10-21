---
id: platform/dev/6.7/products/paas/shopware/monitoring/tideways.md
title: Tideways
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/monitoring/tideways.html
sourceHash: e5df58aff575f2025cdb57c86f1d8c65aedb41c3
codeCheckedAgainst: "6.7.15.1"
keywords: ["tideways", "services.tideways.enabled", "TIDEWAYS_API_KEY", "sw-paas vault create", "application.yaml", "tideways daemon", "php monitoring", "profiling", "apm", "paas native", "blackfire", "opentelemetry tracing"]
summary: Enable Tideways PHP monitoring on Shopware PaaS Native via services.tideways.enabled and a TIDEWAYS_API_KEY env secret.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md", "platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md", "platform/dev/6.7/products/paas/shopware/monitoring/blackfire.md", "platform/dev/6.7/products/paas/shopware/monitoring/traces.md"]
---
## What it is

Tideways is a PHP monitoring and profiling tool that continuously collects performance data. Shopware PaaS Native can run a Tideways daemon next to your application, so traces and profiles from your shop go to your own Tideways organization. You need an existing Tideways account; the platform does not provide one.

## When to use

Use it for continuous performance monitoring of a shop application on PaaS Native. Tideways is only available for shop applications; enabling it on any other application type (for example a Composable Frontends application) is rejected at configuration validation.

## Key steps / config

1. In your Tideways account, open the settings of the project you want to monitor and copy its API key.
2. Create a secret of type `env` with key `TIDEWAYS_API_KEY` and the API key as value, using `sw-paas vault create` (see [Secrets](platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md)).
3. Enable the service in [`application.yaml`](platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md):

   ```yaml
   services:
     tideways:
       enabled: true
   ```

4. Commit, push to your git repository, and [update your application](platform/dev/6.7/products/paas/shopware/fundamentals/applications.md).
5. In Tideways, select the project that belongs to the stored API key. The shop reports to the default service of that project, under the environment `production`. Data arrives continuously once the deployment finishes; no browser extension or CLI is needed.

Enabling Tideways:

- adds the Tideways PHP extension to the application image at build time (do not list it under `app.php.extensions`; such an entry is ignored);
- deploys a Tideways daemon next to the application;
- configures the application containers to send data to that daemon.

To return to tracing, set `services.tideways.enabled` to `false` and update the application again.

## Essential identifiers

- `services.tideways.enabled` (in `application.yaml`)
- `TIDEWAYS_API_KEY` (secret of type `env`)
- `sw-paas vault create`
- `app.php.extensions` (not needed for the extension)
- Tideways environment `production`

## Gotchas

- The secret must exist before enabling Tideways; if it is missing, the deployment fails.
- Enabling or disabling Tideways builds a new image on the next application update, because the extension is part of the image.
- Pages served from the CDN cache never reach PHP and do not show up in Tideways. If a request is missing, look at a page that is not cacheable or otherwise bypasses the cache.
- Only one profiler at a time: Tideways and [Blackfire](platform/dev/6.7/products/paas/shopware/monitoring/blackfire.md) both set to `true` is rejected. Tideways and OpenTelemetry tracing are also mutually exclusive: while Tideways is enabled the application sends no traces, and the Tempo data source in Grafana stays empty for that time range (see [Traces](platform/dev/6.7/products/paas/shopware/monitoring/traces.md)).

## Code check (6.7.15.1)
- unverified `services.tideways.enabled` — PaaS Native application.yaml key, not part of the Shopware core/storefront/administration code
- unverified `TIDEWAYS_API_KEY` — PaaS platform secret consumed by the Tideways daemon, not referenced in Shopware code
- unverified `sw-paas vault create` — PaaS CLI command, out of scope of the installed Shopware packages
- confirmed `Tideways` — core profiler integration in namespace Shopware\Core\Profiling\Integration, creates spans when the Tideways extension is loaded — vendor/shopware/core/Profiling/Integration/Tideways.php:12
- confirmed `shopware.profiler` — the integration is tagged with `integration` `Tideways` — vendor/shopware/core/Profiling/DependencyInjection/services.php:27
- confirmed `shopware.profiler.integrations` — list of active profiler integrations, empty by default — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:186
