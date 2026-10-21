---
id: platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md
title: Application YAML
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/application-yaml.html
sourceHash: 5f84497fecb7dd00087c480be6a227bffa1c9421
codeCheckedAgainst: "6.7.15.1"
keywords: ["application.yaml", "app.php.version", "app.php.extensions", "app.environment_variables", "app.build.context", "services.mysql", "services.opensearch", "services.blackfire", "services.tideways", "services.fastly", "snippets_path", "disable_default_snippets", "paas config file"]
summary: "application.yaml reference for PaaS Native: PHP, env vars (RUN/BUILD), build context, MySQL, OpenSearch, profilers, Fastly."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md", "platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md", "platform/dev/6.7/products/paas/shopware/guides/monorepo.md", "platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md"]
---
## What it is

`application.yaml` is the central configuration file of a Shopware PaaS Native application. It defines the PHP version, environment variables and infrastructure services, in two top-level sections: `app` (PHP version, extensions, environment variables, build) and `services` (MySQL, OpenSearch, Blackfire, Tideways, Fastly).

## When to use

When creating an application, changing its PHP/MySQL version, adding env vars, enabling OpenSearch or a profiler, or adding custom Fastly VCL snippets.

## Key steps / config

Location: repository root by default. In a sub-directory (several apps in one repo), pass its path at creation:

```sh
sw-paas application create --application-yaml-path apps/shopware/application.yaml
```

The directory containing the file is the application root; every path in it resolves relative to that ([Deploy from a monorepo](platform/dev/6.7/products/paas/shopware/guides/monorepo.md)). After pushing changes apply them with `sw-paas application update`.

Shape:

```yaml
app:
  php:
    version: "8.3"          # 8.2, 8.3, 8.4, 8.5
    extensions: [imagick]
  environment_variables:
    - name: INSTALL_LOCALE
      value: fr-FR
      scope: RUN            # RUN or BUILD
  build:
    context: ".."
services:
  mysql: { version: "8.0" } # 8.0 or 8.4
  opensearch: { enabled: true }
  blackfire: { enabled: false }
  tideways: { enabled: false }
  fastly: { disable_default_snippets: false, snippets_path: config/fastly }
```

Reference:
- `app.php.version` — PHP version; supported `8.2`, `8.3`, `8.4`, `8.5`.
- `app.php.extensions` — PHP extensions installed at build time (via the docker-php-extension-installer).
- `app.environment_variables` — entries with `name`, `scope` (`RUN` = runtime, passed to Shopware; `BUILD` = build step), `value`. The same name may be defined with both scopes and different values. Sensitive values belong in [secrets](platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md); details in [Environment variables](platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md).
- `app.build.context` — directory the image is built from, relative to the `application.yaml` directory; defaults to the application root. Must stay inside the repository (validated on create/update). The generated Dockerfile copies the context root, and `composer.lock` is read from the context.
- `services.mysql.version` — `8.0` or `8.4`.
- `services.opensearch.enabled` — after enabling, update the application and reindex ([OpenSearch](platform/dev/6.7/products/paas/shopware/guides/opensearch.md)).
- `services.blackfire.enabled` — requires secrets `BLACKFIRE_SERVER_ID` and `BLACKFIRE_SERVER_TOKEN` ([Blackfire](platform/dev/6.7/products/paas/shopware/monitoring/blackfire.md)).
- `services.tideways.enabled` — requires secret `TIDEWAYS_API_KEY` ([Tideways](platform/dev/6.7/products/paas/shopware/monitoring/tideways.md)).
- `services.fastly.snippets_path` (default unset: no custom snippets, defaults stay on) — directory relative to the application root with one sub-directory per VCL subroutine type ([Fastly snippets](platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md)).
- `services.fastly.disable_default_snippets` (default `false`) — `true` disables the platform's default snippets.

## Essential identifiers

- `application.yaml`, `app`, `services`
- `app.php.version`, `app.php.extensions`, `app.environment_variables`, `app.build.context`
- `services.mysql`, `services.opensearch`, `services.blackfire`, `services.tideways`, `services.fastly`
- `sw-paas application create --application-yaml-path`, `sw-paas application update`

## Gotchas

- Once MySQL `8.4` is configured, downgrading to `8.0` is not possible.
- Blackfire and Tideways are only available for shop applications and cannot be enabled at the same time.
- Changing `app.build.context` also changes where `composer.lock` is read from.

## Code check (6.7.15.1)
- unverified `application.yaml` — PaaS Native platform schema, not read by Shopware core/storefront/administration
- unverified `services.fastly.snippets_path` — platform-side Fastly setting, outside vendor/shopware
- unverified `BLACKFIRE_SERVER_ID` — platform secret consumed by the image build, out of scope
- unverified `INSTALL_LOCALE` — Docker image variable, no match in the Shopware core code root
