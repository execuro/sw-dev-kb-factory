---
id: platform/dev/6.7/guides/hosting/configurations/framework/_index.md
title: Framework
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/framework/
sourceHash: 7d64c4b33cea4427cfafa6e82ae92a5629c7c923
codeCheckedAgainst: "6.7.15.1"
keywords: ["framework", "framework.yaml", "FrameworkBundle", "symfony framework bundle", "framework configuration", "session", "routes", "samesite", "hosting configuration", "symfony config"]
summary: Overview of Symfony FrameworkBundle (framework:) configuration in Shopware 6; only partially documented here, Symfony's reference is authoritative.
lastBuilt: 2026-10-21
---
## What it is

Section index for "framework" configurations: options that originate in the Symfony FrameworkBundle (the `framework:` root key) rather than in Shopware's own `shopware:` tree. The Shopware docs only document a subset of them (e.g. custom routes and SameSite cookie protection); the Symfony FrameworkBundle configuration reference is the full source.

## When to use

When a setting you want to change (session cookies, routing, cache pools, messenger transports, mailer, etc.) belongs to Symfony's `framework:` configuration and you need to know where Shopware sets its defaults.

## Key steps / config

- Shopware ships its own `framework:` defaults in the core bundle's `Resources/config/packages/framework.yaml` (e.g. `session.cookie_secure: 'auto'`, `session.cookie_samesite: lax`, `default_locale: en_GB`).
- Override them in your project's `framework.yaml` under `config/packages/`.

```yaml
framework:
  session:
    cookie_samesite: lax
```

## Essential identifiers

- `framework` — Symfony FrameworkBundle config root
- `framework.yaml` — file name used for these overrides

## Code check (6.7.15.1)
- confirmed `framework` — core ships FrameworkBundle defaults under the `framework:` key — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:11
- confirmed `framework.session.cookie_samesite` — core default is `lax` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:22
- confirmed `framework.default_locale` — core default `en_GB` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:33
