---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md
sourceHash: 11f040df737e5a00da35cb1f450cc7e7c1148abf
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/application-yaml.html
title: Application YAML
version: "6.7"
versions:
  - "6.7"
keywords: ["application.yaml", "app.php.version", "app.php.extensions", "app.environment_variables", "services.mysql", "services.opensearch", "services.blackfire", "services.fastly", "snippets_path", "disable_default_snippets", "sw-paas application update", "paas config", "php version", "environment variables"]
summary: "application.yaml for Shopware PaaS Native: PHP version/extensions, RUN/BUILD env vars, and mysql, opensearch, blackfire, fastly services."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md", "platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md", "platform/dev/6.7/products/paas/shopware/guides/opensearch.md", "platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md"]
---
## What it is

`application.yaml` is the central configuration file of a Shopware PaaS Native application, placed at the repository root. It defines the PHP version and extensions, environment variables, and managed services.

## When to use

When changing the PHP or MySQL version, adding PHP extensions, passing build-time or runtime environment variables, or enabling OpenSearch, Blackfire or custom Fastly VCL snippets.

## Key steps / config

1. Edit `application.yaml` at the repository root and push it.
2. Apply the change with `sw-paas application update`.

Two top-level sections: `app` (PHP, environment variables) and `services` (infrastructure).

```yaml
app:
  php:
    version: "8.3"          # 8.2, 8.3, 8.4, 8.5
    extensions: [imagick]
  environment_variables:
    - { name: MY_VARIABLE, value: runtime-value, scope: RUN }
    - { name: MY_VARIABLE, value: build-value, scope: BUILD }
services:
  mysql: { version: "8.0" }  # 8.0, 8.4
  opensearch: { enabled: true }
  blackfire: { enabled: true }
  fastly: { disable_default_snippets: false, snippets_path: config/fastly }
```

Reference:

- `app.php.version` — supported `8.2`, `8.3`, `8.4`, `8.5`.
- `app.php.extensions` — extensions installed at build time via the docker-php-extension-installer (mlocati).
- `app.environment_variables` — each entry needs `name`, `value`, `scope`; `RUN` = available at runtime in Shopware, `BUILD` = available during build. The same name may be defined with both scopes to use different values. Sensitive values belong in [secrets](platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md); more in [Environment variables](platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md).
- `services.mysql.version` — `8.0` or `8.4`.
- `services.opensearch.enabled` — after enabling, update the application and reindex; see [How to set up OpenSearch](platform/dev/6.7/products/paas/shopware/guides/opensearch.md).
- `services.blackfire.enabled` — requires the `BLACKFIRE_SERVER_ID` and `BLACKFIRE_SERVER_TOKEN` secrets; see [Blackfire](platform/dev/6.7/products/paas/shopware/monitoring/blackfire.md).
- `services.fastly.snippets_path` — default unset; directory relative to repo root with custom VCL snippets, one sub-directory per Fastly VCL subroutine type. Unset = no custom snippets, defaults stay enabled. See [Fastly snippets](platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md).
- `services.fastly.disable_default_snippets` — default `false`; `true` disables the default snippets PaaS deploys to Fastly.

## Essential identifiers

- `application.yaml`, `sw-paas application update`
- `app.php.version`, `app.php.extensions`, `app.environment_variables` (`name`, `value`, `scope`: `RUN`/`BUILD`)
- `services.mysql`, `services.opensearch`, `services.blackfire`, `services.fastly`
- `snippets_path`, `disable_default_snippets`
- `BLACKFIRE_SERVER_ID`, `BLACKFIRE_SERVER_TOKEN`

## Gotchas

- Once MySQL `8.4` has been configured, downgrading to `8.0` is not possible.
- Changes only take effect after `sw-paas application update`.
- Enabling OpenSearch alone is not enough — data must be reindexed.

## Code check (6.7.13.0)
- unverified `application.yaml` — PaaS platform file, not parsed by vendor/shopware
- unverified `app.environment_variables` — consumed by the PaaS build/runtime, out of scope of vendor/shopware
- unverified `INSTALL_LOCALE` — example variable, no read found in vendor/shopware/core
- unverified `BLACKFIRE_SERVER_ID` — PaaS secret for the Blackfire service, not read by vendor/shopware/core
- unverified `services.fastly` — PaaS CDN integration settings, outside the installed Shopware code
