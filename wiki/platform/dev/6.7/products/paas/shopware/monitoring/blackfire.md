---
id: platform/dev/6.7/products/paas/shopware/monitoring/blackfire.md
title: Blackfire
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/monitoring/blackfire.html
sourceHash: d36a4222d2b51bb1775f9bc9b4a428bb967de85f
codeCheckedAgainst: "6.7.15.1"
keywords: ["blackfire", "services.blackfire.enabled", "BLACKFIRE_SERVER_ID", "BLACKFIRE_SERVER_TOKEN", "sw-paas vault create", "application.yaml", "php profiler", "profiling", "blackfire agent", "blackfire probe", "paas native", "tideways", "opentelemetry tracing"]
summary: Enable the Blackfire PHP profiler on Shopware PaaS Native via services.blackfire.enabled and BLACKFIRE_SERVER_ID/TOKEN env secrets.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md", "platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md", "platform/dev/6.7/products/paas/shopware/monitoring/tideways.md", "platform/dev/6.7/products/paas/shopware/monitoring/traces.md"]
---
## What it is

Blackfire is a PHP profiler that shows where time and memory are spent in a request. Shopware PaaS Native can run a Blackfire agent next to your application, so profiles collected from your shop go to your own Blackfire account. You must already have a Blackfire account; the platform does not provide one.

## When to use

Use it when you need request-level CPU/memory profiles of a shop application on PaaS Native. Blackfire is only available for shop applications; enabling it on any other application type (for example a Composable Frontends application) is rejected at configuration validation.

## Key steps / config

1. In your Blackfire account, open the settings of the environment you want to profile into and copy its **Server ID** and **Server Token**.
2. Create one secret per value with type `env` using `sw-paas vault create` (see [Secrets](platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md)):

   | Key | Value |
   |---|---|
   | `BLACKFIRE_SERVER_ID` | Your Blackfire Server ID |
   | `BLACKFIRE_SERVER_TOKEN` | Your Blackfire Server Token |

3. Enable the service in [`application.yaml`](platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md):

   ```yaml
   services:
     blackfire:
       enabled: true
   ```

4. Commit, push to your git repository, and [update your application](platform/dev/6.7/products/paas/shopware/fundamentals/applications.md).
5. Install the Blackfire browser extension or the Blackfire CLI, sign in with your personal Client ID and Client Token, open the storefront and start a profile. Profiles appear in the Blackfire environment that owns the stored Server ID/Token.

Enabling Blackfire:

- adds the Blackfire probe to the application image at build time (do not list it under `app.php.extensions`; such an entry is ignored);
- deploys a Blackfire agent next to the application;
- configures the application containers to send profiles to that agent.

To return to tracing, set `services.blackfire.enabled` to `false` and update the application again.

## Essential identifiers

- `services.blackfire.enabled` (in `application.yaml`)
- `BLACKFIRE_SERVER_ID`, `BLACKFIRE_SERVER_TOKEN` (secrets of type `env`)
- `sw-paas vault create`
- `app.php.extensions` (not needed for the probe)

## Gotchas

- Use the Server ID/Server Token, not the Client ID/Client Token. The client credentials are personal, used by the browser extension and CLI, and are not configured in PaaS Native.
- Both secrets must exist before enabling Blackfire; if either is missing, the deployment fails.
- Enabling or disabling Blackfire builds a new image on the next application update, because the probe is part of the image.
- Pages served from the CDN cache never reach PHP and cannot be profiled. If no profile appears, profile a page that is not cacheable or otherwise bypasses the cache.
- Only one profiler at a time: Blackfire and [Tideways](platform/dev/6.7/products/paas/shopware/monitoring/tideways.md) both set to `true` is rejected. Blackfire and OpenTelemetry tracing are also mutually exclusive: while Blackfire is enabled the application sends no traces, and the Tempo data source in Grafana stays empty for that time range (see [Traces](platform/dev/6.7/products/paas/shopware/monitoring/traces.md)).

## Code check (6.7.15.1)
- unverified `services.blackfire.enabled` — PaaS Native application.yaml key, not part of the Shopware core/storefront/administration code
- unverified `BLACKFIRE_SERVER_ID` — PaaS platform secret consumed by the Blackfire agent, not referenced in Shopware code
- unverified `BLACKFIRE_SERVER_TOKEN` — PaaS platform secret consumed by the Blackfire agent, not referenced in Shopware code
- unverified `sw-paas vault create` — PaaS CLI command, out of scope of the installed Shopware packages
- confirmed `shopware.profiler.integrations` — core ships no Blackfire profiler integration; this list defaults to empty — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:186
