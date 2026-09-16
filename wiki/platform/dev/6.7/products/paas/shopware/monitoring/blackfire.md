---
id: platform/dev/6.7/products/paas/shopware/monitoring/blackfire.md
title: Blackfire
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/monitoring/blackfire.html
sourceHash: 5014e7ba8ea1b135189af4ae6ec21465297adef0
codeCheckedAgainst: "6.7.13.0"
keywords: ["blackfire", "BLACKFIRE_SERVER_ID", "BLACKFIRE_SERVER_TOKEN", "services.blackfire.enabled", "application.yaml", "sw-paas vault create", "php profiler", "profiling", "blackfire agent", "blackfire probe", "opentelemetry tracing", "paas native"]
summary: "Blackfire on Shopware PaaS Native: BLACKFIRE_SERVER_ID/TOKEN env secrets, services.blackfire.enabled in application.yaml; disables tracing."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md", "platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md", "platform/dev/6.7/products/paas/shopware/fundamentals/applications.md", "platform/dev/6.7/products/paas/shopware/monitoring/traces.md"]
---
## What it is

How to run the Blackfire PHP profiler on Shopware PaaS Native. The platform runs a Blackfire agent next to your application and sends profiles to your own Blackfire account; the platform does not provide an account.

## When to use

When you need to find where time and memory are spent in PHP requests of a PaaS Native shop.

## Key steps / config

1. In your Blackfire account, open the settings of the target environment and copy its **Server ID** and **Server Token**.
2. Create one secret of type `env` for each with `sw-paas vault create` (see [Secrets](platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md)):
   - `BLACKFIRE_SERVER_ID` — your Blackfire Server ID
   - `BLACKFIRE_SERVER_TOKEN` — your Blackfire Server Token
3. Enable the service in [`application.yaml`](platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md):

```yaml
services:
  blackfire:
    enabled: true
```

4. Commit, push to your git repository, and [update your application](platform/dev/6.7/products/paas/shopware/fundamentals/applications.md).
5. Install the Blackfire browser extension or Blackfire CLI, sign in with your personal Client ID and Client Token, open the storefront and start a profile. Profiles appear in your Blackfire account.

Enabling Blackfire:
- adds the Blackfire probe to the application image at build time (no entry under `app.php.extensions` needed);
- deploys a Blackfire agent next to the application;
- configures application containers to send profiles to that agent.

## Essential identifiers

- `BLACKFIRE_SERVER_ID`, `BLACKFIRE_SERVER_TOKEN` (secret type `env`)
- `services.blackfire.enabled` in `application.yaml`
- `sw-paas vault create`
- `app.php.extensions`

## Gotchas

- Do not use the Client ID / Client Token for the secrets; those are personal credentials for the browser extension and CLI and are not configured on the platform.
- Both secrets must exist before enabling Blackfire, otherwise the deployment fails.
- Pages served from the CDN cache never reach PHP and cannot be profiled; profile a non-cacheable page or bypass the cache.
- Blackfire and OpenTelemetry tracing are mutually exclusive: while Blackfire is enabled no traces are sent and the Tempo data source in Grafana stays empty for that period (see [Traces](platform/dev/6.7/products/paas/shopware/monitoring/traces.md)). Set `services.blackfire.enabled` to `false` and update the application to restore tracing.

## Code check (6.7.13.0)
- unverified `BLACKFIRE_SERVER_ID` — PaaS platform secret, not read anywhere in vendor/shopware
- unverified `BLACKFIRE_SERVER_TOKEN` — PaaS platform secret, not read anywhere in vendor/shopware
- unverified `services.blackfire.enabled` — PaaS application.yaml key, outside vendor/shopware
- unverified `app.php.extensions` — PaaS application.yaml key, outside vendor/shopware
- unverified `sw-paas vault create` — PaaS CLI command, not part of vendor/shopware
- confirmed `shopware.profiler.integrations` — core has no Blackfire integration; Blackfire works via the probe, integrations default empty — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:175
